# KeepPunch 项目开发计划（更新版）

## 一、项目当前状态调研

### 1. 已完成模块（禁止修改）

#### 后端
| 模块 | 状态 | 文件 |
|------|------|------|
| Koa 框架搭建 | ✅ 完成 | [app.js](file:///d:/xm/KeepPunch_Backend/app.js) |
| MySQL 连接池 | ✅ 完成 | [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js) |
| 测试接口 /test | ✅ 完成 | [app.js](file:///d:/xm/KeepPunch_Backend/app.js#L16-L20) |
| 创建任务接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L5-L52) |
| 查询任务列表接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L54-L162) |
| 查询任务详情接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L164-L203) |
| 更新任务接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L205-L251) |
| 终止任务接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L253-L284) |
| 打卡接口 | ✅ 完成 | [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js#L5-L72) |
| 取消打卡接口 | ✅ 完成 | [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js#L74-L137) |
| 按日期查询记录接口 | ✅ 完成 | [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js#L139-L175) |
| 路由注册 | ✅ 完成 | [app.js](file:///d:/xm/KeepPunch_Backend/app.js#L9-L29) |

#### 前端
| 模块 | 状态 | 文件 |
|------|------|------|
| 项目框架搭建 | ✅ 完成 | Android Studio 模板 |
| Retrofit 网络请求 | ✅ 完成 | [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt) |
| 底部导航栏 | ✅ 完成 | [MainActivity.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/MainActivity.kt) |
| 首页日历视图 | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) |
| 任务列表 UI | ✅ 完成 | [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt) |
| 添加任务页面 | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) |
| 图标硬编码修复 | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) |
| ApiService 扩展 | ✅ 完成 | [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) |
| CreateTaskRequest 模型 | ✅ 完成 | [CreateTaskRequest.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/CreateTaskRequest.kt) |
| ApiResponse 模型 | ✅ 完成 | [ApiResponse.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/ApiResponse.kt) |
| TaskItem 模型 | ✅ 完成 | [TaskItem.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/TaskItem.kt) |
| CheckinRequest 模型 | ✅ 完成 | [CheckinRequest.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/CheckinRequest.kt) |
| IconMapper 工具类 | ✅ 完成 | [IconMapper.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/util/IconMapper.kt) |
| 统计容器 (Tab+ViewPager) | ✅ 完成 | [StatsContainerFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/StatsContainerFragment.kt) |
| 周/月/年报表 UI (Mock数据) | ✅ 完成 | 三个 StatsFragment |
| 任务详情页框架 | ✅ 完成 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) |

### 2. 约束确认
- **包管理器**: pnpm 固定
- **前端语言**: Kotlin（禁止 Java）
- **后端框架**: Koa（禁止 Express）
- **数据库**: MySQL + mysql2/promise（禁止 ORM）
- **API 响应格式**: `{ code, msg, data }`
- **任务删除**: 软删除（status=2）
- **数据库表结构**: 已创建，禁止代码修改

---

## 二、开发阶段划分

### 🔴 第一阶段：核心功能（剩余待开发）
首页任务列表数据对接 + 打卡功能

### 🟡 第二阶段：完整流程
任务详情页对接 + 添加任务成功刷新 + 页面清理

### 🟢 第三阶段：统计功能
统计接口 + 前端统计页面数据对接

---

## 三、第一阶段待开发任务清单

### 模块 6：前端首页功能对接
**目标**: 替换 mock 数据，实现真实的任务列表加载和打卡功能

**涉及文件**:
- [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt)
- [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt)

#### 6.1 HomeFragment 改造
**当前状态**: 使用 mock 数据，`loadTasks` 函数为空

**修改内容**:

1. **添加必要的 import**
```kotlin
import com.example.keeppunch.model.TaskItem
import com.example.keeppunch.model.CheckinRequest
import com.example.keeppunch.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.lifecycle.lifecycleScope
```

2. **添加 ApiService 实例**
```kotlin
private val apiService = RetrofitClient.apiService
```

