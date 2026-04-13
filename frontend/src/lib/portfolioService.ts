const API_BASE_URL = 'http://127.0.0.1:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

export interface WalletAsset {
  id: number;
  user_id: number;
  coin_symbol: string;
  amount: number;
  avg_buy_price: number;
  created_at: string;
  updated_at: string;
}

// GET /api/portfolio — lấy danh sách tài sản trong ví
export async function fetchPortfolio(): Promise<WalletAsset[]> {
  const res = await fetch(`${API_BASE_URL}/portfolio`, {
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Failed to fetch portfolio');
  }

  const json = await res.json();
  return json.data ?? json;
}

// POST /api/portfolio/add — thêm/cập nhật coin
export async function addAsset(payload: {
  coin_symbol: string;
  amount: number;
  avg_buy_price?: number;
}): Promise<WalletAsset> {
  const res = await fetch(`${API_BASE_URL}/portfolio/add`, {
    method: 'POST',
    headers: getAuthHeaders(),
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Failed to add asset');
  }

  const json = await res.json();
  return json.data ?? json;
}

// DELETE /api/portfolio/:symbol — xóa coin
export async function removeAsset(symbol: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/portfolio/${symbol}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Failed to remove asset');
  }
}
