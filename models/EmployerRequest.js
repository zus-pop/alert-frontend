const mongoose = require('mongoose');
const { Schema } = mongoose;

const EmployerRequestSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  proofUrl: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminId: { type: Schema.Types.ObjectId, ref: 'User' }, // Người duyệt (nếu có)
  decisionAt: { type: Date }, // Thời gian duyệt/từ chối (nếu có)
}, {
  timestamps: true // Tự động tạo createdAt, updatedAt
});

module.exports = mongoose.model('EmployerRequest', EmployerRequestSchema); 