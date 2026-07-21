KINDERGARTEN_MOMENTS_BACKEND_OBJECT_SPEC

scope (范围) = screens/kindergarten-moments.html
source_page (参考页面) = kindergarten-moments.html
static_node_count (固定可点击节点数) = 4
dynamic_moment_summary_count (动态在园时光摘要数) = 0:1
dynamic_moment_card_count (动态在园时光卡片数) = 0:k
runtime_clickable_node_count (运行时可点击节点数) = 4
field_format (字段格式) = field_key (中文字段名), cardinality, type|enum, ui
id_rule (ID规则) = integer, database_auto_generated
null_rule (空值规则) = 0:1
list_rule (列表规则) = 0:k | 1:k


[SHARED_OBJECT_RULE]

canonical_registry_checked (canonical 注册表检查) = Teacher/01-05 canonical registry and Parent/home-spec.md
shared_objects (共享对象) = db_school, db_teacher, db_class, db_child, db_moment, db_moment_upload, db_file, db_parent, db_parent_child
parent_page_aggregate (家长端页面聚合) = db_parent_moment_home
shared_nav_objects (共享导航对象) = nav_parent_home, nav_parent_tasks, nav_parent_moments, nav_parent_child_profile
rename_or_duplicate_shared_object (重命名或复制共享对象) = FORBIDDEN


[CONTEXT_RULE]

parent_id_source (家长ID来源) = auth_session.parent_id
allowed_child_id_source (允许幼儿ID来源) = db_parent_child.child_id WHERE parent_id=auth_session.parent_id AND is_active=1
current_child_rule (当前幼儿校验) = current_child_id MUST IN allowed_child_id
school_id_source (园所ID来源) = db_child.school_id
class_id_source (班级ID来源) = db_child.class_id
raw_identity_ui (原始身份ID界面规则) = context.hidden
raw_identity_client_editable (原始身份ID前端可编辑) = 0
backend_authorization_validation (后台授权校验) = REQUIRED


[DATA_INITIALIZATION_RULE]

prototype_content (原型内容) = HTML 中班级名、幼儿名、教师名、三条活动、时间、描述、图片、每周次数及参与状态均为 demo|test Mock
static_ui_content (保留的静态界面内容) = 页面标题、栏目说明、底部导航和空状态文案
business_seed (生产环境业务种子数据) = NONE
production_initial_db_moment (在园时光初始状态) = EMPTY
production_initial_db_moment_upload (幼儿时光上传初始状态) = EMPTY
dynamic_list_without_data (无数据动态列表) = []
dynamic_count_without_data (无数据动态数量) = 0
unassigned_or_unstarted_status (未分配或未开始状态) = not_started
hardcoded_business_id (固定业务ID) = FORBIDDEN
environment_isolation (环境隔离) = demo|test 数据不得复制到 production


[STATIC_BUTTON_NODE_INDEX]

| n | button_name_cn | button_name_en | node_key | object | input | jump |
|---:|---|---|---|---|---|---|
| 1 | 首页 | Home | nav_parent_home | nav_parent_home | NULL | home.html |
| 2 | 我的任务 | My Tasks | nav_parent_tasks | nav_parent_tasks | NULL | evaluation-tasks.html |
| 3 | 在园时光 | Kindergarten Moments | nav_parent_moments | nav_parent_moments | NULL | kindergarten-moments.html |
| 4 | 儿童档案 | Child Profile | nav_parent_child_profile | nav_parent_child_profile | NULL | child-profile.html |


[DYNAMIC_CONTENT_NODE]

| node_name_cn | node_name_en | node_key | object | input | cardinality | clickable | jump |
|---|---|---|---|---|---|---|---|
| 在园时光摘要 | Kindergarten Moment Summary | parent_moment_summary | db_class + db_child + db_moment + db_moment_upload | child_id (context) | 0:1 | 0 | NONE |
| 在园时光卡片 | Kindergarten Moment Card | parent_moment_card | db_moment + db_moment_upload + db_teacher + db_file | moment_id (runtime) | 0:k | 0 | NONE |

