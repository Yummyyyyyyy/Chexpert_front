// src/features/upload/api.js
import { API_BASE_URL, API_ENDPOINTS } from '../../config/api';

// 相对路径 → 绝对 URL
const toAbs = (u) => (!u ? null : (/^https?:\/\//i.test(u) ? u : `${API_BASE_URL}${u.startsWith('/') ? '' : '/'}${u}`));

export function validateFileType(f) {
  const ok = ['.dcm', '.jpg', '.jpeg', '.png'];
  const name = (f?.name || '').toLowerCase();
  return ok.some((ext) => name.endsWith(ext));
}

export function validateFileSize(f, maxMB = 50) {
  return (f?.size || 0) <= maxMB * 1024 * 1024;
}

export function getFilePreviewUrl(file) {
  try { return URL.createObjectURL(file); } catch { return null; }
}

export async function uploadAndAnalyzeImage(file, options = {}) {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('generate_heatmap', String(options.generate_heatmap ?? true));
  fd.append('threshold', String(options.threshold ?? 0.5));
  fd.append('alpha', String(options.alpha ?? 0.45));
  if (options.return_top_k != null) fd.append('return_top_k', String(options.return_top_k));

  const r = await fetch(API_ENDPOINTS.ANALYZE, { method: 'POST', body: fd });
  const data = await r.json().catch(() => ({}));

  if (!data?.success) {
    return { success: false, message: data?.detail?.message || 'Analyze failed', rawResponse: data };
  }

  let disease = 'Unknown', confidence = 0;
  if (Array.isArray(data.classifications) && data.classifications.length) {
    disease = data.classifications[0].label || 'Unknown';
    confidence = data.classifications[0].confidence || 0;
  }

  return {
    success: true,
    disease,
    confidence,
    explanation: '',
    recommendations: (data.classifications || []).map(it => ({
      label: it.label,
      confidence: `${Math.round((it.confidence || 0) * 100)}%`,
      description: it.description || ''
    })),
    heatmapUrl: toAbs(data.heatmap_image_url),
    originalImageUrl: toAbs(data.original_image_url),
    meta: data.meta || {},
    rawResponse: data
  };
}
