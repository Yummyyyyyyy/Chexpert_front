/**
 * 验证工具函数
 */

/**
 * 验证文件类型
 * @param {File} file - 文件对象
 * @param {Array<string>} allowedTypes - 允许的文件类型数组
 * @returns {boolean} 是否为有效文件类型
 */
export const validateFileType = (file, allowedTypes = ['.dcm', '.jpg', '.jpeg', '.png']) => {
  if (!file) return false;

  const fileName = file.name.toLowerCase();
  return allowedTypes.some(type => fileName.endsWith(type));
};

/**
 * 验证文件大小
 * @param {File} file - 文件对象
 * @param {number} maxSizeMB - 最大文件大小（MB）
 * @returns {boolean} 是否符合大小限制
 */
export const validateFileSize = (file, maxSizeMB = 50) => {
  if (!file) return false;

  const maxSize = maxSizeMB * 1024 * 1024;
  return file.size <= maxSize;
};

/**
 * 验证图像文件
 * @param {File} file - 文件对象
 * @returns {Object} 验证结果 { valid: boolean, error: string }
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!validateFileType(file)) {
    return { valid: false, error: 'Invalid file type. Only .dcm, .jpg, .jpeg, .png are allowed' };
  }

  if (!validateFileSize(file, 50)) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  return { valid: true, error: null };
};

/**
 * 验证空值
 * @param {any} value - 要验证的值
 * @returns {boolean} 是否为空
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};
