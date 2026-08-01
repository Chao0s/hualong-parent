# 化龙幼儿园 · 家长端

化龙幼儿园家园共育平台的家长端移动原型及后台 object 规格。家长端与教师端、管理端属于同一园所平台，三个 App 共用同一套 canonical database objects。

> 在线预览：<https://linem7.github.io/hualong-parent/>

## 项目内容

家长端围绕四类核心需求设计：

- 查看家长评价、亲子任务和待办提醒；
- 完成教师发起的成长册素材征集（独立于亲子任务的一类待办，按栏目一次交完，上传时按槽位比例裁剪）；
- 浏览教师发布的班级在园时光；
- 查看和维护授权幼儿的基础资料、成长档案、评价报告与成长册（家长端单本成长册的 PDF 在家长手机上生成并分享给亲友，不从服务器下载；教师端的全班批量导出是另一条路径，由服务器用 node-canvas 跑同一份绘图代码，见 `DECISIONS.md` W20）。

底部一级导航为：首页、我的任务、在园时光、儿童档案。多孩家庭可以在首页切换当前幼儿；所有业务数据均应按登录家长与当前幼儿的授权关系查询。

## 预览入口

- `index.html`：四个一级页面的并排总览，适合桌面端审阅。
- `screens/home.html`：家长端实际首页。
- `screens/`：任务、在园时光、儿童档案及相关详情页面。

项目为纯静态 HTML/CSS/JavaScript，无需构建。推荐通过本地静态服务器预览：

```bash
python -m http.server 8000
# 或
npx serve
```

启动后访问 <http://localhost:8000>。

## 目录结构

```text
.
├── index.html                         # 四个一级页面总览
├── decision.md                        # 前端修改记录（调整 backend spec 时对照）
├── assets/
│   ├── app.css                        # 全局样式与设计 token
│   └── app.js                         # 页面交互脚本
├── screens/                           # 15 个一级、功能与详情页面
│   ├── home.html                      # 家长端首页
│   ├── evaluation-tasks.html          # 我的任务 · 家长评价
│   ├── monthly-evaluation.html        # 月度评价填写
│   ├── term-evaluation.html           # 学期评价填写
│   ├── parent-tasks.html              # 亲子任务列表
│   ├── parent-task-detail.html        # 亲子任务详情与提交
│   ├── kindergarten-moments.html      # 在园时光
│   ├── child-profile.html             # 儿童档案
│   ├── growth-record.html             # 成长档案
│   ├── growth-book.html               # 成长册
│   ├── evaluation-report.html         # 评价报告
│   ├── evaluation-history-detail.html # 历史评价详情
│   ├── all-reminders.html             # 全部待办提醒
│   ├── all-reports.html               # 全部成长报告
│   └── switch-child.html              # 切换孩子
└── docs/
    ├── parent_ia.md                    # 家长端信息架构与页面流
    └── backend spec files/             # 核心页面后台 object 规格
        ├── home-spec.md
        ├── parent-tasks-spec.md
        ├── kindergarten-moments-spec.md
        ├── child-profile-spec.md
        └── growth-book-spec.md
```

## 后台规格

当前后台规格共五份：

- [首页规格](docs/backend%20spec%20files/home-spec.md)
- [亲子任务规格](docs/backend%20spec%20files/parent-tasks-spec.md)
- [在园时光规格](docs/backend%20spec%20files/kindergarten-moments-spec.md)
- [儿童档案规格](docs/backend%20spec%20files/child-profile-spec.md)
- [成长册规格](docs/backend%20spec%20files/growth-book-spec.md)：成长册查看 + 成长册素材征集。后者的两个页面 `screens/growth-book-materials.html`、`screens/growth-book-material-submit.html` 尚未建立，spec 先定名与 `ui=` 标注

规格遵循以下跨 App 原则：

- 同一真实业务对象在教师端、家长端和管理端复用相同的 canonical `db_*` 名称；
- 家长端页面聚合使用 `db_parent_*`，导航使用 `nav_parent_*`；
- `parent_id` 来自登录会话，`current_child_id` 必须属于该家长的授权范围（`db_child.caretakers` 含该 `parent_id`；原 `db_parent_child` 已由后端拔除）；
- 原始身份 ID 不允许由客户端编辑，园所和班级上下文由后台推导；
- HTML 中的姓名、班级、任务、报告、日期、图片、数量及状态均为 Mock，不得作为生产业务种子数据；
- 生产环境业务列表默认空数组、动态数量默认为 `0`，未开始状态统一为 `not_started`。

页面与规格的修改决定记录在 [decision.md](decision.md)。其中 2026-08-01 一批来自后端决策记录（`DECISIONS.md` E 组与 W1-W21），
家长端原型尚未跟进——新增的成长册素材征集、上传裁剪工具与手机端 PDF 生成都在该文件里，动工前先读它。

## 设计规范

视觉规范与教师端、管理端保持一致：

- 主色：青绿 `#189b91`
- 圆角：`12 / 16 / 20`
- 字体：PingFang SC 字体栈

详细页面关系见 [家长端信息架构](docs/parent_ia.md)。

## 相关仓库

- 家长端：<https://github.com/linem7/hualong-parent>
- 教师端：<https://github.com/linem7/hualong-teacher>
