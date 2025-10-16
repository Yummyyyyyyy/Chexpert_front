import React from 'react';
import { Button as AntButton } from 'antd';
import './Button.css';

/**
 * 自定义按钮组件（基于Ant Design Button封装）
 * @param {string} variant - 按钮变体: primary, secondary, success, warning, danger
 * @param {string} size - 按钮尺寸: small, medium, large
 * @param {boolean} gradient - 是否使用渐变背景
 * @param {ReactNode} children - 按钮内容
 * @param {Object} props - 其他Ant Design Button属性
 */
const Button = ({
  variant = 'primary',
  size = 'middle',
  gradient = false,
  children,
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      success: 'btn-success',
      warning: 'btn-warning',
      danger: 'btn-danger',
    };
    return variants[variant] || 'btn-primary';
  };

  const classes = [
    'custom-button',
    getVariantClass(),
    gradient ? 'btn-gradient' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <AntButton
      size={size}
      className={classes}
      {...props}
    >
      {children}
    </AntButton>
  );
};

export default Button;
