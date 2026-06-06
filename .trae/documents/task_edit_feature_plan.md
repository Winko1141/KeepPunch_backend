# 任务编辑功能实施计划

## 计划信息

* 创建日期: 2026-06-06

* 功能: 任务编辑功能

* 优先级: 🔴 高优先级

* 状态: 待批准

***

## 一、需求分析

### 1.1 问题描述

当前系统只能创建和终止任务，无法修改已创建的任务信息。用户创建任务后发现设置错误，只能删除重建。

### 1.2 功能需求

1. 在任务详情页添加"编辑"按钮
2. 可编辑字段:

   * 任务名称 (task\_name)

   * 图标 (icon)

   * 重复规则 (repeat\_type)

   * 周规则 (week\_rule)

   * 目标次数 (target\_count)
3. 保存修改时更新数据库
4. 编辑成功后返回任务详情页并刷新数据

### 1.3 现有基础

#### 后端:

* ✅ 已有 PUT `/task/:id` 接口存在，可直接复用

* 接口位于: [task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L205-L251)

#### 前端:

* ✅ [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) 逻辑可复用

* ✅ [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) 已有终止按钮

* ❌ ApiService.kt 缺少 updateTask 接口

* ❌ 导航配置缺少任务详情页到编辑页的 action

***

## 二、约束遵守

### 2.1 后端约束

* ✅ 框架: Koa 3.x

* ✅ 数据库: MySQL + mysql2/promise

* ✅ 路由: @koa/router

* ✅ API 响应格式: {code, msg, data}

* ✅ 任务相关路由前缀: `/task/*`

### 2.2 前端约束

* ✅ 语言: Kotlin

* ✅ UI 框架: Android Jetpack + ViewBinding

* ✅ 网络: Retrofit + OkHttp

* ✅ 导航: Navigation Component

* ✅ 目录结构: 遵循现有规范

***

## 三、技术方案

### 3.1 整体架构

```
任务详情页 (TaskDetailFragment)
    ↓ 点击"编辑"按钮
    ↓ 传递 taskId
任务编辑页 (EditTaskFragment)
    ↓ 预填充任务数据
    ↓ 用户修改
    ↓ 点击保存
    ↓ 调用 PUT /task/:id 接口
    ↓ 返回任务详情页并刷新
```

### 3.2 涉及文件清单

#### 后端: (共 6 个文件)

| 操作 | 文件路径                                                                                                   | 说明                                      |
| -- | ------------------------------------------------------------------------------------------------------ | --------------------------------------- |
| 新增 | `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\home\EditTaskFragment.kt`         | 任务编辑页面                                  |
| 新增 | `d:\xm\KeepPunch_frontend\app\src\main\res\layout\fragment_edit_task.xml`                              | 编辑页布局 (复用 bottom\_sheet\_add\_task.xml) |
| 修改 | `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\ui\taskDetail\TaskDetailFragment.kt` | 添加编辑按钮和导航逻辑                             |
| 修改 | `d:\xm\KeepPunch_frontend\app\src\main\res\layout\fragment_task_detail.xml`                            | 添加编辑按钮                                  |
| 修改 | `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\network\ApiService.kt`               | 添加 updateTask 接口                        |
| 修改 | `d:\xm\KeepPunch_frontend\app\src\main\res\navigation\mobile_navigation.xml`                           | 添加导航 action                             |

***

## 四、详细实施步骤

### 步骤 1: 新增 EditTaskFragment

#### 1.1 任务分析

[AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) 已具备完整的:

* 图标选择器

