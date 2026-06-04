# KeepPunch 项目待办清单

## 项目当前进度

### ✅ 已完成模块

#### 后端 (KeepPunch_Backend)
| 模块 | 状态 | 文件 |
|------|------|------|
| Koa 框架搭建 | ✅ 完成 | [app.js](file:///d:/xm/KeepPunch_Backend/app.js) |
| MySQL 连接池 | ✅ 完成 | [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js) |
| 测试接口 /test | ✅ 完成 | [app.js](file:///d:/xm/KeepPunch_Backend/app.js#L17-L21) |
| 创建任务接口 | ✅ 完成 | [routes/task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js#L6-L55) |

#### 前端 (KeepPunch_frontend)
| 模块 | 状态 | 文件 |
|------|------|------|
| 项目框架搭建 | ✅ 完成 | Android Studio 模板 |
| Retrofit 网络请求 | ✅ 完成 | [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt) |
| 底部导航栏 | ✅ 完成 | [MainActivity.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/MainActivity.kt#L36-L42) |
| 首页日历视图 | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) |
| 任务列表 UI | ✅ 完成 | [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt) |
| 添加任务页面 | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) |
| 统计容器 (Tab+ViewPager) | ✅ 完成 | [StatsContainerFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/StatsContainerFragment.kt) |
| 周报表 UI (Mock数据) | ✅ 完成 | [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) |
| 月报表 UI (Mock数据) | ✅ 完成 | [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt) |
| 年报表 UI (Mock数据) | ✅ 完成 | [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt) |
| 任务详情页框架 | ✅ 完成 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) |

---

## 📋 待开发模块

### 后端 API 接口

#### 1. 任务管理接口
| 接口 | 方法 | 路径 | 说明 | 优先级 |
|------|------|------|------|--------|
| 查询任务列表 | GET | /task/list | 根据日期、状态查询任务 | 🔴 高 |
| 查询任务详情 | GET | /task/:id | 获取单个任务详情 | 🔴 高 |
| 更新任务 | PUT | /task/:id | 编辑任务信息 | 🟡 中 |
| 终止任务 | DELETE | /task/:id | 软删除（status=2） | 🟡 中 |

#### 2. 打卡/记录接口
| 接口 | 方法 | 路径 | 说明 | 优先级 |
|------|------|------|------|--------|
| 打卡 | POST | /record/checkin | 创建打卡记录 | 🔴 高 |
| 取消打卡 | DELETE | /record/checkin | 删除打卡记录 | 🔴 高 |
| 查询某天打卡记录 | GET | /record/date/:date | 获取某天所有打卡记录 | 🔴 高 |

#### 3. 统计接口
| 接口 | 方法 | 路径 | 说明 | 优先级 |
|------|------|------|------|--------|
| 周统计 | GET | /stats/week | 获取周统计数据 | 🟡 中 |
| 月统计 | GET | /stats/month | 获取月统计数据 | 🟡 中 |
| 年统计 | GET | /stats/year | 获取年统计数据 | 🟡 中 |
| 任务完成率 | GET | /stats/rate/:taskId | 单个任务的完成率 | 🟡 中 |

#### 4. 统计记录表管理 (task_count)
| 说明 | 优先级 |
|------|--------|
| 打卡/取消打卡时同步更新 task_count 表 | 🟡 中 |
| 或直接从 record 表聚合查询（二选一） | 🟡 中 |

---

### 前端功能对接

#### 1. 首页功能
| 功能 | 文件 | 说明 | 优先级 |
|------|------|------|--------|
| 任务列表数据对接 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt#L198-L203) | 替换 mock 数据 | 🔴 高 |
| 任务点击事件 | [TaskAdapter.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/TaskAdapter.kt) | 跳转到详情页 | 🔴 高 |
| 打卡/取消打卡 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) | 调用打卡接口 | 🔴 高 |
| 日期切换刷新 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt#L152-L161) | 根据选中日期加载任务 | 🔴 高 |

#### 2. 添加任务页面
| 功能 | 文件 | 说明 | 优先级 |
|------|------|------|--------|
| 图标选择参数传递 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt#L338-L348) | 修复 icon 硬编码问题 | 🔴 高 |
| 创建成功后返回刷新 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt#L350-L363) | 自动返回首页并刷新 | 🟡 中 |

#### 3. 任务详情页
| 功能 | 文件 | 说明 | 优先级 |
|------|------|------|--------|
| 详情数据对接 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 展示任务详情和历史 | 🔴 高 |
| 终止任务按钮 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 调用软删除接口 | 🟡 中 |

