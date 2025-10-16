import React from 'react';
import { Modal as AntModal } from 'antd';
import './Modal.css';

/**
 * 自定义弹窗组件（基于Ant Design Modal封装）
 * @param {boolean} visible - 是否显示弹窗
 * @param {string} title - 弹窗标题
 * @param {ReactNode} children - 弹窗内容
 * @param {Function} onOk - 确认回调
 * @param {Function} onCancel - 取消回调
 * @param {string} variant - 弹窗类型: default, info, success, warning, error
 * @param {Object} props - 其他Ant Design Modal属性
 */
const Modal = ({
  visible,
  title,
  children,
  onOk,
  onCancel,
  variant = 'default',
  className = '',
  ...props
}) => {
  const getVariantClass = () => {
    const variants = {
      default: 'modal-default',
      info: 'modal-info',
      success: 'modal-success',
      warning: 'modal-warning',
      error: 'modal-error',
    };
    return variants[variant] || 'modal-default';
  };

  const classes = [
    'custom-modal',
    getVariantClass(),
    className
  ].filter(Boolean).join(' ');

  return (
    <AntModal
      open={visible}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      className={classes}
      centered
      {...props}
    >
      {children}
    </AntModal>
  );
};

export default Modal;
