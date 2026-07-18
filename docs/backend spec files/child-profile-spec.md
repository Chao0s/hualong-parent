CHILD_PROFILE_BACKEND_OBJECT_SPEC

scope (范围) = screens/child-profile.html
source_page (参考页面) = child-profile.html
static_node_count (固定可点击节点数) = 11
dynamic_profile_block_count (动态档案区块数) = 0:1
dynamic_growth_status_count (动态成长状态数) = 0:3
runtime_clickable_node_count (运行时可点击节点数) = 11
field_format (字段格式) = field_key (中文字段名), cardinality, type|enum, ui
id_rule (ID规则) = integer, database_auto_generated
null_rule (空值规则) = 0:1
list_rule (列表规则) = 0:k | 1:k


[SHARED_OBJECT_RULE]

canonical_registry_checked (canonical 注册表检查) = Teacher/01-05 canonical registry and Parent/home-spec.md
shared_objects (共享对象) = db_school, db_class, db_child, db_month_eval, db_growth_record, db_growth_book, db_parent_evaluation, db_parent, db_parent_child
parent_page_aggregate (家长端页面聚合) = db_parent_child_profile_home
shared_nav_objects (共享导航对象) = nav_parent_home, nav_parent_tasks, nav_parent_moments, nav_parent_child_profile
rename_or_duplicate_shared_object (重命名或复制共享对象) = FORBIDDEN
parent_child_profile_copy (家长端儿童档案副本表) = FORBIDDEN


[CONTEXT_RULE]

parent_id_source (家长ID来源) = auth_session.parent_id
allowed_child_id_source (允许幼儿ID来源) = db_parent_child.child_id WHERE parent_id=auth_session.parent_id AND active=1
current_child_rule (当前幼儿校验) = current_child_id MUST IN allowed_child_id
school_id_source (园所ID来源) = db_child.school_id
class_id_source (班级ID来源) = db_child.class_id
raw_identity_ui (原始身份ID界面规则) = context.hidden
raw_identity_client_editable (原始身份ID前端可编辑) = 0
backend_authorization_validation (后台授权校验) = REQUIRED
class_assignment_rule (班级归属规则) = class_id 由园所名册管理；家长端只读，HTML class select 在 production 禁用且提交值必须忽略


[DATA_INITIALIZATION_RULE]

prototype_content (原型内容) = HTML 中幼儿姓名、生日、性别、班级、成长状态、徽标、报告与生成进度均为 demo|test Mock
static_ui_content (保留的静态界面内容) = 页面标题、基础信息字段标签、成长栏目名、三个固定入口、编辑说明、性别固定选项、底部导航和空状态文案
business_seed (生产环境业务种子数据) = NONE
production_initial_growth_objects (成长业务表初始状态) = db_growth_record|db_growth_book|db_month_eval|db_parent_evaluation EMPTY
dynamic_list_without_data (无数据动态列表) = []
dynamic_count_without_data (无数据动态数量) = 0
unassigned_or_unstarted_status (未分配或未开始状态) = not_started
base_identity_data (基础身份数据) = db_child|db_class|db_parent|db_parent_child 可由部署或管理员初始化
hardcoded_business_id (固定业务ID) = FORBIDDEN
environment_isolation (环境隔离) = demo|test 数据不得复制到 production


[STATIC_BUTTON_NODE_INDEX]

| n | button_name_cn | button_name_en | node_key | object | input | jump |
|---:|---|---|---|---|---|---|
| 1 | 编辑 | Open Profile Editor | btn_parent_profile_edit_open | db_child | child_id | child-profile.html > profile-edit sheet |
| 2 | 成长档案 | Growth Record | btn_parent_profile_growth_record | db_growth_record | child_id | child-profile.html > growth-record.html |
| 3 | 评价/评估报告 | Evaluation Reports | btn_parent_profile_evaluation_report | db_month_eval + db_parent_evaluation | child_id | child-profile.html > evaluation-report.html?from=profile |
| 4 | 成长册 | Growth Book | btn_parent_profile_growth_book | db_growth_book | child_id | child-profile.html > growth-book.html?from=profile |
| 5 | 编辑层背景关闭 | Close Editor by Backdrop | btn_parent_profile_edit_backdrop_close | db_parent_child_profile_home | NULL | close profile-edit sheet |
| 6 | 编辑层关闭 | Close Profile Editor | btn_parent_profile_edit_close | db_parent_child_profile_home | NULL | close profile-edit sheet |
| 7 | 保存修改 | Save Profile Changes | btn_parent_profile_save | db_child | child_id, child_name, birth_date, gender | submit then close profile-edit sheet |
| 8 | 首页 | Home | nav_parent_home | nav_parent_home | NULL | ../home.html |
| 9 | 我的任务 | My Tasks | nav_parent_tasks | nav_parent_tasks | NULL | evaluation-tasks.html |
| 10 | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | kindergarten-moments.html |
| 11 | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |


[DYNAMIC_CONTENT_NODE]

| node_name_cn | node_name_en | node_key | object | input | cardinality | clickable | jump |
|---|---|---|---|---|---|---|---|
| 幼儿基础信息 | Child Basic Profile | parent_child_profile_block | db_child + db_class | child_id (context) | 0:1 | 0 | NONE |
| 成长档案状态 | Growth Record Status | parent_growth_record_status | db_growth_record | child_id (context) | 0:1 | 0 | NONE |
| 评价报告状态 | Evaluation Report Status | parent_evaluation_report_status | db_month_eval + db_parent_evaluation | child_id (context) | 0:1 | 0 | NONE |
| 成长册状态 | Growth Book Status | parent_growth_book_status | db_growth_book | child_id (context) | 0:1 | 0 | NONE |

