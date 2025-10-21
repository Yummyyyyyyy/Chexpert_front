import React, { useState, useEffect } from 'react';
import { Radio, Empty, Spin, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import PathologyCard from './PathologyCard';
import './PathologyTable.css';

const PathologyTable = ({ data, loading }) => {
  const [topN, setTopN] = useState(5);
  const [sortedData, setSortedData] = useState([]);
  const [filterThreshold, setFilterThreshold] = useState(0);

  useEffect(() => {
    if (data && data.pathologies) {
      // 根据阈值过滤
      const filtered = data.pathologies.filter(
        item => item.probability >= filterThreshold
      );
      setSortedData(filtered);
    }
  }, [data, filterThreshold]);

  if (loading) {
    return (
      <div className="pathology-loading">
        <Spin size="large" tip="分析病症标签中..." />
      </div>
    );
  }

  if (!data || !data.pathologies || data.pathologies.length === 0) {
    return (
      <div className="pathology-empty">
        <Empty description="暂无病症数据" />
      </div>
    );
  }

  const displayData = sortedData.slice(0, topN === 'all' ? undefined : topN);

  return (
    <div className="pathology-table-container">
      {/* 头部控制栏 */}
      <div className="pathology-header">
        <div className="header-title">
          <h3>病症标签分析</h3>
          <Tooltip title="基于DenseNet121模型的14类CheXpert病症分类">
            <InfoCircleOutlined style={{ marginLeft: 8, color: '#1890ff' }} />
          </Tooltip>
        </div>

        {/* 统计信息 */}
        {data.statistics && (
          <div className="statistics-row">
            <div className="stat-item high">
              <span className="stat-label">高风险</span>
              <span className="stat-value">{data.statistics.high_risk_count}</span>
            </div>
            <div className="stat-item medium">
              <span className="stat-label">中风险</span>
              <span className="stat-value">{data.statistics.medium_risk_count}</span>
            </div>
            <div className="stat-item low">
              <span className="stat-label">低风险</span>
              <span className="stat-value">{data.statistics.low_risk_count}</span>
            </div>
            <div className="stat-item avg">
              <span className="stat-label">平均概率</span>
              <span className="stat-value">
                {(data.statistics.avg_probability * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}

        {/* 控制按钮 */}
        <div className="controls-row">
          <div className="control-group">
            <label>显示数量:</label>
            <Radio.Group
              value={topN}
              onChange={(e) => setTopN(e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value={3}>Top 3</Radio.Button>
              <Radio.Button value={5}>Top 5</Radio.Button>
              <Radio.Button value={10}>Top 10</Radio.Button>
              <Radio.Button value="all">全部</Radio.Button>
            </Radio.Group>
          </div>

          <div className="control-group">
            <label>最小概率:</label>
            <Radio.Group
              value={filterThreshold}
              onChange={(e) => setFilterThreshold(e.target.value)}
              buttonStyle="solid"
              size="small"
            >
              <Radio.Button value={0}>全部</Radio.Button>
              <Radio.Button value={0.3}>≥30%</Radio.Button>
              <Radio.Button value={0.5}>≥50%</Radio.Button>
              <Radio.Button value={0.7}>≥70%</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </div>

      {/* 病症卡片列表 */}
      <div className="pathology-cards-container">
        {displayData.length > 0 ? (
          displayData.map((pathology, index) => (
            <PathologyCard
              key={pathology.label}
              data={pathology}
              index={index}
            />
          ))
        ) : (
          <Empty description="没有符合条件的病症" />
        )}
      </div>

      {/* 底部信息 */}
      <div className="pathology-footer">
        <div className="footer-info">
          <span>共检测到 {data.total_count} 种病症</span>
          <span>•</span>
          <span>当前显示 {displayData.length} 项</span>
          <span>•</span>
          <span>分析时间: {new Date(data.timestamp).toLocaleString('zh-CN')}</span>
        </div>
      </div>
    </div>
  );
};

export default PathologyTable;