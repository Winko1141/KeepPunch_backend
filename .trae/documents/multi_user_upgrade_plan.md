# 编辑任务提醒功能增加日期选项计划

## 需求概述

在编辑任务（和添加任务）的提醒功能中，增加提醒日期选项，支持三种模式：

1. **单次**：选择具体的年月日日期，只提醒一次
2. **周定期**：选择每周的某些天（周一到周日）定期提醒
3. **每天**：每天都提醒

**关键约束**：提醒日期独立于任务的重复模式（周定期/周次数/月次数）

## 现状分析

### 前端

#### 数据模型

**TaskItem.kt** (当前字段):

* `reminder_time: String?` - 提醒时间 "HH:mm"

* `reminder_enabled: Boolean` - 是否开启提醒

**CreateTaskRequest.kt**:

* `reminder_time: String?`

* `reminder_enabled: Boolean?`

#### UI 布局 (bottom\_sheet\_add\_task.xml)

* 提醒开关 `switch_reminder`

* 时间选择 `tv_reminder_time`

* 没有日期选择组件

#### 逻辑 (EditTaskFragment.kt / AddTaskFragment.kt)

* `initReminder()` - 初始化提醒开关和时间选择

* `showTimePicker()` - 显示时间选择器

* 提交时构造 `CreateTaskRequest`

#### 通知调度 (NotificationHelper.kt)

* `scheduleTaskReminder()` - 根据 `repeat_type` 调度提醒

  * `repeat_type = 1` (周定期): 用 `week_rule` 设置每周特定日期

  * 其他: 每天提醒

### 后端

#### task.js

* 保存/读取 `reminder_time` 和 `reminder_enabled`

* 数据库 task 表字段: `reminder_time`, `reminder_enabled`

## 方案设计

### 数据结构新增字段

#### 提醒类型枚举

```
reminder_type = 1: 单次
reminder_type = 2: 周定期
reminder_type = 3: 每天
```

#### 新增字段

| 字段名                  | 类型      | 说明                                          |
| -------------------- | ------- | ------------------------------------------- |
| `reminder_type`      | Int     | 提醒类型: 1=单次, 2=周定期, 3=每天                     |
| `reminder_date`      | String? | 单次提醒的日期 "yyyy-MM-dd"，仅 reminder\_type=1 时有效 |
| `reminder_week_rule` | String? | 周定期的星期规则 "1,3,5"，仅 reminder\_type=2 时有效     |

### 数据库变更

需要在 task 表新增字段：

```sql
ALTER TABLE task ADD COLUMN reminder_type INT DEFAULT 3;
ALTER TABLE task ADD COLUMN reminder_date VARCHAR(20);
ALTER TABLE task ADD COLUMN reminder_week_rule VARCHAR(50);
```

（默认值 3 表示每天，保持向后兼容）

## 实施步骤

### 步骤 1：后端 - 数据库和 API 适配

#### 修改文件

* `d:\xm\KeepPunch_Backend\routes\task.js`

#### 工作内容

1. 更新 `/task/create` 路由：接收 `reminder_type`, `reminder_date`, `reminder_week_rule` 字段
2. 更新 `/task/:id` (PUT) 路由：更新新字段
3. 更新 `/task/list`, `/task/all`, `/task/:id` (GET) 路由：返回新字段

### 步骤 2：前端 - 数据模型更新

#### 修改文件

* `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\TaskItem.kt`

* `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\CreateTaskRequest.kt`

#### 工作内容

1. 在 `TaskItem` 中新增字段：

   * `reminder_type: Int?`

   * `reminder_date: String?`

   * `reminder_week_rule: String?`

2. 在 `CreateTaskRequest` 中新增字段：

   * `reminder_type: Int?`

   * `reminder_date: String?`

   * `reminder_week_rule: String?`

### 步骤 3：前端 - UI 布局更新

#### 修改文件

* `d:\xm\KeepPunch_frontend\app\src\main\res\layout\bottom_sheet_add_task.xml`

#### 工作内容

在提醒区域 `layout_reminder_time` 下方新增：

