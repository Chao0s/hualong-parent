# 化龙幼儿园 · 家长端 信息架构

> 家长端手机原型。底部常驻导航四项：**首页 / 我的任务 / 在园时光 / 儿童档案**。
> 家长评价（月度/学期）为**纯文本评语 + 照片**，与教师端发布口径一致，不含维度打分。

```mermaid
flowchart LR
    Home["家长端主页面"]

    %% ========== 主页面：一级入口 ==========
    Home --> NavTask["我的任务"]
    Home --> NavChild["儿童档案"]
    Home --> NavMoments["在园时光"]
    Home --> EntryTodo["待办提醒<br/>待填评价/待完成任务·红点角标"]
    Home --> EntryMonthly["本月评价<br/>直达当月月度评价"]
    Home --> EntryReport["最新成长报告<br/>教师最近推送的档案/报告"]
    Home --> EntryChildSwitch["孩子切换<br/>多孩家庭"]

    %% ========================================
    %% 我的任务
    %% ========================================
    NavTask --> Task["我的任务"]
    Task --> TabEval["标签A：家长评价"]
    Task --> TabParent["标签B：亲子任务"]

    %% ---------- 标签A：家长评价（月度/学期） ----------
    TabEval --> EvalMonthly["月度评价"]
    TabEval --> EvalTerm["学期评价"]
    TabEval --> EvalHistory["历史评价<br/>入口 → 全部报告"]
    %% 月度与学期评价填写结构一致：纯文本评语 + 本机照片 + 引用过往素材

    %% --- 月度评价 ---
    EvalMonthly --> MTodo["待填写（教师推送）"]
    MTodo --> MForm["月度评价填写"]
    MForm --> MWrite["填写评语（纯文本）"]
    MForm --> MPhoto["添加本机照片"]
    MForm --> MQuote["引用过往素材（点选·标注来源）"]
    MQuote --> MFromParentTask["引用·亲子任务图文"]
    MQuote --> MFromCommunity["引用·社区任务图文"]
    MForm --> MSubmit["提交"]

    %% --- 学期评价 ---
    EvalTerm --> TTodo["待填写（教师推送）"]
    TTodo --> TForm["学期评价填写"]
    TForm --> TWrite["填写学期总结（纯文本）"]
    TForm --> TPhoto["添加本机照片"]
    TForm --> TQuote["引用过往素材（点选·标注来源）"]
    TQuote --> TFromParentTask["引用·亲子任务图文"]
    TQuote --> TFromCommunity["引用·社区任务图文"]
    TForm --> TSubmit["提交"]

    %% ---------- 标签B：亲子任务 ----------
    TabParent --> PTaskType["任务类型"]
    PTaskType --> PDaily["日常亲子任务"]
    PTaskType --> PCommunity["社区任务"]
    TabParent --> PTodo["待完成"]
    TabParent --> PDone["已完成（沉淀为可引用素材）"]
    PTodo --> PDetail["任务详情·查看要求"]
    PDetail --> PSubmit["提交反馈<br/>图文/视频"]

    %% ========================================
    %% 在园时光（教师端家园共育推送）
    %% ========================================
    NavMoments --> Moments["在园时光"]
    Moments --> MomentFeed["班级活动动态流<br/>教师每周发布 2 次·开放浏览"]
    MomentFeed --> MomentCard["活动卡片<br/>评语实录 + 照片 + 涉及幼儿"]

    %% ========================================
    %% 儿童档案
    %% ========================================
    NavChild --> Child["儿童档案"]
    Child --> ChildBasic["基础信息（常驻存储·唯一出处）"]
    ChildBasic --> BasicFields["姓名/生日/性别/班级"]

    Child --> ChildPushed["成长信息（教师推送后才可见·未推送则无）"]
    ChildPushed --> GrowthRecord["成长档案<br/>过程素材·按月时间线"]
    ChildPushed --> EvalReport["评价/评估报告 → 全部报告"]
    EvalReport --> ReportSummary["综合评估报告<br/>五大领域雷达（5 分制）"]
    ChildPushed --> GrowthBook["成长册（学期成品）<br/>列表点开即展示完整内容"]
    GrowthBook --> BookItems["内容章节<br/>园所介绍/在园时光/亲子活动/家长动态/发展评估/幼儿评语/体检数据"]

    %% ========================================
    %% 数据流：素材逐级汇聚（虚线引用关系）
    %% ========================================
    PDone -. 素材来源 .-> MQuote
    PDone -. 素材来源 .-> TQuote
```

## 底部导航

| Tab | 目标屏 | 说明 |
| --- | --- | --- |
| 首页 | `screens/home.html` | 待办提醒、本月评价直达、最新成长报告、孩子切换 |
| 我的任务 | `screens/evaluation-tasks.html` | 家长评价 ⇄ 亲子任务（顶部分段切换） |
| 在园时光 | `screens/kindergarten-moments.html` | 班级动态流（开放浏览） |
| 儿童档案 | `screens/child-profile.html` | 基础信息 + 成长档案/报告/成长册入口 |

详情页与填写页（评价填写、任务详情、历史详情、切换孩子）不带底部导航，使用返回键；跨入口进入的详情页通过 `?from=` 参数动态回退。
