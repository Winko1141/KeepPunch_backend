# KeepPunch 项目执行计划（V2）

## 一、项目当前状态调研总结

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

#### 前端
| 模块 | 状态 | 文件 |
|------|------|------|
| 项目框架搭建 | ✅ 完成 | Android Studio 模板 |
| Retrofit 网络请求 | ✅ 完成 | [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt) |
| 底部导航栏（仅保留首页+统计） | ✅ 完成 | [bottom_nav_menu.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/menu/bottom_nav_menu.xml) |
| 首页日历视图 | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) |
| **首页任务列表数据对接** | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt#L176-L192) |
| **TaskAdapter 改造（TaskItem模型+点击事件）** | ✅ 完成 | [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt) |
| **打卡/取消打卡功能** | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt#L211-L233) |
| 添加任务页面（含图标选择） | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) |
| **添加任务成功后返回** | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt#L323-L338) |
| 导航配置（首页→详情页） | ✅ 完成 | [mobile_navigation.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/navigation/mobile_navigation.xml) |
| 统计容器 (Tab+ViewPager) | ✅ 完成 | [StatsContainerFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/StatsContainerFragment.kt) |
| 周/月/年报表 UI（Mock数据） | ✅ 完成 | 三个 StatsFragment |
| 任务详情页框架 | ✅ 完成 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) |
| 数据模型类（TaskItem/WeekTaskStat/MonthStatItem/YearTaskItem） | ✅ 完成 | model/ 目录 |

### 2. 待开发功能确认

根据 `todo.md` 和代码实际状态，**剩余待开发**：

#### 🔴 高优先级（立即开发）
| 序号 | 功能 | 说明 |
|------|------|------|
| 1 | 后端统计接口 | 周/月/年统计接口尚未实现（routes/stats.js 不存在） |
| 2 | 前端 ApiService 扩展 | 缺失任务详情、终止任务、统计接口定义 |
| 3 | 前端任务详情页对接 | 当前使用 mock 数据（loadFakeStats），需对接真实接口 |

#### 🟡 中优先级（次高）
| 序号 | 功能 | 说明 |
|------|------|------|
| 4 | 前端周统计页面对接 | WeekStatsFragment 使用 mock 数据 |
| 5 | 前端月统计页面对接 | MonthStatsFragment 使用 mock 数据 |
| 6 | 前端年统计页面对接 | YearStatsFragment 使用 mock 数据 |
| 7 | 清理无用 Dashboard 页面 | DashboardFragment.kt 等文件需删除 |

---

## 二、约束确认

### 不可修改文件
| 文件 | 原因 |
|------|------|
| [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js) | 数据库连接配置，可修改连接信息但不可改导出方式 |
| [HttpClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/HttpClient.kt) | OkHttp 客户端单例配置 |
| 数据库表结构 | 已在 MySQL 中创建，如需变更需手动执行 SQL |

### 技术栈约束
- **包管理器**: pnpm 固定
- **前端语言**: Kotlin（禁止 Java）
- **后端框架**: Koa（禁止 Express）
- **数据库**: MySQL + mysql2/promise（禁止 ORM）
- **API 响应格式**: `{ code, msg, data }`

### 目录锁定
- 后端目录结构不可改名：`db/`, `routes/`, `app.js`
- 前端目录结构不可改名：`network/`, `model/`, `response/` 等

### 禁用依赖
- 后端禁止引入新依赖
- 前端禁止引入新依赖（使用现有 Retrofit + OkHttp + Gson + MPAndroidChart）

---

## 三、开发优先级（按需求截止时间排序）

### 开发顺序
```
🔴 高优先级 → 🟡 中优先级
```

### 详细开发步骤

#### 第一步：后端统计接口
| 任务 | 文件 | 优先级 |
|------|------|--------|
| 1.1 创建 routes/stats.js | 新建 | 🔴 高 |
| 1.2 实现周统计接口 GET /stats/week | stats.js | 🔴 高 |
| 1.3 实现月统计接口 GET /stats/month | stats.js | 🔴 高 |
| 1.4 实现年统计接口 GET /stats/year | stats.js | 🔴 高 |
| 1.5 实现任务完成率接口 GET /stats/rate/:taskId | stats.js | 🔴 高 |
| 1.6 注册 stats 路由到 app.js | app.js | 🔴 高 |

