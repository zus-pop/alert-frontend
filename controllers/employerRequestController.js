const EmployerRequest = require('../models/EmployerRequest');
const User = require('../models/User');

// User gửi yêu cầu
exports.createRequest = async (req, res) => {
  try {
    const { companyName, proofUrl } = req.body;
    const userId = req.user._id;
    const newRequest = await EmployerRequest.create({
      userId,
      companyName,
      proofUrl,
      status: 'pending',
    });
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi gửi yêu cầu', error: err.message });
  }
};

// User lấy lịch sử yêu cầu
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const requests = await EmployerRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy lịch sử', error: err.message });
  }
};

// Admin lấy danh sách yêu cầu (lọc theo status)
exports.getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const requests = await EmployerRequest.find(filter)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy danh sách', error: err.message });
  }
};

// Admin duyệt yêu cầu
exports.approveRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user._id;
    const request = await EmployerRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Yêu cầu đã được xử lý' });
    request.status = 'approved';
    request.adminId = adminId;
    request.decisionAt = new Date();
    await request.save();
    // Cập nhật role user
    await User.findByIdAndUpdate(request.userId, { role: 'employer' });
    res.json({ message: 'Đã duyệt yêu cầu', request });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi duyệt yêu cầu', error: err.message });
  }
};

// Admin từ chối yêu cầu
exports.rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const adminId = req.user._id;
    const request = await EmployerRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Không tìm thấy yêu cầu' });
    if (request.status !== 'pending') return res.status(400).json({ message: 'Yêu cầu đã được xử lý' });
    request.status = 'rejected';
    request.adminId = adminId;
    request.decisionAt = new Date();
    await request.save();
    res.json({ message: 'Đã từ chối yêu cầu', request });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi từ chối yêu cầu', error: err.message });
  }
}; 