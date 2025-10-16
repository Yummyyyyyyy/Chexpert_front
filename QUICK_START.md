# 🚀 快速启动指南

## 项目已重构完成！

您的CheXpert前端项目已按照模块化架构全面重构。所有功能和样式都完整保留，并新增了LLaVA报告生成等强大功能。

---

## ⚡ 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm start
```
浏览器自动打开 http://localhost:3000

### 3. 构建生产版本
```bash
npm run build
```

---

## 🎯 主要功能

### 📤 上传与分析
1. 点击或拖拽上传CT图像 (.dcm, .jpg, .png)
2. AI自动分析（模拟2秒延迟）
3. 查看分析结果：疾病诊断、置信度、详细解释、医疗建议

### 🤖 LLaVA报告生成 (新功能!)
1. 上传图像并完成分析后
2. 在下方看到"AI Report Generator"
3. 可选：输入自定义指令
4. 点击"Generate Comprehensive Report"
5. 等待3秒，查看专业医疗报告

### 📊 知识图谱
- 分析完成后自动显示相关医学知识图谱
- 点击图片可预览

### 📜 历史记录
- 点击顶部"Analysis History"卡片
- 查看所有分析历史
- 支持排序和过滤

---

## 📁 新的项目结构

```
src/
├── components/      # 公共组件 (Button, Loading, Modal)
├── features/        # 功能模块
│   ├── upload/           # 上传+分析
│   ├── llava-report/     # LLaVA报告 (新!)
│   ├── third-party-api/  # 知识图谱
│   └── history/          # 历史记录
├── utils/           # 工具函数
└── styles/          # 主题配置
```

---

## 🎨 新增组件示例

### Button组件
```jsx
import Button from './components/Button';

// 基础按钮
<Button variant="primary">点击</Button>

// 渐变按钮
<Button variant="success" gradient>保存</Button>

// 大号按钮
<Button size="large" variant="warning">警告</Button>
```

### Loading组件
```jsx
import Loading from './components/Loading';

<Loading
  visible={isLoading}
  message="正在处理..."
  progress={75}
/>
```

### Modal组件
```jsx
import Modal from './components/Modal';

<Modal
  visible={showModal}
  title="提示"
  variant="info"
  onOk={handleOk}
  onCancel={handleCancel}
>
  <p>确认执行此操作吗？</p>
</Modal>
```

---

## 🛠️ 工具函数

```jsx
import {
  formatFileSize,
  formatDateTime,
  validateImageFile,
  saveToLocalStorage
} from './utils';

// 格式化文件大小
formatFileSize(1024000) // "1000 KB"

// 格式化日期
formatDateTime(new Date()) // "2024-01-15 10:30:00"

// 验证图像
const { valid, error } = validateImageFile(file)

// 本地存储
saveToLocalStorage('key', data)
```

---

## 🎨 主题定制

在 `src/styles/theme.css` 中修改CSS变量：

```css
:root {
  --primary-500: #3b82f6;  /* 修改主色调 */
  --spacing-md: 16px;       /* 修改间距 */
  --radius-lg: 8px;         /* 修改圆角 */
}
```

---

## 📋 待办事项

### 后端集成
1. 将 `features/*/api.js` 中的模拟API替换为真实API
2. 配置API基础URL
3. 添加错误处理

### 示例：
```javascript
// features/upload/api.js
export const uploadAndAnalyzeImage = async (file) => {
  // 替换模拟代码
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://your-api.com/analyze', {
    method: 'POST',
    body: formData
  });

  return response.json();
};
```

---

## 🐛 故障排除

### 问题：npm start 报错
**解决**:
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### 问题：样式不显示
**解决**: 确保 `src/index.css` 导入了主题
```css
@import './styles/theme.css';
```

### 问题：构建警告
**解决**: 运行
```bash
npm run build
```
检查具体警告信息

---

## 📚 详细文档

- `REFACTOR_README.md` - 详细的重构说明
- `PROJECT_SUMMARY.md` - 完整的项目总结
- `QUICK_START.md` - 本文件

---

## 🎯 下一步

1. ✅ **已完成**: 项目重构
2. ✅ **已完成**: 新功能模块
3. 📝 **建议**: 连接后端API
4. 📝 **建议**: 添加单元测试
5. 📝 **建议**: 完善错误处理

---

## 💡 提示

- 所有原有功能都已保留
- 新增了LLaVA报告生成模块
- 代码更易维护和扩展
- 构建成功，无警告 ✅

---

## 🆘 需要帮助？

查看详细文档：
- 重构说明: [REFACTOR_README.md](./REFACTOR_README.md)
- 项目总结: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

---

**开始使用**: `npm start` 🚀

祝开发愉快！
