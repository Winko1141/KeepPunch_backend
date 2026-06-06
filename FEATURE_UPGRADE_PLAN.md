# KeepPunch 功能升级计划

## 文档信息

- 创建日期: 2026-06-06
- 适用项目: KeepPunch (后端 + 前端)
- 状态: 待实施

---

## 一、项目现状分析

### 1.1 已完成功能

#### 后端
| 模块 | 功能 | 状态 | 文件位置 |
|------|------|------|----------|
| 任务管理 | 创建、查询、更新、终止任务 | ✅ 完成 | [task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js) |
| 打卡功能 | 打卡、取消打卡 | ✅ 完成 | [record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js) |
| 统计功能 | 周/月/年统计、完成率 | ✅ 完成 | [stats.js](file:///d:/xm/KeepPunch_Backend/routes/stats.js) |

#### 前端
| 模块 | 功能 | 状态 | 文件位置 |
|------|------|------|----------|
| 首页 | 周历视图、任务列表、打卡 | ✅ 完成 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) |
| 添加任务 | 图标选择、重复规则设置 | ✅ 完成 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) |
| 任务详情 | 月历视图、统计数据、终止任务 | ✅ 完成 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) |
| 统计页面 | 周/月/年统计展示 | ✅ 完成 | [WeekStatsFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/stats/WeekStatsFragment.kt) |

### 1.2 技术栈

- **后端**: Node.js + Koa + MySQL (mysql2/promise)
- **前端**: Android (Kotlin) + Retrofit + Kizitonwose Calendar
- **包管理**: pnpm (后端)

---

## 二、功能升级清单

### 2.1 🔴 高优先级（建议优先实施）

#### 功能 1: 任务编辑功能

**问题描述**: 
- 当前只能创建和终止任务，无法修改已创建的任务信息
- 用户创建任务后发现设置错误，只能删除重建

**需求**:
- 在任务详情页添加"编辑"按钮
- 可编辑: 任务名称、图标、重复规则、目标次数
- 保存修改时更新数据库

**技术方案**:
1. **后端**: 复用现有的 PUT `/task/:id` 接口
2. **前端**: 
   - 创建 EditTaskFragment（复用 AddTaskFragment 逻辑）
   - 在 TaskDetailFragment 添加编辑入口
   - 预填充任务当前数据

**涉及文件**:
- 后端: 无需新增（已有接口）
- 前端: 
  - 新建: `ui/home/EditTaskFragment.kt`
  - 修改: `ui/taskDetail/TaskDetailFragment.kt`
  - 修改: `res/navigation/mobile_navigation.xml`

**预期收益**: 
- 提升用户体验，减少重复操作
- 符合常规使用习惯

**工作量预估**: 2-3 天

---

#### 功能 2: 环境变量配置（安全性）

