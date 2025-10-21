// src/features/upload/components/PathologyLabels.jsx
import React, { useEffect, useState } from 'react';
import { Card, Empty, Progress, Tag, Row, Col } from 'antd';
import { getPathologyLabels } from '../api';

export default function PathologyLabels({ analysisResults }) {
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const ls = await getPathologyLabels();
      if (mounted) setLabels(ls);
    })();
    return () => { mounted = false; };
  }, []);

  const left  = analysisResults?.chexpert?.classifications  || analysisResults?.classifications || [];
  const right = analysisResults?.pathology?.classifications || [];

  const renderList = (items) => {
    if (!items?.length) return <Empty description="No data" />;
    return items.map((it, idx) => (
      <div key={idx} style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
        <Tag>{it.label || labels[idx] || '-'}</Tag>
        <Progress percent={Math.round((Number(it.confidence)||0)*100)} size="small" style={{ width:180 }} />
      </div>
    ));
  };

  return (
    <Row gutter={16}>
      <Col span={12}><Card title="CheXpert Model" size="small">{renderList(left)}</Card></Col>
      <Col span={12}><Card title="Pathology Model" size="small">{renderList(right)}</Card></Col>
    </Row>
  );
}
