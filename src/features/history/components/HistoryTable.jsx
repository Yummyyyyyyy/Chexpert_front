// src/features/history/components/HistoryTable.jsx
import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { fetchAnalysisHistory } from '../api';

function pct(x) {
  const v = Number(x || 0);
  if (Number.isNaN(v)) return '0%';
  return `${Math.round(v * 100)}%`;
}

export default function HistoryTable() {
  const [rows, setRows]   = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const list = await fetchAnalysisHistory();
      // 规范化为表格所需字段
      const data = list.map((it, idx) => ({
        key: it.id || idx,
        ts: it.ts || '',
        file_name: it.file_name || '',
        top1: it.top1 || '',
        confidence: it.confidence ?? 0,
        status: it.status || 'completed',
      }));
      if (mounted) setRows(data);
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'ts',
      key: 'ts',
      width: 200,
      sorter: (a, b) => (new Date(a.ts).getTime()) - (new Date(b.ts).getTime()),
      render: (v) => v ? new Date(v).toLocaleString() : '-',
      defaultSortOrder: 'descend',
    },
    { title: 'File Name', dataIndex: 'file_name', key: 'file_name', ellipsis: true },
    { title: 'Diagnosis', dataIndex: 'top1', key: 'top1', ellipsis: true },
    {
      title: 'Confidence',
      dataIndex: 'confidence',
      key: 'confidence',
      width: 140,
      render: (v) => pct(v),
      sorter: (a, b) => (a.confidence || 0) - (b.confidence || 0),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (v) => <Tag color={v === 'completed' ? 'green' : 'default'}>{v}</Tag>,
    },
  ];

  return (
    <Table
      loading={loading}
      columns={columns}
      dataSource={rows}
      pagination={{ pageSize: 10, showSizeChanger: true }}
      bordered
    />
  );
}
