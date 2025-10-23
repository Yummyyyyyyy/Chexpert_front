// src/features/llava-report/components/ReportGenerator.jsx
import React, { useState } from 'react';
import { Card, Button, Space, message } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { generateReport } from '../api';

/**
 * Props:
 * - analysisData: 后端 /analyze 的返回（包含 classifications、heatmap_image_url 等）
 * - onReportGenerated: function(text) -> void  // 生成后把文本回传给父组件
 */
export default function ReportGenerator({ analysisData, onReportGenerated }) {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!analysisData || !analysisData.success) {
      message.warning('Please run analysis first.');
      return;
    }
    try {
      setLoading(true);

      const classifications =
        analysisData.classifications ||
        analysisData.rawResponse?.classifications ||
        [];

      const heatmap =
        analysisData.heatmapUrl ||
        analysisData.heatmap_image_url ||
        null;

      const original =
        analysisData.originalImageUrl ||
        analysisData.original_image_url ||
        null;

      const res = await generateReport({
        classifications,
        heatmap_image_url: heatmap,
        original_image_url: original,
      });

      if (res.success) {
        onReportGenerated?.(res.report_text || '');
        message.success('Report generated.');
      } else {
        onReportGenerated?.('');
        message.error('Failed to generate report.');
      }
    } catch (e) {
      onReportGenerated?.('');
      message.error(e?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Report Generator">
      <Space>
        <Button
          type="primary"
          icon={<FileTextOutlined />}
          onClick={handleGenerate}
          loading={loading}
          disabled={!analysisData || !analysisData.success}
        >
          Generate Report
        </Button>
      </Space>
    </Card>
  );
}
