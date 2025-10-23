// src/config/api.js
export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  process.env.REACT_APP_API_BASE_URL ||
  'http://localhost:8000';

export const API_ENDPOINTS = {
  ANALYZE:       `${API_BASE_URL}/api/v1/image/analyze`,
  PATHO_ANALYZE: `${API_BASE_URL}/api/v1/pathology/analyze`,
  PATHO_LABELS:  `${API_BASE_URL}/api/v1/pathology/labels`,
  REPORT:        `${API_BASE_URL}/api/v1/report/generate`,
  HISTORY_LIST:   `${API_BASE_URL}/api/v1/history/list`,
  HISTORY_ADD:    `${API_BASE_URL}/api/v1/history/add`,
  REPORT_GENERATE: `${API_BASE_URL}/api/v1/report/generate`,
  REPORT_LLAVA:   `${API_BASE_URL}/api/v1/report/generate`,      // LLaVA模型
  REPORT_LLAVA7B: `${API_BASE_URL}/api/v1/report/generate-v2`,   // LLaVA-7B模型
  REPORT_GLM4V_RAG: `${API_BASE_URL}/api/v1/report/generate-glm4v-rag`, // GLM-4V + RAG
};


// 兼容函数（别的模块可能还在用）
const toAbs = (u) => (!u ? null : (/^https?:\/\//i.test(u) ? u : `${API_BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`));
export { toAbs };
export async function apiPost(url, body = {}, options = {}) {
  const r = await fetch(/^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    body: JSON.stringify(body),
    ...options,
  });
  return r.json().catch(() => ({}));
}
export async function apiGet(url, options = {}) {
  const r = await fetch(/^https?:\/\//i.test(url) ? url : `${API_BASE_URL}${url}`, {
    method: 'GET', ...(options || {}),
  });
  return r.json().catch(() => ({}));
}
