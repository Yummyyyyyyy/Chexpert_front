# CheXpert Frontend - 重构说明文档

## 项目重构概述

本项目已按照模块化、功能导向的架构进行了全面重构，使代码更加清晰、可维护和可扩展。

## 新的项目结构

```
src/
├── components/              # 全局公共组件（全项目复用）
│   ├── Button/             # 自定义按钮组件
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── index.js
│   ├── Loading/            # 加载动画组件
│   │   ├── Loading.jsx
│   │   ├── Loading.css
│   │   └── index.js
│   └── Modal/              # 弹窗组件
│       ├── Modal.jsx
│       ├── Modal.css
│       └── index.js
│
├── features/               # 按功能模块拆分（每个模块内包含自己的组件/API/样式）
│   ├── upload/            # 功能1：上传+热力图+分类
│   │   ├── components/
│   │   │   ├── UploadImage.jsx
│   │   │   ├── UploadImage.css
│   │   │   ├── HeatmapDisplay.jsx
│   │   │   └── HeatmapDisplay.css
│   │   ├── api.js         # 该功能专属API请求
│   │   └── index.js       # 对外暴露组件（方便其他模块引用）
│   │
│   ├── llava-report/      # 功能2：LLaVA大模型报告生成
│   │   ├── components/
│   │   │   ├── ReportGenerator.jsx
│   │   │   ├── ReportGenerator.css
│   │   │   ├── ReportDisplay.jsx
│   │   │   └── ReportDisplay.css
│   │   ├── api.js         # 调用后端大模型的API
│   │   └── index.js
│   │
│   ├── third-party-api/   # 功能3：第三方API集成（知识图谱）
│   │   ├── components/
│   │   │   ├── KnowledgeGraph.jsx
│   │   │   └── KnowledgeGraph.css
│   │   ├── api.js
│   │   └── index.js
│   │
│   └── history/           # 功能4：分析历史记录
│       ├── components/
│       │   ├── HistoryTable.jsx
│       │   └── HistoryTable.css
│       ├── api.js
│       └── index.js
│
├── utils/                 # 全局工具函数
│   ├── formatUtils.js     # 格式化工具
│   ├── validationUtils.js # 验证工具
│   ├── storageUtils.js    # 本地存储工具
│   └── index.js
│
├── styles/                # 全局样式
│   └── theme.css          # 主题配置（颜色、间距、圆角等）
│
├── App.js                 # 主应用组件（已重构）
├── App.css               # 应用样式
├── AnalysisHistory.js    # 历史记录页面（已重构）
├── index.js              # 入口文件
└── index.css             # 全局基础样式
```

## 主要改进

### 1. 模块化组件结构

#### 全局公共组件 (`components/`)
- **Button**: 自定义按钮，支持多种变体（primary, secondary, success, warning, danger）和渐变效果
- **Loading**: 统一的加载动画组件，支持自定义进度和提示信息
- **Modal**: 自定义弹窗，支持不同类型（info, success, warning, error）

#### 功能模块 (`features/`)

**upload 模块**
- `UploadImage.jsx`: 文件上传组件
- `HeatmapDisplay.jsx`: AI分析结果和热力图展示
- `api.js`: 上传和分析相关API（模拟）

**llava-report 模块** (新增)
- `ReportGenerator.jsx`: LLaVA大模型报告生成器
- `ReportDisplay.jsx`: 生成的医疗报告展示
- `api.js`: LLaVA模型API调用

**third-party-api 模块**
- `KnowledgeGraph.jsx`: 医学知识图谱可视化
- `api.js`: 第三方API集成（知识图谱、文献检索等）

**history 模块**
- `HistoryTable.jsx`: 分析历史记录表格
- `api.js`: 历史记录管理API

### 2. 工具函数库 (`utils/`)

**formatUtils.js**
- `formatFileSize()`: 格式化文件大小
- `formatDateTime()`: 格式化日期时间
- `formatPercentage()`: 格式化百分比
- `truncateText()`: 文本截断

**validationUtils.js**
- `validateFileType()`: 验证文件类型
- `validateFileSize()`: 验证文件大小
- `validateImageFile()`: 综合验证图像文件
- `isEmpty()`: 空值检查

**storageUtils.js**
- `saveToLocalStorage()`: 保存到本地存储
- `loadFromLocalStorage()`: 从本地存储读取
- `saveAnalysisHistory()`: 保存分析历史
- `getAnalysisHistory()`: 获取分析历史

### 3. 主题系统 (`styles/theme.css`)

使用CSS变量管理全局样式：
- 颜色系统：primary, success, warning, danger, purple, gray
- 间距系统：xs, sm, md, lg, xl, 2xl
- 圆角系统：sm, md, lg, xl, full
- 阴影系统：sm, md, lg, xl
- 过渡时间：fast, base, slow

