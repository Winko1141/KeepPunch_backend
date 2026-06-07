# 打卡补签与限制功能实现计划

## 1. 仓库分析结论

### 1.1 后端实现分析
- **打卡路由**: [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js)
  - `POST /record/checkin` - 打卡接口
  - `DELETE /record/checkin` - 取消打卡接口
  - 目前没有未来日期限制检查
  - 没有区分正常打卡和补签

- **统计路由**: [routes/stats.js](file:///d:/xm/KeepPunch_Backend/routes/stats.js)
  - 周/月/年统计接口
  - 用于前端日历展示打卡状态

### 1.2 前端实现分析
- **打卡主页**: [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt)
  - 周视图日历选择器
  - 可选择未来日期并打卡（需要添加限制）

- **任务详情页**: [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt)
  - 月视图日历展示
  - 日历当前不可点击（需要增加补签功能）

- **API服务**: [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt)
  - 现有打卡接口定义

### 1.3 数据库分析
现有数据表：
- `record` - 打卡记录表
- `task` - 任务表
- `task_count` - 打卡统计表

**不涉及数据库结构修改**，仅需要修改业务逻辑。

---

## 2. 功能需求分析

### 2.1 需求1：任务详情打卡日历增加补签功能
- 点击未打卡的日期可以补签
- 点击已打卡的日期可以取消打卡
- 补签限制：只能补签过去的日期（不包括未来日期）

### 2.2 需求2：打卡页面不能打卡未来时期的任务
- 选择未来日期时，任务列表仍可查看
- 点击打卡按钮时提示"不能打卡未来日期"
- 后端也要做同样的校验（双重保护）

---

## 3. 修改方案

### 3.1 后端修改

#### 文件1: [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js)

**修改1 - 打卡接口增加未来日期限制**
- 在 `POST /record/checkin` 接口中添加日期校验
- 如果 `record_date > 今天`，返回错误提示

**修改2 - 增强打卡逻辑支持补签**
- 现有打卡逻辑本身可以接受任意日期（包括过去日期）
- 只需要添加错误信息区分："未来日期不能打卡" vs "该日期已打卡"

### 3.2 前端修改

#### 文件1: [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt)

**修改1 - 打卡时增加未来日期判断**
- 在 `handleCheckin` 方法中
- 如果选择日期 > 今天，弹出 Toast 提示"不能打卡未来日期"
- 不调用后端接口

**可选优化**：
- 未来日期的任务打卡按钮可以置灰或隐藏
- 或者在日历上禁用未来日期选择

#### 文件2: [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt)

**修改1 - 增加日历日期点击事件**
- 在 `setupCalendar` 的 `bind` 方法中添加点击监听
- 点击逻辑：
  - 未来日期：提示"不能补签未来日期"
  - 过去日期（未打卡）：调用补签（打卡）接口
  - 过去日期（已打卡）：调用取消打卡接口

**修改2 - 补签/取消后刷新**
- 操作成功后刷新日历和统计数据

---

## 4. 详细实施步骤

### 步骤1：后端修改
1. 修改 [routes/record.js](file:///d:/xm/KeepPunch_Backend/routes/record.js) 中 `POST /record/checkin`
   - 添加日期格式校验
   - 添加未来日期判断逻辑
   - 返回清晰的错误提示

### 步骤2：前端打卡页限制
1. 修改 [HomeFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/home/HomeFragment.kt)
   - 在 `handleCheckin` 方法中增加日期判断
   - 显示提示信息

### 步骤3：前端任务详情页补签功能
1. 修改 [TaskDetailFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/taskDetail/TaskDetailFragment.kt)
   - 增加日期点击事件绑定
   - 实现补签/取消补签逻辑
   - 添加 UI 交互反馈

---

## 5. 依赖与注意事项

### 5.1 日期比较注意事项
- 前后端都需要使用本地日期比较
- 只比较年/月/日，不比较时分秒
- 格式统一使用 `yyyy-MM-dd`

### 5.2 后端日期判断逻辑
```
record_date <= today → 允许打卡/补签
record_date > today  → 拒绝，返回错误
```

### 5.3 前端日期判断逻辑
- 使用 `LocalDate.now()` 获取今天日期
- 使用 `isAfter()` 方法比较

---

## 6. 风险处理

| 风险 | 处理方案 |
|------|----------|
| 前后端时区不一致 | 统一使用 yyyy-MM-dd 格式字符串比较 |
| 用户绕过前端直接调用API | 后端必须做校验 |
| 补签操作误触 | 可以考虑添加确认弹窗 |

---

## 7. SQL语句说明

**本功能不涉及数据库结构修改**，无需执行 SQL 语句。

现有表结构已满足需求：
- `record` 表已有 `record_date` 字段存储打卡日期
- `task_count` 表统计逻辑已通过事务处理
