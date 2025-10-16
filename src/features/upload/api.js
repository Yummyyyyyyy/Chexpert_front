/**
 * Upload功能模块的API服务
 */
import { API_ENDPOINTS, apiPostFormData } from '../../config/api';

/**
 * 上传并分析CT图像
 * @param {File} file - 要上传的文件
 * @returns {Promise<Object>} 分析结果
 */
export const uploadAndAnalyzeImage = async (file) => {
  try {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);

    // 调用后端API
    const response = await apiPostFormData(API_ENDPOINTS.IMAGE_ANALYZE, formData);

    if (!response.success) {
      throw new Error(response.message || '图像分析失败');
    }

    // 转换为前端期望的格式
    const primaryDisease = response.classifications && response.classifications.length > 0
      ? response.classifications[0]
      : { label: 'Unknown', confidence: 0, description: '未知' };

    return {
      disease: primaryDisease.label,
      confidence: primaryDisease.confidence * 100,
      explanation: primaryDisease.description || '暂无详细说明',
      recommendations: response.classifications.map(c =>
        c.description + ': ' + (c.confidence * 100).toFixed(1) + '%'
      ),
      rawResponse: response,
      heatmapUrl: response.heatmap_image_url,
      originalImageUrl: response.original_image_url,
    };

  } catch (error) {
    console.error('上传图像失败:', error);
    throw new Error(error.message || '图像上传失败，请检查网络连接或后端服务');
  }
};

export const validateFileType = (file) => {
  const validTypes = ['.dcm', '.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  return validTypes.some(type => fileName.endsWith(type));
};

export const validateFileSize = (file) => {
  const maxSize = 50 * 1024 * 1024;
  return file.size <= maxSize;
};

export const getFilePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};
