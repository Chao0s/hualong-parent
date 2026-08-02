GROWTH_BOOK_BACKEND_OBJECT_SPEC

scope (范围) = screens/growth-book.html, screens/growth-book-materials.html, screens/growth-book-material-submit.html
source_page (参考页面) = growth-book.html
pending_page (待建页面) = growth-book-materials.html, growth-book-material-submit.html
decision_source (决策来源) = hualong-backend/DECISIONS.md E1|E3|E4|E6|E7 及 E3 之下的 W11-W21；缺口登记见 hualong-backend/db/GAPS.md G6|G29|G31
static_node_count_growth_book (成长册页固定可点击节点数) = 8
static_node_count_material_list (素材征集列表页固定可点击节点数) = 6
static_node_count_material_submit (素材提交页固定可点击节点数) = 8
dynamic_book_page_count (动态册内页数) = 0:k
dynamic_material_request_count (动态素材征集待办数) = 0:k
dynamic_material_slot_count (动态素材槽位数) = 0:k
runtime_clickable_node_count (运行时可点击节点数) = 22:k
field_format (字段格式) = field_key (中文字段名), cardinality, type|enum, ui
id_rule (ID规则) = integer, database_auto_generated
null_rule (空值规则) = 0:1
list_rule (列表规则) = 0:k | 1:k


[SPEC_SPLIT_RULE]

why_new_file (为何独立成 spec) = 成长册查看与成长册素材征集既不属于 home-school.html（原 parent-tasks.html）的亲子任务（db_parent_task 一系，E5 已确认筛选只按 parent_task_type），也不属于 child-profile.html 的档案编辑范围；两者共用同一组对象（db_growth_book、db_growth_book_template、db_growth_book_section、db_book_widget、db_book_material_submission、db_teacher_message），故合为一份 spec，不再拆两份
covered_subject (覆盖主题) = 成长册查看（按幼儿、按学期）+ 成长册素材征集（家长提交）
not_covered (不覆盖) = 教师端的模版编辑、栏目新增、批量导出与生成检查表；这些在 Teacher/05 home-school-spec.md
entry_point (入口) = child-profile.html > 成长册（btn_parent_profile_growth_book），详见 child-profile-spec.md


[SHARED_OBJECT_RULE]

canonical_registry_checked (canonical 注册表检查) = Teacher/01-05 canonical registry and Parent/home-spec.md
shared_objects (共享对象) = db_school, db_class, db_child, db_teacher, db_file, db_growth_book, db_growth_book_template, db_growth_book_section, db_book_widget, db_growth_material, db_parent_task_submission, db_term_eval, db_child_assessment, db_child_assessment_item, db_teacher_message, db_parent
parent_page_aggregate (家长端页面聚合) = db_parent_growth_book_home
parent_canonical_first_definition (家长端首次 canonical 定义) = db_book_material_submission
shared_nav_objects (共享导航对象) = nav_parent_home, nav_parent_tasks, nav_parent_moments, nav_parent_child_profile
rename_or_duplicate_shared_object (重命名或复制共享对象) = FORBIDDEN
parent_app_growth_book_copy (家长端成长册副本表) = FORBIDDEN


[CONTEXT_RULE]

parent_id_source (家长ID来源) = auth_session.parent_id
allowed_child_id_source (允许幼儿ID来源) = db_child WHERE db_child.caretakers 含 auth_session.parent_id（DECISIONS.md B1：db_parent_child 已拔除，改 db_child.caretakers JSON）
compat_note (兼容说明) = 同目录其余四份 spec 仍写 db_parent_child(is_active=1)，B1 的落地改写不在本次范围；两处语义等价，以 B1 为准
current_child_rule (当前幼儿校验) = current_child_id MUST IN allowed_child_id
school_id_source (园所ID来源) = db_child.school_id
class_id_source (班级ID来源) = db_child.class_id
term_id_source (学期ID来源) = 客户端可选，仅限该幼儿已存在成长册的学期
derived_fields (服务器派生字段) = school_id, class_id, parent_id, created_by, uploaded_by, uploaded_by_parent_id
derived_field_rule (派生字段规则) = 请求体中的同名字段一律忽略，不报错、不采用（scope-rules.json roles.parent.derived）；这些字段不得出现在任何 ui= 标注的输入或选择控件上
scoped_fields (需重新校验字段) = child_id
scoped_field_rule (范围校验规则) = 校验必须内联成查询 predicate，不可先查再做
raw_identity_ui (原始身份ID界面规则) = context.hidden
raw_identity_client_editable (原始身份ID前端可编辑) = 0
backend_authorization_validation (后台授权校验) = REQUIRED