* 三种重复模式切换 (Tab 布局

* 周定期/周次数/月次数 UI 组件

* 表单验证

#### 1.2 EditTaskFragment 差异点

| 功能点  | AddTaskFragment   | EditTaskFragment | <br /> |
| ---- | ----------------- | ---------------- | :----- |
| 页面标题 | "新建目标"            | "编辑任务"           | <br /> |
| 按钮文本 | "保存"              | "保存"             | "保存"   |
| 初始化  | 空表单               | 预填充任务数据          | <br /> |
| 提交接口 | POST /task/create | PUT /task/:id    | <br /> |
| 返回逻辑 | 返回首页              | 返回详情页            | <br /> |

#### 1.3 数据预填充逻辑

从 Bundle 接收 taskId → 从接口获取任务详情 → 解析任务数据并填充:

```kotlin
// 1. 解析 week_rule: "1,2,3" → [1, 2, 3] → 选中周一至周三

// 2. repeat_type 1 对应:
//   - 1 → WEEK_FIXED
//   - 2 → WEEK_COUNT
//   - 3 → MONTH_COUNT

// 3. target_count:
//   - WEEK_COUNT → weekCount
//   - MONTH_COUNT → monthCount
```

### 步骤 2: 新增布局文件

复用 bottom\_sheet\_add\_task.xml

创建 fragment\_edit\_task.xml

复用现有布局，无需修改

### 步骤 3: 修改 TaskDetailFragment.kt

#### 3.1 添加编辑按钮

在 \`onViewCreated 中:

```kotlin
// 在 btn_terminate 上方添加 btn_edit 点击事件:
view.findViewById<Button>(R.id.btn_edit).setOnClickListener {
    val bundle = Bundle()
    bundle.putString("taskId", taskId.toString()
    findNavController().navigate(
        R.id.action_taskDetailFragment_to_editTaskFragment, bundle
    )
}
```

#### 3.2 处理返回时刷新

EditTaskFragment 成功后返回 TaskDetailFragment 在 onViewCreated 中接收返回时刷新数据

### 步骤 4: 修改 fragment\_task\_detail.xml

在终止按钮上方添加编辑按钮:

```xml
<Button
    android:id="@+id/btn_edit"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginTop="16dp"
    android:text="编辑任务"
    android:textColor="#FFFFFF"
    android:background="@drawable/bg_button_orange_rounded"/>

<Button
    android:id="@+id/btn_terminate"
    ...
```

### 步骤 5: 修改 ApiService.kt

添加更新任务接口:

```kotlin
@PUT("task/{id}")
suspend fun updateTask(
    @Path("id") id: Int,
    @Body request: CreateTaskRequest
): Response<ApiResponse<Any>>
```

注意: CreateTaskRequest 字段与后端 PUT 接口需求一致

### 步骤 6: 修改 mobile\_navigation.xml

在 taskDetailFragment 中添加:

```xml
<action
    android:id="@+id/action_taskDetailFragment_to_editTaskFragment"
    app:destination="@+id/editTaskFragment" />
```

添加 editTaskFragment 节点:

```xml
<fragment
    android:id="@+id/editTaskFragment"
    android:name="com.example.keeppunch.ui.home.EditTaskFragment"
    android:label="编辑任务"
    tools:layout="@layout/fragment_edit_task" />
```

***

## 五、数据流

### 5.1 创建任务 (POST /task/create

```json
{
    "task_name": "跑步",
    "icon": "running",
    "repeat_type": 1,
    "week_rule": "1,3,5",
    "target_count": 0
}
```

### 5.2 更新任务 (PUT /task/:id

```json
{
    "task_name": "跑步",
    "icon": "exercise",
    "repeat_type": 2,
    "week_rule": "",
    "target_count": 3
}
```

响应格式:

```json
{
    "code": 200,
    "msg": "更新成功",
    "data": null
}
```

***

## 六、测试验证

### 6.1 测试场景

| 场景            | 预期结果         |
| ------------- | ------------ |
| 点击任务详情页显示编辑按钮 | ✅ 按钮可见       |
| 点击编辑按钮跳转到编辑页  | ✅ 页面跳转，数据预填充 |
| 周定期任务编辑周规则    | ✅ 正确选中对应日期   |
| 周次数任务编辑目标次数   | ✅ 正确显示次数     |
| 修改任务名称和图标     | ✅ 更新成功       |
| 修改重复类型        | ✅ 切换到对应 Tab  |
| 保存修改          | ✅ 返回详情页，数据刷新 |
| 空任务名称验证       | ✅ Toast 提示   |
| 网络错误处理        | ✅ Toast 提示   |

### 6.2 自测清单

* [ ] 后端 PUT 接口测试

* [ ] 前端页面跳转正常

* [ ] 数据预填充正确

* [ ] 保存成功

* [ ] 返回刷新

***

## 七、风险与注意事项

### 7.1 风险点

| 风险                                      | 影响                | 缓解措施                                |
| --------------------------------------- | ----------------- | ----------------------------------- |
| week\_rule 解析错误                         | 周定期任务编辑时无法正确选中周规则 | 参考 TaskItem.getSubtitle() 逻辑，确保解析一致 |
| EditTaskFragment 与 AddTaskFragment 代码重复 | 维护成本高             | 抽取公共基类或复用逻辑                         |
| 导航返回刷新                                  | 编辑成功后详情页数据未刷新     | 使用 Navigation 返回时调用 loadTaskDetail  |

### 7.2 约束注意事项

1. 所有网络请求必须使用 suspend + 协程
2. 必须使用 try...catch 处理异常
3. 遵循现有代码风格
4. 资源引用使用 R 文件，禁止硬编码
5. ViewBinding 生命周期正确管理

***

## 八、实施顺序

### 阶段一: 后端验证 (0 改动)

验证现有 PUT 接口可用

### 阶段二: 前端开发

1. 新增 EditTaskFragment.kt
2. 新增 fragment\_edit\_task.xml
3. 修改 fragment\_task\_detail.xml (添加编辑按钮
4. 修改 TaskDetailFragment.kt (添加导航逻辑
5. 修改 ApiService.kt (添加 updateTask 接口
6. 修改 mobile\_navigation.xml (添加导航配置

### 阶段三: 测试验证

1. 单元测试
2. 功能测试
3. 边界情况测试

***

## 九、文件变更总览

### 新增文件 (2 个)

| 文件                       | 说明     |
| ------------------------ | ------ |
| EditTaskFragment.kt      | 任务编辑页面 |
| fragment\_edit\_task.xml | 编辑页布局  |

### 修改文件 (4 个)

| 文件                         | 修改内容             |
| -------------------------- | ---------------- |
| TaskDetailFragment.kt      | 添加编辑按钮和导航        |
| fragment\_task\_detail.xml | 添加编辑按钮 UI        |
| ApiService.kt              | 添加 updateTask 接口 |
| mobile\_navigation.xml     | 添加导航 action      |

***

## 十、参考代码

### 10.1 后端 PUT 接口参考

```javascript
// routes/task.js 第 205-251 行:

router.put('/:id', async (ctx) => {
    // 已有完整实现
    // 支持字段: task_name, icon, repeat_type, week_rule, target_count
})
```

### 10.2 前端 CreateTaskRequest 参考

```kotlin
data class CreateTaskRequest(
    val task_name: String,
    val icon: String,
    val repeat_type: Int,
    val week_rule: String,
    val target_count: Int?
)
```

### 10.3 TaskItem 解析 week\_rule 格式

```kotlin
// week_rule 存储格式: "1,2,3,4,5,6,7"
// 1=周一, 7=周日
// 参考 TaskItem.getSubtitle() 第 20-22 行:
val weekDays = week_rule.split(",").map { it.toInt() }
```

***

## 十一、验收标准

### 功能验收

* [ ] 任务详情页显示"编辑任务"按钮

* [ ] 点击编辑按钮跳转到编辑页

* [ ] 编辑页预填充任务数据

* [ ] 可编辑所有字段

* [ ] 保存成功

* [ ] 返回详情页并刷新

* [ ] 数据与后端一致

### 代码质量验收

* [ ] 遵循约束文档

* [ ] 无编译错误

* [ ] 无运行时崩溃

* [ ] 错误处理完善

