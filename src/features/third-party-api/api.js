/**
 * 第三方API模块 - 知识图谱服务
 */
import { API_ENDPOINTS, apiPost } from '../../config/api';

/**
 * 获取医学知识图谱数据
 * @param {string} disease - 疾病名称
 * @returns {Promise<Object>} 知识图谱数据
 */
export const fetchKnowledgeGraph = async (disease) => {
  try {
    // 调用后端API
    const response = await apiPost(API_ENDPOINTS.KNOWLEDGE_QUERY, {
      disease_name: disease,
      language: 'zh'
    });

    if (!response.success) {
      throw new Error(response.message || '知识图谱查询失败');
    }

    const kg = response.knowledge_graph;

    // 转换为前端期望的格式
    return {
      disease: response.disease_name,
      nodes: kg.graph_visualization?.nodes || [
        { id: 1, label: disease, type: 'disease' },
      ],
      edges: kg.graph_visualization?.edges || [],
      imageUrl: '/image/IMG_1674.jpg',
      description: kg.description,
      symptoms: kg.symptoms,
      causes: kg.causes,
      treatments: kg.treatments,
      prevention: kg.prevention,
      relatedDiseases: kg.related_diseases
    };

  } catch (error) {
    console.error('获取知识图谱失败:', error);
    throw new Error(error.message || '知识图谱查询失败，请检查网络连接或后端服务');
  }
};

/**
 * 获取疾病相关信息
 * @param {string} disease - 疾病名称
 * @returns {Promise<Object>} 疾病详细信息
 */
export const fetchDiseaseInfo = async (disease) => {
  const graphData = await fetchKnowledgeGraph(disease);
  return {
    name: disease,
    description: graphData.description || '',
    symptoms: graphData.symptoms || [],
    treatments: graphData.treatments || [],
    relatedConditions: graphData.relatedDiseases || []
  };
};

/**
 * 搜索医学文献
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 文献列表
 */
export const searchMedicalLiterature = async (query) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const literature = [
        {
          id: 1,
          title: 'Study on ' + query,
          authors: ['Author A', 'Author B'],
          year: 2023,
          abstract: 'Abstract content...'
        }
      ];
      resolve(literature);
    }, 1000);
  });
};
