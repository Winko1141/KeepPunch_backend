# KeepPunch 功能升级实施计划 - 任务提醒与分类功能

## 文档信息

- 创建日期: 2026-06-06
- 适用项目: KeepPunch (后端 + 前端)
- 状态: 待审核

---

## 一、代码库现状分析

### 1.1 后端现状

| 模块 | 文件位置 | 说明 |
|------|----------|------|
| 任务路由 | [task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js) | 任务的CRUD操作 |
| 统计路由 | [stats.js](file:///d:/xm/KeepPunch_Backend/routes/stats.js) | 周/月/年统计 |
| 打卡记录 | [record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js) | 打卡操作 |
| 数据库连接 | [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js) | MySQL连接池 |

**task表现有字段**:
- id, task_name, icon, repeat_type, week_rule, target_count, status, create_time

### 1.2 前端现状

| 模块 | 文件位置 | 说明 |
|------|----------|------|
| 任务创建 | [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) | 创建任务页面 |
| 任务编辑 | [EditTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/EditTaskFragment.kt) | 编辑任务页面 |
| 首页 | [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) | 任务列表和打卡 |
| 任务详情 | [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt) | 任务详情页 |
| 数据模型 | [TaskItem.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/TaskItem.kt) | 任务数据模型 |
| API接口 | [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | Retrofit接口定义 |
| 清单文件 | [AndroidManifest.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/AndroidManifest.xml) | 应用配置 |

### 1.3 技术栈确认

- **后端**: Node.js + Koa + MySQL (mysql2/promise)
- **前端**: Android (Kotlin, minSdk 24, targetSdk 36) + Retrofit + Coroutines
- **通知**: Android AlarmManager + NotificationManager

---

## 二、功能5: 任务提醒/通知功能

### 2.1 需求分析

**核心需求**:
1. 用户可为任务设置提醒时间
2. 支持开启/关闭提醒
3. 在设定时间弹出本地通知
4. 根据重复规则触发提醒

**用户场景**:
- 用户创建"早起"任务，设置每天07:00提醒
- 用户创建"健身"任务，设置每周一三五18:00提醒
- 用户临时不想被提醒，可关闭提醒开关

### 2.2 技术方案

#### 2.2.1 数据库变更

```sql
-- 为task表添加提醒相关字段
ALTER TABLE task 
ADD COLUMN reminder_time VARCHAR(5) DEFAULT NULL COMMENT '提醒时间，格式HH:mm',
ADD COLUMN reminder_enabled TINYINT(1) DEFAULT 0 COMMENT '是否开启提醒，0关闭1开启';
```

**字段说明**:
- `reminder_time`: 存储格式为 "HH:mm"，如 "08:00"、"18:30"
- `reminder_enabled`: 布尔值，表示是否启用提醒

#### 2.2.2 后端改动

| 文件 | 改动类型 | 说明 |
|------|----------|------|
| [task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js) | 修改 | 添加提醒字段支持 |

**具体改动**:

1. **POST /task/create**:
   - 新增参数: `reminder_time` (可选, 格式HH:mm), `reminder_enabled` (可选, 默认0)
   - SQL INSERT语句添加新字段

2. **GET /task/list**:
   - 返回数据包含 `reminder_time`, `reminder_enabled`

3. **GET /task/:id**:
   - 返回数据包含 `reminder_time`, `reminder_enabled`

4. **PUT /task/:id**:
   - 支持更新 `reminder_time`, `reminder_enabled`

#### 2.2.3 前端改动

**新增文件**:
| 文件 | 说明 |
|------|------|
| `util/NotificationHelper.kt` | 通知管理工具类 |
| `receiver/AlarmReceiver.kt` | 闹钟广播接收器 |
| `receiver/BootReceiver.kt` | 开机自启动接收器 |

**修改文件**:
| 文件 | 改动说明 |
|------|----------|
| [AndroidManifest.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/AndroidManifest.xml) | 添加通知权限、接收器注册 |
| [TaskItem.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/TaskItem.kt) | 添加提醒字段 |
| [CreateTaskRequest.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/CreateTaskRequest.kt) | 添加提醒字段 |
| [bottom_sheet_add_task.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/bottom_sheet_add_task.xml) | 添加提醒设置UI |
| [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) | 支持提醒设置 |
| [EditTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/EditTaskFragment.kt) | 支持提醒设置 |
| [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) | 加载任务时设置闹钟 |

**前端实现要点**:

1. **权限配置**:
   - POST_NOTIFICATIONS (Android 13+)
   - SCHEDULE_EXACT_ALARM (Android 12+)
   - RECEIVE_BOOT_COMPLETED
   - SET_ALARM

2. **通知流程**:
   - 用户设置提醒时间 → 保存到服务器 → 设置AlarmManager
   - 闹钟触发 → AlarmReceiver → 显示通知
   - 点击通知 → 打开应用到首页

3. **重复规则处理**:
   - 周定期: 为选中的每一天设置闹钟
   - 周次数/月次数: 每天设置闹钟，实际触发时检查是否需要打卡

### 2.3 工作量分解

| 任务 | 复杂度 | 预估步骤 |
|------|--------|----------|
| 数据库SQL编写 | 低 | 提供ALTER语句 |
| 后端路由修改 | 低 | 修改4个接口 |
| 前端UI添加 | 中 | 添加时间选择器和开关 |
| 通知工具类 | 中 | NotificationHelper |
| 广播接收器 | 中 | AlarmReceiver + BootReceiver |
| 权限配置 | 低 | Manifest配置 |
| 集成测试 | 中 | 验证提醒触发 |

---

## 三、功能10: 任务分类/标签

### 3.1 需求分析

**核心需求**:
1. 创建/管理任务分类（健身、学习、生活等）
2. 任务创建时选择分类
3. 首页按分类筛选任务
4. 统计页面按分类汇总

**用户场景**:
- 用户创建"健身"、"学习"、"生活"三个分类
- 创建"跑步"任务，归类到"健身"
- 在首页只看"学习"类的任务
- 统计页面查看各分类的完成情况

### 3.2 技术方案

#### 3.2.1 数据库变更

```sql
-- 新建分类表
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '分类名称',
    icon VARCHAR(50) NOT NULL DEFAULT 'default' COMMENT '分类图标',
    color VARCHAR(7) NOT NULL DEFAULT '#FF6B00' COMMENT '分类颜色，十六进制',
    sort_order INT NOT NULL DEFAULT 0 COMMENT '排序顺序',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='任务分类表';

-- 插入默认分类
INSERT INTO category (name, icon, color, sort_order) VALUES
('健身', 'exercise', '#E91E63', 1),
('学习', 'study', '#2196F3', 2),
('生活', 'home', '#4CAF50', 3),
('工作', 'work', '#FF9800', 4),
('健康', 'health', '#9C27B0', 5);

-- 为task表添加分类关联
ALTER TABLE task 
ADD COLUMN category_id INT DEFAULT NULL COMMENT '分类ID',
ADD CONSTRAINT fk_task_category 
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE SET NULL;
```

**表结构说明**:
- `category`表: 管理分类信息
- `task.category_id`: 关联分类，可为空（未分类）

#### 3.2.2 后端改动

**新增文件**:
| 文件 | 说明 |
|------|------|
| `routes/category.js` | 分类CRUD接口 |

**修改文件**:
| 文件 | 改动说明 |
|------|----------|
| [task.js](file:///d:/xm/KeepPunch_Backend/routes/task.js) | 支持category_id |
| [stats.js](file:///d:/xm/KeepPunch_Backend/routes/stats.js) | 按分类统计 |
| [app.js](file:///d:/xm/KeepPunch_Backend/app.js) | 注册category路由 |

**新增API接口**:
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /category/list | 获取所有分类 |
| POST | /category/create | 创建分类 |
| PUT | /category/:id | 更新分类 |
| DELETE | /category/:id | 删除分类 |

**现有接口修改**:

1. **POST /task/create**:
   - 新增参数: `category_id` (可选)

2. **GET /task/list**:
   - 新增参数: `category_id` (可选，按分类筛选)
   - 返回数据包含分类信息

3. **GET /task/:id**:
   - 返回数据包含分类信息

4. **PUT /task/:id**:
   - 支持更新 `category_id`

5. **GET /stats/week/month/year**:
   - 可按分类过滤统计

#### 3.2.3 前端改动

**新增文件**:
| 文件 | 说明 |
|------|------|
| `model/CategoryItem.kt` | 分类数据模型 |
| `ui/category/CategoryFragment.kt` | 分类管理页面 |
| `ui/category/AddCategoryFragment.kt` | 添加/编辑分类页面 |
| `adapter/CategoryAdapter.kt` | 分类列表适配器 |
| `layout/fragment_category.xml` | 分类管理布局 |
| `layout/fragment_add_category.xml` | 添加分类布局 |
| `layout/item_category.xml` | 分类项布局 |
| `layout/dialog_select_category.xml` | 分类选择对话框 |

**修改文件**:
| 文件 | 改动说明 |
|------|----------|
| [TaskItem.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/TaskItem.kt) | 添加category_id和category信息 |
| [CreateTaskRequest.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/model/CreateTaskRequest.kt) | 添加category_id |
| [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt) | 添加分类相关API |
| [bottom_sheet_add_task.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/bottom_sheet_add_task.xml) | 添加分类选择UI |
| [AddTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/AddTaskFragment.kt) | 支持分类选择 |
| [EditTaskFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/EditTaskFragment.kt) | 支持分类选择 |
| [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt) | 添加分类筛选 |
| [fragment_home.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/layout/fragment_home.xml) | 添加筛选栏UI |
| [mobile_navigation.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/navigation/mobile_navigation.xml) | 添加分类页面路由 |
| [bottom_nav_menu.xml](file:///d:/xm/KeepPunch_frontend/app/src/main/res/menu/bottom_nav_menu.xml) | 添加分类菜单项 |

**前端实现要点**:

1. **分类管理页面**:
   - 显示所有分类列表
   - 支持添加、编辑、删除分类
   - 支持拖拽排序

2. **任务创建/编辑**:
   - 添加分类选择下拉框
   - 默认选中"未分类"

3. **首页筛选**:
   - 顶部添加分类筛选栏
   - 支持"全部"和各分类选项

4. **导航结构**:
   - 底部导航新增"分类"标签
   - 或在设置页面入口

### 3.3 工作量分解

| 任务 | 复杂度 | 预估步骤 |
|------|--------|----------|
| 数据库SQL编写 | 低 | CREATE TABLE + ALTER TABLE |
| 后端分类路由 | 中 | CRUD接口 |
| 后端任务接口修改 | 中 | 支持category_id |
| 后端统计接口修改 | 中 | 按分类过滤 |
| 前端分类管理页面 | 高 | Fragment + Adapter |
| 前端分类选择组件 | 中 | Dialog/Spinner |
| 前端首页筛选 | 中 | UI + 逻辑 |
| 前端导航修改 | 低 | 菜单和路由 |
| 集成测试 | 中 | 分类筛选验证 |

---

## 四、实施步骤

### 阶段一: 数据库准备
1. 用户执行数据库SQL语句（功能5和功能10）

### 阶段二: 功能5（任务提醒）后端开发
1. 修改 `routes/task.js` 支持提醒字段

### 阶段三: 功能5（任务提醒）前端开发
1. 修改数据模型和API接口
2. 添加通知工具类和广播接收器
3. 修改Manifest权限
4. 添加提醒设置UI
5. 修改AddTaskFragment和EditTaskFragment
6. 修改HomeFragment设置闹钟

### 阶段四: 功能10（任务分类）后端开发
1. 新增 `routes/category.js`
2. 修改 `routes/task.js` 支持category_id
3. 修改 `routes/stats.js` 支持分类过滤
4. 修改 `app.js` 注册路由

### 阶段五: 功能10（任务分类）前端开发
1. 新增CategoryItem模型
2. 新增分类管理相关Fragment和布局
3. 修改任务创建/编辑页面
4. 新增分类选择组件
5. 修改首页添加筛选功能
6. 修改导航配置

### 阶段六: 测试与验证
1. 提醒功能测试（不同重复规则、开关控制）
2. 分类功能测试（创建、删除、筛选）
3. 兼容性测试（Android版本）

---

## 五、潜在风险与处理

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| Android通知权限变更 | 中 | 适配Android 13+ POST_NOTIFICATIONS，动态请求权限 |
| 闹钟在某些机型被杀 | 中 | 使用setExactAndAllowWhileIdle，引导用户加入白名单 |
| 开机自启不生效 | 中 | 部分厂商需要手动开启，添加引导提示 |
| 分类删除时关联任务处理 | 低 | 外键设置ON DELETE SET NULL，任务变为未分类 |
| 数据迁移问题 | 低 | 新字段允许NULL，不影响现有数据 |

---

## 六、验证清单

### 功能5验证
- [ ] 数据库字段添加成功
- [ ] 创建任务可设置提醒时间和开关
- [ ] 编辑任务可修改提醒设置
- [ ] 提醒时间到达时弹出通知
- [ ] 关闭开关后不触发提醒
- [ ] 周定期任务在正确的日期触发
- [ ] 通知点击可打开应用

### 功能10验证
- [ ] 分类表创建成功并有默认分类
- [ ] 可创建新分类
- [ ] 可编辑和删除分类
- [ ] 任务创建时可选择分类
- [ ] 首页可按分类筛选任务
- [ ] 删除分类后关联任务变为未分类
- [ ] 统计页面按分类过滤正常

---

## 七、依赖确认

### 后端
- 无需新增依赖，现有 mysql2/promise 足够

### 前端
- 无需新增依赖，使用Android系统API
  - AlarmManager
  - NotificationManager
  - BroadcastReceiver
