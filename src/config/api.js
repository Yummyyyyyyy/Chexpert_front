/**
 * API配置文件
 * 统一管理后端API地址
 */

// 后端API基础URL
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// API版本前缀
export const API_V1_PREFIX = '/api/v1';

// 完整的API端点
export const API_ENDPOINTS = {
  // 图像分析
  IMAGE_ANALYZE: `${API_BASE_URL}${API_V1_PREFIX}/image/analyze`,

  // 报告生成
  REPORT_GENERATE: `${API_BASE_URL}${API_V1_PREFIX}/report/generate`,

  // 知识图谱
  KNOWLEDGE_QUERY: `${API_BASE_URL}${API_V1_PREFIX}/knowledge/query`,

  // 健康检查
  HEALTH: `${API_BASE_URL}/health`,
};

/**
 * 通用的fetch请求封装
 * @param {string} url - 请求URL
 * @param {Object} options - fetch选项
 * @returns {Promise} 响应数据
 */
export const apiFetch = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    // 检查HTTP状态
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Network error',
        detail: response.statusText
      }));
      throw new Error(error.detail || error.error || 'API request failed');
    }

    return await response.json();
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
};

/**
 * POST请求封装（JSON）
 */
export const apiPost = (url, data) => {
  return apiFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};

/**
 * POST请求封装（FormData，用于文件上传）
 */
export const apiPostFormData = (url, formData) => {
  return apiFetch(url, {
    method: 'POST',
    body: formData,
    // 注意：上传文件时不要手动设置Content-Type，让浏览器自动设置
  });
};

export default API_ENDPOINTS;