#### 4. 统计页面
| 功能 | 文件 | 说明 | 优先级 |
|------|------|------|--------|
| 周统计数据对接 | [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt#L77-L87) | 替换 mock 数据 | 🟡 中 |
| 月统计数据对接 | [MonthStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/MonthStatsFragment.kt#L71-L81) | 替换 mock 数据 | 🟡 中 |
| 年统计数据对接 | [YearStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/YearStatsFragment.kt#L104-L122) | 替换 mock 数据 | 🟡 中 |
| 切换月份/年份刷新 | 三个 StatsFragment | 切换时重新加载数据 | 🟡 中 |

#### 5. 网络层
| 功能 | 文件 | 说明 | 优先级 |
|------|------|------|--------|
| 补充 API 接口定义 | [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | 新增所有后端接口 | 🔴 高 |
| 添加数据模型类 | model/ 目录 | 新增 Task、Record 等 model | 🔴 高 |
| 统一响应格式处理 | [response/BaseResponse.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/response/BaseResponse.kt) | 确认后端返回格式 | 🟡 中 |

#### 6. 待删除/清理
| 项目 | 文件 | 说明 |
|------|------|------|
| Dashboard 页面 | [DashboardFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardFragment.kt) | 用户确认无用，删除 |
| DashboardViewModel | [DashboardViewModel.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardViewModel.kt) | 随同 Dashboard 一并删除 |
| fragment_dashboard.xml | layout 目录 | 随同 Dashboard 一并删除 |
| 底部导航 Dashboard 项 | [bottom_nav_menu.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/menu/bottom_nav_menu.xml) | 删除多余项 |
| 导航配置 | [mobile_navigation.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/navigation/mobile_navigation.xml) | 调整导航图 |

---

## 🔧 已知问题清单

| 问题 | 文件 | 影响 | 优先级 |
|------|------|------|--------|
| CreateTaskRequest 类缺失 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt#L22-L23) | 编译错误 | 🔴 高 |
| 图标硬编码为 "book" | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt#L340) | 所有任务图标相同 | 🔴 高 |
| API 地址 IP 可能变化 | [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt#L9-L10) | 换网络后无法连接 | 🟡 中 |
| 所有页面使用 mock 数据 | 各 Fragment | 功能不完整 | 🔴 高 |

---

## 📌 开发优先级建议

### 第一阶段（核心功能）
1. 修复编译错误（CreateTaskRequest）
2. 后端：任务列表查询接口
3. 后端：打卡/取消打卡接口
4. 前端：首页任务列表对接
5. 前端：打卡功能对接
6. 修复图标硬编码问题

### 第二阶段（完整流程）
1. 后端：任务详情/编辑/终止接口
2. 后端：按日期查询记录接口
3. 前端：任务详情页对接
4. 前端：添加任务成功后自动刷新
5. 清理无用的 Dashboard 页面

### 第三阶段（统计功能）
1. 后端：周/月/年统计接口
2. 前端：统计页面数据对接
3. API 地址动态配置方案

---

## 📊 数据库表确认（已完成）

```sql
-- task 表：任务定义
CREATE TABLE `task` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_name VARCHAR(100) NOT NULL,
  icon VARCHAR(100),
  repeat_type TINYINT NOT NULL COMMENT '1=周定期 2=周次数 3=月次数',
  week_rule VARCHAR(50) DEFAULT '' COMMENT '周定期：1,3,5（周一到周日 1-7）',
  target_count INT DEFAULT 0,
  status TINYINT DEFAULT 1 COMMENT '1=正常 2=终止',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- record 表：打卡记录
CREATE TABLE `record` (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  record_date DATE NOT NULL,
  is_finish TINYINT DEFAULT 1 COMMENT '1=已打卡',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uk_task_date (task_id, record_date)
);

-- task_count 表：统计汇总（可选使用，或从 record 聚合）
CREATE TABLE task_count (
  id INT PRIMARY KEY AUTO_INCREMENT,
  task_id INT NOT NULL,
  year INT NOT NULL,
  month INT NOT NULL,
  week INT NOT NULL COMMENT '一年中第几周',
  total_count INT DEFAULT 0,
  UNIQUE KEY uk_task_week (task_id, year, week),
  UNIQUE KEY uk_task_month (task_id, year, month)
);
```

> week_rule 解析：前端传 0-6 或 1-7？需要统一。建议后端统一处理为 1-7（周一=1，周日=7）
