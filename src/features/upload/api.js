/**
 * Upload功能模块的API服务
 */

// Mock分析结果数据
const mockAnalysisResults = {
  disease: 'Pneumonia',
  confidence: 87.5,
  explanation: 'AI analysis detected consolidation patterns in the right lower lobe consistent with bacterial pneumonia. The opacity shows air bronchograms and increased density compared to surrounding healthy lung tissue.',
  recommendations: [
    'Consider antibiotic treatment',
    'Monitor oxygen saturation',
    'Follow-up chest X-ray in 48-72 hours'
  ]
};

/**
 * 上传并分析CT图像
 * @param {File} file - 要上传的文件
 * @returns {Promise<Object>} 分析结果
 */
export const uploadAndAnalyzeImage = async (file) => {
  // 模拟API调用延迟
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAnalysisResults);
    }, 2000);
  });
};

/**
 * 验证文件类型
 * @param {File} file - 要验证的文件
 * @returns {boolean} 是否为有效文件类型
 */
export const validateFileType = (file) => {
  const validTypes = ['.dcm', '.jpg', '.jpeg', '.png'];
  const fileName = file.name.toLowerCase();
  return validTypes.some(type => fileName.endsWith(type));
};

/**
 * 验证文件大小（最大50MB）
 * @param {File} file - 要验证的文件
 * @returns {boolean} 是否符合大小限制
 */
export const validateFileSize = (file) => {
  const maxSize = 50 * 1024 * 1024; // 50MB
  return file.size <= maxSize;
};

/**
 * 获取文件预览URL
 * @param {File} file - 文件对象
 * @returns {string} 预览URL
 */
export const getFilePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};
