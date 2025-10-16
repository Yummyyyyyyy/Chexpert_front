import React from 'react';
import { Table, Tag, Progress } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './HistoryTable.css';

/**
 * 历史记录表格组件
 * @param {Array} data - 历史数据
 * @param {number} pageSize - 每页显示数量
 */
const HistoryTable = ({ data, pageSize = 10 }) => {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      defaultSortOrder: 'descend',
    },
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Diagnosis',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
      render: (diagnosis) => (
        <Tag color={diagnosis === 'Normal' ? 'green' : 'orange'} className="diagnosis-tag">
          {diagnosis}
        </Tag>
      ),
    },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (confidence) => (
        <Progress
          percent={confidence}
          size="small"
          format={(percent) => `${percent}%`}
          strokeColor={confidence > 80 ? '#52c41a' : '#faad14'}
        />
      ),
      sorter: (a, b) => a.confidence - b.confidence,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag
          color={status === 'completed' ? 'green' : 'blue'}
          icon={<CheckCircleOutlined />}
          className="status-tag"
        >
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Completed', value: 'completed' },
        { text: 'Processing', value: 'processing' },
      ],
      onFilter: (value, record) => record.status === value,
    },
  ];

  return (
    <Table
      dataSource={data}
      columns={columns}
      pagination={{ pageSize, showSizeChanger: true, showTotal: (total) => `Total ${total} items` }}
      size="middle"
      className="history-table ant-table-striped"
    />
  );
};

export default HistoryTable;