[DATA_INITIALIZATION_RULE]

prototype_content (原型内容) = HTML 中的成长册标题、学期、生成状态与栏目内容均为 demo|test Mock
static_ui_content (保留的静态界面内容) = 页面标题、栏目名、说明文案、底部导航和空状态文案
business_seed (生产环境业务种子数据) = NONE
production_initial_db_growth_book (成长册初始状态) = EMPTY
production_initial_db_book_material_submission (素材提交初始状态) = EMPTY
production_initial_db_teacher_message (教师寄语初始状态) = EMPTY
page_layout_library (页版式库) = 不进 DB，存于后端仓库的版本化 JSON（DECISIONS.md W13），因此不属于业务种子数据
dynamic_list_without_data (无数据动态列表) = []
dynamic_count_without_data (无数据动态数量) = 0
unassigned_or_unstarted_status (未分配或未开始状态) = not_started
hardcoded_business_id (固定业务ID) = FORBIDDEN
environment_isolation (环境隔离) = demo|test 数据不得复制到 production


[STATIC_BUTTON_NODE_INDEX]

| n | page | button_name_cn | button_name_en | node_key | object | input | jump |
|---:|---|---|---|---|---|---|---|
| 1 | growth-book | 返回 | Back | btn_parent_book_back | db_parent_growth_book_home | NULL | growth-book.html > child-profile.html |
| 2 | growth-book | 学期切换 | Switch Term | btn_parent_book_term_switch | db_growth_book | term_id | growth-book.html（同页重载） |
| 3 | growth-book | 生成并分享PDF | Build and Share PDF | btn_parent_book_share_pdf | db_parent_growth_book_home | child_id, term_id | 设备端渲染后调起微信分享，不请求文件下载 |
| 4 | growth-book | 素材征集待办 | Material Requests | btn_parent_book_material_entry | db_parent_book_material_request | child_id | growth-book.html > growth-book-materials.html |
| 5 | growth-book | 首页 | Home | nav_parent_home | nav_parent_home | NULL | home.html |
| 6 | growth-book | 家园共育 | Home School | nav_parent_tasks | nav_parent_tasks | NULL | home-school.html |
| 7 | growth-book | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | kindergarten-moments.html |
| 8 | growth-book | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |
| 9 | material-list | 返回 | Back | btn_parent_material_list_back | db_parent_book_material_request | NULL | growth-book-materials.html > growth-book.html |
| 10 | material-list | 首页 | Home | nav_parent_home | nav_parent_home | NULL | home.html |
| 11 | material-list | 家园共育 | Home School | nav_parent_tasks | nav_parent_tasks | NULL | home-school.html |
| 12 | material-list | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | kindergarten-moments.html |
| 13 | material-list | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |
| 14 | material-list | 栏目待办卡片入口 | Open Material Request | btn_parent_material_request_open | db_parent_book_material_request | section_id | growth-book-materials.html > growth-book-material-submit.html?section_id={section_id} |
| 15 | material-submit | 返回 | Back | btn_parent_material_submit_back | db_parent_book_material_request | NULL | growth-book-material-submit.html > growth-book-materials.html |
| 16 | material-submit | 选择照片 | Choose Photo | btn_parent_material_pick_photo | db_book_material_submission | widget_id | 打开系统相册，进入裁剪层 |
| 17 | material-submit | 裁剪确认 | Confirm Crop | btn_parent_material_crop_confirm | db_book_material_submission | widget_id, crop | 关闭裁剪层，回填该槽位预览 |
| 18 | material-submit | 重新选择 | Replace Photo | btn_parent_material_replace_photo | db_book_material_submission | widget_id | 覆盖该槽位的未提交内容 |
| 19 | material-submit | 提交 | Submit Materials | btn_parent_material_submit | db_book_material_submission | section_id | 提交该栏目全部槽位后返回 growth-book-materials.html |
| 20 | material-submit | 首页 | Home | nav_parent_home | nav_parent_home | NULL | home.html |
| 21 | material-submit | 家园共育 | Home School | nav_parent_tasks | nav_parent_tasks | NULL | home-school.html |
| 22 | material-submit | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |

