/**
 * 本地存储工具函数
 */

/**
 * 保存到localStorage
 * @param {string} key - 键名
 * @param {any} value - 值
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * 从localStorage读取
 * @param {string} key - 键名
 * @param {any} defaultValue - 默认值
 * @returns {any} 读取的值或默认值
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) return defaultValue;
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * 从localStorage删除
 * @param {string} key - 键名
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * 清空localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * 保存分析历史记录
 * @param {Object} record - 历史记录对象
 */
export const saveAnalysisHistory = (record) => {
  const history = loadFromLocalStorage('analysisHistory', []);
  history.unshift(record); // 添加到开头

  // 只保留最近100条记录
  const trimmedHistory = history.slice(0, 100);
  saveToLocalStorage('analysisHistory', trimmedHistory);
};

/**
 * 获取分析历史记录
 * @returns {Array} 历史记录数组
 */
export const getAnalysisHistory = () => {
  return loadFromLocalStorage('analysisHistory', []);
};
