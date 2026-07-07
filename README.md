# 化龙幼儿园 · 家长端原型

化龙幼儿园家园共育平台 **家长端** 的移动端高保真原型。纯静态 HTML/CSS/JS，无需构建，直接在浏览器中即可预览。

> 在线预览：**https://linem7.github.io/hualong-parent/**

## 简介

家长端聚焦"查看待办、提交家园互动记录、了解孩子成长信息"三件事。底部常驻四个一级导航：

- **首页** —— 本周待办、最新成长报告、孩子切换（多孩家庭）
- **我的任务** —— 家长评价（月度 / 学期）与亲子任务（日常 / 社区）
- **在园时光** —— 教师发布的班级动态与照片
- **儿童档案** —— 成长册、成长记录、评价历史

家长评价采用**纯文本评语 + 照片**形式，与教师端发布口径一致，不含维度打分；填写时可**引用**过往亲子任务与社区任务的图文素材。

## 目录结构

```
.
├── index.html          # 家长端主页面（入口）
├── assets/
│   ├── app.css         # 全局样式与设计 token
│   └── app.js          # 交互脚本
├── screens/            # 各功能页面（14 个）
│   ├── evaluation-tasks.html          # 我的任务 · 家长评价
│   ├── monthly-evaluation.html        # 月度评价填写
│   ├── term-evaluation.html           # 学期评价填写
│   ├── parent-tasks.html              # 亲子任务列表
│   ├── parent-task-detail.html        # 任务详情 / 提交反馈
│   ├── kindergarten-moments.html      # 在园时光
│   ├── child-profile.html             # 儿童档案
│   ├── growth-book.html               # 成长册
│   ├── growth-record.html             # 成长记录
│   ├── evaluation-report.html         # 评价报告
│   ├── evaluation-history-detail.html # 历史评价详情
│   ├── all-reports.html               # 全部成长报告
│   ├── all-reminders.html             # 全部待办提醒
│   └── switch-child.html              # 切换孩子
└── docs/
    └── parent_ia.md    # 信息架构文档（含 Mermaid 流程图）
```

## 本地预览

克隆后用浏览器直接打开 `index.html` 即可，或启动一个本地静态服务器：

```bash
# 任选其一
python -m http.server 8000
npx serve
```

然后访问 http://localhost:8000。

## 设计规范

设计 token 与教师端、管理端三端对齐：

- 主色：青绿 `#189b91`
- 圆角：三档 `12 / 16 / 20`
- 字体：PingFang SC 字体栈

## 相关仓库

- 家长端（本仓库）：https://github.com/linem7/hualong-parent
- 教师端：https://github.com/linem7/hualong-teacher

详细的页面跳转逻辑见 [`docs/parent_ia.md`](docs/parent_ia.md)。