3. **实现 `loadTasks` 函数**
```kotlin
private fun loadTasks(date: LocalDate) {
    val dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE)
    lifecycleScope.launch {
        try {
            val response = apiService.getTaskList(dateStr)
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.code == 200) {
                    val tasks = body.data ?: emptyList()
                    updateTaskList(tasks)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

4. **实现 `updateTaskList` 函数**
```kotlin
private fun updateTaskList(tasks: List<TaskItem>) {
    val incomplete = tasks.filter { !it.is_finished }
    val complete = tasks.filter { it.is_finished }
    
    binding.rvIncomplete.adapter = TaskAdapter(
        incomplete,
        onTaskClick = { task -> navigateToDetail(task) },
        onCheckinClick = { task -> handleCheckin(task, false) }
    )
    
    binding.rvCompleted.adapter = TaskAdapter(
        complete,
        onTaskClick = { task -> navigateToDetail(task) },
        onCheckinClick = { task -> handleCheckin(task, true) }
    )
}
```

5. **实现 `handleCheckin` 函数**
```kotlin
private fun handleCheckin(task: TaskItem, isAlreadyChecked: Boolean) {
    val dateStr = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)
    val request = CheckinRequest(task.id, dateStr)
    
    lifecycleScope.launch {
        try {
            val response = if (isAlreadyChecked) {
                apiService.cancelCheckin(request)
            } else {
                apiService.checkin(request)
            }
            
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.code == 200) {
                    loadTasks(selectedDate)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

6. **实现 `navigateToDetail` 函数**
```kotlin
private fun navigateToDetail(task: TaskItem) {
    val bundle = Bundle()
    bundle.putString("taskId", task.id.toString())
    findNavController().navigate(R.id.action_navigation_home_to_taskDetailFragment, bundle)
}
```

7. **页面初始化时加载数据**
在 `onViewCreated` 中调用 `loadTasks(selectedDate)`

#### 6.2 TaskAdapter 改造
**当前状态**: 使用 `Task(title, subtitle, isComplete)` 模型

**修改内容**:

1. **修改数据模型**
将 `List<Task>` 改为 `List<TaskItem>`

2. **添加点击事件回调**
```kotlin
class TaskAdapter(
    private val items: List<TaskItem>,
    private val onTaskClick: (TaskItem) -> Unit,
    private val onCheckinClick: (TaskItem) -> Unit
) : RecyclerView.Adapter<RecyclerView.ViewHolder>()
```

3. **修改 getItemViewType**
```kotlin
override fun getItemViewType(position: Int): Int {
    return if (items[position].is_finished) TYPE_COMPLETE else TYPE_INCOMPLETE
}
```

4. **修改 onBindViewHolder**
- 使用 `task.task_name` 作为标题
- 使用 `task.getSubtitle()` 作为副标题
- 使用 `IconMapper.getResIdFromName(task.icon)` 获取图标
- 添加点击事件监听

5. **添加必要的 import**
```kotlin
import com.example.keeppunch.model.TaskItem
import com.example.keeppunch.util.IconMapper
```

#### 6.3 导航配置
**需要确认**: 是否已有 `action_navigation_home_to_taskDetailFragment`

**文件**: `res/navigation/mobile_navigation.xml`

如果不存在，需要添加：
```xml
<action
    android:id="@+id/action_navigation_home_to_taskDetailFragment"
    app:destination="@id/taskDetailFragment" />
```

---

## 四、第二阶段待开发任务清单

### 模块 10：前端任务详情页对接
**目标**: 替换 mock 数据，实现真实的任务详情展示

**文件**: [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt)

**修改内容**:

1. **添加网络请求 import**
```kotlin
import com.example.keeppunch.network.RetrofitClient
import kotlinx.coroutines.launch
import androidx.lifecycle.lifecycleScope
import java.time.format.DateTimeFormatter
```

2. **添加 ApiService 实例**
```kotlin
private val apiService = RetrofitClient.apiService
```

3. **实现 `loadTaskDetail` 函数**
```kotlin
private fun loadTaskDetail(taskId: String) {
    lifecycleScope.launch {
        try {
            val response = apiService.getTaskDetail(taskId.toInt())
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.code == 200) {
                    body.data?.let { task ->
                        updateUI(task)
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

4. **ApiService 需要添加任务详情接口**
```kotlin
@GET("task/{id}")
suspend fun getTaskDetail(@Path("id") id: Int): Response<ApiResponse<TaskItem>>
```

5. **实现 `updateUI` 函数**
- 设置任务名称
- 设置图标
- 设置重复规则
- 加载统计数据

6. **添加终止任务按钮功能**
```kotlin
private fun terminateTask(taskId: Int) {
    lifecycleScope.launch {
        try {
            val response = apiService.terminateTask(taskId)
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.code == 200) {
                    findNavController().popBackStack()
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

7. **ApiService 需要添加终止任务接口**
```kotlin
@DELETE("task/{id}")
suspend fun terminateTask(@Path("id") id: Int): Response<ApiResponse<Any>>
```

### 模块 11：前端添加任务成功后刷新
**目标**: 创建任务成功后自动返回首页并刷新

**文件**: [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt)

**当前状态**: `submitTask` 函数已有，但可能没有返回刷新

**修改内容**:

1. **在 `submitTask` 成功后添加**
```kotlin
if (body?.code == 200) {
    Toast.makeText(requireContext(), "创建成功", Toast.LENGTH_SHORT).show()
    findNavController().popBackStack()
}
```

### 模块 12：清理无用的 Dashboard 页面
**目标**: 删除不需要的页面，简化导航

**删除文件**:
- [DashboardFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardFragment.kt)
- [DashboardViewModel.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardViewModel.kt)

**可能需要删除的资源文件**:
- `res/layout/fragment_dashboard.xml`

**修改文件**:
- `res/menu/bottom_nav_menu.xml` - 删除 Dashboard 菜单项
- `res/navigation/mobile_navigation.xml` - 删除 Dashboard 导航配置

---

## 五、第三阶段待开发任务清单

### 模块 13：后端统计接口
**目标**: 提供周/月/年统计数据接口

**新建文件**: `routes/stats.js`

**需要实现的接口**:

#### 13.1 周统计
```
GET /stats/week?date=2026-06-05
```

**响应数据**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "task_id": 1,
      "task_name": "跑步",
      "week_days": [true, true, false, true, true, false, true]
    }
  ]
}
```

**业务逻辑**:
1. 获取指定日期所在周的所有日期
2. 查询每个任务在该周的打卡记录
3. 按周一到周日排序返回

#### 13.2 月统计
```
GET /stats/month?date=2026-06-05
```

**响应数据**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "task_id": 1,
      "task_name": "跑步",
      "month_days": [1, 5, 10, 15, 20, 25, 30]
    }
  ]
}
```

**业务逻辑**:
1. 获取指定日期所在月份的所有打卡记录
2. 按任务分组
3. 返回每个任务的打卡日期列表

#### 13.3 年统计
```
GET /stats/year?year=2026
```

**响应数据**:
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "task_id": 1,
      "task_name": "跑步",
      "months": [
        {"month": 1, "days": [1,5,10]},
        {"month": 2, "days": [2,8,15,22]},
        ...
      ]
    }
  ]
}
```

#### 13.4 任务完成率（可选）
```
GET /stats/rate/:taskId
```

**响应数据**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "total_count": 100,
    "current_streak": 5,
    "max_streak": 15
  }
}
```