#### 第二步：前端 ApiService 扩展
| 任务 | 文件 | 优先级 |
|------|------|--------|
| 2.1 添加任务详情接口 GET task/:id | [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | 🔴 高 |
| 2.2 添加终止任务接口 DELETE task/:id | ApiService.kt | 🔴 高 |
| 2.3 添加周统计接口 GET stats/week | ApiService.kt | 🔴 高 |
| 2.4 添加月统计接口 GET stats/month | ApiService.kt | 🔴 高 |
| 2.5 添加年统计接口 GET stats/year | ApiService.kt | 🔴 高 |
| 2.6 添加任务完成率接口 GET stats/rate/:taskId | ApiService.kt | 🔴 高 |

#### 第三步：前端任务详情页对接
| 任务 | 文件 | 优先级 |
|------|------|--------|
| 3.1 实现 loadTaskDetail 从后端获取数据 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 🔴 高 |
| 3.2 实现 updateUI 展示任务详情 | TaskDetailFragment.kt | 🔴 高 |
| 3.3 实现日历打卡状态显示（替换 isCheckedIn mock） | TaskDetailFragment.kt | 🔴 高 |
| 3.4 实现终止任务按钮功能 | TaskDetailFragment.kt | 🔴 高 |
| 3.5 可能需要新增数据模型类（TaskStats/TaskDetailResponse） | model/ 目录 | 🔴 高 |

#### 第四步：前端统计页面对接
| 任务 | 文件 | 优先级 |
|------|------|--------|
| 4.1 WeekStatsFragment 对接周统计接口 | [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) | 🟡 中 |
| 4.2 MonthStatsFragment 对接月统计接口 | [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) | 🟡 中 |
| 4.3 YearStatsFragment 对接年统计接口 | [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) | 🟡 中 |

#### 第五步：清理无用页面
| 任务 | 文件 | 优先级 |
|------|------|--------|
| 5.1 删除 DashboardFragment.kt | ui/dashboard/ | 🟡 中 |
| 5.2 删除 DashboardViewModel.kt | ui/dashboard/ | 🟡 中 |
| 5.3 确认 fragment_dashboard.xml 是否已删除 | layout/ | 🟡 中 |
| 5.4 清理导航配置中残留的 Dashboard 相关 | mobile_navigation.xml | 🟡 中 |

---

## 四、详细实现方案

### 模块 1：后端统计接口

#### 1.1 新建 routes/stats.js

**接口设计**：

##### 1.1.1 周统计接口
```
GET /stats/week?date=2026-06-05
```

**响应格式**：
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

**业务逻辑**：
1. 获取指定日期所在周的所有日期（周一到周日）
2. 查询所有有效任务（status=1）
3. 对每个任务，查询该周的打卡记录
4. 按周一到周日排序返回布尔数组

**SQL 思路**：
```sql
-- 获取指定周的所有打卡记录
SELECT r.task_id, r.record_date 
FROM record r
JOIN task t ON r.task_id = t.id
WHERE t.status = 1
  AND r.record_date >= ?  -- 周一开始
  AND r.record_date <= ?  -- 周日结束
```

##### 1.1.2 月统计接口
```
GET /stats/month?date=2026-06-05
```

**响应格式**：
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

**业务逻辑**：
1. 获取指定日期所在月份的所有打卡记录
2. 按任务分组
3. 返回每个任务的打卡日期列表（日数字）

##### 1.1.3 年统计接口
```
GET /stats/year?year=2026
```

**响应格式**：
```json
{
  "code": 200,
  "msg": "success",
  "data": [
    {
      "task_id": 1,
      "task_name": "跑步",
      "total_days": 120,
      "months": [
        {"month": 1, "days": [1,5,10]},
        {"month": 2, "days": [2,8,15,22]},
        ...
      ]
    }
  ]
}
```

**业务逻辑**：
1. 获取指定年份所有打卡记录
2. 按任务和月份分组
3. 返回每个任务的各月打卡情况

##### 1.1.4 任务完成率接口
```
GET /stats/rate/:taskId
```

**响应格式**：
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

**业务逻辑**：
1. total_count: 该任务历史总打卡天数
2. current_streak: 当前连续打卡天数（从今天往前数连续日期）
3. max_streak: 历史最长连续打卡天数

#### 1.2 注册路由到 app.js

在 `app.js` 中添加：
```javascript
const statsRouter = require('./routes/stats');
app.use(statsRouter.routes());
app.use(statsRouter.allowedMethods());
```

---

### 模块 2：前端 ApiService 扩展

#### 2.1 新增接口定义

在 [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) 中添加：

```kotlin
@GET("task/{id}")
suspend fun getTaskDetail(@Path("id") id: Int): Response<ApiResponse<TaskItem>>

@DELETE("task/{id}")
suspend fun terminateTask(@Path("id") id: Int): Response<ApiResponse<Any>>

@GET("stats/week")
suspend fun getWeekStats(@Query("date") date: String): Response<ApiResponse<List<WeekTaskStat>>>

@GET("stats/month")
suspend fun getMonthStats(@Query("date") date: String): Response<ApiResponse<List<MonthStatItem>>>

@GET("stats/year")
suspend fun getYearStats(@Query("year") year: Int): Response<ApiResponse<List<YearTaskItem>>>

@GET("stats/rate/{taskId}")
suspend fun getTaskStats(@Path("taskId") taskId: Int): Response<ApiResponse<TaskStats>>
```

#### 2.2 可能需要新增的数据模型

**TaskStats.kt**（用于任务详情页统计数据）：
```kotlin
data class TaskStats(
    val total_count: Int,
    val current_streak: Int,
    val max_streak: Int
)
```

**注意**：需要确认 WeekTaskStat、MonthStatItem、YearTaskItem 字段名是否与后端响应一致。

---

### 模块 3：前端任务详情页对接

#### 3.1 改造 [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt)

**当前问题**：
- 使用 `loadFakeStats()` 返回 mock 数据
- `isCheckedIn()` 使用 mock 逻辑（偶数日打卡）
- 没有终止任务按钮功能

**改造内容**：

##### 3.1.1 添加必要的 import 和成员变量
```kotlin
import com.example.keeppunch.network.RetrofitClient
import com.example.keeppunch.model.TaskItem
import com.example.keeppunch.model.TaskStats
import kotlinx.coroutines.launch
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import android.widget.Button
import android.widget.ImageView
```

##### 3.1.2 添加 ApiService 实例
```kotlin
private val apiService = RetrofitClient.apiService
private var taskId: Int = 0
private var task: TaskItem? = null
private var checkedInDates: Set<LocalDate> = emptySet()
```

##### 3.1.3 实现 loadTaskDetail 函数
```kotlin
private fun loadTaskDetail(taskIdStr: String) {
    taskId = taskIdStr.toIntOrNull() ?: return
    
    lifecycleScope.launch {
        try {
            // 并行请求任务详情和统计数据
            val detailResponse = apiService.getTaskDetail(taskId)
            val statsResponse = apiService.getTaskStats(taskId)
            
            if (detailResponse.isSuccessful && detailResponse.body()?.code == 200) {
                task = detailResponse.body()?.data
            }
            
            var stats: TaskStats? = null
            if (statsResponse.isSuccessful && statsResponse.body()?.code == 200) {
                stats = statsResponse.body()?.data
            }
            
            // 加载该月打卡记录用于日历显示
            loadMonthCheckinDates()
            
            task?.let { updateUI(it, stats) }
            
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

##### 3.1.4 实现 updateUI 函数
```kotlin
private fun updateUI(task: TaskItem, stats: TaskStats?) {
    // 设置任务名称
    view?.findViewById<TextView>(R.id.tv_task_name)?.text = task.task_name
    
    // 设置图标
    val iconRes = IconMapper.getResIdFromName(task.icon)
    view?.findViewById<ImageView>(R.id.iv_task_icon)?.setImageResource(iconRes)
    
    // 设置重复规则
    view?.findViewById<TextView>(R.id.tv_repeat_rule)?.text = task.getSubtitle()
    
    // 设置统计数据
    stats?.let {
        view?.findViewById<TextView>(R.id.tv_total_count)?.text = it.total_count.toString()
        view?.findViewById<TextView>(R.id.tv_streak_days)?.text = it.current_streak.toString()
        view?.findViewById<TextView>(R.id.tv_max_streak)?.text = it.max_streak.toString()
    }
}
```

##### 3.1.5 实现 loadMonthCheckinDates 函数
```kotlin
private fun loadMonthCheckinDates() {
    // 可以使用 /record/date/:date 接口，但需要获取整月数据
    // 或者直接使用月统计接口
    // 简化方案：在切换月份时重新加载
}
```

##### 3.1.6 改造 isCheckedIn 函数
```kotlin
private fun isCheckedIn(date: LocalDate): Boolean {
    return checkedInDates.contains(date)
}
```

##### 3.1.7 实现终止任务功能
```kotlin
private fun setupTerminateButton() {
    view?.findViewById<Button>(R.id.btn_terminate)?.setOnClickListener {
        AlertDialog.Builder(requireContext())
            .setTitle("确认终止")
            .setMessage("终止后该任务将不再显示，确认终止？")
            .setPositiveButton("确认") { _, _ ->
                terminateTask()
            }
            .setNegativeButton("取消", null)
            .show()
    }
}

private fun terminateTask() {
    lifecycleScope.launch {
        try {
            val response = apiService.terminateTask(taskId)
            if (response.isSuccessful && response.body()?.code == 200) {
                Toast.makeText(requireContext(), "任务已终止", Toast.LENGTH_SHORT).show()
                findNavController().popBackStack()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
```

**注意**：需要确认 layout 中是否有 `btn_terminate` 按钮。

---

### 模块 4：前端统计页面对接

#### 4.1 WeekStatsFragment 改造

**当前代码**：
```kotlin
private fun loadWeekData(date: LocalDate, recyclerView: RecyclerView) {
    // 这里先用 mock，之后你可以接数据库
    val mockData = listOf(
        WeekTaskStat("跑步", listOf(true, true, false, true, true, false, true)),
        WeekTaskStat("阅读", listOf(true, false, true, true, true, true, true)),
        WeekTaskStat("背单词", listOf(false, false, true, false, true, false, true))
    )
    recyclerView.adapter = WeekStatAdapter(mockData)
}
```

**改造内容**：
1. 添加 `apiService` 实例
2. 使用 `lifecycleScope.launch` 调用 `getWeekStats`
3. 注意 WeekTaskStat 字段名是否与后端一致

#### 4.2 MonthStatsFragment 改造

类似 WeekStatsFragment，注意：
- 调用 `getMonthStats`
- MonthStatItem 可能需要调整字段以匹配后端响应
- 切换月份时重新加载

#### 4.3 YearStatsFragment 改造

类似 WeekStatsFragment，注意：
- 调用 `getYearStats(year: Int)`
- YearTaskItem 可能需要调整字段
- 切换年份时重新加载

---

### 模块 5：清理无用 Dashboard 页面

**待删除文件**：
- [DashboardFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardFragment.kt)
- [DashboardViewModel.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardViewModel.kt)
- `res/layout/fragment_dashboard.xml`（如果存在）

**需要检查的文件**：
- `mobile_navigation.xml` - 确认是否已删除 Dashboard 相关配置
- `bottom_nav_menu.xml` - 已确认无 Dashboard 菜单项

---

## 五、文件变更总览

### 后端新增文件
| 文件 | 模块 |
|------|------|
| `routes/stats.js` | 统计接口 |

### 后端修改文件
| 文件 | 修改内容 |
|------|----------|
| [app.js](file:///d:/xm/KeepPunch_Backend/app.js) | 注册 stats 路由 |

### 前端新增文件
| 文件 | 说明 |
|------|------|
| `model/TaskStats.kt` | 任务统计数据模型（可能需要） |

### 前端修改文件
| 文件 | 修改内容 | 优先级 |
|------|----------|--------|
| [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | 新增任务详情、终止任务、统计接口 | 🔴 高 |
| [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 数据对接 + 终止任务功能 | 🔴 高 |
| [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) | 数据对接 | 🟡 中 |
| [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) | 数据对接 | 🟡 中 |
| [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) | 数据对接 | 🟡 中 |

### 前端删除文件
| 文件 | 说明 |
|------|------|
| `ui/dashboard/DashboardFragment.kt` | 无用页面 |
| `ui/dashboard/DashboardViewModel.kt` | 随同 Dashboard 删除 |
| `layout/fragment_dashboard.xml` | 随同 Dashboard 删除 |

---

## 六、开发执行顺序

### 第一轮：高优先级（核心功能）
```
1. 后端 stats.js 接口开发
2. 后端 app.js 注册路由
3. 前端 ApiService 扩展
4. 前端 TaskDetailFragment 对接
```

### 第二轮：中优先级（统计功能）
```
5. 前端 WeekStatsFragment 对接
6. 前端 MonthStatsFragment 对接
7. 前端 YearStatsFragment 对接
```

### 第三轮：清理
```
8. 删除 Dashboard 相关文件
```

---

## 七、自测校验规则

### 后端自测
| 步骤 | 命令/操作 | 预期结果 |
|------|----------|----------|
| 安装依赖 | `pnpm install` | 无报错 |
| 启动服务 | `pnpm run dev` | 显示 "server running on port 3000" |
| 周统计测试 | `Invoke-RestMethod "http://localhost:3000/stats/week?date=2026-06-05"` | 返回任务周统计数组 |
| 月统计测试 | `Invoke-RestMethod "http://localhost:3000/stats/month?date=2026-06-05"` | 返回任务月统计数组 |
| 年统计测试 | `Invoke-RestMethod "http://localhost:3000/stats/year?year=2026"` | 返回任务年统计数组 |
| 任务详情测试 | `Invoke-RestMethod "http://localhost:3000/task/1"` | 返回任务详情 |
| 任务统计测试 | `Invoke-RestMethod "http://localhost:3000/stats/rate/1"` | 返回 total_count/current_streak/max_streak |

### 前端自测
| 步骤 | 操作 | 预期结果 |
|------|------|----------|
| 构建项目 | Android Studio Build | 无编译错误 |
| 首页功能 | 切换日期、点击任务、打卡 | 功能正常（已完成） |
| 任务详情 | 点击首页任务卡片 | 正确显示任务详情和统计数据 |
| 终止任务 | 详情页点击终止按钮 | 确认对话框→终止成功→返回首页 |
| 周统计 | 切换到报表页→周统计 Tab | 显示真实数据 |
| 月统计 | 切换月份 | 数据刷新 |
| 年统计 | 切换年份 | 数据刷新 |

---

## 八、风险与注意事项

### 风险点
1. **数据模型字段不匹配**：WeekTaskStat、MonthStatItem、YearTaskItem 当前字段名可能与后端响应不一致
2. **TaskDetailFragment 布局缺失**：需要确认是否有 `tv_task_name`、`iv_task_icon`、`btn_terminate` 等视图
3. **连续打卡计算复杂度**：后端计算 current_streak 和 max_streak 需要处理日期连续性

### 注意事项
- 所有 SQL 必须使用参数化查询，禁止字符串拼接
- 禁止修改 constraint.md 中标记为"不可修改"的文件
- 禁止引入新依赖（后端）
- 前端所有网络请求必须使用 suspend + 协程
- 严格区分已完成模块，绝不改动

---

## 九、确认项

本执行计划已明确：
- ✅ 已完成/待开发模块清晰区分
- ✅ 开发优先级按需求截止时间排序
- ✅ 所有约束已确认并遵循
- ✅ 详细的实现方案和代码框架
- ✅ 自测校验规则

请确认后开始执行。
