// src/features/llava-report/components/ReportSection.jsx
import React, { useState } from 'react';
import { Card, Button, Tabs, Space, message, Spin, Empty } from 'antd';
import { FileTextOutlined, ExperimentOutlined, RocketOutlined, DatabaseOutlined } from '@ant-design/icons';
import { generateLLaVAReport, generateLLaVA7BReport, generateGLM4VRAGReport } from '../api';
import FormattedReport from './FormattedReport';

const { TabPane } = Tabs;

/**
 * 报告生成模块 - 支持双模型
 * Props:
 * - analysisResults: 分析结果（包含originalImageUrl和pathology等）
 */
export default function ReportSection({ analysisResults }) {
  const [llavaReport, setLlavaReport] = useState(null);
  const [llava7bReport, setLlava7bReport] = useState(null);
  const [glmRagReport, setGlmRagReport] = useState(null);
  const [llavaLoading, setLlavaLoading] = useState(false);
  const [llava7bLoading, setLlava7bLoading] = useState(false);
  const [glmRagLoading, setGlmRagLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('llava');

  // 提取Top3病症标签
  const getPathologyEntries = () => {
    // 可以在此调整使用分类模型的优先级，当前是 pathology 模型优先
    if (analysisResults?.pathology?.classifications?.length) return analysisResults.pathology.classifications;
    if (analysisResults?.chexpert?.classifications?.length) return analysisResults.chexpert.classifications;   
    if (analysisResults?.pathology?.pathologies?.length) return analysisResults.pathology.pathologies;
    if (analysisResults?.top3?.length) return analysisResults.top3;
    return [];
  };

  const getTop3PathologyLabels = () => {
    const entries = getPathologyEntries();
    return entries
      .slice(0, 3)
      .map(item => item?.label)
      .filter(Boolean);
  };
  const buildClassifierPayload = () => {
    const pathologies = getPathologyEntries();
    const view =
      analysisResults?.chexpert?.meta?.view ||
      analysisResults?.meta?.view ||
      analysisResults?.view;
    const parts = [];
    const probs = {};

    if (view) {
      parts.push(`view=${view}`);
    }

    const topItems = pathologies.slice(0, 6);
    if (topItems.length > 0) {
      topItems.forEach(item => {
        if (!item?.label) return;
        const rawProb =
          typeof item.confidence === 'number'
            ? item.confidence
            : typeof item.probability === 'number'
              ? item.probability
              : null;
        if (typeof rawProb === 'number' && !Number.isNaN(rawProb)) {
          const bounded = Math.max(0, Math.min(1, rawProb));
          probs[item.label] = bounded;
          parts.push(`${item.label}:${bounded.toFixed(2)}`);
        } else {
          parts.push(item.label);
        }
      });
    } else {
      const labels = getTop3PathologyLabels();
      labels.forEach(label => parts.push(label));
    }

    return {
      query: parts.join(', '),
      probs,
    };
  };


  // 将完整URL转换为服务器相对路径
  const convertUrlToPath = (url) => {
    if (!url) return '';

    // 如果是完整URL，提取路径部分
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const urlObj = new URL(url);
        // 返回路径部分，例如 /uploads/xxx.jpg 或 uploads/xxx.jpg
        let path = urlObj.pathname;
        // 移除开头的斜杠，后端期望相对路径
        if (path.startsWith('/')) {
          path = path.substring(1);
        }
        return path;
      } catch (e) {
        console.error('URL解析错误:', e);
        return url;
      }
    }

    // 如果已经是相对路径，直接返回
    return url;
  };

  // 生成LLaVA报告
  const handleGenerateLLaVA = async () => {
    if (!analysisResults) {
      message.warning('请先分析图像');
      return;
    }

    try {
      setLlavaLoading(true);
      const imageUrl = analysisResults.originalImageUrl || analysisResults.original_image_url;
      const imagePath = convertUrlToPath(imageUrl);  // 转换URL为路径
      const pathologyLabels = getTop3PathologyLabels();

      const response = await generateLLaVAReport({
        image_path: imagePath,
        pathology_labels: pathologyLabels
      });

      if (response.success) {
        setLlavaReport(response.report);
        message.success('LLaVA报告生成成功');
        setActiveTab('llava');  // 切换到LLaVA标签页
      } else {
        message.error(response.message || 'LLaVA报告生成失败');
      }
    } catch (error) {
      console.error('LLaVA报告生成错误:', error);
      message.error('LLaVA报告生成失败: ' + (error.message || '网络错误'));
    } finally {
      setLlavaLoading(false);
    }
  };

  // 生成LLaVA-7B报告
  const handleGenerateLLaVA7B = async () => {
    if (!analysisResults) {
      message.warning('请先分析图像');
      return;
    }

    try {
      setLlava7bLoading(true);
      const imageUrl = analysisResults.originalImageUrl || analysisResults.original_image_url;
      const imagePath = convertUrlToPath(imageUrl);  // 转换URL为路径
      const pathologyLabels = getTop3PathologyLabels();

      const response = await generateLLaVA7BReport({
        image_path: imagePath,
        pathology_labels: pathologyLabels
      });

      if (response.success) {
        setLlava7bReport(response.report);
        message.success('LLaVA-7B报告生成成功');
        setActiveTab('llava7b');  // 切换到LLaVA-7B标签页
      } else {
        message.error(response.message || 'LLaVA-7B报告生成失败');
      }
    } catch (error) {
      console.error('LLaVA-7B报告生成错误:', error);
      message.error('LLaVA-7B报告生成失败: ' + (error.message || '网络错误'));
    } finally {
      setLlava7bLoading(false);
    }
  };

  // 生成 GLM-4V + RAG 报告
  const handleGenerateGLM4VRAG = async () => {
    if (!analysisResults) {
      message.warning('请先分析图像');
      return;
    }

    try {
      setGlmRagLoading(true);
      const imageUrl = analysisResults.originalImageUrl || analysisResults.original_image_url;
      const imagePath = convertUrlToPath(imageUrl);
      const pathologyLabels = getTop3PathologyLabels();
      const { query: ragQuery, probs: classifierProbs } = buildClassifierPayload();

      const response = await generateGLM4VRAGReport({
        image_path: imagePath,
        pathology_labels: pathologyLabels,
        rag_query: ragQuery,
        classifier_probs: classifierProbs
      });

      if (response.success) {
        setGlmRagReport(response.report);
        message.success('GLM-4V + RAG 报告生成成功');
        setActiveTab('glm4v_rag');
      } else {
        message.error(response.message || 'GLM-4V + RAG 报告生成失败');
      }
    } catch (error) {
      console.error('GLM-4V + RAG 报告生成错误:', error);
      message.error('GLM-4V + RAG 报告生成失败: ' + (error.message || '网络错误'));
    } finally {
      setGlmRagLoading(false);
    }
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>
            <FileTextOutlined style={{ marginRight: '8px' }} />
            AI Medical Report
          </span>
          <Space>
            <Button
              type="primary"
              icon={<ExperimentOutlined />}
              onClick={handleGenerateLLaVA}
              loading={llavaLoading}
              disabled={!analysisResults || llavaLoading || llava7bLoading || glmRagLoading}
            >
              Generate LLaVA Report
            </Button>
            <Button
              type="primary"
              icon={<RocketOutlined />}
              onClick={handleGenerateLLaVA7B}
              loading={llava7bLoading}
              disabled={!analysisResults || llavaLoading || llava7bLoading || glmRagLoading}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderColor: '#667eea'
              }}
            >
              Generate LLaVA-7B Report
            </Button>
            <Button
              type="primary"
              icon={<DatabaseOutlined />}
              onClick={handleGenerateGLM4VRAG}
              loading={glmRagLoading}
              disabled={!analysisResults || llavaLoading || llava7bLoading || glmRagLoading}
              style={{
                background: 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)',
                borderColor: '#0ba360'
              }}
            >
              Generate GLM-4V + RAG
            </Button>
          </Space>
        </div>
      }
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
        <TabPane
          tab={
            <span>
              <ExperimentOutlined />
              LLaVA Model
            </span>
          }
          key="llava"
        >
          {llavaLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#666' }}>
                Generating LLaVA report, please wait...
              </div>
            </div>
          ) : llavaReport ? (
            <FormattedReport reportText={llavaReport} />
          ) : (
            <Empty
              description="Click 'Generate LLaVA Report' to create a report"
              style={{ padding: '40px 0' }}
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <RocketOutlined />
              LLaVA-7B Model
            </span>
          }
          key="llava7b"
        >
          {llava7bLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#666' }}>
                Generating LLaVA-7B report, please wait...
              </div>
            </div>
          ) : llava7bReport ? (
            <FormattedReport reportText={llava7bReport} />
          ) : (
            <Empty
              description="Click 'Generate LLaVA-7B Report' to create a report"
              style={{ padding: '40px 0' }}
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              GLM-4V + RAG
            </span>
          }
          key="glm4v_rag"
        >
          {glmRagLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px', color: '#666' }}>
                Generating GLM-4V + RAG report, please wait...
              </div>
            </div>
          ) : glmRagReport ? (
            <FormattedReport reportText={glmRagReport} />
          ) : (
            <Empty
              description="Click 'Generate GLM-4V + RAG' to create a report"
              style={{ padding: '40px 0' }}
            />
          )}
        </TabPane>
      </Tabs>

      {/* 显示当前使用的病症标签 */}
      {analysisResults && getTop3PathologyLabels().length > 0 && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          background: '#e8f4f8',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          <strong>Top 3 Pathology Labels:</strong> {getTop3PathologyLabels().join(', ')}
        </div>
      )}
    </Card>
  );
}



