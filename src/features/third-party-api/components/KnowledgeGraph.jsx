import React from 'react';
import { Card, Space, Typography, Image } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import './KnowledgeGraph.css';

const { Text, Title } = Typography;

/**
 * 医学知识图谱组件
 * @param {Object} analysisResults - 分析结果
 * @param {File} selectedFile - 已选择的文件
 */
const KnowledgeGraph = ({ analysisResults, selectedFile }) => {
  const hasData = selectedFile && analysisResults;

  const diseaseImages = {
    'Atelectasis': '/image/KG_Atelectasis.png',
    'Cardiomegaly': '/image/KG_Cardiomegaly.png',
    'Consolidation': '/image/KG_Consolidation.png',
    'Edema': '/image/KG_Edema.png',
    'Enlarged Cardiomediastinum': '/image/KG_Enlarged_Cardiomediastinum.png',
    'Fracture': '/image/KG_Fracture.png',
    'Lung Lesion': '/image/KG_Lung_Lesion.png',
    'Lung Opacity': '/image/KG_Lung_Opacity.png',
    'Pleural Effusion': '/image/KG_Pleural_Effusion.png',
    'Pleural Other': '/image/KG_Pleural_Other.png',
    'Pneumonia': '/image/KG_Pneumonia.png',
    'Pneumothorax': '/image/KG_Pneumothorax.png',
    'Support Devices': '/image/KG_Support_Devices.png'
  };

  const imageSrc = diseaseImages[analysisResults?.disease] ?? '/image/KG.png';


  return (
    <Card
      title={
        <Space>
          <BarChartOutlined style={{ color: '#9333ea' }} />
          <span style={{ color: '#7c3aed' }}>Medical Knowledge Graph</span>
        </Space>
      }
      className="knowledge-graph-card"
    >
      <div className="knowledge-graph-content">
        {hasData ? (
          <div className="graph-display">
            <Text className="graph-title">
              Knowledge Graph for: {analysisResults.disease}
            </Text>
            <Image
              // src="/image/KG.png"
              src={imageSrc}
              alt="Medical Knowledge Graph"
              className="graph-image"
              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
              preview={{
                mask: <div className="preview-mask">Click to view full graph</div>
              }}
            />
            <Text className="graph-description">
              Interactive medical knowledge relationships and disease pathways
            </Text>
          </div>
        ) : (
          <div className="graph-placeholder">
            <BarChartOutlined className="placeholder-icon" />
            <Title level={4} className="placeholder-title">
              Knowledge Graph Visualization
            </Title>
            <Text className="placeholder-text">
              Upload a CT scan to view related medical knowledge graph
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default KnowledgeGraph;
