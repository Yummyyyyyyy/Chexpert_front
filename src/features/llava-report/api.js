/**
 * LLaVA报告生成模块的API服务
 */
import { API_ENDPOINTS, apiPost } from '../../config/api';

/**
 * 调用LLaVA模型生成医疗报告
 * @param {Object} analysisData - 分析数据
 * @param {string} customPrompt - 自定义提示
 * @returns {Promise<Object>} 生成的报告
 */
export const generateMedicalReport = async (analysisData, customPrompt = '') => {
  try {
    // 从分析数据中获取图片路径
    const imagePath = analysisData.rawResponse?.original_image_url || analysisData.originalImageUrl;

    if (!imagePath) {
      throw new Error('缺少图片路径，无法生成报告');
    }

    // 调用后端API
    const response = await apiPost(API_ENDPOINTS.REPORT_GENERATE, {
      image_path: imagePath,
      prompt: customPrompt || '请分析这张X光片并生成详细的医学报告'
    });

    if (!response.success) {
      throw new Error(response.message || '报告生成失败');
    }

    // 转换为前端期望的格式
    return {
      title: 'Medical Imaging Analysis Report',
      diagnosis: analysisData?.disease || 'No diagnosis available',
      confidence: analysisData?.confidence || 0,
      detailedAnalysis: response.report,
      recommendations: analysisData?.recommendations || [],
      generatedBy: 'LLaVA Medical AI Model',
      timestamp: new Date().toLocaleString(),
      customNotes: customPrompt,
      processingTime: response.processing_time
    };

  } catch (error) {
    console.error('生成报告失败:', error);
    throw new Error(error.message || '报告生成失败，请检查网络连接或后端服务');
  }
};

export const exportReportToPDF = async (report) => {
  return new Promise((resolve, reject) => {
    reject(new Error('PDF export not implemented yet'));
  });
};

export const exportReportToWord = async (report) => {
  return new Promise((resolve, reject) => {
    reject(new Error('Word export not implemented yet'));
  });
};
