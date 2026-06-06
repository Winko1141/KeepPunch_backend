# 加载状态与错误处理优化实施计划

## 计划信息

* 创建日期: 2026-06-06

* 功能: 加载状态与错误处理优化

* 优先级: 🔴 高优先级

* 状态: 待批准

***

## 一、需求分析

### 1.1 问题描述

**当前问题**:

* 所有 Fragment 页面无 Loading 指示器

* 网络请求失败时仅 Toast 提示（部分页面甚至没有提示）

* 空数据状态无引导（如首页无任务时仅空白）

* 错误处理不统一，catch 中仅 `e.printStackTrace()`

**涉及页面**:

| 页面                                                                                                                                 | 加载状态 | 空状态 | 错误处理     |
| ---------------------------------------------------------------------------------------------------------------------------------- | ---- | --- | -------- |
| [HomeFragment](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt)                   | ❌ 无  | ❌ 无 | ⚠️ 仅打印堆栈 |
| [WeekStatsFragment](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt)        | ❌ 无  | ❌ 无 | ⚠️ 仅打印堆栈 |
| [MonthStatsFragment](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt)      | ❌ 无  | ❌ 无 | ⚠️ 仅打印堆栈 |
| [YearStatsFragment](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt)        | ❌ 无  | ❌ 无 | ⚠️ 仅打印堆栈 |
| [TaskDetailFragment](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | ❌ 无  | ❌ 无 | ⚠️ 仅打印堆栈 |

### 1.2 功能需求

1. **加载状态**: 网络请求期间显示 Loading 指示器
2. **空状态**: 无数据时显示引导信息（插画 + 文字）
3. **错误状态**: 网络请求失败时显示错误页面，支持重试
4. **统一错误提示**: 创建统一的错误处理机制

### 1.3 技术方案

采用 `ViewStub` 或动态显示/隐藏的方式实现三种状态切换：

```
┌─────────────────────────────────────┐
│         页面内容容器 (FrameLayout)   │
│  ┌───────────────────────────────┐  │
│  │      正常内容 (初始隐藏)       │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │    Loading View (初始隐藏)     │  │
│  │     ProgressBar + 加载中...    │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │      空状态 View (初始隐藏)    │  │
│  │  📭 + 暂无数据 + 添加引导按钮   │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │     错误 View (初始隐藏)       │  │
│  │  ❌ + 加载失败 + 重试按钮       │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

***

## 二、约束遵守

### 2.1 前端约束

* ✅ 语言: Kotlin

* ✅ UI 框架: Android Jetpack + ViewBinding

* ✅ 网络: Retrofit + OkHttp

* ✅ 导航: Navigation Component

* ✅ 目录结构: 遵循现有规范

* ✅ 资源引用使用 R 文件，禁止硬编码

* ✅ ViewBinding 生命周期正确管理

***

## 三、涉及文件清单

### 3.1 新增文件 (6 个)

| 文件路径                              | 说明         |
| --------------------------------- | ---------- |
| `util/LoadingStateHelper.kt`      | 加载状态管理工具类  |
| `util/ErrorHandler.kt`            | 统一错误处理工具类  |
| `res/layout/view_loading.xml`     | 加载中状态布局    |
| `res/layout/view_empty.xml`       | 空状态布局      |
| `res/layout/view_error.xml`       | 错误状态布局     |
| `res/drawable/ic_empty_state.xml` | 空状态图标 (可选) |

### 3.2 修改文件 (9 个)

| 文件路径                                  | 修改内容              |
| ------------------------------------- | ----------------- |
| `ui/home/HomeFragment.kt`             | 添加加载/空/错误状态处理     |
| `ui/stats/WeekStatsFragment.kt`       | 添加加载/空/错误状态处理     |
| `ui/stats/MonthStatsFragment.kt`      | 添加加载/空/错误状态处理     |
| `ui/stats/YearStatsFragment.kt`       | 添加加载/空/错误状态处理     |
| `ui/taskDetail/TaskDetailFragment.kt` | 添加加载/空/错误状态处理     |
| `res/layout/fragment_home.xml`        | 添加 ViewStub 或状态容器 |
| `res/layout/fragment_week_stats.xml`  | 添加 ViewStub 或状态容器 |
| `res/layout/fragment_month_stats.xml` | 添加 ViewStub 或状态容器 |
| `res/layout/fragment_year_stats.xml`  | 添加 ViewStub 或状态容器 |

***

## 四、详细实施步骤

### 步骤 1: 新增状态布局文件

#### 1.1 view\_loading.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    android:background="@color/white">

    <ProgressBar
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:indeterminateTint="@color/color_orange" />

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="12dp"
        android:text="加载中..."
        android:textColor="@color/gray"
        android:textSize="14sp" />
</LinearLayout>
```

#### 1.2 view\_empty.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    android:background="@color/white"
    android:padding="32dp">

    <TextView
        android:id="@+id/tv_empty_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="📭"
        android:textSize="48sp" />

    <TextView
        android:id="@+id/tv_empty_message"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="暂无数据"
        android:textColor="@color/gray"
        android:textSize="14sp" />

    <TextView
        android:id="@+id/tv_empty_hint"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:text="点击右下角按钮添加你的第一个目标"
        android:textColor="#AAAAAA"
        android:textSize="12sp"
        android:visibility="gone" />
</LinearLayout>
```

#### 1.3 view\_error.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    android:background="@color/white"
    android:padding="32dp">

    <TextView
        android:id="@+id/tv_error_icon"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="❌"
        android:textSize="48sp" />

    <TextView
        android:id="@+id/tv_error_title"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:text="加载失败"
        android:textColor="#333333"
        android:textSize="16sp"
        android:textStyle="bold" />

    <TextView
        android:id="@+id/tv_error_message"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:text="请检查网络连接后重试"
        android:textColor="@color/gray"
        android:textSize="14sp" />

    <Button
        android:id="@+id/btn_retry"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="24dp"
        android:text="重试"
        android:textColor="@color/white"
        android:background="@drawable/bg_button_orange_rounded"
        android:paddingHorizontal="32dp"
        android:paddingVertical="10dp" />
</LinearLayout>
```

***

### 步骤 2: 新增 LoadingStateHelper.kt

创建统一的加载状态管理工具类，封装三种状态的切换逻辑。

```kotlin
package com.example.keeppunch.util

import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView

class LoadingStateHelper(
    private val contentView: View,
    private val loadingView: View,
    private val emptyView: View,
    private val errorView: View
) {

    enum class State {
        LOADING,
        CONTENT,
        EMPTY,
        ERROR
    }

    fun showLoading() {
        setVisibility(State.LOADING)
    }

    fun showContent() {
        setVisibility(State.CONTENT)
    }

    fun showEmpty(message: String = "暂无数据", hint: String? = null) {
        emptyView.findViewById<TextView>(R.id.tv_empty_message)?.text = message
        emptyView.findViewById<TextView>(R.id.tv_empty_hint)?.let {
            if (hint != null) {
                it.text = hint
                it.visibility = View.VISIBLE
            } else {
                it.visibility = View.GONE
            }
        }
        setVisibility(State.EMPTY)
    }

    fun showError(message: String = "加载失败", onRetry: (() -> Unit)? = null) {
        errorView.findViewById<TextView>(R.id.tv_error_message)?.text = message
        errorView.findViewById<Button>(R.id.btn_retry)?.setOnClickListener {
            onRetry?.invoke()
        }
        setVisibility(State.ERROR)
    }

    private fun setVisibility(state: State) {
        contentView.visibility = if (state == State.CONTENT) View.VISIBLE else View.GONE
        loadingView.visibility = if (state == State.LOADING) View.VISIBLE else View.GONE
        emptyView.visibility = if (state == State.EMPTY) View.VISIBLE else View.GONE
        errorView.visibility = if (state == State.ERROR) View.VISIBLE else View.GONE
    }
}
```

***

### 步骤 3: 新增 ErrorHandler.kt

创建统一的错误处理工具类，区分网络错误、服务器错误等。

```kotlin
package com.example.keeppunch.util

import android.content.Context
import android.widget.Toast
import retrofit2.HttpException
import java.io.IOException

object ErrorHandler {

    fun handleException(e: Exception, context: Context): String {
        return when (e) {
            is IOException -> "网络连接失败，请检查网络"
            is HttpException -> {
                when (e.code()) {
                    400 -> "请求参数错误"
                    404 -> "资源不存在"
                    500 -> "服务器错误"
                    else -> "请求失败，错误码: ${e.code()}"
                }
            }
            else -> "未知错误: ${e.message}"
        }
    }

    fun showToast(context: Context, message: String) {
        Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
    }

    fun handleAndShow(e: Exception, context: Context) {
        val message = handleException(e, context)
        showToast(context, message)
    }
}
```

***

### 步骤 4: 修改布局文件

#### 4.1 fragment\_home.xml 修改

在 NestedScrollView 外层添加 FrameLayout 包裹，并在其中添加 loading/empty/error 的 ViewStub。

```xml
<!-- 修改前结构: ConstraintLayout -> NestedScrollView -->
<!-- 修改后结构: ConstraintLayout -> FrameLayout(内容+状态) + FAB -->

<androidx.constraintlayout.widget.ConstraintLayout
    ...>

    <!-- 顶部日期选择器容器（保持不变） -->
    <androidx.cardview.widget.CardView
        android:id="@+id/card_dates"
        ... />

    <!-- 内容区域改为 FrameLayout 包裹 -->
    <FrameLayout
        android:id="@+id/frame_content"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toBottomOf="@id/card_dates">

        <!-- 原有的 NestedScrollView -->
        <androidx.core.widget.NestedScrollView
            android:id="@+id/scroll_content"
            ... />

        <!-- Loading View -->
        <include
            android:id="@+id/layout_loading"
            layout="@layout/view_loading"
            android:visibility="gone" />

        <!-- Empty View -->
        <include
            android:id="@+id/layout_empty"
            layout="@layout/view_empty"
            android:visibility="gone" />

        <!-- Error View -->
        <include
            android:id="@+id/layout_error"
            layout="@layout/view_error"
            android:visibility="gone" />

    </FrameLayout>

    <!-- 底部悬浮按钮（保持不变） -->
    <com.google.android.material.floatingactionbutton.FloatingActionButton
        android:id="@+id/fab_add"
        ... />

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### 4.2 统计页面布局修改 (week/month/year)

类似地，为统计页面的 RecyclerView 区域添加状态容器。

***

### 步骤 5: 修改 Fragment 添加状态处理

#### 5.1 HomeFragment.kt 修改

```kotlin
// 新增成员变量
private lateinit var loadingStateHelper: LoadingStateHelper

// 在 onCreateView 中初始化
override fun onCreateView(...): View {
    _binding = FragmentHomeBinding.inflate(inflater, container, false)
    
    // 初始化 LoadingStateHelper
    loadingStateHelper = LoadingStateHelper(
        contentView = binding.scrollContent,
        loadingView = binding.layoutLoading.root,
        emptyView = binding.layoutEmpty.root,
        errorView = binding.layoutError.root
    )
    
    setupCalendar()
    setupTaskList()
    
    binding.fabAdd.setOnClickListener { ... }
    
    loadTasks(selectedDate)
    
    return binding.root
}

// 修改 loadTasks 方法
private fun loadTasks(date: LocalDate) {
    val dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE)
    lifecycleScope.launch {
        loadingStateHelper.showLoading()
        try {
            val response = apiService.getTaskList(dateStr)
            if (response.isSuccessful) {
                val body = response.body()
                if (body?.code == 200) {
                    val tasks = body.data ?: emptyList()
                    if (tasks.isEmpty()) {
                        loadingStateHelper.showEmpty(
                            message = "今天还没有任务",
                            hint = "点击右下角按钮添加你的第一个目标"
                        )
                    } else {
                        updateTaskList(tasks)
                        loadingStateHelper.showContent()
                    }
                }
            } else {
                loadingStateHelper.showError(
                    message = "加载失败，请稍后重试",
                    onRetry = { loadTasks(date) }
                )
            }
        } catch (e: Exception) {
            val errorMsg = ErrorHandler.handleException(e, requireContext())
            loadingStateHelper.showError(
                message = errorMsg,
                onRetry = { loadTasks(date) }
            )
        }
    }
}
```

#### 5.2 其他 Fragment 修改模式

WeekStatsFragment、MonthStatsFragment、YearStatsFragment、TaskDetailFragment 采用相同的模式修改：

1. 添加 `loadingStateHelper` 成员变量
2. 在 `onViewCreated` 或 `onCreateView` 中初始化
3. 在网络请求方法中：

   * 开始前调用 `loadingStateHelper.showLoading()`

   * 成功且有数据时调用 `loadingStateHelper.showContent()`

   * 成功但无数据时调用 `loadingStateHelper.showEmpty()`

   * 失败时调用 `loadingStateHelper.showError()`

***

## 五、数据流程

```
用户进入页面
    ↓
