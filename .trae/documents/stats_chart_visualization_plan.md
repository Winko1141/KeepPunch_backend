# 统计图表可视化实现计划

## 一、代码库调研结论

### 1.1 现有依赖情况

**MPAndroidChart 依赖已存在**:
- [build.gradle.kts](file:///d:/xm/KeepPunch_frontend/app/build.gradle.kts#L60) 已添加: `implementation("com.github.PhilJay:MPAndroidChart:v3.1.0")`
- 无需新增依赖

### 1.2 现有统计页面结构

| 页面 | 布局文件 | Fragment | 数据展示方式 |
|------|----------|----------|--------------|
| 周统计 | [fragment_week_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_week_stats.xml) | [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) | RecyclerView 显示表格 |
| 月统计 | [fragment_month_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_month_stats.xml) | [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) | RecyclerView 显示卡片列表 |
| 年统计 | [fragment_year_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_year_stats.xml) | [YearStatsFragment.kt](d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) | RecyclerView 显示卡片列表 |

### 1.3 现有颜色资源

[colors.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/values/colors.xml) 包含:
- 主题橙色: `color_orange`, `theme_orange`
- 绿色: `green_check`
- 蓝色: `primary`, `bg_blue`
- 粉色: `pink_check`
- 灰色系: `gray`, `stat_gray`, `light_gray`

### 1.4 数据模型

- 周统计: 每个任务 7 天的打卡情况 (`week_days: List<Int>`)
- 月统计: 每个任务当月打卡的日期列表 (`month_days: List<Int>`)
- 年统计: 每个任务全年打卡天数 (`total_days: Int`)

---

## 二、需求分析

### 2.1 功能 7 需求摘要

**问题**: 当前统计仅显示数字和简单日历，缺乏直观的图表展示

**需求**:
- 使用 MPAndroidChart 添加图表
- 支持折线图、柱状图、饼图

**技术方案**:
1. **周统计**: 折线图（趋势）
2. **月统计**: 柱状图（每日打卡）
3. **年统计**: 热力图或堆叠柱状图

---

## 三、实现方案

### 3.1 总体架构

采用 **"保留现有列表 + 新增图表展示"** 的混合模式：

1. **周统计**: 折线图（各任务每日打卡情况）
2. **月统计**: 横向柱状图（各任务完成天数对比）+ 每日打卡分布图
3. **年统计**: 饼图（各任务全年占比）+ 横向柱状图

### 3.2 新增图表工具类

创建 `ChartHelper.kt` 统一管理图表配置：

```
util/ChartHelper.kt
├── setupLineChart()       - 周统计折线图配置
├── setupBarChart()        - 月/年统计柱状图配置
├── setupPieChart()        - 年统计饼图配置
└── getChartColors()       - 获取图表颜色列表
```

### 3.3 各页面详细改造

#### 方案 A: 周统计 - 折线图

**布局改造** (`fragment_week_stats.xml`):
- 保留现有日期切换栏和统计卡片
- 在 RecyclerView 上方添加 `LineChart` 组件
- 使用 `ScrollView` 包裹图表和列表

**数据处理**:
- X 轴: 周一 ~ 周日 (7 天)
- Y 轴: 打卡数量 (0 或 1)
- 多条折线: 每个任务一条线

#### 方案 B: 月统计 - 横向柱状图 + 分布热力图

**布局改造** (`fragment_month_stats.xml`):
- 保留日期切换栏
- 添加 `HorizontalBarChart` (各任务完成天数对比)
- 在 RecyclerView 上方添加简单的每日打卡分布图

**数据处理**:
- 横向柱状图: 每个任务一根柱子，显示完成天数
- 分布热力图: 用不同颜色表示当月每日打卡数量

#### 方案 C: 年统计 - 饼图 + 柱状图

**布局改造** (`fragment_year_stats.xml`):
- 保留年份切换栏
- 顶部添加 `PieChart` (各任务占比)
- 下方添加 `HorizontalBarChart` (各任务天数)
- 保留原有的卡片列表

**数据处理**:
- 饼图: 按各任务 `total_days` 计算占比
- 柱状图: 横向展示各任务全年打卡天数

---

## 四、涉及文件清单

### 4.1 新增文件

| 文件路径 | 说明 |
|----------|------|
| `app/src/main/java/com/example/keeppunch/util/ChartHelper.kt` | 图表配置工具类 |

### 4.2 修改文件

#### 布局文件:

| 文件路径 | 修改内容 |
|----------|----------|
| [fragment_week_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_week_stats.xml) | 添加 LineChart 组件 |
| [fragment_month_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_month_stats.xml) | 添加 BarChart 组件 |
| [fragment_year_stats.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_year_stats.xml) | 添加 PieChart + BarChart 组件 |

#### Fragment 文件:

| 文件路径 | 修改内容 |
|----------|----------|
| [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) | 初始化折线图、绑定数据 |
| [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) | 初始化柱状图、绑定数据 |
| [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) | 初始化饼图+柱状图、绑定数据 |

#### 资源文件 (可选):

| 文件路径 | 修改内容 |
|----------|----------|
| [colors.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/values/colors.xml) | 新增图表专用颜色 (如需要) |

---

## 五、实施步骤

### 步骤 1: 创建图表工具类

创建 `ChartHelper.kt`，包含:
- 折线图配置函数
- 柱状图配置函数
- 饼图配置函数
- 统一的图表样式设置

### 步骤 2: 改造周统计页面

1. 修改 `fragment_week_stats.xml`，添加 `LineChart`
2. 修改 `WeekStatsFragment.kt`:
   - 初始化图表
   - 将 weekStats 数据转换为 `LineData`
   - 设置多条折线（每个任务一条）

### 步骤 3: 改造月统计页面

1. 修改 `fragment_month_stats.xml`，添加 `HorizontalBarChart`
2. 修改 `MonthStatsFragment.kt`:
   - 初始化横向柱状图
   - 统计每个任务的完成天数
   - 绑定数据到图表

### 步骤 4: 改造年统计页面

1. 修改 `fragment_year_stats.xml`，添加 `PieChart` 和 `HorizontalBarChart`
2. 修改 `YearStatsFragment.kt`:
   - 初始化饼图和柱状图
   - 饼图: 按各任务 total_days 计算占比
   - 柱状图: 横向展示各任务全年打卡天数

### 步骤 5: 测试与优化

- 测试空数据场景
- 测试单任务、多任务场景
- 测试日期切换时图表刷新
- 检查动画效果和交互体验

---

## 六、技术细节

### 6.1 MPAndroidChart 核心类

| 图表类型 | 核心类 |
|----------|--------|
| 折线图 | `LineChart`, `LineDataSet`, `Entry` |
| 柱状图 | `BarChart`, `BarDataSet`, `BarEntry` |
| 饼图 | `PieChart`, `PieDataSet`, `PieEntry` |
| 横向柱状图 | `HorizontalBarChart` |

### 6.2 数据转换示例

**周统计折线图数据转换**:
```kotlin
// weekStats: List<WeekStatResponse>
// 每个任务: { task_name, week_days: [0,1,1,0,1,1,0] }

// 转换为多个 LineDataSet
// X轴索引 0-6 对应 周一-周日
// Y值: 0=未打卡, 1=已打卡
```

**年统计饼图数据转换**:
```kotlin
// yearStats: List<YearStatResponse>
// 每个任务: { task_name, total_days }

// 计算各任务占比
// PieEntry(value, label)
```

### 6.3 图表样式配置

| 配置项 | 值 |
|--------|-----|
| 描述文本 | 隐藏 (无右下角描述) |
| 图例 | 显示在底部 |
| 坐标轴 | 根据图表类型决定显示 |
| 动画 | 开启动画效果 |
| 交互 | 支持缩放和平移 |

---

## 七、风险与注意事项

### 7.1 潜在风险

1. **数据量过大**: 年月统计可能有大量数据
   - 缓解: 仅显示前 N 个任务，其余合并为"其他"

2. **图表刷新性能**: 频繁切换日期时的性能
   - 缓解: 使用 `notifyDataSetChanged()` 而非重新创建

3. **颜色冲突**: 任务多时颜色不足
   - 缓解: 准备至少 10 种图表颜色，循环使用

### 7.2 注意事项

1. 保持现有 RecyclerView 列表功能不变
2. 图表需与列表数据同步更新
3. 空数据时图表也需显示空状态
4. 错误状态时图表隐藏，显示错误页面（已有 LoadingStateHelper 处理）

---

## 八、验收标准

1. 周统计页面显示折线图，展示各任务每周打卡趋势
2. 月统计页面显示柱状图，对比各任务完成天数
3. 年统计页面显示饼图（占比）和柱状图（天数）
4. 图表与列表数据同步，日期切换时图表正确刷新
5. 空数据和错误状态处理正常
6. 代码无编译错误
