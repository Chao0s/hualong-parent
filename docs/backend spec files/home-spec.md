PARENT_HOME_BACKEND_OBJECT_SPEC

scope (范围) = screens/home.html
source_page (参考页面) = screens/home.html
static_node_count (固定可点击节点数) = 9
dynamic_context_summary_count (动态当前幼儿摘要数) = 0:1
dynamic_reminder_card_count (动态提醒卡片数) = 0:k
dynamic_report_card_count (动态报告卡片数) = 0:k
runtime_clickable_node_count (运行时可点击节点数) = 9:k
field_format (字段格式) = field_key (中文字段名), cardinality, type|enum, ui
id_rule (ID规则) = integer, database_auto_generated
null_rule (空值规则) = 0:1
list_rule (列表规则) = 0:k | 1:k


[SHARED_OBJECT_RULE]

canonical_registry_checked (canonical 注册表检查) = Teacher/01-05 canonical registry checked before Parent first definitions
shared_object_source (共享对象来源) = Teacher/01 home-spec.md | Teacher/05 home-school-spec.md
shared_objects (共享对象) = db_school, db_teacher, db_class, db_child, db_file, db_parent_task, db_parent_task_submission, db_month_eval, db_growth_record
reserved_identity_objects_used (使用的预留身份对象) = db_parent, db_parent_child
parent_page_aggregate (家长端页面聚合) = db_parent_home
shared_nav_namespace (家长端导航命名空间) = nav_parent_*
rename_or_duplicate_shared_object (重命名或复制共享对象) = FORBIDDEN


[CONTEXT_RULE]

parent_id_source (家长ID来源) = auth_session.parent_id
allowed_child_id_source (允许幼儿ID来源) = db_parent_child.child_id WHERE parent_id=auth_session.parent_id AND is_active=1
current_child_rule (当前幼儿校验) = current_child_id MUST IN allowed_child_id
school_id_source (园所ID来源) = db_child.school_id WHERE child_id=current_child_id
class_id_source (班级ID来源) = db_child.class_id WHERE child_id=current_child_id
raw_identity_ui (原始身份ID界面规则) = context.hidden
raw_identity_client_editable (原始身份ID前端可编辑) = 0
backend_authorization_validation (后台授权校验) = REQUIRED


[DATA_INITIALIZATION_RULE]

prototype_content (原型内容) = HTML 中的园所、幼儿名、班级、今日待办数量、提醒、报告、日期、徽标、状态和固定业务ID均为 demo|test Mock
static_ui_content (保留的静态界面内容) = 页面标题、说明、栏目名、两个任务入口、全部入口、底部导航和空状态文案
business_seed (生产环境业务种子数据) = NONE
production_initial_db_parent_evaluation (家长评价初始状态) = EMPTY
production_initial_shared_business_objects (共享业务表初始状态) = db_parent_task|db_parent_task_submission|db_month_eval|db_growth_record EMPTY
dynamic_list_without_data (无数据动态列表) = []
dynamic_count_without_data (无数据动态数量) = 0
unassigned_or_unstarted_status (未分配或未开始状态) = not_started
base_identity_data (基础身份数据) = db_school|db_teacher|db_class|db_child|db_parent|db_parent_child 可由部署或管理员初始化
hardcoded_business_id (固定业务ID) = FORBIDDEN
environment_isolation (环境隔离) = demo|test 数据不得复制到 production


[STATIC_BUTTON_NODE_INDEX]

| n | button_name_cn | button_name_en | node_key | object | input | jump |
|---:|---|---|---|---|---|---|
| 1 | 切换孩子 | Switch Child | nav_parent_switch_child | db_parent_child | parent_id | screens/home.html > screens/switch-child.html |
| 2 | 家长评价 | Parent Evaluation | btn_parent_home_evaluation | db_parent_evaluation | child_id | screens/home.html > screens/evaluation-tasks.html |
| 3 | 亲子任务 | Parent-Child Tasks | btn_parent_home_task | db_parent_task | child_id | screens/home.html > screens/parent-tasks.html |
| 4 | 全部提醒 | All Reminders | btn_parent_home_reminder_all | db_parent_home | child_id | screens/home.html > screens/all-reminders.html |
| 5 | 全部报告 | All Reports | btn_parent_home_report_all | db_parent_home | child_id | screens/home.html > screens/all-reports.html |
| 6 | 首页 | Home | nav_parent_home | nav_parent_home | NULL | screens/home.html |
| 7 | 我的任务 | My Tasks | nav_parent_tasks | nav_parent_tasks | NULL | screens/evaluation-tasks.html |
| 8 | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | screens/kindergarten-moments.html |
| 9 | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | screens/child-profile.html |


