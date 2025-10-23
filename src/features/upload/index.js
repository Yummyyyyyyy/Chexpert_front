// src/features/upload/index.js

// Components
export { default as UploadImage } from './components/UploadImage';
export { default as HeatmapDisplay } from './components/HeatmapDisplay';

// API functions
export { 
  uploadAndAnalyzeImage,
  uploadAndAnalyzeImageFull,  // 【新增】
  analyzePathology,            // 【新增】
  getPathologyLabels,          // 【新增】
  validateFileType,
  validateFileSize,
  getFilePreviewUrl
} from './api';