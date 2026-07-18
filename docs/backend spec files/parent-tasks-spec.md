PARENT_TASKS_BACKEND_OBJECT_SPEC

scope (范围) = screens/parent-tasks.html
source_page (参考页面) = parent-tasks.html
static_node_count (固定可点击节点数) = 9
dynamic_parent_task_card_count (动态亲子任务卡片数) = 0:k
runtime_clickable_node_count (运行时可点击节点数) = 9:k
field_format (字段格式) = field_key (中文字段名), cardinality, type|enum, ui
id_rule (ID规则) = integer, database_auto_generated
null_rule (空值规则) = 0:1
list_rule (列表规则) = 0:k | 1:k


[SHARED_OBJECT_RULE]

canonical_registry_checked (canonical 注册表检查) = Teacher/01-05 canonical registry and Parent/home-spec.md
shared_objects (共享对象) = db_school, db_class, db_child, db_parent_task, db_parent_task_submission, db_file, db_parent, db_parent_child
parent_page_aggregate (家长端页面聚合) = db_parent_task_home
shared_nav_objects (共享导航对象) = nav_parent_home, nav_parent_tasks, nav_parent_moments, nav_parent_child_profile
rename_or_duplicate_shared_object (重命名或复制共享对象) = FORBIDDEN


[CONTEXT_RULE]

parent_id_source (家长ID来源) = auth_session.parent_id
allowed_child_id_source (允许幼儿ID来源) = db_parent_child.child_id WHERE parent_id=auth_session.parent_id AND active=1
current_child_rule (当前幼儿校验) = current_child_id MUST IN allowed_child_id
school_id_source (园所ID来源) = db_child.school_id
class_id_source (班级ID来源) = db_child.class_id
raw_identity_ui (原始身份ID界面规则) = context.hidden
raw_identity_client_editable (原始身份ID前端可编辑) = 0
backend_authorization_validation (后台授权校验) = REQUIRED


[DATA_INITIALIZATION_RULE]

prototype_content (原型内容) = HTML 中四条任务、标题、类型、日期、图片数量、完成状态及 slug ID 均为 demo|test Mock
static_ui_content (保留的静态界面内容) = 页面标题、任务类型标签、三项固定筛选、待完成/历史栏目、说明文案、底部导航和空状态文案
business_seed (生产环境业务种子数据) = NONE
production_initial_db_parent_task (亲子任务初始状态) = EMPTY
production_initial_db_parent_task_submission (亲子任务提交初始状态) = EMPTY
dynamic_list_without_data (无数据动态列表) = []
dynamic_count_without_data (无数据动态数量) = 0
unassigned_or_unstarted_status (未分配或未开始状态) = not_started
hardcoded_business_id (固定业务ID) = FORBIDDEN
environment_isolation (环境隔离) = demo|test 数据不得复制到 production


[STATIC_BUTTON_NODE_INDEX]

| n | button_name_cn | button_name_en | node_key | object | input | jump |
|---:|---|---|---|---|---|---|
| 1 | 家长评价标签 | Parent Evaluation Tab | btn_parent_tasks_evaluation_tab | db_parent_evaluation | child_id | parent-tasks.html > evaluation-tasks.html |
| 2 | 亲子任务标签 | Parent Task Tab | btn_parent_tasks_parent_tab | db_parent_task_home | child_id | parent-tasks.html |
| 3 | 全部 | All | btn_parent_tasks_filter_all | db_parent_task | task_filter=all | client filter only; route unchanged |
| 4 | 日常亲子任务 | Daily Parent Task | btn_parent_tasks_filter_daily | db_parent_task | parent_task_type=t1 | client filter only; route unchanged |
| 5 | 社区任务 | Community Task | btn_parent_tasks_filter_community | db_parent_task | parent_task_type=t2 | client filter only; route unchanged |
| 6 | 首页 | Home | nav_parent_home | nav_parent_home | NULL | ../home.html |
| 7 | 我的任务 | My Tasks | nav_parent_tasks | nav_parent_tasks | NULL | evaluation-tasks.html |
| 8 | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | kindergarten-moments.html |
| 9 | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |


[DYNAMIC_CONTENT_NODE]

