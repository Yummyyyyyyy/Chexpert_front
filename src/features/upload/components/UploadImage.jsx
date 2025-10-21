// src/features/upload/components/UploadImage.jsx
import React, { useState } from 'react';
import { Upload, Card, message, Space, Typography, InputNumber, Switch, Button } from 'antd';
import { InboxOutlined, PlayCircleOutlined } from '@ant-design/icons';

import {
  uploadAndAnalyzeImage,
  analyzePathology,
  validateFileType,
  validateFileSize,
  getFilePreviewUrl,
} from '../api';
import { API_ENDPOINTS } from '../../../config/api';

const { Dragger } = Upload;
const { Text } = Typography;

export default function UploadImage({ onFileChange, onAnalysisFinished, onResults }) {
  const [file, setFile] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [generateHeatmap, setGenerateHeatmap] = useState(true);
  const [threshold, setThreshold] = useState(0.5); // 仍然按原逻辑传给病理接口作为 min_prob
  const [topK, setTopK] = useState(10);
  const [loading, setLoading] = useState(false);

  const beforeUpload = (f) => {
    if (!validateFileType(f)) { message.error('Only .dcm/.jpg/.jpeg/.png'); return Upload.LIST_IGNORE || false; }
    if (!validateFileSize(f)) { message.error('Max size 50MB'); return Upload.LIST_IGNORE || false; }
    return false;
  };

  const onChange = (info) => {
    const raw = info?.file?.originFileObj || info?.file;
    if (!raw || !validateFileType(raw) || !validateFileSize(raw)) {
      setFile(null); setFileList([]); return;
    }
    setFile(raw);
    setFileList([{ ...info.file, status: 'done' }]);
    onFileChange?.(raw);
  };

  const onRemove = () => { setFile(null); setFileList([]); return true; };

  const handleAnalyze = async () => {
    if (!file) { message.warning('Please choose a file first'); return; }

    const chexOpts = {
      generate_heatmap: generateHeatmap,
      threshold,
      alpha: 0.45,
      return_top_k: topK,
    };

    setLoading(true);
    try {
      console.log('[UI] Start Analysis clicked');
      console.log('[Analyze] opts =', chexOpts);

      const hasPathology = !!API_ENDPOINTS?.PATHO_ANALYZE;

      // 并发请求（保持原来的阈值传递给病理接口：min_prob = threshold）
      const [chexpertRes, pathoRes] = await Promise.allSettled([
        uploadAndAnalyzeImage(file, chexOpts),
        hasPathology
          ? analyzePathology(file, { top_k: topK, min_prob: threshold })
          : Promise.resolve({ success: false }),
      ]);

      const chexpert  = chexpertRes.status === 'fulfilled' ? chexpertRes.value : null;
      const pathology = pathoRes.status   === 'fulfilled' ? pathoRes.value   : null;

      console.log('[Analyze] chexpert =', chexpert);
      console.log('[Analyze] pathology =', pathology);

      if (!chexpert && !pathology) {
        throw new Error('Both models failed or no response');
      }

      // ===== 仅新增：整理 CheXpert Top-3，用于热力图显示 =====
      const chexCls = Array.isArray(chexpert?.classifications) ? chexpert.classifications : [];
      const top1    = chexCls[0] || null;
      const top3    = chexCls.slice(0, 3); // ← 关键：汇总 Top-3

      const heatmapUrl   = chexpert?.heatmap_image_url   || chexpert?.heatmapUrl   || null;
      const originalUrl  = chexpert?.original_image_url  || chexpert?.originalImageUrl || null;

      const merged = {
        success: !!(chexpert?.success || pathology?.success),
        // 标题/进度沿用 CheXpert Top1
        disease: top1?.label || '未知',
        confidence: top1?.confidence || 0,
        // 供热力图区域显示的 Top-3（新增字段）
        top3,
        // 图像
        heatmapUrl,
        originalImageUrl: originalUrl,
        // 原始结果保留
        chexpert,
        pathology,
      };
      // 写入历史（失败也不影响页面）
      try {
        await fetch(API_ENDPOINTS.HISTORY_ADD, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file_name: file?.name || '',
            top1: merged.disease,
            confidence: merged.confidence,
            diagnosis: merged.top3 || [],          // 存 Top-3
            heatmap_url: merged.heatmapUrl || null,
            original_url: merged.originalImageUrl || null,
            status: 'completed',
            source: 'chexpert',
          }),
        });
      } catch (e) {
        console.warn('[history] save failed:', e);
      }

      onAnalysisFinished?.(merged);
      onResults?.(merged);
      message.success('Analysis completed');
      console.log('[Analyze] merged =', merged);
    } catch (e) {
      console.error('[Analyze] error =', e);
      message.error(e?.message || 'Analyze failed');
      onAnalysisFinished?.({ success:false, error:e?.message || 'Analyze failed' });
    } finally {
      setLoading(false);
    }
  };

  const previewUrl = file ? getFilePreviewUrl(file) : null;

  return (
    <Card title="Upload Image for Analysis">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space wrap align="center">
          <span>Heatmap:</span>
          <Switch checked={generateHeatmap} onChange={setGenerateHeatmap} />
          <span>Threshold:</span>
          <InputNumber min={0} max={1} step={0.05} value={threshold} onChange={setThreshold} />
          <span>Top-K:</span>
          <InputNumber min={1} max={50} value={topK} onChange={setTopK} />
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleAnalyze}
            loading={loading}
            disabled={!file}
          >
            Start Analysis
          </Button>
        </Space>

        <Dragger
          multiple={false}
          maxCount={1}
          accept=".dcm,.jpg,.jpeg,.png"
          beforeUpload={beforeUpload}
          onChange={onChange}
          onRemove={onRemove}
          fileList={fileList}
          showUploadList={{ showPreviewIcon: false, showRemoveIcon: true }}
        >
          <p className="ant-upload-drag-icon"><InboxOutlined /></p>
          <p className="ant-upload-text">Click or drag file here</p>
          <p className="ant-upload-hint">Supports .dcm/.jpg/.jpeg/.png, up to 50MB</p>
        </Dragger>

        {file && (
          <Space direction="vertical" size={4}>
            <Text type="secondary">Selected: {file.name}</Text>
            {previewUrl ? <img src={previewUrl} alt="preview" style={{ maxWidth: 320, borderRadius: 8 }} /> : null}
          </Space>
        )}
      </Space>
    </Card>
  );
}
