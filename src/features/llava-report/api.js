// src/features/llava-report/api.js
// All imports must stay at top to satisfy eslint `import/first`
import { API_ENDPOINTS, apiPost } from '../../config/api';

/**
 * Generate report text from analysis results.
 * payload: {
 *   classifications: [{label, confidence}],  // required
 *   heatmap_image_url?: string,
 *   original_image_url?: string,
 *   patient_id?: string|null,
 *   study_id?: string|null
 * }
 */
export async function generateReport({ chexpert, pathology, patient_info, notes }) {
  const res = await fetch(API_ENDPOINTS.REPORT_GENERATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chexpert, pathology, patient_info, notes }),
  });
  const data = await res.json();
  return data; // { success, report_text, report_url }
}
  const data = await apiPost(API_ENDPOINTS.REPORT, body);
  // 统一返回格式
  return {
    success: !!data?.success,
    report_text: data?.report_text || '',
    raw: data,
  };
}