| node_name_cn | node_name_en | node_key | object | input | cardinality | jump |
|---|---|---|---|---|---|---|
| 亲子任务卡片 | Parent Task Card | parent_task_card | db_parent_task + db_parent_task_submission | parent_task_id (runtime) | 0:k | parent-tasks.html > parent-task-detail.html?parent_task_id={parent_task_id} |

dynamic_rule (动态规则) = 任务标题、类型、提交时间、媒体数量、状态和 parent_task_id 来自授权查询；筛选值仅映射到 canonical enum，不写入业务表


[PAGE_OBJECT]

家长亲子任务首页 (Parent Task Home / db_parent_task_home)

parent_task_home_id (亲子任务首页ID), 1:1, integer, ui=parent_task_home.page
parent_id (当前家长ID), 1:1, integer, ui=context.hidden
parent_child_id (家长幼儿关系ID), 1:1, integer, ui=context.hidden
child_id (当前幼儿ID), 1:1, integer, ui=context.hidden
school_id (当前园所ID), 1:1, integer, ui=context.hidden
class_id (当前班级ID), 1:1, integer, ui=context.hidden
parent_task_id (亲子任务ID), 0:k, integer, ui=parent_task_home.card
parent_task_submission_id (亲子任务提交ID), 0:k, integer, ui=parent_task_home.card.status

rel_count (关系数量) = 7
rel_db (关联表) = db_parent, db_parent_child, db_child, db_school, db_class, db_parent_task, db_parent_task_submission
rel_map (关系字段) = db_parent_task_home{parent_id}<->db_parent{parent_id}; db_parent_task_home{parent_child_id}<->db_parent_child{parent_child_id}; db_parent_task_home{child_id}<->db_child{child_id}; db_parent_task_home{school_id}<->db_school{school_id}; db_parent_task_home{class_id}<->db_class{class_id}; db_parent_task_home{parent_task_id}<->db_parent_task{parent_task_id}; db_parent_task_home{parent_task_submission_id}<->db_parent_task_submission{parent_task_submission_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
task_list = db_parent_task FILTER(school_id=current_school_id, class_id=current_class_id, publish_status=s2|s3) LEFT JOIN db_parent_task_submission ON parent_task_id AND child_id=current_child_id
effective_submission_status = COALESCE(db_parent_task_submission.submission_status, p0=not_started)
pending = effective_submission_status IN(p0,p1,p3) AND db_parent_task.publish_status=s2
history = effective_submission_status=p2 OR db_parent_task.publish_status=s3
task_filter=all returns all authorized rows
task_filter=daily maps to parent_task_type=t1
task_filter=community maps to parent_task_type=t2


[REUSED_OBJECT_USAGE]

db_parent_task = REUSE Teacher/05 home-school-spec.md; same teacher-issued record is read here
db_parent_task_submission = REUSE Teacher/05 home-school-spec.md; same child submission is created/updated here and read by Teacher App
db_school|db_class|db_child|db_file = REUSE Teacher canonical definitions
db_parent|db_parent_child|db_parent_evaluation = REUSE Parent/home-spec.md


[EMPTY_STATE]

IF allowed_child_count=0, show_page_empty=1, empty_title=暂无关联幼儿
IF pending_count=0, show_pending_empty=1, pending_empty_title=暂无待完成任务
IF history_count=0, show_history_empty=1, history_empty_title=暂无历史任务
IF selected_type_count=0, show_filter_empty=1, filter_empty_title=当前分类暂无任务
Mock task|submission|date|media_count|status MUST NOT be returned in production


[NAV_OBJECTS]

nav_parent_home|nav_parent_tasks|nav_parent_moments|nav_parent_child_profile = REUSE home-spec.md with identical node_key and resolved App-root route; page-local href may be relative


[JUMP_VALIDATION]

IF current_child_id NOT_IN allowed_child_id, return 403
IF task_filter NOT_IN(all,daily,community), return 400
IF node_key=parent_task_card, REQUIRE parent_task_id FROM query_result
IF parent_task_id NOT_FOUND, return 404
IF db_parent_task.school_id != current_school_id OR db_parent_task.class_id != current_class_id, return 403
IF db_parent_task.publish_status=s1|deleted, return 403
IF submission child_id != current_child_id, return 403
client supplied parent_id|child_id|school_id|class_id MUST be ignored and re-derived from context