dynamic_rule (动态规则) = 姓名、生日、性别、班级、徽标和成长状态来自授权接口；没有业务记录时不得显示 HTML Mock 的“已推送/新报告/生成中”


[PAGE_OBJECT]

家长儿童档案首页 (Parent Child Profile Home / db_parent_child_profile_home)

parent_child_profile_home_id (儿童档案首页ID), 1:1, integer, ui=parent_child_profile.page
parent_id (当前家长ID), 1:1, integer, ui=context.hidden
parent_child_id (家长幼儿关系ID), 1:1, integer, ui=context.hidden
child_id (当前幼儿ID), 1:1, integer, ui=context.hidden
school_id (当前园所ID), 1:1, integer, ui=context.hidden
class_id (当前班级ID), 1:1, integer, ui=context.hidden
growth_record_id (成长档案ID), 0:k, integer, ui=parent_child_profile.growth_record
month_eval_id (教师月度评价ID), 0:k, integer, ui=parent_child_profile.evaluation_report
parent_evaluation_id (家长评价ID), 0:k, integer, ui=parent_child_profile.evaluation_report
growth_book_id (成长册ID), 0:k, integer, ui=parent_child_profile.growth_book

rel_count (关系数量) = 9
rel_db (关联表) = db_parent, db_parent_child, db_child, db_school, db_class, db_growth_record, db_month_eval, db_parent_evaluation, db_growth_book
rel_map (关系字段) = db_parent_child_profile_home{parent_id}<->db_parent{parent_id}; db_parent_child_profile_home{parent_child_id}<->db_parent_child{parent_child_id}; db_parent_child_profile_home{child_id}<->db_child{child_id}; db_parent_child_profile_home{school_id}<->db_school{school_id}; db_parent_child_profile_home{class_id}<->db_class{class_id}; db_parent_child_profile_home{growth_record_id}<->db_growth_record{growth_record_id}; db_parent_child_profile_home{month_eval_id}<->db_month_eval{month_eval_id}; db_parent_child_profile_home{parent_evaluation_id}<->db_parent_evaluation{parent_evaluation_id}; db_parent_child_profile_home{growth_book_id}<->db_growth_book{growth_book_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
profile = db_child JOIN db_class WHERE child_id=current_child_id
growth_record_status = latest authorized db_growth_record.record_status; IF missing, p0=not_started
evaluation_report_status = derived from COUNT(db_month_eval WHERE eval_status=e3) + COUNT(db_parent_evaluation WHERE evaluation_status=p2); IF count=0, not_started
growth_book_status = latest authorized db_growth_book.growth_book_status; IF missing, b0=not_started


[CANONICAL_FIELD_EXTENSION]

object (扩展对象) = db_child REUSE Teacher/05 home-school-spec.md
birth_date (出生日期), 0:1, date, ui=child.profile.birth_date|child.profile.edit.birth_date
gender (性别), 0:1, g1=female(女)|g2=male(男)|g3=unspecified(未指定), ui=child.profile.gender|child.profile.edit.gender
extension_rule (扩展规则) = 以上字段加入唯一 canonical db_child；不得创建家长端儿童业务副本表
existing_child_name_update (姓名更新) = db_child.child_name may be updated by authorized parent
class_id_update (班级更新) = FORBIDDEN_FROM_PARENT_APP

profile_update_method (档案更新方法):
REQUIRE current_child_id IN allowed_child_id
allow_fields = child_name, birth_date, gender
ignore_or_reject_fields = child_id, school_id, class_id, enrollment_status
validate child_name max_len=50; birth_date<=CURRENT_DATE; gender IN(g1,g2,g3)
UPDATE canonical db_child; Teacher and Admin Apps read the same updated record


[REUSED_OBJECT_USAGE]

db_child|db_school|db_class = REUSE Teacher canonical definitions; only the declared db_child field extension is added
db_growth_record|db_growth_book|db_month_eval = REUSE Teacher/05 home-school-spec.md and Teacher/01 home-spec.md
db_parent_evaluation|db_parent|db_parent_child = REUSE Parent/home-spec.md


[EMPTY_STATE]

IF allowed_child_count=0, show_page_empty=1, empty_title=暂无关联幼儿, edit_enabled=0
IF growth_record_count=0, growth_record_status=not_started, growth_record_label=暂无成长档案
IF evaluation_report_count=0, evaluation_report_status=not_started, evaluation_report_label=暂无评价报告
IF growth_book_count=0, growth_book_status=not_started, growth_book_label=暂无成长册
Mock profile value|badge|report|progress|status MUST NOT be returned in production


[NAV_OBJECTS]

nav_parent_home|nav_parent_tasks|nav_parent_moments|nav_parent_child_profile = REUSE home-spec.md with identical node_key and resolved App-root route; page-local href may be relative


[JUMP_VALIDATION]

IF current_child_id NOT_IN allowed_child_id, return 403
IF btn_parent_profile_save contains child_id|school_id|class_id from client, ignore those IDs and re-derive context; unauthorized target returns 403
IF growth record|evaluation report|growth book object_id NOT_FOUND, return 404
IF any growth object child_id != current_child_id OR school_id/class_id is outside derived context, return 403
IF content status is draft|pending|rejected|deleted or not parent-visible, return 403
IF query enum invalid, return 400
