export const API_BASE_URL = '/api/auth';

/**
 * ĐĂNG KÝ (Register)
 * Yêu cầu: name, email, password, password_confirmation
 */

export const registerQuery = async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
  const res = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json', // <--- THIẾU DÒNG NÀY LÀ BỊ REDIRECT HTML NGAY
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  // Nếu server trả về lỗi (4xx, 5xx)
  if (!res.ok) {
    // Vì đã có Accept: json, nên chắc chắn res.json() sẽ không bị lỗi parse HTML
    const errorData = await res.json().catch(() => null);
    
    // Logic bóc tách lỗi từ Laravel Validation (rất chuyên nghiệp)
    const errorMessage = errorData?.error || 
                         errorData?.message || 
                         (errorData?.errors ? Object.values(errorData.errors as Record<string, string[]>)[0]?.[0] : null) || 
                         'Registration failed';
                         
    throw new Error(errorMessage);
  }
  
  return res.json();
};

/**
 * ĐĂNG NHẬP (Login)
 * Yêu cầu: email, password
 */
export const loginQuery = async (data: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || 'Login failed');
  }
  return res.json();
};

/**
 * QUÊN MẬT KHẨU (Forgot Password)
 * Yêu cầu: email
 */
export const forgotPasswordQuery = async (email: string) => {
  const res = await fetch(`${API_BASE_URL}/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || (errorData?.errors ? Object.values(errorData.errors as Record<string, string[]>)[0]?.[0] : null) || 'Request failed');
  }
  return res.json();
};

/**
 * ĐĂNG XUẤT (Logout)
 */
export const logoutQuery = async (token: string) => {
  const res = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
  });
  
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.error || errorData?.message || 'Logout failed');
  }
  return res.json();
};
