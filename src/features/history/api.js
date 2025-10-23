// src/features/history/api.js
import { API_ENDPOINTS } from '../../config/api';

export async function fetchAnalysisHistory() {
  try {
    const res = await fetch(API_ENDPOINTS.HISTORY_LIST, { method: 'GET' });
    const data = await res.json().catch(() => ({}));
    // 后端返回 { items: [...] }
    return Array.isArray(data.items) ? data.items : [];
  } catch (e) {
    console.warn('[history] fetch failed:', e);
    return [];
  }
}