#### 13.5 路由注册
在 `app.js` 中添加：
```javascript
const statsRouter = require('./routes/stats');
app.use(statsRouter.routes());
app.use(statsRouter.allowedMethods());
```

### 模块 14：前端统计页面数据对接
**目标**: 替换 mock 数据，实现真实的统计展示

**涉及文件**:
- [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt)
- [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt)
- [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt)

#### 14.1 ApiService 扩展
```kotlin
@GET("stats/week")
suspend fun getWeekStats(@Query("date") date: String): Response<ApiResponse<List<WeekTaskStat>>>

@GET("stats/month")
suspend fun getMonthStats(@Query("date") date: String): Response<ApiResponse<List<MonthStatItem>>>

@GET("stats/year")
suspend fun getYearStats(@Query("year") year: Int): Response<ApiResponse<List<YearTaskItem>>>
```

#### 14.2 WeekStatsFragment 改造
**当前状态**: `loadWeekData` 使用 mock 数据

**修改内容**:
1. 添加网络请求 import
2. 添加 ApiService 实例
3. 实现 `loadWeekData` 从后端获取数据
4. 切换周时重新加载

#### 14.3 MonthStatsFragment 改造
类似 WeekStatsFragment

#### 14.4 YearStatsFragment 改造
类似 WeekStatsFragment

---

## 六、文件变更总览

### 后端新增文件
| 文件 | 模块 |
|------|------|
| `routes/stats.js` | 统计接口 |