[DYNAMIC_CONTENT_NODE]

| node_name_cn | node_name_en | node_key | object | input | cardinality | jump |
|---|---|---|---|---|---|---|
| 当前幼儿摘要 | Current Child Summary | parent_home_child_summary | db_school + db_child + db_class | child_id (context) | 0:1 | NONE |
| 今日待办数量 | Today Reminder Count | parent_home_today_reminder_count | db_parent_home | child_id (context) | 1:1 | NONE |
| 家长评价提醒卡片 | Parent Evaluation Reminder Card | parent_home_evaluation_reminder_card | db_parent_evaluation | parent_evaluation_id (runtime) | 0:k | screens/home.html > screens/monthly-evaluation.html?parent_evaluation_id={parent_evaluation_id}&from=home |
| 亲子任务提醒卡片 | Parent Task Reminder Card | parent_home_task_reminder_card | db_parent_task + db_parent_task_submission | parent_task_id (runtime) | 0:k | screens/home.html > screens/parent-task-detail.html?parent_task_id={parent_task_id}&from=home |
| 教师月度评价报告卡片 | Teacher Monthly Evaluation Report Card | parent_home_teacher_eval_report_card | db_month_eval | month_eval_id (runtime) | 0:k | screens/home.html > screens/evaluation-history-detail.html?report_type=teacher_monthly&month_eval_id={month_eval_id}&from=home |
| 家长评价报告卡片 | Parent Evaluation Report Card | parent_home_parent_eval_report_card | db_parent_evaluation | parent_evaluation_id (runtime) | 0:k | screens/home.html > screens/evaluation-history-detail.html?report_type=parent&parent_evaluation_id={parent_evaluation_id}&from=home |
| 成长档案报告卡片 | Growth Record Report Card | parent_home_growth_report_card | db_growth_record | growth_record_id (runtime) | 0:k | screens/home.html > screens/evaluation-history-detail.html?report_type=growth&growth_record_id={growth_record_id}&from=home |

dynamic_rule (动态规则) = 标题、类型、日期、发布者、状态、数量和所有 object_id 均来自当前幼儿授权范围内的接口结果；HTML 中的 slug/id 不得进入生产代码


[PAGE_OBJECT]

家长首页 (Parent Home / db_parent_home)

parent_home_id (家长首页ID), 1:1, integer, ui=parent_home.page
parent_id (当前家长ID), 1:1, integer, ui=context.hidden
parent_child_id (家长幼儿关系ID), 1:1, integer, ui=context.hidden
child_id (当前幼儿ID), 1:1, integer, ui=context.hidden
school_id (当前园所ID), 1:1, integer, ui=context.hidden
class_id (当前班级ID), 1:1, integer, ui=context.hidden
parent_evaluation_id (家长评价ID), 0:k, integer, ui=parent_home.reminder|parent_home.report
parent_task_id (亲子任务ID), 0:k, integer, ui=parent_home.reminder
parent_task_submission_id (亲子任务提交ID), 0:k, integer, ui=parent_home.reminder.status
month_eval_id (教师月度评价ID), 0:k, integer, ui=parent_home.report
growth_record_id (成长档案ID), 0:k, integer, ui=parent_home.report

