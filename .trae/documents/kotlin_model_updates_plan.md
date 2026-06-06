# Kotlin 模型文件更新计划

## 任务概述
在 KeepPunch_frontend 项目中创建和修改 3 个 Kotlin 数据模型文件。

## 待执行的操作

### 1. 新建文件: CategoryItem.kt
**路径**: `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\CategoryItem.kt`

**操作**: 创建新文件
**内容**:
```kotlin
package com.example.keeppunch.model

data class CategoryItem(
    val id: Int,
    val name: String,
    val icon: String,
    val color: String,
    val sort_order: Int,
    val create_time: String?,
    val update_time: String?
)
```

### 2. 修改文件: TaskItem.kt
**路径**: `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\TaskItem.kt`

**操作**: 替换整个文件内容
**变更说明**:
- 添加字段: `reminder_time: String?`
- 添加字段: `reminder_enabled: Boolean`
- 添加字段: `category_id: Int?`
- 添加字段: `category_name: String?`
- 添加字段: `category_icon: String?`
- 添加字段: `category_color: String?`

**新内容**:
```kotlin
package com.example.keeppunch.model

data class TaskItem(
    val id: Int,
    val task_name: String,
    val icon: String,
    val repeat_type: Int,
    val week_rule: String,
    val target_count: Int,
    val status: Int,
    val is_finished: Boolean,
    val create_time: String?,
    val reminder_time: String?,
    val reminder_enabled: Boolean,
    val category_id: Int?,
    val category_name: String?,
    val category_icon: String?,
    val category_color: String?
) {
    fun getSubtitle(): String {
        return when (repeat_type) {
            1 -> {
                if (week_rule.isEmpty()) {
                    "每天"
                } else {
                    val weekDays = week_rule.split(",").map { it.toInt() }
                    val weekNames = listOf("周一", "周二", "周三", "周四", "周五", "周六", "周日")
                    weekDays.map { weekNames[it - 1] }.joinToString("、")
                }
            }
            2 -> "每周 $target_count 次"
            3 -> "每月 $target_count 次"
            else -> ""
        }
    }
}
```

### 3. 修改文件: CreateTaskRequest.kt
**路径**: `d:\xm\KeepPunch_frontend\app\src\main\java\com\example\keeppunch\model\CreateTaskRequest.kt`

**操作**: 替换整个文件内容
**变更说明**:
- 添加字段: `reminder_time: String? = null`
- 添加字段: `reminder_enabled: Boolean? = null`
- 添加字段: `category_id: Int? = null`

**新内容**:
```kotlin
package com.example.keeppunch.model

data class CreateTaskRequest(
    val task_name: String,
    val icon: String,
    val repeat_type: Int,
    val week_rule: String,
    val target_count: Int?,
    val reminder_time: String? = null,
    val reminder_enabled: Boolean? = null,
    val category_id: Int? = null
)
```

## 执行步骤
1. 创建 CategoryItem.kt 文件
2. 替换 TaskItem.kt 内容
3. 替换 CreateTaskRequest.kt 内容
4. 验证代码编译正确性（可选）