dynamic_rule (动态规则) = 班级、教师、活动标题、日期时间、观察文本、图片、周更新次数、幼儿参与状态和 moment_id 均来自授权接口结果；页面卡片当前不可点击


[PAGE_OBJECT]

家长在园时光首页 (Parent Moment Home / db_parent_moment_home)

parent_moment_home_id (家长在园时光首页ID), 1:1, integer, ui=parent_moment_home.page
parent_id (当前家长ID), 1:1, integer, ui=context.hidden
parent_child_id (家长幼儿关系ID), 1:1, integer, ui=context.hidden
child_id (当前幼儿ID), 1:1, integer, ui=context.hidden
school_id (当前园所ID), 1:1, integer, ui=context.hidden
class_id (当前班级ID), 1:1, integer, ui=context.hidden
teacher_id (发布教师ID), 0:k, integer, ui=parent_moment_home.card.publisher
moment_id (在园时光ID), 0:k, integer, ui=parent_moment_home.card
moment_upload_id (幼儿时光上传ID), 0:k, integer, ui=parent_moment_home.card.participation

rel_count (关系数量) = 8
rel_db (关联表) = db_parent, db_parent_child, db_child, db_school, db_class, db_teacher, db_moment, db_moment_upload
rel_map (关系字段) = db_parent_moment_home{parent_id}<->db_parent{parent_id}; db_parent_moment_home{parent_child_id}<->db_parent_child{parent_child_id}; db_parent_moment_home{child_id}<->db_child{child_id}; db_parent_moment_home{school_id}<->db_school{school_id}; db_parent_moment_home{class_id}<->db_class{class_id}; db_parent_moment_home{teacher_id}<->db_teacher{teacher_id}; db_parent_moment_home{moment_id}<->db_moment{moment_id}; db_parent_moment_home{moment_upload_id}<->db_moment_upload{moment_upload_id}
persist (是否持久化) = 0
object_type (对象类型) = aggregate

method (方法):
moment_list = db_moment FILTER(school_id=current_school_id, class_id=current_class_id, publish_status=s2) ORDER BY moment_date DESC
child_participation = LEFT JOIN db_moment_upload ON moment_id AND child_id=current_child_id
weekly_update_count = COUNT(moment_list WHERE moment_date in current local week)
participated_week_count = COUNT(DISTINCT moment_id WHERE EXISTS db_moment_upload(moment_id, child_id=current_child_id) AND moment_date in current local week)
IF no moment row, moment_list=[] AND weekly_update_count=0 AND participated_week_count=0


[REUSED_OBJECT_USAGE]

db_moment|db_moment_upload = REUSE Teacher/01 home-spec.md; Teacher App writes and Parent App reads the same records
db_school|db_teacher|db_class|db_child|db_file = REUSE Teacher canonical definitions
db_parent|db_parent_child = REUSE Parent/home-spec.md
parent_app_moment_copy (家长端时光副本表) = FORBIDDEN


[EMPTY_STATE]

IF allowed_child_count=0, show_page_empty=1, empty_title=暂无关联幼儿
IF moment_count=0, show_moment_empty=1, moment_empty_title=暂无在园时光, empty_description=教师发布班级活动后将在这里显示
weekly_update_count_without_data=0
participated_week_count_without_data=0
Mock moment|teacher|child|class|date|image|count|participation MUST NOT be returned in production


[NAV_OBJECTS]

nav_parent_home|nav_parent_tasks|nav_parent_moments|nav_parent_child_profile = REUSE home-spec.md with identical node_key and resolved App-root route; page-local href may be relative


[JUMP_VALIDATION]

IF current_child_id NOT_IN allowed_child_id, return 403
IF any moment query includes school_id != current_school_id OR class_id != current_class_id, return 403
IF moment_id NOT_FOUND, return 404
IF db_moment.publish_status=s1|deleted, return 403
IF db_moment_upload.child_id != current_child_id, omit child-specific upload and do not disclose it
client supplied parent_id|child_id|school_id|class_id MUST be ignored and re-derived from context
