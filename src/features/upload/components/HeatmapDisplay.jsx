// upload/components/HeatmapDisplay.jsx
import React from 'react';
import { Card, Typography, Progress, Tag, Space, Empty } from 'antd';

const { Title, Text, Paragraph } = Typography;

export default function HeatmapDisplay({ analysisResults, isAnalyzing }) {
  if (!analysisResults) return null;

  const {
    disease,
    confidence,
    explanation,
    recommendations = [],
    heatmapUrl,
    meta = {}
  } = analysisResults;

  return (
    <Card className="heatmap-card" loading={isAnalyzing} title="AI 分析结果">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Title level={4} style={{ marginBottom: 0 }}>{disease || '未知'}</Title>
        <Progress percent={Math.round((confidence || 0) * 100)} />
        <Paragraph style={{ marginTop: 8 }}>{explanation || '暂无详细说明'}</Paragraph>

        {/* 只显示热力图 */}
        <div className="image-pair">
          {heatmapUrl ? (
            <div className="image-col" style={{ width: '100%' }}>
              <Text type="secondary">热力图</Text>
              <img src={heatmapUrl} alt="heatmap" className="image" style={{ width: '100%', borderRadius: 8 }} />
            </div>
          ) : (
            <Empty description="未生成热力图（可能阈值过高或未开启）" />
          )}
        </div>

        {/* 建议/Top-K */}
        <div className="reco-list">
          {recommendations.map((rec, i) => (
            <Tag key={i}>{`${rec.label} · ${rec.confidence}`}</Tag>
          ))}
        </div>

        {/* meta */}
        {meta ? (
          <div className="meta">
            <Text type="secondary">
              模型：{meta.model_name || '-'} · 设备：{meta.device || '-'} · 耗时：
              {typeof meta.inference_time_ms === 'number' ? `${meta.inference_time_ms} ms` : '-'}
            </Text>
          </div>
        ) : null}
      </Space>
    </Card>
  );
}