1. **提醒类型选择区**：

   * 三个选项：单次 / 周定期 / 每天（RadioButton 或 Tab 样式）

2. **单次提醒日期选择区**：

   * 日期显示和选择按钮（点击弹出 DatePickerDialog）

3. **周定期星期选择区**：

   * 周一到周日的可点击 TextView（可多选）

   * "每天"开关

### 步骤 4：前端 - 添加任务逻辑更新

#### 修改文件

* `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\home\AddTaskFragment.kt`

#### 工作内容

1. 新增变量：

   * `reminderType: Int` (默认 3 = 每天)

   * `reminderDate: String?`

   * `reminderWeekRule: Set<Int>` (选中的星期几 0-6)

2. 新增 `initReminderType()` 初始化方法：

   * 初始化提醒类型选择器

   * 根据选择显示/隐藏单次日期区或周定期星期选择区

3. 新增 `showDatePicker()` 方法：

   * 显示日期选择器，设置提醒日期

4. 修改 `submitTask()`：

   * 构造 `CreateTaskRequest` 时包含新字段

### 步骤 5：前端 - 编辑任务逻辑更新

#### 修改文件

* `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\home\EditTaskFragment.kt`

#### 工作内容

与 AddTaskFragment 相同，另外：

1. 修改 `prefillData()`：

   * 从 `task.reminder_type`, `task.reminder_date`, `task.reminder_week_rule` 填充 UI

   * 处理旧数据（没有这些字段时，默认每天提醒）

### 步骤 6：前端 - 通知调度更新

#### 修改文件

* `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\util\NotificationHelper.kt`

#### 工作内容

1. 修改 `scheduleTaskReminder()`：

   * 不再使用 `repeat_type` 和 `week_rule`

   * 使用新的 `reminder_type`, `reminder_date`, `reminder_week_rule`

2. 新增逻辑：

   * `reminder_type = 1` (单次): 只在指定日期的指定时间提醒一次

   * `reminder_type = 2` (周定期): 根据 `reminder_week_rule` 设置每周提醒

   * `reminder_type = 3` (每天): 每天提醒

3. 向后兼容：

   * 如果 `reminder_type` 为空或无效，保持原有逻辑（使用 `repeat_type`）

## 文件清单

### 必须修改

| 文件路径                                                                                           | 修改类型 | 说明       |
| ---------------------------------------------------------------------------------------------- | ---- | -------- |
| `d:\xm\KeepPunch_Backend\routes\task.js`                                                       | 修改   | 新增字段的读写  |
| `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\TaskItem.kt`           | 修改   | 新增字段     |
| `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\CreateTaskRequest.kt`  | 修改   | 新增字段     |
| `d:\xm\KeepPunch_frontend\app\src\main\res\layout\bottom_sheet_add_task.xml`                   | 修改   | 新增 UI 组件 |
| `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\home\AddTaskFragment.kt`  | 修改   | 逻辑实现     |
| `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\home\EditTaskFragment.kt` | 修改   | 逻辑实现     |
| `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\util\NotificationHelper.kt`  | 修改   | 通知调度逻辑   |

### 数据库变更（手动执行）

```sql
ALTER TABLE task ADD COLUMN reminder_type INT DEFAULT 3;
ALTER TABLE task ADD COLUMN reminder_date VARCHAR(20);
ALTER TABLE task ADD COLUMN reminder_week_rule VARCHAR(50);
```

## 风险与注意事项

1. **向后兼容**：旧数据没有 `reminder_type` 字段，需要在前后端都处理默认值
2. **数据库迁移**：需要执行 ALTER TABLE 语句添加新字段
3. **通知取消逻辑**：`cancelTaskReminder()` 已遍历 day 0-7，无需修改
4. **TaskDetailFragment**：如果详情页显示提醒信息，可能需要同步更新（待确认）

## 验证点

1. 添加任务时选择单次提醒，在指定日期能收到通知
2. 选择周定期提醒，只在选中的星期收到通知
3. 选择每天提醒，每天都能收到通知
4. 编辑任务时能正确显示和修改提醒类型
5. 旧任务（无新字段）仍能正常工作（默认每天提醒）

