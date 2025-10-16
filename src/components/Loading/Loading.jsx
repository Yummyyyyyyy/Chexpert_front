import React from 'react';
import { Progress, Typography } from 'antd';
import './Loading.css';

const { Text } = Typography;

/**
 * 全局加载组件
 * @param {boolean} visible - 是否显示加载动画
 * @param {string} message - 加载提示文字
 * @param {number} progress - 进度百分比 (0-100)
 * @param {boolean} showProgress - 是否显示进度条
 */
const Loading = ({
  visible = false,
  message = 'Loading...',
  progress = 100,
  showProgress = true
}) => {
  if (!visible) return null;

  return (
    <div className="loading-container">
      {showProgress && (
        <Progress
          percent={progress}
          status="active"
          strokeColor={{
            '0%': '#3b82f6',
            '100%': '#8b5cf6',
          }}
        />
      )}
      <Text className="loading-text">{message}</Text>
    </div>
  );
};

export default Loading;