prototype_gap (原型缺口) = 已消除：growth-book-materials.html 与 growth-book-material-submit.html 于 2026-08-02 建立（Parent/decision.md 第 10 条）。与本 spec 的两处出入待 reconcile：①material-submit 页按 parent_ia.md 填写页惯例不带底部导航（本表 20-22 号导航节点未落地，回退走返回键 + ?from=）；②growth-book 页的 btn_parent_book_material_entry 为条件渲染（无征集不渲染），不再是恒在的静态节点
entry_decision (入口拍板) = 触达=首页待办提醒卡直达 material-submit（不计入 today_reminder_count，无 due_at）；归属=本页条目行进 materials 列表；家园共育不出现。详见 Parent/decision.md 第 10 条
screens_registry_note (页面登记说明) = 两个新页面需补进 hualong-backend/db/spec/screens.tsv，该文件为手工维护，不在本次改动范围


[DYNAMIC_CONTENT_NODE]

| node_name_cn | node_name_en | node_key | object | input | cardinality | clickable | jump |
|---|---|---|---|---|---|---|---|
| 成长册学期列表 | Growth Book Term List | parent_book_term_list | db_growth_book | child_id (context) | 0:k | 1 | growth-book.html（同页重载） |
| 成长册页面 | Growth Book Page | parent_book_page | db_growth_book_template + db_book_widget + 页版式库 JSON | growth_book_id (runtime) | 0:k | 0 | NONE |
| 综合评估雷达图 | Comprehensive Assessment Radar | parent_book_radar | db_child_assessment + db_child_assessment_item | child_id (context) | 0:1 | 0 | NONE |
| 教师寄语 | Teacher Message | parent_book_message | db_teacher_message | child_id (context) | 0:1 | 0 | NONE |
| 素材征集待办卡片 | Material Request Card | parent_material_request_card | db_parent_book_material_request | section_id (runtime) | 0:k | 1 | growth-book-materials.html > growth-book-material-submit.html?section_id={section_id} |
| 素材槽位 | Material Slot | parent_material_slot | db_book_widget + db_book_material_submission | widget_id (runtime) | 0:k | 1 | 打开该槽位的上传或文字输入 |

dynamic_rule (动态规则) = 学期、页面内容、栏目名、槽位数量、已提交数、寄语文本、领域均分均来自当前幼儿授权范围内的接口结果；HTML 中的 slug/id 不得进入生产代码


[PAGE_OBJECT]

家长成长册首页 (Parent Growth Book Home / db_parent_growth_book_home)

parent_growth_book_home_id (成长册首页ID), 1:1, derived(page_context), ui=parent_growth_book.page
parent_id (当前家长ID), 1:1, derived(auth_session), ui=context.hidden
child_id (当前幼儿ID), 1:1, derived(current_child_context), ui=context.hidden
school_id (当前园所ID), 1:1, derived(db_child), ui=context.hidden
class_id (当前班级ID), 1:1, derived(db_child), ui=context.hidden
term_id (查看学期ID), 0:k, derived(db_growth_book), ui=parent_growth_book.term_select
growth_book_id (成长册ID), 0:k, derived(db_growth_book), ui=parent_growth_book.card
book_page_count (册内页数), 1:1, derived(页版式库 JSON 与 db_book_widget), ui=parent_growth_book.count
widget_id (册内槽位ID), 0:k, derived(db_book_widget), ui=parent_growth_book.preview

