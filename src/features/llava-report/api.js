// src/features/llava-report/api.js
import { API_ENDPOINTS } from '../../config/api';

/**
 * 生成LLaVA模型报告
 * @param {Object} params
 * @param {string} params.image_path - 图片路径
 * @param {Array<string>} params.pathology_labels - 病症标签列表（Top3）
 * @param {string} params.prompt - 可选的自定义提示词
 * @returns {Promise<{success: boolean, report: string, processing_time: number}>}
 */
export async function generateLLaVAReport({ image_path, pathology_labels, prompt }) {
  const response = await fetch(API_ENDPOINTS.REPORT_LLAVA, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_path,
      pathology_labels,
      prompt
    })
  });

  const data = await response.json();
  return data;
}

/**
 * 向后兼容的报告生成函数（旧API）
 * 用于兼容旧的 ReportGenerator 组件
 * @deprecated 请使用 generateLLaVAReport 或 generateLLaVA7BReport
 */
export async function generateReport({ classifications, heatmap_image_url, original_image_url }) {
  // 这是一个占位符，因为旧的接口已经不存在
  // 返回一个简单的格式化文本
  return {
    success: true,
    report_text: 'Please use the new ReportSection component with LLaVA or LLaVA-7B models.',
    raw: {}
  };
}

/**
 * 生成LLaVA-7B模型报告
 * @param {Object} params
 * @param {string} params.image_path - 图片路径
 * @param {Array<string>} params.pathology_labels - 病症标签列表（Top3）
 * @param {string} params.prompt - 可选的自定义提示词
 * @returns {Promise<{success: boolean, report: string, processing_time: number}>}
 */
export async function generateLLaVA7BReport({ image_path, pathology_labels, prompt }) {
  const response = await fetch(API_ENDPOINTS.REPORT_LLAVA7B, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image_path,
      pathology_labels,
      prompt
    })
  });

  const data = await response.json();
  return data;
}
