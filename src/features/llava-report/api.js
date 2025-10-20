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
      prompt: customPrompt || 'You are an experienced radiologist. Analyze this chest X-ray image and generate a comprehensive diagnostic report including FINDINGS, IMPRESSION AND SUMMARY sections.'
    });

    if (!response.success) {
      throw new Error(response.message || '报告生成失败');
    }

    // 格式化报告文本：移除Markdown符号并在句号和冒号后添加换行
    const formatReport = (text) => {
      if (!text) return '';

      let formattedText = text;

      // 1. 移除所有Markdown渲染符号
      formattedText = formattedText
        // 移除标题符号 (# ## ### 等)
        .replace(/^#+\s+/gm, '')
        // 移除粗体符号 (**text** 或 __text__)
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        // 移除斜体符号 (*text* 或 _text_)
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        // 移除删除线 (~~text~~)
        .replace(/~~(.+?)~~/g, '$1')
        // 移除代码块符号 (```code```)
        .replace(/```[\s\S]*?```/g, (match) => {
          return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
        })
        // 移除行内代码符号 (`code`)
        .replace(/`(.+?)`/g, '$1')
        // 移除链接但保留文本 [text](url)
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        // 移除图片 ![alt](url)
        .replace(/!\[.*?\]\(.+?\)/g, '')
        // 移除引用符号 (> text)
        .replace(/^>\s+/gm, '')
        // 移除无序列表符号 (- * +)
        .replace(/^[\*\-\+]\s+/gm, '')
        // 移除水平分割线 (--- *** ___)
        .replace(/^[\*\-_]{3,}$/gm, '')
        // 移除HTML标签
        .replace(/<[^>]+>/g, '');

      // 2. 在句号和冒号后添加换行
      formattedText = formattedText
        // 在句号后添加换行（但保留数字后的句号，如 "1. "）
        .replace(/\.\s+(?=\d+\.\s)/g, '.\n')  // 数字列表前换行
        .replace(/\.\s+(?=[A-Z])/g, '.\n')    // 大写字母开头的新句子前换行
        // 在冒号后添加换行（但不影响时间格式）
        .replace(/:\s+(?=[A-Z])/g, ':\n')     // 冒号后跟大写字母时换行
        .trim();

      return formattedText;
    };

    // 转换为前端期望的格式
    return {
      title: 'Medical Imaging Analysis Report',
      diagnosis: analysisData?.disease || 'No diagnosis available',
      confidence: analysisData?.confidence || 0,
      detailedAnalysis: formatReport(response.report),
      recommendations: analysisData?.recommendations || [],
      generatedBy: 'LLaVA Medical AI Model',
      timestamp: new Date().toLocaleString(),
      customNotes: customPrompt,
      processingTime: response.processing_time,
      modelType: 'llava'  // 标识模型类型
    };

  } catch (error) {
    console.error('生成报告失败:', error);
    throw new Error(error.message || '报告生成失败，请检查网络连接或后端服务');
  }
};

/**
 * 调用LLAVA-7B模型生成医疗报告
 * @param {Object} analysisData - 分析数据
 * @param {string} customPrompt - 自定义提示
 * @returns {Promise<Object>} 生成的报告
 */
export const generateMedicalReportV2 = async (analysisData, customPrompt = '') => {
  try {
    // 从分析数据中获取图片路径
    const imagePath = analysisData.rawResponse?.original_image_url || analysisData.originalImageUrl;

    if (!imagePath) {
      throw new Error('缺少图片路径，无法生成报告');
    }

    // 准备support_info (从分类结果提取)
    // 当前/api/v1/image/analyze接口未完全实现，support_info可以暂时为空
    // 未来可以从analysisData.classifications提取
    let supportInfo = '';
    if (analysisData.classifications && analysisData.classifications.length > 0) {
      supportInfo = analysisData.classifications
        .map(c => `${c.label} (${(c.confidence * 100).toFixed(1)}%)`)
        .join(', ');
    }

    // 调用后端API V2
    const response = await apiPost(API_ENDPOINTS.REPORT_GENERATE_V2, {
      image_path: imagePath,
      prompt: customPrompt || undefined,  // 使用undefined让后端使用默认prompt
      support_info: supportInfo || undefined  // 预留字段，未来使用
    });

    if (!response.success) {
      throw new Error(response.message || 'LLAVA-7B报告生成失败');
    }

    // 格式化报告文本：移除Markdown符号并在句号和冒号后添加换行
    const formatReport = (text) => {
      if (!text) return '';

      let formattedText = text;

      // 1. 移除所有Markdown渲染符号
      formattedText = formattedText
        // 移除标题符号 (# ## ### 等)
        .replace(/^#+\s+/gm, '')
        // 移除粗体符号 (**text** 或 __text__)
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/__(.+?)__/g, '$1')
        // 移除斜体符号 (*text* 或 _text_)
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/_(.+?)_/g, '$1')
        // 移除删除线 (~~text~~)
        .replace(/~~(.+?)~~/g, '$1')
        // 移除代码块符号 (```code```)
        .replace(/```[\s\S]*?```/g, (match) => {
          return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
        })
        // 移除行内代码符号 (`code`)
        .replace(/`(.+?)`/g, '$1')
        // 移除链接但保留文本 [text](url)
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        // 移除图片 ![alt](url)
        .replace(/!\[.*?\]\(.+?\)/g, '')
        // 移除引用符号 (> text)
        .replace(/^>\s+/gm, '')
        // 移除无序列表符号 (- * +)
        .replace(/^[\*\-\+]\s+/gm, '')
        // 移除水平分割线 (--- *** ___)
        .replace(/^[\*\-_]{3,}$/gm, '')
        // 移除HTML标签
        .replace(/<[^>]+>/g, '');

      // 2. 在句号和冒号后添加换行
      formattedText = formattedText
        // 在句号后添加换行（但保留数字后的句号，如 "1. "）
        .replace(/\.\s+(?=\d+\.\s)/g, '.\n')  // 数字列表前换行
        .replace(/\.\s+(?=[A-Z])/g, '.\n')    // 大写字母开头的新句子前换行
        // 在冒号后添加换行（但不影响时间格式）
        .replace(/:\s+(?=[A-Z])/g, ':\n')     // 冒号后跟大写字母时换行
        .trim();

      return formattedText;
    };

    // 转换为前端期望的格式 (LLAVA-7B只返回报告内容，不包含诊断信息)
    return {
      title: 'Medical Imaging Analysis Report (LLAVA-7B)',
      detailedAnalysis: formatReport(response.report),
      generatedBy: 'LLAVA-7B Medical AI Model',
      timestamp: new Date().toLocaleString(),
      customNotes: customPrompt,
      processingTime: response.processing_time,
      modelType: 'llava-7b'  // 标识模型类型
    };

  } catch (error) {
    console.error('生成LLAVA-7B报告失败:', error);
    throw new Error(error.message || 'LLAVA-7B报告生成失败，请检查网络连接或后端服务');
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
