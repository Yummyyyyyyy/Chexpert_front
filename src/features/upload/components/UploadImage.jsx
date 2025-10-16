import React from 'react';
import { Upload, Card, Alert, Space } from 'antd';
import { UploadOutlined, FileImageOutlined } from '@ant-design/icons';
import Loading from '../../../components/Loading';
import './UploadImage.css';

/**
 * 图像上传组件
 * @param {Object} selectedFile - 已选择的文件
 * @param {boolean} isAnalyzing - 是否正在分析
 * @param {Function} onFileChange - 文件变化回调
 */
const UploadImage = ({
  selectedFile,
  isAnalyzing,
  onFileChange
}) => {
  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.dcm,.jpg,.jpeg,.png',
    beforeUpload: () => false, // 阻止自动上传
    onChange: onFileChange,
  };

  return (
    <Card
      title={
        <Space>
          <UploadOutlined style={{ color: '#2563eb' }} />
          <span style={{ color: '#1e40af' }}>CT Image Upload</span>
        </Space>
      }
      className="upload-image-card"
    >
      <div className="upload-image-content">
        <Upload.Dragger {...uploadProps} className="upload-area">
          <p className="ant-upload-drag-icon">
            <FileImageOutlined style={{ fontSize: '48px', color: '#3b82f6' }} />
          </p>
          <p className="ant-upload-text">
            Click or drag CT image file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for DICOM (.dcm), JPEG, PNG formats
          </p>
        </Upload.Dragger>

        {selectedFile && (
          <Alert
            message={`File Selected: ${selectedFile.name}`}
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}

        <Loading
          visible={isAnalyzing}
          message="AI is analyzing your CT scan..."
        />
      </div>
    </Card>
  );
};

export default UploadImage;