rel_count (关系数量) = 8
rel_db (关联表) = db_parent, db_child, db_school, db_class, db_growth_book, db_growth_book_template, db_growth_book_section, db_book_widget
rel_map (关系字段) = db_parent_growth_book_home{parent_id}<->db_parent{parent_id}; db_parent_growth_book_home{child_id}<->db_child{child_id}; db_parent_growth_book_home{school_id}<->db_school{school_id}; db_parent_growth_book_home{class_id}<->db_class{class_id}; db_parent_growth_book_home{growth_book_id}<->db_growth_book{growth_book_id}; db_parent_growth_book_home{class_id}<->db_growth_book_template{class_id}; db_parent_growth_book_home{widget_id}<->db_book_widget{widget_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
term_list = db_growth_book WHERE child_id=current_child_id ORDER BY term_id DESC
one_book_per_term = db_growth_book UNIQUE(child_id, term_id)；同一幼儿同一学期只有一本
selected_book = db_growth_book WHERE child_id=current_child_id AND term_id=selected_term_id
book_page_count = 页版式库 JSON 中已启用栏目的页数 + 新增栏目 db_book_widget 的 MAX(page_index)+1 之和
IF selected_book NOT_FOUND, page_content=[] AND book_page_count=0


[BOOK_CONTENT_RULE]

section_count (栏目数) = 6 项预设 + N 个新增栏目
section_order (显示顺序) = intro 园所介绍 -> time 在园时光 -> task 亲子活动 -> term 期末评估 -> comp 综合评估 -> message 教师寄语（固定顺序，家长端不可改，教师端也不提供整体拖拽排序）
removed_section (已删除栏目) = parent 家长动态（原读 db_parent_evaluation，DECISIONS.md E3 删除；家长评价仍在 evaluation-tasks 一线，不再进成长册）
removed_section_2 (已删除栏目) = health 体检数据（B12 已砍，维持不变）
split_section (拆分栏目) = eval 发展评估 拆成 term 期末评估 与 comp 综合评估
renamed_section (更名栏目) = comment 幼儿评语 更名 message 教师寄语，并改读 db_teacher_message.content
enabled_sections_source (栏目开关来源) = db_growth_book_template.enabled_sections（班级级，教师配置；W13/W19）
custom_section_source (新增栏目来源) = db_growth_book_section，按 anchor_after 插在预设项之间
book_message_note (寄语字段说明) = B12 的 db_growth_book.book_message 不再使用；寄语一律读 db_teacher_message（E1）

section_binding (栏目内容绑定) =
intro -> db_school.school_intro（园所级；db_class.class_intro 已由 W11 作废）
time -> db_growth_material（班级级：教师从在园时光挑照片加入成长资料，全班每本内容相同）
task -> db_parent_task_submission（幼儿级）
term -> db_term_eval.eval_text + db_file_ref(owner_object='db_term_eval')（幼儿级）
comp -> db_child_assessment + db_child_assessment_item（幼儿级，即时聚合，见 COMPREHENSIVE_ASSESSMENT_RULE）
message -> db_teacher_message.content（幼儿级）
custom -> db_book_widget.binding_key，取值见 W11 登记表：literal|collected|school.intro|class.material|child.message|child.term_eval|child.task|child.assessment

variable_length_rule (不定长内容规则) = child.task 与 class.material 件数不定，由页版式库中若干重复页样板铺满；挑选序列 = PRNG(db_growth_book.layout_seed, section_key, page_index)，同一本册子任意次渲染版面一致
layout_seed_rule (版面种子规则) = layout_seed 首次渲染时产生，之后永不变；家长端不得重算或覆盖


[COMPREHENSIVE_ASSESSMENT_RULE]

applies_to (适用范围) = 一切家长端展示综合评估的界面，包括成长册 comp 栏目与 evaluation-report.html
scale (量表) = 《3-6岁儿童学习与发展指南》教师评定量表 v1.0，5 领域 / 11 维度 / 32 目标 / 124 题项（DECISIONS.md E2）
domain_score_source (领域分来源) = db_child_assessment_item 的题项分即时聚合，题项级均值（非下级均值的均值）
domain_score_persist (领域分是否入库) = 0；db_child_assessment.domain_scores 不落列，B4 的存法已由 E2 改写
radar_persist (雷达图是否存档) = 0；不存文件、不存 base64、不存字段（W12）
radar_render (雷达图渲染) = 小程序端 canvas 直接画；PDF 端服务器绘向量。两端同一份绘图逻辑，渲染时算
unrated_domain (未评领域) = 该领域全部题项均无记录时，接口返回「该领域尚无评分」，不得返回 0；家长端不得把缺分画成 0 分顶点
unrated_item (未评题项) = 未评题项在 db_child_assessment_item 中无列，不是 0 分；领域均分只按已评题项计算
text_analysis (文字分析) = 无。强弱项描述与综合评语已由 E2 删除，接口不返回 analysis_text / assessment_summary
progress_display (进度口径) = 家长端只显示二元完成态；综合评估自身的三态（已完成 / 草稿 / 未完成）是教师端口径（E4），不外露给家长


[TEACHER_MESSAGE_RULE]

object (对象) = db_teacher_message，Teacher/05 home-school-spec.md 为 canonical，家长端只读
content_shape (内容形态) = content 纯文字，max_len=300，不支持任何附件
cardinality (基数) = UNIQUE(child_id, term_id)，每名幼儿每学期一条
writable_by_parent (家长可写) = 0；家长不得新增、编辑或删除寄语
editable_by_teacher (教师可回改) = 1；已提交的寄语可重新编辑保存，家长端读到的是最新内容
parent_read_surface (家长读取面) = 成长册 message 栏目
other_parent_surface (其它家长入口) = 未定。DECISIONS.md 未指定寄语在 home.html 报告流或 evaluation-report.html 出现，不臆测，不实现
visibility_gate (可见门槛) = db_teacher_message.publish_status 的取值与内容把关落点未定（E1 指向 D5 / GAPS.md G2）；在该项拍板之前不得默认全部可见


[RENDER_RULE]

pdf_purpose (PDF 用途) = 传阅，不是印刷（W20）
pdf_producer (PDF 生成方) = 设备端。家长看自家孩子那本时由小程序 canvas 逐页出图并自组极简 PDF，再经 wx.shareFileMessage 分享；服务器零渲染成本
backend_returns (后端返回什么) = 册内页面内容（栏目、页序、槽位坐标、绑定值、图片引用），不是渲染好的文件
generated_file_note (生成文件说明) = db_growth_book.generated_file_id 是教师端批量导出（异步任务）的产物，不作为家长端下载来源
same_source_rendering (同源渲染) = 样本预览、家长查看页、最终 PDF 走同一套渲染逻辑，看到的与导出的必须一致
resolution (分辨率) = 150 DPI，A4 = 1240 x 1754
page_geometry (版面几何) = A4 210 x 297mm 直式；网格 15 x 24，格子 10mm 精确正方；左右边距 30mm、上下边距 28.5mm；widget 不跨页、不进边距
aspect_ratio_rule (长宽比规则) = widget 的长宽比 = grid_w : grid_h，逐像素成立；家长端裁剪框直接吃这个比值
mobile_zoom (手机端缩放) = 默认宽度 best-fit 屏幕，允许 zoom 与横向平移（W1c 推翻了原「不允许横向滑动」）；纵向可下滚
font_rule (字体规则) = 两端必须载同一字体文件（小程序侧 wx.loadFontFace），否则中文字宽差异会连锁影响断行，守不住像素级 95% 一致度；字体选型与授权未定（GAPS.md G29 余项）
page_count_limit (页数上限) = 软上限，超过只提示不阻挡；提示落在教师端，家长端不做拦截


[MATERIAL_COLLECTION_RULE]

request_table (征集请求表) = 无。不建 db_book_material_request；一个 binding_key=collected 的 widget 存在本身就是一次征集，状态由提交记录的有无派生（DECISIONS.md E3 落地段）
request_granularity (征集粒度) = 以栏目为单位发起。一个新增栏目 = 家长端一则待办，点进去列出该栏目所有页上的全部 collected 槽位，一次交完；不按 widget 发、不按页发（W15）
completeness (齐备判定) = 该栏目全部槽位都有提交才算齐备，不是「至少交一件」（W15）
completeness_scope (齐备范围) = 逐栏目判定；某栏目齐备不代表整本可生成，can_generate 由教师端逐栏目比对
deadline (时限) = 无 due_date、无逾期状态、无提醒任务，以学期结束为自然边界（E3 第 4 点）；家长端不得显示倒计时或逾期标记
teacher_fallback (缺交兜底) = 教师可替未交的家长代传，落在同一张表，用 submitted_by 区分
freeze_rule (冻结规则) = 发起征集即冻结该栏目版面。发布后教师只能撤回，不能改版面（W16）
withdraw_semantics (撤回语意) = 撤回时该栏目已收的提交一并删除，不留孤儿档；重新发布时家长要重交。家长端需据此把该栏目状态回退为待提交（W16）
unique_key (唯一键) = widget_id + child_id，一列 = 一个槽位一名幼儿
resubmit (重复提交) = 同一槽位重复提交为覆盖该唯一键上的既有列，不新增列

image_pipeline (图片处理链) =
输入端照单全收：客户端传 HEIC / WebP / PNG 均接受
上传当下统一转 JPEG（MozJPEG 编码，q82-85），长边 2000px
只存裁切后的成品，不留原图（W17）
理由是 PDF 原生只支持 DCTDecode(JPEG) 与 JPXDecode(JPEG2000)，WebP / HEIC / AVIF / JPEG XL 进不了 PDF
unverified_item (待查证) = 微信 chooseMedia 在 iOS 上回 HEIC 还是已转 JPEG、WebP 在两端 image 组件的显示支持；只影响上传端要不要自己转，不影响存储格式结论（W17）

crop_rule (裁剪规则) = 家长端附裁剪工具，上传时按 grid_w : grid_h 预览最终显示比例，可拖拽调位；不强制家长上传符合该比例的原图，Fill / Cover / 自动裁切的显示方式由教师在网格端决定（W9/W10）
crop_persist (裁剪描述存储) = db_book_material_submission.crop，形态待定（DECISIONS.md E3 落地段标为开放项）

text_slot_rule (文字槽位规则) = collected 也吃文字，不只照片（W11）
text_maxlength (文字上限) = 由框的大小推导。前端依 grid_w x grid_h 与当前字级即时算出 maxlength，打满就打不下去；不设全局字数上限，结构上不存在溢出（W18）
text_truncate (静默截断) = FORBIDDEN


[CONTENT_SAFETY_RULE]

ugc_scope (UGC 范围) = 家长提交的照片与文字均为 UGC
gate_rule (把关规则) = 任何 UGC 在对非作者可见之前必须过一道内容把关（CLAUDE.md 安全红线 3）；家长打的字与照片走同一条把关（W11）
gate_landing (把关落点) = 未定。状态位与复核队列的落点、v1 覆盖的内容型别均未拍板（DECISIONS.md D5 / GAPS.md G2）；本 spec 不预设字段名，接口在该项拍板前不得默认「提交即可见」
minor_data (未成年人数据) = 幼儿照片属敏感个人信息，不写明文直链（GAPS.md G16），不在日志里打幼儿姓名


[MATERIAL_REQUEST_OBJECT]

成长册素材征集 (Growth Book Material Request / db_parent_book_material_request)

section_id (成长册栏目ID), 1:1, derived(db_growth_book_section), ui=book_material.request.hidden
template_id (班级模版ID), 1:1, derived(db_growth_book_template), ui=context.hidden
child_id (幼儿ID), 1:1, derived(current_child_context), ui=context.hidden
class_id (班级ID), 1:1, derived(db_child), ui=context.hidden
section_name (栏目名称), 1:1, derived(db_growth_book_section), ui=book_material.request.title
slot_count (槽位总数), 1:1, derived(db_book_widget), ui=book_material.request.count
submitted_count (已提交数), 1:1, derived(db_book_material_submission), ui=book_material.request.progress
request_status (征集状态), 1:1, derived(slot_count 与 submitted_count 比对), ui=book_material.request.status

status_enum (征集状态取值) = c1=complete(已齐备)|c2=incomplete(待提交)；派生显示状态，非入库字段

rel_count (关系数量) = 5
rel_db (关联表) = db_growth_book_section, db_growth_book_template, db_book_widget, db_book_material_submission, db_child
rel_map (关系字段) = db_parent_book_material_request{section_id}<->db_growth_book_section{section_id}; db_parent_book_material_request{template_id}<->db_growth_book_template{template_id}; db_parent_book_material_request{section_id}<->db_book_widget{section_id}; db_parent_book_material_request{child_id}<->db_book_material_submission{child_id}; db_parent_book_material_request{child_id}<->db_child{child_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
request_list = db_growth_book_section WHERE template_id = 当前幼儿所在班级的模版 AND 该栏目已发布征集
slot_count = COUNT(db_book_widget WHERE section_id=? AND binding_key='collected')
submitted_count = COUNT(db_book_material_submission WHERE child_id=current_child_id AND widget_id IN 该栏目的 collected widget)
request_status = c1 ONLY IF submitted_count = slot_count AND slot_count > 0 ELSE c2
IF slot_count=0, 该栏目不进家长端待办列表
草稿态（template_status=d1 或该栏目未发布征集）的栏目一律不对家长可见


[CONTENT_OBJECTS]

成长册素材提交 (Growth Book Material Submission / db_book_material_submission)

book_material_submission_id (成长册素材提交ID), 1:1, integer, ui=book_material.submission.hidden
widget_id (版式槽位ID), 1:1, integer, ui=book_material.submission.hidden
child_id (幼儿ID), 1:1, integer, ui=context.hidden
submission_text (提交文字), 0:1, max_len=derived_from_widget_size, ui=book_material.submission.text
file_id (提交照片ID), 0:1, integer, ui=book_material.submission.upload
crop (裁切框), 0:1, json, ui=book_material.submission.crop
submitted_by (提交来源), 1:1, parent(家长提交)|teacher(教师代传), ui=context.hidden
submitted_at (提交时间), 0:1, datetime, ui=book_material.submission.time

rel_count (关系数量) = 3
rel_db (关联表) = db_book_widget, db_child, db_file
rel_map (关系字段) = db_book_material_submission{widget_id}<->db_book_widget{widget_id}; db_book_material_submission{child_id}<->db_child{child_id}; db_book_material_submission{file_id}<->db_file{file_id}
unique (唯一键) = widget_id + child_id
cross_app_rule (跨端规则) = db_book_material_submission 为家长端 canonical 定义；教师端与管理端仅 REUSE，不得重复定义或另建同义表。教师代传写同一张表，只有 submitted_by 不同
enum_registration_note (枚举登记说明) = submitted_by 的取值沿用 DECISIONS.md E3 落地段的原文 parent|teacher；是否改为 DATABASE_SPEC §2 的编码式枚举尚未登记
file_reference (文件关联) = file_id 经 db_file_ref(owner_object='db_book_material_submission') 关联，不新建关联表（§1.2-1）

method (方法):
提交写入前 child_id 从上下文重新派生，widget_id 必须落在该幼儿所在班级模版的已发布栏目内，校验内联成 predicate
submitted_by 由服务器按调用者角色设值，请求体不得指定
submitted_at 由服务器设值
一个槽位一名幼儿只有一列，重复提交为覆盖
该栏目被撤回时，本表中属于该栏目全部 widget 的该班提交一并删除


[REUSED_OBJECT_USAGE]

db_growth_book = REUSE Teacher/05 home-school-spec.md；家长端只读，不写
db_growth_book_template|db_growth_book_section|db_book_widget = REUSE Teacher/05 home-school-spec.md（E3 新增对象，教师端为 canonical）；家长端只读版面与绑定，不写
db_growth_material = REUSE Teacher/05 home-school-spec.md；班级级素材，全班每本内容相同
db_teacher_message = REUSE Teacher/05 home-school-spec.md（E1 新增对象）；家长端只读
db_term_eval|db_child_assessment|db_child_assessment_item = REUSE Teacher/05 home-school-spec.md；家长端只读
db_parent_task_submission = REUSE Teacher/05 home-school-spec.md；与 parent-tasks-spec.md 读写的是同一批记录
db_school|db_class|db_child|db_teacher|db_file = REUSE Teacher canonical definitions
db_parent = REUSE Parent/home-spec.md
superseded_field (被取代字段) = db_growth_book.book_eval_status 已由 B12 拔除改派生；db_growth_book.book_message 已由 E1 取代；两者均不得再出现在家长端接口


[EMPTY_STATE]

IF allowed_child_count=0, show_page_empty=1, empty_title=暂无关联幼儿
IF term_count=0, show_book_empty=1, book_empty_title=暂无成长册, empty_description=教师完成生成后将在这里显示
IF selected_term book NOT_FOUND, show_book_empty=1
IF request_count=0, show_material_empty=1, material_empty_title=暂无素材征集
IF slot 未提交, slot_state=待提交，不得以留白冒充已完成
IF 某领域无题项分, radar_domain_state=该领域尚无评分（不得显示 0）
IF db_teacher_message NOT_FOUND, message_section_state=暂无寄语
Mock book|section|slot|score|message|progress MUST NOT be returned in production


[NAV_OBJECTS]

nav_parent_home|nav_parent_tasks|nav_parent_moments|nav_parent_child_profile = REUSE home-spec.md with identical node_key and resolved App-root route; page-local href may be relative


[JUMP_VALIDATION]

IF current_child_id NOT_IN allowed_child_id, return 403
IF db_growth_book.child_id != current_child_id, return 403
IF term_id 不在该幼儿已有成长册的学期集合内, return 404
IF section_id 所属 template_id 的 class_id != current_class_id, return 403
IF section 未发布征集 OR template_status=d1, return 403
IF widget_id 的 section_id != 请求的 section_id, return 403
IF db_book_widget.binding_key != 'collected', 拒绝提交, return 403
IF submission child_id != current_child_id, return 403
IF 内容未过把关（落点待 D5 拍板）, 不得对非作者返回
IF query enum invalid, return 400
client supplied parent_id|child_id|school_id|class_id|created_by|uploaded_by|submitted_by MUST be ignored and re-derived from context


[OPEN_ITEM]

open_1 (家长端可见门槛) = 家长看得到某学期成长册的条件未定。B12 写「点进去看该幼儿所有学期的成长册」，E3 W16 定了模版的草稿/定稿两态，W20 又把单本 PDF 渲染移到设备端，db_growth_book.generation_status 是否仍是家长端可见的前提，DECISIONS.md 没有正面回答。本 spec 不替它选一种读法
open_2 (included_sections 去留) = B12 在 db_growth_book 加了 included_sections，E3 W13 把栏目开关移到 db_growth_book_template.enabled_sections，DECISIONS.md 未说明前者是否作废。本 spec 一律读 template.enabled_sections
open_3 (crop 形态) = 裁切框的 JSON 形态待定（DECISIONS.md E3 落地段）
open_4 (寄语可见门槛) = db_teacher_message.publish_status 取值与内容把关落点未定（E1 -> D5 / GAPS.md G2）
open_5 (末页不满) = 重复页样板池在末页件数不足时如何配版未定（GAPS.md G29 余项 a）；影响家长端预览与 PDF 的一致性表现，但不影响提交流程
open_6 (字体选型与授权) = GAPS.md G29 余项 b；家长端 wx.loadFontFace 载哪一份字体尚无答案
open_7 (待查证) = wx.shareFileMessage 的文件大小上限（W21）；微信 chooseMedia 在 iOS 上回的图片格式（W17）
open_rule (开放项纪律) = 以上各项在拍板前不得由实现方选一种读法默默落地，遇到就登记或询问