### 后端修改文件
| 文件 | 修改内容 |
|------|----------|
| [app.js](file:///d:/xm/KeepPunch_Backend/app.js) | 注册 stats 路由（第三阶段） |

### 前端新增文件
| 文件 | 说明 |
|------|------|
| （无） | 所有模型类已存在 |

### 前端修改文件
| 文件 | 修改内容 | 阶段 |
|------|----------|------|
| [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | 新增任务详情、终止任务、统计接口 | 第二、三阶段 |
| [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) | 数据对接 + 打卡功能 | 第一阶段 |
| [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt) | 改造模型 + 点击事件 | 第一阶段 |
| [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 数据对接 | 第二阶段 |
| [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) | 创建成功后返回刷新 | 第二阶段 |
| `res/navigation/mobile_navigation.xml` | 添加首页到详情页的导航 | 第一阶段 |
| `res/menu/bottom_nav_menu.xml` | 删除 Dashboard 菜单项 | 第二阶段 |
| [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) | 数据对接 | 第三阶段 |
| [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) | 数据对接 | 第三阶段 |
| [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) | 数据对接 | 第三阶段 |

### 前端删除文件
- [DashboardFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardFragment.kt)（第二阶段）
- [DashboardViewModel.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardViewModel.kt)（第二阶段）

---

## 七、开发顺序

### 建议执行顺序
1. **第一阶段**: 模块 6（首页功能对接）
2. **第二阶段**: 模块 10 → 模块 11 → 模块 12
3. **第三阶段**: 模块 13 → 模块 14

### 第一阶段详细步骤
```
1. 检查导航配置（mobile_navigation.xml）
2. 改造 TaskAdapter（模型 + 点击事件）
3. 改造 HomeFragment（数据加载 + 打卡功能）
4. 后端自测：启动服务，验证所有接口可用
5. 前端自测：Android Studio 构建，验证功能
```

---

## 八、自测校验规则

### 后端自测
| 步骤 | 命令/操作 | 预期结果 |
|------|----------|----------|
| 安装依赖 | `pnpm install` | 无报错 |
| 启动服务 | `pnpm run dev` | 显示 "server running on port 3000" |
| 测试连接 | `Invoke-RestMethod http://localhost:3000/test` | 返回 `{ "msg": "后端连接成功" }` |
| 创建任务 | POST `/task/create` | 返回 `code=200` |
| 查询列表 | GET `/task/list?date=2026-06-05` | 返回任务数组 |
| 打卡 | POST `/record/checkin` | 返回 `code=200` |
| 重复打卡 | 再次 POST | 返回 `code=400` |
| 取消打卡 | DELETE `/record/checkin` | 返回 `code=200` |

### 前端自测（第一阶段）
| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 构建项目 | Android Studio Build | 无编译错误 |
| 启动应用 | 模拟器运行 | 首页正常显示 |
| 切换日期 | 点击日历日期 | 任务列表刷新 |
| 点击任务卡片 | 未完成任务 | 跳转到详情页 |
| 点击打卡图标 | 未完成任务 | 图标变为完成状态，任务移到已完成列表 |
| 点击完成图标 | 已完成任务 | 图标变为未完成状态，任务移到未完成列表 |

### 数据库验证
```sql
-- 查看任务表
SELECT * FROM task;

-- 查看打卡记录
SELECT * FROM record;

-- 查看统计表
SELECT * FROM task_count;
```

---

## 九、风险与注意事项

### 风险点
1. **导航配置缺失**: 可能没有 `action_navigation_home_to_taskDetailFragment`
2. **TaskAdapter 类型不匹配**: 需要从 `Task` 改为 `TaskItem`
3. **协程作用域**: 确保使用正确的 lifecycleScope
4. **Android 模拟器网络**: IP 变化需手动更新 RetrofitClient

### 注意事项
- 所有 SQL 必须使用参数化查询，禁止字符串拼接
- 禁止修改 constraint.md 中标记为"不可修改"的文件
- 禁止引入新依赖（后端）
- 前端所有网络请求必须使用 suspend + 协程
- 首页 loadTasks 在日期切换和页面初始化时都要调用

---

## 十、确认项

本方案已明确：
- ✅ 开发模块拆分（按阶段）
- ✅ 前后端开发顺序
- ✅ 数据库无变更（仅使用现有三张表）
- ✅ 自测校验规则
- ✅ 已完成/待开发模块清晰区分

请确认后开始执行第一阶段开发。