loadData() 开始
    ↓
loadingStateHelper.showLoading()
    ↓
协程发起网络请求
    ↓
┌─────────────────┬──────────────────┐
│    成功          │      失败         │
└─────────────────┴──────────────────┘
    ↓                    ↓
┌───────┴───────┐    showError()
│ 有数据 │ 无数据 │    显示错误页面
│       │       │    + 重试按钮
└───┬───┴───┬───┘
    ↓       ↓
showContent  showEmpty
显示内容   显示空状态
```

***

## 六、测试验证

### 6.1 测试场景

| 场景        | 页面   | 预期结果               |
| --------- | ---- | ------------------ |
| 网络请求期间    | 所有页面 | 显示 Loading 指示器     |
| 加载成功且有数据  | 所有页面 | 显示正常内容             |
| 加载成功但无数据  | 首页   | 显示"今天还没有任务" + 引导提示 |
| 加载成功但无数据  | 统计页  | 显示"暂无统计数据"         |
| 网络断开      | 所有页面 | 显示错误页面 + 重试按钮      |
| 服务器返回 500 | 所有页面 | 显示"服务器错误"          |
| 点击重试按钮    | 所有页面 | 重新发起请求             |

### 6.2 自测清单

* [ ] 所有页面加载时显示 Loading

* [ ] 首页无任务时显示空状态引导

* [ ] 统计页无数据时显示空状态

* [ ] 网络错误时显示错误页面

* [ ] 错误页面的重试按钮可用

* [ ] 任务详情页加载失败时可重试

***

## 七、风险与注意事项

### 7.1 风险点

| 风险                          | 影响   | 缓解措施                                 |
| --------------------------- | ---- | ------------------------------------ |
| ViewBinding 找不到 include 的布局 | 编译错误 | 使用 `binding.layoutLoading.root` 方式访问 |
| Loading 状态闪烁                | 体验问题 | 添加最小显示时间或使用防抖                        |
| 空状态和加载状态冲突                  | 逻辑错误 | 确保状态切换互斥                             |
| 多个请求时状态混乱                   | 逻辑错误 | 确保每次请求都有明确的状态管理                      |

### 7.2 约束注意事项

1. 所有网络请求必须使用 suspend + 协程
2. 必须使用 try...catch 处理异常
3. 资源引用使用 R 文件，禁止硬编码
4. ViewBinding 生命周期正确管理
5. LoadingStateHelper 应在 onDestroyView 中清理（如有需要）

***

## 八、实施顺序

### 阶段一: 基础组件

1. 新增 view\_loading.xml
2. 新增 view\_empty.xml
3. 新增 view\_error.xml
4. 新增 LoadingStateHelper.kt
5. 新增 ErrorHandler.kt

### 阶段二: 布局修改

1. 修改 fragment\_home.xml
2. 修改 fragment\_week\_stats.xml
3. 修改 fragment\_month\_stats.xml
4. 修改 fragment\_year\_stats.xml
5. 修改 fragment\_task\_detail.xml

### 阶段三: 代码集成

1. 修改 HomeFragment.kt
2. 修改 WeekStatsFragment.kt
3. 修改 MonthStatsFragment.kt
4. 修改 YearStatsFragment.kt
5. 修改 TaskDetailFragment.kt

### 阶段四: 测试验证

1. 编译测试
2. 功能测试（正常、空数据、网络错误）
3. 边界情况测试

***

## 九、文件变更总览

### 新增文件 (5 个)

| 文件                            | 说明        |
| ----------------------------- | --------- |
| `util/LoadingStateHelper.kt`  | 加载状态管理工具类 |
| `util/ErrorHandler.kt`        | 统一错误处理工具类 |
| `res/layout/view_loading.xml` | 加载中状态布局   |
| `res/layout/view_empty.xml`   | 空状态布局     |
| `res/layout/view_error.xml`   | 错误状态布局    |

### 修改文件 (9 个)

| 文件                                    | 修改内容     |
| ------------------------------------- | -------- |
| `ui/home/HomeFragment.kt`             | 添加状态管理逻辑 |
| `ui/stats/WeekStatsFragment.kt`       | 添加状态管理逻辑 |
| `ui/stats/MonthStatsFragment.kt`      | 添加状态管理逻辑 |
| `ui/stats/YearStatsFragment.kt`       | 添加状态管理逻辑 |
| `ui/taskDetail/TaskDetailFragment.kt` | 添加状态管理逻辑 |
| `res/layout/fragment_home.xml`        | 添加状态容器   |
| `res/layout/fragment_week_stats.xml`  | 添加状态容器   |
| `res/layout/fragment_month_stats.xml` | 添加状态容器   |
| `res/layout/fragment_year_stats.xml`  | 添加状态容器   |

***

## 十、验收标准

### 功能验收

* [ ] 所有页面加载时显示 Loading 指示器

* [ ] 首页无任务时显示"今天还没有任务"

* [ ] 首页空状态有"点击右下角按钮添加你的第一个目标"提示

* [ ] 统计页无数据时显示"暂无统计数据"

* [ ] 网络错误时显示错误页面

* [ ] 错误页面包含"重试"按钮

* [ ] 点击重试按钮能重新加载数据

* [ ] 加载成功后自动隐藏 Loading 并显示内容

### 代码质量验收

* [ ] 遵循约束文档

* [ ] 无编译错误

* [ ] 无运行时崩溃

* [ ] 错误处理完善

* [ ] 状态切换逻辑清晰

### 用户体验验收

* [ ] Loading 不阻塞用户交互（不使用全屏遮罩）

* [ ] 空状态有友好的引导

* [ ] 错误信息清晰易懂

* [ ] 重试按钮操作流畅

