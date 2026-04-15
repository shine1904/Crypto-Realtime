import { fetchWithAuth, BASE_URL } from './apiFetch';

export interface WalletAsset {
  id: number;
  user_id: number;
  coin_symbol: string;
  amount: number;
  average_buy_price: number;
  created_at: string;
  updated_at: string;
}

// GET /api/portfolio — lấy danh sách tài sản trong ví
export async function fetchPortfolio(): Promise<WalletAsset[]> {
  const res = await fetchWithAuth(`${BASE_URL}/portfolio`);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Failed to fetch portfolio');
  }

  const json = await res.json();
  return json.data ?? json;
}

// POST /api/portfolio/add — thêm/cập nhật coin
export async function addAsset(payload: {
  symbol: string;
  amount: number;
  price?: number;
  type?: 'BUY' | 'SELL';
}): Promise<WalletAsset> {
  const res = await fetchWithAuth(`${BASE_URL}/portfolio/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      type: payload.type || 'BUY', // Mặc định là BUY nếu không có
      price: payload.price || 0,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.data?.message || err?.message || 'Failed to add asset');
  }

  const json = await res.json();
  return json.data ?? json;
}

// DELETE /api/portfolio/:symbol — xóa coin
export async function removeAsset(symbol: string): Promise<void> {
  const res = await fetchWithAuth(`${BASE_URL}/portfolio/${symbol}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || 'Failed to remove asset');
  }
}