rel_count (关系数量) = 10
rel_db (关联表) = db_parent, db_parent_child, db_child, db_school, db_class, db_parent_evaluation, db_parent_task, db_parent_task_submission, db_month_eval, db_growth_record
rel_map (关系字段) = db_parent_home{parent_id}<->db_parent{parent_id}; db_parent_home{parent_child_id}<->db_parent_child{parent_child_id}; db_parent_home{child_id}<->db_child{child_id}; db_parent_home{school_id}<->db_school{school_id}; db_parent_home{class_id}<->db_class{class_id}; db_parent_home{parent_evaluation_id}<->db_parent_evaluation{parent_evaluation_id}; db_parent_home{parent_task_id}<->db_parent_task{parent_task_id}; db_parent_home{parent_task_submission_id}<->db_parent_task_submission{parent_task_submission_id}; db_parent_home{month_eval_id}<->db_month_eval{month_eval_id}; db_parent_home{growth_record_id}<->db_growth_record{growth_record_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
reminder_list = authorized incomplete db_parent_evaluation UNION authorized published db_parent_task LEFT JOIN db_parent_task_submission
report_list = published db_month_eval UNION completed db_parent_evaluation UNION completed db_growth_record ORDER BY report_date DESC
today_reminder_count = COUNT(reminder_list WHERE due_at falls in current local day)
IF no source row, corresponding list=[] AND count=0


[CONTENT_OBJECTS]

家长 (Parent / db_parent)

parent_id (家长ID), 1:1, integer, ui=context.hidden
parent_name (家长姓名), 1:1, max_len=50, ui=parent.profile.name
phone (联系电话), 0:1, phone, ui=parent.profile.phone
parent_status (家长账号状态), 1:1, s1=active(启用)|s2=suspended(暂停)|s3=closed(注销), ui=parent.hidden

rel_count (关系数量) = 0
cross_app_rule (跨端规则) = db_parent 为家长端 canonical identity object；教师端与管理端仅 REUSE，不得重复定义或另建同义表；家长园所归属经 db_parent_child->db_child.school_id 派生，db_parent 不存 school_id


家长幼儿关系 (Parent-Child Relation / db_parent_child)

parent_child_id (家长幼儿关系ID), 1:1, integer, ui=context.hidden
parent_id (家长ID), 1:1, integer, ui=context.hidden
child_id (幼儿ID), 1:1, integer, ui=context.hidden
relationship_type (监护关系), 1:1, r1=mother(母亲)|r2=father(父亲)|r3=grandparent(祖辈)|r4=guardian(监护人)|r5=other(其他), ui=parent_child.role
is_primary_contact (是否主要联系人), 1:1, boolean, ui=parent_child.hidden
is_active (是否有效), 1:1, boolean, ui=context.hidden

rel_count (关系数量) = 2
rel_db (关联表) = db_parent, db_child
rel_map (关系字段) = db_parent_child{parent_id}<->db_parent{parent_id}; db_parent_child{child_id}<->db_child{child_id}
unique (唯一键) = parent_id + child_id
cross_app_rule (跨端规则) = db_parent_child 为家长端 canonical 定义；教师端与管理端仅 REUSE，不得重复定义


家长评价 (Parent Evaluation / db_parent_evaluation)

parent_evaluation_id (家长评价ID), 1:1, integer, ui=parent_evaluation.hidden
school_id (园所ID), 1:1, integer, ui=context.hidden
class_id (班级ID), 1:1, integer, ui=context.hidden
child_id (幼儿ID), 1:1, integer, ui=context.hidden
parent_id (提交家长ID), 0:1, integer, ui=context.hidden
requested_by_teacher_id (发起教师ID), 1:1, integer, ui=parent_evaluation.requester
evaluation_type (评价类型), 1:1, t1=monthly(月度)|t2=term(学期), ui=parent_evaluation.type
evaluation_period (评价周期), 1:1, YYYY-MM|school_term, ui=parent_evaluation.period
evaluation_title (评价标题), 1:1, max_len=100, ui=parent_evaluation.title
evaluation_prompt (评价说明), 0:1, max_len=1000, ui=parent_evaluation.prompt
evaluation_text (家长评价内容), 0:1, max_len=2000, ui=parent_evaluation.text
file_id (评价附件ID), 0:k, integer, ui=parent_evaluation.media
start_at (开放时间), 1:1, datetime, ui=parent_evaluation.start_at
due_at (截止时间), 0:1, datetime, ui=parent_evaluation.due_at
evaluation_status (评价状态), 1:1, p0=not_started(未开始)|p1=in_progress(进行中)|p2=complete(已完成)|p3=overdue(逾期未完成), ui=parent_evaluation.status
submitted_at (提交时间), 0:1, datetime, ui=parent_evaluation.submitted_at

rel_count (关系数量) = 6
rel_db (关联表) = db_school, db_class, db_child, db_parent, db_teacher, db_file
rel_map (关系字段) = db_parent_evaluation{school_id}<->db_school{school_id}; db_parent_evaluation{class_id}<->db_class{class_id}; db_parent_evaluation{child_id}<->db_child{child_id}; db_parent_evaluation{parent_id}<->db_parent{parent_id}; db_parent_evaluation{requested_by_teacher_id}<->db_teacher{teacher_id}; db_parent_evaluation{file_id}<->db_file{file_id}
unique (唯一键) = child_id + evaluation_type + evaluation_period
cross_app_rule (跨端规则) = db_parent_evaluation 为家长端 canonical 定义；教师端(05 home-school-spec.md)与管理端仅 REUSE；evaluation_status=p2 在教师端映射为完成(c1)


[REUSED_OBJECT_USAGE]

db_school|db_teacher|db_class|db_child|db_file = REUSE Teacher/01 home-spec.md and Teacher/05 home-school-spec.md
db_parent_task|db_parent_task_submission|db_month_eval|db_growth_record = REUSE Teacher/05 home-school-spec.md and Teacher/01 home-spec.md
shared_schema_redefinition (共享 schema 重复定义) = NONE


[EMPTY_STATE]

IF allowed_child_count=0, show_page_empty=1, empty_title=暂无关联幼儿, empty_description=请联系园所管理员维护家长与幼儿关系
IF reminder_count=0, show_reminder_empty=1, reminder_empty_title=暂无待办提醒, today_reminder_count=0
IF report_count=0, show_report_empty=1, report_empty_title=暂无成长报告
Mock child_name|class_name|count|date|badge|status|report MUST NOT be returned in production


[NAV_OBJECTS]

首页 (Home / nav_parent_home): node_key=nav_parent_home; object_ref=db_parent_home; route=screens/home.html; persist=0; rel_count=0
我的任务 (My Tasks / nav_parent_tasks): node_key=nav_parent_tasks; object_ref=db_parent_task_home; route=screens/evaluation-tasks.html; persist=0; rel_count=0
在园时光 (Kindergarten Moments / nav_parent_moments): node_key=nav_parent_moments; object_ref=db_parent_moment_home; route=screens/kindergarten-moments.html; persist=0; rel_count=0
儿童档案 (Child Profile / nav_parent_child_profile): node_key=nav_parent_child_profile; object_ref=db_parent_child_profile_home; route=screens/child-profile.html; persist=0; rel_count=0
切换孩子 (Switch Child / nav_parent_switch_child): node_key=nav_parent_switch_child; object_ref=db_parent_child; route=screens/switch-child.html; persist=0; rel_count=0
route_resolution_rule (路由解析规则) = route 使用 App 根目录语义；screens 页面以同级 href=home.html 指向 nav_parent_home


[JUMP_VALIDATION]

IF auth_session.parent_id NOT_FOUND|INACTIVE, return 403
IF current_child_id NOT_IN allowed_child_id, return 403
IF node_key=parent_home_evaluation_reminder_card, REQUIRE parent_evaluation_id FROM query_result
IF node_key=parent_home_task_reminder_card, REQUIRE parent_task_id FROM query_result
IF node_key=parent_home_teacher_eval_report_card, REQUIRE month_eval_id FROM query_result
IF node_key=parent_home_parent_eval_report_card, REQUIRE parent_evaluation_id FROM query_result
IF node_key=parent_home_growth_report_card, REQUIRE growth_record_id FROM query_result
IF dynamic object_id NOT_FOUND, return 404
IF dynamic object child_id != current_child_id OR school_id != current_school_id, return 403
IF content status is draft|pending|rejected|deleted or not parent-visible, return 403
IF query enum report_type invalid, return 400
