// src/features/llava-report/components/FormattedReport.jsx
import React from 'react';
import { Card, Typography, Divider } from 'antd';
import { FileTextOutlined, EyeOutlined, BulbOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

/**
 * 格式化医学报告展示组件
 * 自动识别并分块展示 FINDINGS, IMPRESSION, SUMMARY
 */
export default function FormattedReport({ reportText }) {
  // 解析报告文本，提取各个部分
  const parseReport = (text) => {
    if (!text) return { findings: '', impression: '', summary: '' };

    // 使用正则表达式提取各部分（不区分大小写）
    const findingsMatch = text.match(/FINDINGS:\s*([\s\S]*?)(?=IMPRESSION:|SUMMARY:|$)/i);
    const impressionMatch = text.match(/IMPRESSION:\s*([\s\S]*?)(?=SUMMARY:|FINDINGS:|$)/i);
    const summaryMatch = text.match(/SUMMARY:\s*([\s\S]*?)$/i);

    // 转换文本为标准格式（句子首字母大写）
    const normalizeContent = (str) => {
      if (!str) return '';
      return str
        .trim()
        .split(/\n+/)
        .map(line => {
          line = line.trim();
          if (!line) return '';
          // 句子首字母大写
          return line
            .toLowerCase()
            .replace(/(^\w|[.!?]\s+\w)/g, letter => letter.toUpperCase());
        })
        .filter(line => line)
        .join('\n');
    };

    return {
      findings: normalizeContent(findingsMatch ? findingsMatch[1] : ''),
      impression: normalizeContent(impressionMatch ? impressionMatch[1] : ''),
      summary: normalizeContent(summaryMatch ? summaryMatch[1] : ''),
      raw: !findingsMatch && !impressionMatch && !summaryMatch ? text : null
    };
  };

  const { findings, impression, summary, raw } = parseReport(reportText);

  // 如果无法解析，显示原始文本
  if (raw) {
    return (
      <div style={{
        padding: '16px',
        background: '#f9fafb',
        borderRadius: '8px',
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        lineHeight: '1.8',
        whiteSpace: 'pre-wrap'
      }}>
        {raw}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* FINDINGS 部分 */}
      {findings && (
        <Card
          size="small"
          style={{
            borderLeft: '4px solid #3b82f6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <EyeOutlined style={{ fontSize: '20px', color: '#3b82f6', marginRight: '8px' }} />
            <Title level={5} style={{ margin: 0, color: '#3b82f6' }}>
              FINDINGS
            </Title>
          </div>
          <Paragraph
            style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#374151'
            }}
          >
            {findings}
          </Paragraph>
        </Card>
      )}

      {/* IMPRESSION 部分 */}
      {impression && (
        <Card
          size="small"
          style={{
            borderLeft: '4px solid #10b981',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <BulbOutlined style={{ fontSize: '20px', color: '#10b981', marginRight: '8px' }} />
            <Title level={5} style={{ margin: 0, color: '#10b981' }}>
              IMPRESSION
            </Title>
          </div>
          <Paragraph
            style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#374151'
            }}
          >
            {impression}
          </Paragraph>
        </Card>
      )}

      {/* SUMMARY 部分 */}
      {summary && (
        <Card
          size="small"
          style={{
            borderLeft: '4px solid #f59e0b',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <FileTextOutlined style={{ fontSize: '20px', color: '#f59e0b', marginRight: '8px' }} />
            <Title level={5} style={{ margin: 0, color: '#f59e0b' }}>
              SUMMARY
            </Title>
          </div>
          <Paragraph
            style={{
              margin: 0,
              fontFamily: 'Georgia, serif',
              fontSize: '14px',
              lineHeight: '1.8',
              color: '#374151'
            }}
          >
            {summary}
          </Paragraph>
        </Card>
      )}
    </div>
  );
}
