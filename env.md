# KeepPunch 运行环境说明

## 项目架构
```
KeepPunch (打卡应用)
├── KeepPunch_Backend   # Node.js 后端
└── KeepPunch_frontend  # Android 前端
```

---

## 一、后端环境

### 1. 技术栈
| 组件 | 版本 | 说明 |
|------|------|------|
| Node.js | >= 18.x | LTS 版本 |
| pnpm | 10.12.4 | 包管理器 |
| Koa | 3.2.0 | Web 框架 |
| mysql2 | 3.22.3 | MySQL 驱动 |
| MySQL | >= 5.7 | 数据库 |

### 2. 依赖清单
```json
{
  "@koa/cors": "^5.0.0",
  "@koa/router": "^15.4.0",
  "koa": "^3.2.0",
  "koa-bodyparser": "^4.4.1",
  "koa-json": "^2.0.2",
  "mysql2": "^3.22.3"
}
```

### 3. 安装依赖
```powershell
# 在 KeepPunch_Backend 目录下
cd d:\xm\KeepPunch_Backend
pnpm install
```

### 4. 数据库配置
修改 [db/index.js](file:///d:/xm/KeepPunch_Backend/db/index.js#L5-L13)：

```javascript
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',         // 你的 MySQL 用户名
  password: 'root',     // 你的 MySQL 密码
  database: 'keeppunch', // 数据库名
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**数据库准备**：
```sql
-- 创建数据库
CREATE DATABASE keeppunch;

-- 三张表结构见 todo.md，已在 MySQL 中创建
```

### 5. 启动命令
```powershell
# 开发模式
pnpm run dev
# 或
node app.js

# 默认端口: 3000
```

### 6. 测试接口
启动后访问：
```
GET http://localhost:3000/test

响应:
{
  "msg": "后端连接成功"
}
```

---

## 二、前端环境

### 1. 技术栈
| 组件 | 版本 | 说明 |
|------|------|------|
| Android Studio | 任意版本 | 建议 Hedgehog 及以上 |
| Kotlin | 1.9.x | 项目配置在 build.gradle |
| Gradle | 8.x | 项目使用 |
| JDK | 17 | Android Studio 自带 |
| Retrofit | 2.x | 网络请求 |
| OkHttp | 4.x | HTTP 客户端 |
| Gson | 2.x | JSON 序列化 |
| Material | 1.x | UI 组件 |

### 2. 关键依赖（已在项目中配置）
- ViewBinding
- Navigation Component
- Kizitonwose CalendarView（日历组件）
- MPAndroidChart（图表组件）
- FlycoTabLayout（Tab 组件）

### 3. 模拟器配置
**当前使用**: MuMu 模拟器

**网络配置说明**：
Android 模拟器访问本机后端需要特殊处理：

| 环境 | 宿主机 IP | 说明 |
|------|----------|------|
| 官方 Android 模拟器 | `10.0.2.2` | 固定映射 |
| MuMu 模拟器 | `127.0.0.1` 或宿主机 IP | 需确认 |
| 真机调试 | 宿主机局域网 IP | 需同网络 |

**当前配置**（[RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt#L9-L10)）：
```kotlin
BASE_URL = "http://10.78.237.209:3000/"
```

### 4. 换网络后的配置步骤

**IP 变化时，更新前端 BASE_URL**：

1. 在 Windows 命令行查看当前 IP：
```powershell
ipconfig
# 找到 IPv4 地址，如: 192.168.1.100
```

2. 修改 [RetrofitClient.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/network/RetrofitClient.kt)：
```kotlin
// 改为你的当前 IP
BASE_URL = "http://你的IP:3000/"
```

3. 确保后端允许局域网访问：
   - 后端监听 `0.0.0.0:3000`（当前 app.js 已配置 `app.listen(3000)`，默认监听所有网卡）
   - Windows 防火墙可能需要放行

### 5. 构建运行
```
1. 用 Android Studio 打开 KeepPunch_frontend 目录
2. 等待 Gradle 同步完成
3. 选择模拟器或真机
4. 点击 Run (▶) 按钮
```

---

## 三、启动顺序

### 完整启动流程

```
第一步：启动 MySQL 服务
└── 确保 MySQL 已启动并可连接

第二步：启动后端
├── cd d:\xm\KeepPunch_Backend
├── pnpm install (首次或依赖变化时)
├── pnpm run dev
└── 确认控制台打印: server running + 数据库连接成功

第三步：启动前端
├── 查看本机 IP: ipconfig
├── 更新 RetrofitClient.kt 中的 BASE_URL
├── Android Studio 中点击 Run
└── 查看 Logcat: "连接成功：后端连接成功"
```

### 验证连接
1. 后端启动后，浏览器访问 `http://localhost:3000/test`
2. 前端启动后，Logcat 搜索 "RetrofitTest"，应看到 "连接成功"

---

## 四、目录结构总览

```
工作目录: d:\xm
├── KeepPunch_Backend/        # 后端
│   ├── db/
│   │   └── index.js          # 数据库连接
│   ├── routes/
│   │   └── task.js           # 任务路由
│   ├── app.js                # 入口
│   ├── package.json
│   ├── pnpm-lock.yaml
│   ├── todo.md               # 待办清单
│   ├── constraint.md         # 编码约束
│   └── env.md                # 本文件
│
└── KeepPunch_frontend/       # 前端
    ├── app/
    │   └── src/main/
    │       ├── java/com/example/keeppunch/
    │       │   ├── adapter/          # 适配器
    │       │   ├── api/              # API
    │       │   ├── model/            # 数据模型
    │       │   ├── network/          # Retrofit 配置
    │       │   ├── response/         # 响应封装
    │       │   └── ui/               # 页面
    │       ├── res/                  # 资源文件
    │       └── AndroidManifest.xml
    ├── gradle/
    └── build.gradle.kts
```

---

## 五、常见问题

### Q1: 后端启动报错 "数据库连接失败"
**解决**: 
- 检查 MySQL 服务是否启动
- 确认用户名密码正确
- 确认数据库 `keeppunch` 已创建

### Q2: 前端无法连接后端
**解决**:
- 确认后端已启动
- 检查 `BASE_URL` IP 是否正确
- 确认手机/模拟器和电脑在同一网络
- 检查 Windows 防火墙是否拦截

### Q3: MuMu 模拟器如何访问本机后端
**建议方案**:
1. 方案一：使用宿主机局域网 IP（如 `192.168.1.100:3000`）
2. 方案二：在 MuMu 设置中查看网络桥接模式

### Q4: 端口被占用
```powershell
# 查看端口占用
netstat -ano | findstr :3000

# 结束进程（替换 PID）
taskkill /PID <PID> /F
```
