# 年报表柱形图完善计划

## 一、需求分析

**需求**: 柱形图显示年度打卡次数最多的五个任务，数据从数据库获取。

## 二、当前实现问题

当前在 `YearTaskAdapter.kt` 中，柱形图数据是硬编码的：

```kotlin
val taskNames = listOf("阅读", "浇花", "跳绳", "晨跑", "练字")
val taskValues = listOf(241f, 365f, 152f, 120f, 98f)
```

需要改为从后端返回的实际数据中获取，按 `total_days` 排序后取前5个。

## 三、技术方案

### 3.1 后端改动（无）

后端 `/stats/year` 接口已经返回了每个任务的 `total_days` 字段，无需修改。

当前返回数据格式（已有）：
```json
{
  "code": 200,
  "data": [
    {
      "task_id": 1,
      "task_name": "阅读",
      "total_days": 45,
      "months": [...]
    }
  ]
}
```

### 3.2 前端改动

需要修改两个文件：

1. `YearStatsFragment.kt`: 在映射数据时传入排序后的 TOP5 任务列表给适配器
2. `YearTaskAdapter.kt`: 适配器接收 TOP5 数据并在 ChartViewHolder 中使用

## 四、实施步骤

### 步骤1: 修改 `YearStatsFragment.kt`

在 `loadYearData` 方法中：
1. 将后端返回的 `yearStats` 按 `total_days` 降序排序
2. 取前5个任务作为 TOP5 列表，传递给适配器
3. 适配器构造函数新增 `top5Tasks` 参数

### 步骤2: 修改 `YearTaskAdapter.kt`

1. 新增 `top5Tasks` 参数
2. `ChartViewHolder.bind()` 使用 `top5Tasks` 数据渲染柱形图

## 五、文件修改清单

| 文件 | 修改内容 |
|-----|---------|
| `YearStatsFragment.kt` | 按 `total_days` 排序，提取 TOP5 并传给适配器 |
| `YearTaskAdapter.kt` | 接收 TOP5 数据，在图表中展示 |

## 六、测试验证

1. 验证柱形图显示的任务名和打卡次数与实际数据一致
2. 验证确实是按打卡次数从多到少排序（如果不足5个则显示全部）
3. 验证任务数量不足5个时的边界情况
