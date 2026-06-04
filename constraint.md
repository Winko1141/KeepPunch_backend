# KeepPunch 项目编码约束

## 一、后端约束

### 1. 技术栈锁定
- **框架**: Koa 3.x，禁止切换为 Express
- **数据库**: MySQL + mysql2/promise，禁止使用其他 ORM（如 Sequelize、TypeORM）
- **路由**: `@koa/router`，禁止使用其他路由库

### 2. 目录结构约束
```
KeepPunch_Backend/
├── db/           # 数据库连接配置（不可改名）
│   └── index.js
├── routes/       # 路由模块（不可改名）
│   └── task.js
├── app.js        # 入口文件（不可改名）
└── package.json
```

### 3. 数据库规范
- **连接方式**: 必须使用连接池 `mysql2/promise.createPool()`
- **SQL 注入**: 所有 SQL 必须使用参数化查询 `?` 占位符
- **表名**: 与数据库一致：`task`、`record`、`task_count`

### 4. API 统一响应格式
所有接口必须返回以下格式：

```json
{
  "code": 200,
  "msg": "success",
  "data": {}
}
```

**约定值**:
- `code=200`: 成功
- `code=400`: 参数错误
- `code=404`: 资源不存在
- `code=500`: 服务器错误

### 5. 路由规范
- 所有路由注册在 `app.js` 中统一挂载
- 任务相关路由前缀: `/task/*`
- 记录相关路由前缀: `/record/*`
- 统计相关路由前缀: `/stats/*`

### 6. 业务规则约束
- **任务删除**: 软删除，更新 `status=2`，禁止物理删除
- **week_rule 解析**: 前端传 0-6（Android Java 周索引，周一=0），后端统一转为 1-7（周一=1）存储
- **唯一约束**: `record` 表 `(task_id, record_date)` 唯一，重复打卡返回错误
- **统计方式**: 优先从 `record` 表聚合查询，`task_count` 表作为缓存表（可选）

### 7. 错误处理
- 所有异步操作必须 `try...catch`
- 数据库错误返回 `code=500`，日志打印错误详情
- 参数校验失败返回 `code=400`

---

## 二、前端约束

### 1. 技术栈锁定
- **语言**: Kotlin（禁止 Java）
- **UI 框架**: Android Jetpack + ViewBinding
- **网络**: Retrofit + OkHttp（禁止 Volley）
- **序列化**: Gson（禁止 Moshi）
- **导航**: Navigation Component

### 2. 目录结构约束
```
app/src/main/java/com/example/keeppunch/
├── adapter/          # RecyclerView 适配器
├── api/              # API 调用封装
├── model/            # 数据模型
├── network/          # Retrofit 配置（不可改名）
│   ├── ApiService.kt
│   ├── HttpClient.kt
│   └── RetrofitClient.kt
├── response/         # 响应封装
└── ui/
    ├── home/         # 首页模块
    ├── stats/        # 统计模块
    ├── taskDetail/   # 任务详情
    └── theme/        # 主题配置
```

### 3. 网络层约束
- **BASE_URL**: 统一在 [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt) 配置
- **接口定义**: 全部集中在 [ApiService.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/ApiService.kt)
- **请求方式**: 必须使用 `suspend` + 协程调用

### 4. 数据模型规范
- 所有 API 请求/响应模型放在 `model/` 目录
- 字段命名遵循后端 JSON 字段（或使用 `@SerializedName`）
- 使用 `data class` 定义

### 5. UI 规范
- 使用 ViewBinding，禁止 `findViewById`
- Fragment 中正确管理 `_binding` 生命周期
- 资源引用使用 R 文件，禁止硬编码颜色/尺寸

### 6. 图标映射规则
数据库存储的 `icon` 字段值与 drawable 资源映射：

| 数据库值 | 资源 ID |
|---------|---------|
| "book" | R.drawable.ic_book |
| "cook" | R.drawable.ic_cook |
| "draw" | R.drawable.ic_draw |
| "eat" | R.drawable.ic_eat |
| "exercise" | R.drawable.ic_exercise |
| "fruit" | R.drawable.ic_fruit |
| "happy" | R.drawable.ic_happy |
| "money" | R.drawable.ic_money |
| "nodrink" | R.drawable.ic_nodrink |
| "nosmoke" | R.drawable.ic_nosmoke |
| "play" | R.drawable.ic_play |
| "running" | R.drawable.ic_running |
| "sleep" | R.drawable.ic_sleep |
| "study" | R.drawable.ic_study |
| "vegetables" | R.drawable.ic_vegetables |
| "wakeup" | R.drawable.ic_wakeup |
| "water" | R.drawable.ic_water |
| "weight" | R.drawable.ic_weight |
| "work" | R.drawable.ic_work |
| "write" | R.drawable.ic_write |

### 7. 重复类型枚举
```kotlin
repeat_type:
1 = 周定期（week_rule 有效）
2 = 周次数（target_count = 每周目标次数）
3 = 月次数（target_count = 每月目标次数）
```

### 8. 待删除清单（已确认无用）
- [DashboardFragment.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardFragment.kt)
- [DashboardViewModel.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/ui/dashboard/DashboardViewModel.kt)
- `fragment_dashboard.xml`
- `fragment_notifications.xml`
- 底部导航 Dashboard 项

---

## 三、前后端交互规范

### 1. 日期格式
- 请求: `yyyy-MM-dd` 字符串（如 "2026-06-03"）
- 响应: 日期字段统一为字符串格式 `yyyy-MM-dd`
- 时间: `yyyy-MM-dd HH:mm:ss`

### 2. 分页（如需要）
- 请求参数: `page`, `pageSize`
- 响应: `{ list: [], total: 0 }`

### 3. 状态值约定
| 字段 | 值 | 含义 |
|------|---|------|
| task.status | 1 | 正常 |
| task.status | 2 | 已终止 |
| record.is_finish | 1 | 已打卡 |

---

## 四、命名约定

### 后端
- 路由函数: 动词开头，如 `createTask`, `getTaskList`
- SQL 字段: 蛇形命名 `task_name`, `create_time`
- JavaScript: 驼峰命名

### 前端
- Kotlin: 标准驼峰命名
- XML ID: 蛇形命名 `tv_task_name`, `btn_save`
- 布局文件: `fragment_xxx.xml`, `item_xxx.xml`

---

## 五、不可修改项

| 文件 | 原因 |
|------|------|
| [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js) | 数据库连接配置，可修改连接信息但不可改导出方式 |
| [HttpClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/HttpClient.kt) | OkHttp 客户端单例配置 |
| 数据库表结构 | 已在 MySQL 中创建，如需变更需手动执行 SQL |