**问题描述**:
- 数据库密码硬编码在 [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js#L5-L12) 中
- 存在安全风险，不适合提交到版本控制

**需求**:
- 使用环境变量管理敏感配置
- 支持开发/生产环境区分

**技术方案**:
1. 安装 `dotenv` 依赖
2. 创建 `.env` 文件（添加到 .gitignore）
3. 修改 db/index.js 读取环境变量
4. 创建 `.env.example` 模板

**涉及文件**:
- 新增: `.env.example`
- 修改: `db/index.js`
- 修改: `.gitignore`
- 修改: `package.json` (添加 dotenv)

**预期收益**:
- 提升安全性
- 便于多环境部署

**工作量预估**: 0.5 天

---

#### 功能 3: 加载状态与错误处理优化

**问题描述**:
- 当前页面无 Loading 指示器
- 网络请求失败时仅 Toast 提示
- 空数据状态无引导

**需求**:
- 添加加载中动画
- 统一错误处理机制
- 空状态页面设计

**技术方案**:
1. **加载状态**:
   - 使用 ProgressBar 或 Shimmer 效果
   - 在网络请求期间显示

2. **错误处理**:
   - 创建统一的错误提示组件
   - 区分网络错误、服务器错误、数据错误

3. **空状态**:
   - 设计空状态插画 + 引导文字
   - 首页无任务时显示"添加你的第一个任务"

**涉及文件**:
- 前端:
  - 所有 Fragment 修改（添加 Loading 逻辑）
  - 新增: `res/layout/layout_empty_state.xml`
  - 新增: `res/layout/layout_loading.xml`

**预期收益**:
- 大幅提升用户体验
- 减少用户困惑

**工作量预估**: 1-2 天

---

#### 功能 4: 用户认证系统（多用户支持）

**问题描述**:
- 当前为单用户设计，无用户概念
- 所有数据共享，不适合多人使用

**需求**:
- 实现用户注册/登录
- 基于 JWT 的 API 认证
- 数据按用户隔离

**技术方案**:
1. **数据库**:
   - 新增 `user` 表 (id, username, password_hash, email, created_at)
   - 各业务表添加 `user_id` 字段

2. **后端**:
   - 新增 `routes/auth.js`: 注册、登录、刷新 Token
   - 添加 JWT 中间件验证
   - 所有业务接口增加 user_id 过滤

3. **前端**:
   - 新增登录/注册页面
   - 本地存储 Token
   - 所有请求携带 Authorization 头

**涉及文件**:
- 后端:
  - 新增: `routes/auth.js`
  - 新增: `middleware/auth.js`
  - 修改: 所有路由文件
  - 修改: `app.js`
- 前端:
  - 新增: `ui/auth/LoginFragment.kt`
  - 新增: `ui/auth/RegisterFragment.kt`
  - 修改: `network/RetrofitClient.kt` (添加拦截器)
  - 修改: 所有 API 调用

**预期收益**:
- 支持多用户使用
- 数据安全隔离
- 为后续云同步奠定基础

**工作量预估**: 5-7 天

---

### 2.2 🟡 中优先级

#### 功能 5: 任务提醒/通知功能

**问题描述**:
- 无任务提醒功能
- 容易忘记打卡

**需求**:
- 为任务设置提醒时间
- Android 本地通知提醒
- 可开关提醒

**技术方案**:
1. **数据库**:
   - task 表新增: `reminder_time`, `reminder_enabled`

2. **后端**:
   - 修改任务创建/更新接口支持提醒设置

3. **前端**:
   - 在 AddTaskFragment 添加时间选择器
   - 使用 Android AlarmManager + WorkManager
   - 创建 NotificationChannel

**涉及文件**:
- 后端: 修改 `routes/task.js`
- 前端:
  - 修改: `AddTaskFragment.kt`
  - 新增: `util/NotificationHelper.kt`
  - 新增: `receiver/AlarmReceiver.kt`
  - 修改: `AndroidManifest.xml`

**预期收益**:
- 提升用户打卡率
- 防止遗漏

**工作量预估**: 2-3 天

---

#### 功能 6: 数据导出功能

**问题描述**:
- 无数据导出能力
- 用户数据无法备份或迁移

**需求**:
- 支持导出为 CSV/JSON 格式
- 包含任务信息和打卡记录

**技术方案**:
1. **后端**:
   - 新增 `GET /export/data` 接口
   - 生成 CSV/JSON 内容返回

2. **前端**:
   - 设置页面添加"导出数据"选项
   - 使用 Android Storage Access Framework 保存文件

**涉及文件**:
- 后端: 新增 `routes/export.js`
- 前端:
  - 新增: `ui/settings/SettingsFragment.kt`
  - 修改: 导航配置

**预期收益**:
- 数据可备份
- 便于分析统计

**工作量预估**: 1-2 天

---

#### 功能 7: 统计图表可视化

**问题描述**:
- 当前统计仅显示数字和简单日历
- 缺乏直观的图表展示

**需求**:
- 使用 MPAndroidChart 添加图表
- 支持折线图、柱状图、饼图

**技术方案**:
1. 添加 MPAndroidChart 依赖
2. **周统计**: 折线图（趋势）
3. **月统计**: 柱状图（每日打卡）
4. **年统计**: 热力图或堆叠柱状图

**涉及文件**:
- 前端:
  - 修改: `build.gradle.kts` (添加依赖)
  - 修改: 各 StatsFragment
  - 新增: 图表配置工具类

**预期收益**:
- 数据更直观
- 提升成就感

**工作量预估**: 2-3 天

---

#### 功能 8: 单元测试

**问题描述**:
- 前后端均无测试代码
- 重构和功能升级风险高

**需求**:
- 后端 API 测试 (Jest/Supertest)
- 前端单元测试 (JUnit + MockK)

**技术方案**:
1. **后端**:
   - 安装: jest, supertest, cross-env
   - 配置测试数据库
   - 为每个路由编写测试用例

2. **前端**:
   - 配置 JUnit + MockK
   - 测试 ViewModel 和工具类

**涉及文件**:
- 后端: 新增 `tests/` 目录
- 前端: 扩展 `test/` 目录下的测试

**预期收益**:
- 提高代码质量
- 降低回归风险

**工作量预估**: 3-4 天

---

### 2.3 🟢 低优先级

#### 功能 9: 深色模式完整支持

**问题描述**:
- 已有 values-night 目录，但可能不完善
- 部分自定义 drawable 可能需要适配

**需求**:
- 完整的深色主题
- 可切换主题（跟随系统/手动选择）

**技术方案**:
1. 审查所有颜色资源
2. 创建深色模式下的 drawable 资源
3. 添加主题切换设置

**工作量预估**: 1-2 天

---

#### 功能 10: 任务分类/标签

**问题描述**:
- 任务无分类
- 任务多时难以管理

**需求**:
- 创建任务分类（健身、学习、生活等）
- 按分类筛选显示
- 统计时可按分类汇总

**工作量预估**: 2-3 天

---

#### 功能 11: 数据本地缓存

**问题描述**:
- 每次都从网络加载
- 无网络时无法使用

**需求**:
- 使用 Room 数据库本地缓存
- 无网络时使用本地数据
- 网络恢复时同步

**工作量预估**: 3-4 天

---

#### 功能 12: 更多图标/自定义图标

**问题描述**:
- 目前只有 20 个预设图标
- 无法自定义图标

**需求**:
- 扩展图标库（50+ 个）
- 支持用户上传自定义图标

**工作量预估**: 1-2 天

---

## 三、实施路线图

### 阶段一: 基础体验优化（1-2 周）

1. 环境变量配置
2. 加载状态与错误处理
3. 任务编辑功能

### 阶段二: 核心功能完善（2-3 周）

1. 任务提醒通知
2. 统计图表可视化
3. 数据导出功能

### 阶段三: 架构升级（可选）

1. 用户认证系统
2. 数据本地缓存（离线支持）
3. 单元测试覆盖

---

## 四、风险评估

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| 数据库迁移（用户系统） | 高 | 编写迁移脚本，测试环境验证 |
| 依赖版本冲突 | 中 | 固定版本号，锁定依赖 |
| Android 通知权限变更 | 中 | 适配最新 Android 版本，动态请求权限 |
| 测试覆盖不足 | 中 | 优先测试核心业务逻辑 |

---

## 五、参考资源

- Koa 文档: https://koajs.com/
- Android Jetpack: https://developer.android.com/jetpack
- MPAndroidChart: https://github.com/PhilJay/MPAndroidChart
- JWT 认证: https://jwt.io/

---

## 六、更新记录

| 日期 | 版本 | 变更内容 |
|------|------|----------|
| 2026-06-06 | v1.0 | 初始版本，完成功能清单整理 |

