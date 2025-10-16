/**
 * 第三方API模块 - 知识图谱服务
 */

/**
 * 获取医学知识图谱数据
 * @param {string} disease - 疾病名称
 * @returns {Promise<Object>} 知识图谱数据
 */
export const fetchKnowledgeGraph = async (disease) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const graphData = {
        disease,
        nodes: [
          { id: 1, label: disease, type: 'disease' },
          { id: 2, label: 'Symptoms', type: 'category' },
          { id: 3, label: 'Treatments', type: 'category' },
          { id: 4, label: 'Related Conditions', type: 'category' }
        ],
        edges: [
          { from: 1, to: 2 },
          { from: 1, to: 3 },
          { from: 1, to: 4 }
        ],
        imageUrl: '/image/IMG_1674.jpg'
      };
      resolve(graphData);
    }, 1000);
  });
};

/**
 * 获取疾病相关信息
 * @param {string} disease - 疾病名称
 * @returns {Promise<Object>} 疾病详细信息
 */
export const fetchDiseaseInfo = async (disease) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const diseaseInfo = {
        name: disease,
        description: `Detailed information about ${disease}`,
        symptoms: ['Symptom 1', 'Symptom 2', 'Symptom 3'],
        treatments: ['Treatment 1', 'Treatment 2'],
        relatedConditions: ['Related condition 1', 'Related condition 2']
      };
      resolve(diseaseInfo);
    }, 1000);
  });
};

/**
 * 搜索医学文献
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 文献列表
 */
export const searchMedicalLiterature = async (query) => {
  // 模拟API调用
  return new Promise((resolve) => {
    setTimeout(() => {
      const literature = [
        {
          id: 1,
          title: `Study on ${query}`,
          authors: ['Author A', 'Author B'],
          year: 2023,
          abstract: 'Abstract content...'
        }
      ];
      resolve(literature);
    }, 1000);
  });
};
