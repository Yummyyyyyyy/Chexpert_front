/**
 * 历史记录模块的API服务
 */

// Mock历史数据
const mockHistoryData = [
  {
    key: '1',
    date: '2024-01-15',
    fileName: 'chest_ct_001.dcm',
    diagnosis: 'Pneumonia',
    confidence: 87.5,
    status: 'completed'
  },
  {
    key: '2',
    date: '2024-01-14',
    fileName: 'chest_ct_002.dcm',
    diagnosis: 'Normal',
    confidence: 94.2,
    status: 'completed'
  },
  {
    key: '3',
    date: '2024-01-13',
    fileName: 'chest_ct_003.dcm',
    diagnosis: 'Pleural Effusion',
    confidence: 91.8,
    status: 'completed'
  },
  {
    key: '4',
    date: '2024-01-12',
    fileName: 'chest_ct_004.dcm',
    diagnosis: 'Normal',
    confidence: 96.1,
    status: 'completed'
  },
  {
    key: '5',
    date: '2024-01-11',
    fileName: 'chest_ct_005.dcm',
    diagnosis: 'Pneumothorax',
    confidence: 89.3,
    status: 'completed'
  }
];

/**
 * 获取分析历史记录
 * @returns {Promise<Array>} 历史记录数组
 */
export const fetchAnalysisHistory = async () => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockHistoryData);
    }, 500);
  });
};

/**
 * 删除历史记录
 * @param {string} key - 记录ID
 * @returns {Promise<boolean>} 是否成功
 */
export const deleteHistoryRecord = async (key) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 300);
  });
};

/**
 * 导出历史记录为CSV
 * @param {Array} data - 历史数据
 * @returns {string} CSV字符串
 */
export const exportHistoryToCSV = (data) => {
  const headers = ['Date', 'File Name', 'Diagnosis', 'Confidence', 'Status'];
  const rows = data.map(item => [
    item.date,
    item.fileName,
    item.diagnosis,
    item.confidence,
    item.status
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};