### 4. 新增功能

#### LLaVA医疗报告生成模块
- 基于大模型的智能报告生成
- 支持自定义指令
- 完整的医疗报告展示（包括诊断、置信度、详细分析、建议）
- 预留PDF和Word导出接口

#### 增强的历史记录功能
- 支持排序和过滤
- 更好的表格展示
- 支持导出CSV

## 使用指南

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm start
```

### 构建生产版本
```bash
npm build
```

### 运行测试
```bash
npm test
```

## 组件使用示例

### 1. 使用Button组件
```jsx
import Button from './components/Button';

<Button variant="primary" gradient size="large">
  Click Me
</Button>
```

### 2. 使用Loading组件
```jsx
import Loading from './components/Loading';

<Loading
  visible={isLoading}
  message="Processing..."
  progress={75}
/>
```

### 3. 使用Modal组件
```jsx
import Modal from './components/Modal';

<Modal
  visible={showModal}
  title="Confirmation"
  variant="success"
  onOk={handleOk}
  onCancel={handleCancel}
>
  <p>Are you sure?</p>
</Modal>
```

### 4. 使用upload功能模块
```jsx
import { UploadImage, HeatmapDisplay, uploadAndAnalyzeImage } from './features/upload';

const [selectedFile, setSelectedFile] = useState(null);
const [results, setResults] = useState(null);

const handleUpload = async (info) => {
  const { file } = info;
  setSelectedFile(file);
  const results = await uploadAndAnalyzeImage(file);
  setResults(results);
};

return (
  <>
    <UploadImage
      selectedFile={selectedFile}
      onFileChange={handleUpload}
    />
    <HeatmapDisplay analysisResults={results} />
  </>
);
```

### 5. 使用工具函数
```jsx
import { formatFileSize, formatDateTime, validateImageFile } from './utils';

const fileSize = formatFileSize(1024000); // "1000 KB"
const date = formatDateTime(new Date(), 'full'); // "2024-01-15 10:30:00"
const validation = validateImageFile(file); // { valid: true, error: null }
```

## API结构

所有功能模块都遵循相同的API结构：

```javascript
// features/[module]/api.js
export const someAPIFunction = async (params) => {
  // 当前使用模拟数据
  // TODO: 替换为真实API调用
  return mockData;
};
```

## 迁移指南

### 从旧代码迁移

1. **组件导入**
   ```javascript
   // 旧方式
   import { Upload, Progress } from 'antd';

   // 新方式
   import { UploadImage } from './features/upload';
   import Loading from './components/Loading';
   ```

2. **API调用**
   ```javascript
   // 旧方式（内联mock数据）
   const mockData = { ... };

   // 新方式（使用API模块）
   import { uploadAndAnalyzeImage } from './features/upload';
   const results = await uploadAndAnalyzeImage(file);
   ```

3. **样式**
   ```css
   /* 旧方式 */
   .my-button {
     background-color: #3b82f6;
   }

   /* 新方式（使用主题变量） */
   .my-button {
     background-color: var(--primary-500);
   }
   ```

## 待办事项

### 短期
- [ ] 连接真实后端API
- [ ] 添加错误处理和用户反馈
- [ ] 完善单元测试
- [ ] 添加TypeScript类型定义

### 中期
- [ ] 实现报告导出功能（PDF/Word）
- [ ] 添加用户认证
- [ ] 实现数据持久化
- [ ] 优化性能和打包体积

### 长期
- [ ] 添加更多AI功能模块
- [ ] 集成实时协作功能
- [ ] 移动端适配
- [ ] 国际化支持

## 技术栈

- **React**: 19.1.1
- **React Router**: 7.8.2
- **Ant Design**: 5.27.3
- **构建工具**: Create React App (react-scripts 5.0.1)

## 文件对照表

| 旧文件 | 新位置 | 说明 |
|--------|--------|------|
| `App.js` (374行) | `App.js` (237行) + `features/` | 拆分为多个功能模块 |
| `AnalysisHistory.js` | `AnalysisHistory.js` + `features/history/` | 使用HistoryTable组件 |
| 内联样式 | `components/*/css` + `styles/theme.css` | 分离样式到独立文件 |
| Mock数据 | `features/*/api.js` | 统一管理API和数据 |

## 备份文件

重构过程中，原始文件已备份：
- `src/App.old.js` - 原始App.js
- `src/AnalysisHistory.old.js` - 原始AnalysisHistory.js

## 联系方式

如有问题，请查看：
- 项目GitHub Issues
- 技术文档：`/docs`

---

**重构完成日期**: 2025-10-16
**版本**: 2.0.0
**重构目标**: ✅ 完成
