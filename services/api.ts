const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

interface LoginRequest {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  name?: string;

}

export const login = async (credentials: LoginRequest): Promise<{ token: string }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*'
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    // console.log('Login successful:', data);
  
    if (data["access_token"]) {
      localStorage.setItem('auth_token', data.access_token);
      
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};


export const getUserInfo = async (): Promise<UserData> => {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('No auth token found');
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch user data');
    }
 console.log('User info fetched successfully', response);
    return await response.json();
   
  } catch (error) {
    console.error('Get user info error:', error);
    throw error;
  }
};


export const logout = () => {
  localStorage.removeItem('auth_token');
};


export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('auth_token');
};
