# KeepPunch 自定义图标功能实施计划

## 文档信息

- 创建日期: 2026-06-07
- 适用项目: KeepPunch (后端 + 前端)
- 状态: 待审核

---

## 一、现状分析

### 1.1 现有数据库结构

**task 表（任务表）**:
- 已有 `icon` 字段，类型 `VARCHAR(100)`，存储图标名称如 "book", "exercise"
- 20 个预设图标名称已在使用

**category 表（分类表）**:
- 已有 `icon` 字段，类型 `VARCHAR(50)`，存储图标名称
- 默认分类预设了 5 个图标

### 1.2 前端图标实现

**[IconMapper.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/util/IconMapper.kt)** 核心逻辑:
- 硬编码 20 个预设图标的名称到 Android Drawable 资源 ID 的映射
- `getResIdFromName()`: 根据图标名称获取资源 ID
- `getAllIcons()`: 返回所有预设图标列表

**当前 20 个预设图标**:
| 名称 | 对应资源 |
|------|----------|
| book | R.drawable.ic_book |
| cook | R.drawable.ic_cook |
| draw | R.drawable.ic_draw |
| eat | R.drawable.ic_eat |
| exercise | R.drawable.ic_exercise |
| fruit | R.drawable.ic_fruit |
| happy | R.drawable.ic_happy |
| money | R.drawable.ic_money |
| nodrink | R.drawable.ic_nodrink |
| nosmoke | R.drawable.ic_nosmoke |
| play | R.drawable.ic_play |
| running | R.drawable.ic_running |
| sleep | R.drawable.ic_sleep |
| study | R.drawable.ic_study |
| vegetables | R.drawable.ic_vegetables |
| wakeup | R.drawable.ic_wakeup |
| water | R.drawable.ic_water |
| weight | R.drawable.ic_weight |
| work | R.drawable.ic_work |
| write | R.drawable.ic_write |

---

## 二、需求分析

### 2.1 核心需求

1. **图标数据化**: 将图标定义从前端硬编码迁移到数据库管理
2. **自定义图标**: 用户可以上传/添加自定义图标
3. **向后兼容**: 现有数据不被破坏，预设图标继续可用

### 2.2 用户场景

- 用户在创建任务/分类时，除了选择预设图标，还可以从相册选择或拍照自定义图标
- 用户可以管理自己的自定义图标（查看、删除）
- 系统预设图标不可修改或删除

---

## 三、技术方案

### 3.1 数据库设计

#### 方案选择: 独立图标表 + 引用模式

**核心思路**:
- 新建 `icon` 表统一管理所有图标（预设 + 自定义）
- `task` 和 `category` 表的 `icon` 字段改为外键关联 `icon.id`
- 但为了向后兼容，保留字符串引用方式，通过命名规则区分

**最终方案**: 混合引用模式

1. 新建 `icon` 表存储图标元数据
2. `task.icon` 和 `category.icon` 字段含义扩展:
   - 纯名称（如 "book"）: 系统预设图标，兼容旧数据
   - "custom:{id}" 格式: 用户自定义图标，id 为 icon 表记录 ID

### 3.2 数据库变更 SQL

#### 第一步: 新增图标管理表

```sql
-- 图标表：统一管理系统预设图标和用户自定义图标
CREATE TABLE IF NOT EXISTS icon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '图标名称/标识',
    display_name VARCHAR(100) DEFAULT NULL COMMENT '显示名称（可选）',
    icon_type ENUM('system', 'custom') NOT NULL DEFAULT 'custom' COMMENT '图标类型：system=系统预设，custom=用户自定义',
    icon_content TEXT COMMENT '图标内容：system类型存储资源名称，custom类型存储base64编码的图片数据',
    icon_format VARCHAR(20) DEFAULT 'png' COMMENT '图标格式：png, jpg, svg等',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用：1启用 0禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_name_type (name, icon_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图标管理表';
```

#### 第二步: 初始化系统预设图标数据

```sql
-- 插入所有预设图标到 icon 表（icon_type = 'system'）
-- 注意：icon_content 存储资源名称，保持与前端 IconMapper 一致
INSERT INTO icon (name, display_name, icon_type, icon_content, icon_format, sort_order, is_active) VALUES
('book', '阅读', 'system', 'ic_book', 'png', 1, 1),
('cook', '烹饪', 'system', 'ic_cook', 'png', 2, 1),
('draw', '绘画', 'system', 'ic_draw', 'png', 3, 1),
('eat', '美食', 'system', 'ic_eat', 'png', 4, 1),
('exercise', '健身', 'system', 'ic_exercise', 'png', 5, 1),
('fruit', '水果', 'system', 'ic_fruit', 'png', 6, 1),
('happy', '开心', 'system', 'ic_happy', 'png', 7, 1),
('money', '理财', 'system', 'ic_money', 'png', 8, 1),
('nodrink', '戒酒', 'system', 'ic_nodrink', 'png', 9, 1),
('nosmoke', '戒烟', 'system', 'ic_nosmoke', 'png', 10, 1),
('play', '娱乐', 'system', 'ic_play', 'png', 11, 1),
('running', '跑步', 'system', 'ic_running', 'png', 12, 1),
('sleep', '睡眠', 'system', 'ic_sleep', 'png', 13, 1),
('study', '学习', 'system', 'ic_study', 'png', 14, 1),
('vegetables', '蔬菜', 'system', 'ic_vegetables', 'png', 15, 1),
('wakeup', '早起', 'system', 'ic_wakeup', 'png', 16, 1),
('water', '喝水', 'system', 'ic_water', 'png', 17, 1),
('weight', '体重', 'system', 'ic_weight', 'png', 18, 1),
('work', '工作', 'system', 'ic_work', 'png', 19, 1),
('write', '写作', 'system', 'ic_write', 'png', 20, 1);
```

#### 第三步: 调整现有表结构（可选，增强查询能力）

```sql
-- 说明：task 和 category 表的 icon 字段已经存在，无需修改结构
-- 但建议增加索引以提升查询性能（如果数据量大）

-- 为 task 表 icon 字段添加索引
ALTER TABLE task ADD INDEX idx_task_icon (icon);

-- 为 category 表 icon 字段添加索引
ALTER TABLE category ADD INDEX idx_category_icon (icon);
```

---

## 四、图标引用规则设计

### 4.1 引用格式

| 格式 | 示例 | 含义 |
|------|------|------|
| 纯名称 | `book` | 系统预设图标，icon_content 中存储资源名 |
| custom:{id} | `custom:1` | 用户自定义图标，id 为 icon 表主键 |
| resource:{name} | `resource:ic_book` | 显式指定 Android 资源（可选扩展） |

### 4.2 兼容旧数据

现有数据直接使用纯名称格式（如 `book`），无需迁移，完全兼容。

---

## 五、后端改动

### 5.1 新增文件

| 文件 | 说明 |
|------|------|
| `routes/icon.js` | 图标管理 API 路由 |

### 5.2 新增 API 接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| GET | `/icon/list` | 获取可用图标列表（系统预设 + 用户自定义） | 公开 |
| GET | `/icon/system` | 获取系统预设图标列表 | 公开 |
| GET | `/icon/custom` | 获取用户自定义图标列表 | 需要认证 |
| POST | `/icon/upload` | 上传自定义图标（multipart/form-data） | 需要认证 |
| POST | `/icon/create` | 创建图标（base64 方式） | 需要认证 |
| GET | `/icon/:id` | 获取单个图标详情 | 公开 |
| PUT | `/icon/:id` | 更新图标信息 | 只能改自定义 |
| DELETE | `/icon/:id` | 删除图标 | 只能删自定义 |

### 5.3 返回格式设计

**GET /icon/list 返回示例**:
```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "system": [
      {
        "id": 1,
        "name": "book",
        "display_name": "阅读",
        "icon_type": "system",
        "icon_content": "ic_book",
        "sort_order": 1
      }
    ],
    "custom": [
      {
        "id": 21,
        "name": "custom_21",
        "display_name": "我的图标",
        "icon_type": "custom",
        "icon_content": "data:image/png;base64,iVBORw0KG...",
        "sort_order": 1
      }
    ]
  }
}
```

### 5.4 现有接口影响

**分类接口 `category.js`**: 无需修改，继续使用 icon 字段

**任务接口 `task.js`**: 无需修改，继续使用 icon 字段

---

## 六、前端改动

### 6.1 数据模型改动

| 文件 | 改动说明 |
|------|----------|
| `model/IconItem.kt` | 新增：图标数据模型 |

**IconItem.kt 结构**:
```kotlin
data class IconItem(
    val id: Int,
    val name: String,
    val display_name: String?,
    val icon_type: String,  // "system" or "custom"
    val icon_content: String,
    val icon_format: String,
    val sort_order: Int
) {
    // 判断是否为系统图标
    fun isSystem(): Boolean = icon_type == "system"
    
    // 获取引用值（用于存储到 task.icon 或 category.icon）
    fun getReference(): String = if (isSystem()) name else "custom:$id"
}
```

### 6.2 工具类改动

**[IconMapper.kt](file:///d:/xm/KeepPunch_frontend/app/src/main/java/com/example/keeppunch/util/IconMapper.kt)** 增强:

1. 新增方法 `parseIconReference()`: 解析图标引用字符串
2. 新增方法 `loadCustomIcon()`: 从 base64 加载自定义图标
3. 新增方法 `loadIconAsync()`: 统一加载图标（系统/自定义）

```kotlin
object IconMapper {
    // 原有方法保持不变，用于向后兼容
    
    // 解析图标引用
    // 返回: Pair<类型, 内容> 类型: "system" | "custom"
    fun parseIconReference(reference: String): Pair<String, String> {
        return if (reference.startsWith("custom:")) {
            Pair("custom", reference.removePrefix("custom:"))
        } else {
            Pair("system", reference)
        }
    }
    
    // 从 base64 加载位图
    fun loadBitmapFromBase64(base64: String): Bitmap? {
        val cleanBase64 = base64.removePrefix("data:image/png;base64,")
                                   .removePrefix("data:image/jpeg;base64,")
        val decodedString = Base64.decode(cleanBase64, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(decodedString, 0, decodedString.size)
    }
}
```

### 6.3 UI 组件改动

| 文件 | 改动说明 |
|------|----------|
| `dialog_icon_picker.xml` | 增强：添加自定义图标上传入口 |
| `AddTaskFragment.kt` | 支持选择自定义图标 |
| `EditTaskFragment.kt` | 支持选择自定义图标 |
| `CategoryManagerFragment.kt` | 支持选择自定义图标 |
| `TaskAdapter.kt` | 支持显示自定义图标 |
| `CategoryAdapter.kt` | 支持显示自定义图标 |
| `TaskDetailFragment.kt` | 支持显示自定义图标 |

### 6.4 图标选择器设计

**功能**:
1. Tab 切换: "系统图标" / "我的图标"
2. 系统图标页: 网格展示 20 个预设图标
3. 我的图标页: 网格展示用户自定义图标 + "+ 添加" 按钮
4. 添加图标: 拍照 / 从相册选择 / 裁剪

---

## 七、数据迁移（可选）

如果需要将现有硬编码图标完全迁移到数据库管理模式:

```sql
-- 可选：将 task 表中使用的图标名标准化
-- （当前数据已经是兼容格式，无需迁移）

-- 如果未来需要切换到 ID 引用模式，可以执行:
-- 1. 先确保所有预设图标已插入 icon 表
-- 2. 查询对应关系并更新

-- 仅供参考，当前不需要执行
```

---

## 八、验证清单

### 数据库验证
- [ ] `icon` 表创建成功
- [ ] 20 个系统预设图标数据插入成功
- [ ] 索引创建成功

### 后端验证
- [ ] `/icon/list` 接口返回系统图标
- [ ] 上传自定义图标成功
- [ ] 自定义图标 CRUD 正常

### 前端验证
- [ ] 图标选择器显示系统图标
- [ ] 可上传自定义图标
- [ ] 任务/分类使用自定义图标显示正常
- [ ] 向后兼容：旧数据正常显示

---

## 九、完整 SQL 执行清单

### 必须执行的 SQL

```sql
-- 1. 创建图标表
CREATE TABLE IF NOT EXISTS icon (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '图标名称/标识',
    display_name VARCHAR(100) DEFAULT NULL COMMENT '显示名称（可选）',
    icon_type ENUM('system', 'custom') NOT NULL DEFAULT 'custom' COMMENT '图标类型：system=系统预设，custom=用户自定义',
    icon_content TEXT COMMENT '图标内容：system类型存储资源名称，custom类型存储base64编码的图片数据',
    icon_format VARCHAR(20) DEFAULT 'png' COMMENT '图标格式：png, jpg, svg等',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    is_active TINYINT(1) DEFAULT 1 COMMENT '是否启用：1启用 0禁用',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_name_type (name, icon_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图标管理表';

-- 2. 插入预设图标
INSERT INTO icon (name, display_name, icon_type, icon_content, icon_format, sort_order, is_active) VALUES
('book', '阅读', 'system', 'ic_book', 'png', 1, 1),
('cook', '烹饪', 'system', 'ic_cook', 'png', 2, 1),
('draw', '绘画', 'system', 'ic_draw', 'png', 3, 1),
('eat', '美食', 'system', 'ic_eat', 'png', 4, 1),
('exercise', '健身', 'system', 'ic_exercise', 'png', 5, 1),
('fruit', '水果', 'system', 'ic_fruit', 'png', 6, 1),
('happy', '开心', 'system', 'ic_happy', 'png', 7, 1),
('money', '理财', 'system', 'ic_money', 'png', 8, 1),
('nodrink', '戒酒', 'system', 'ic_nodrink', 'png', 9, 1),
('nosmoke', '戒烟', 'system', 'ic_nosmoke', 'png', 10, 1),
('play', '娱乐', 'system', 'ic_play', 'png', 11, 1),
('running', '跑步', 'system', 'ic_running', 'png', 12, 1),
('sleep', '睡眠', 'system', 'ic_sleep', 'png', 13, 1),
('study', '学习', 'system', 'ic_study', 'png', 14, 1),
('vegetables', '蔬菜', 'system', 'ic_vegetables', 'png', 15, 1),
('wakeup', '早起', 'system', 'ic_wakeup', 'png', 16, 1),
('water', '喝水', 'system', 'ic_water', 'png', 17, 1),
('weight', '体重', 'system', 'ic_weight', 'png', 18, 1),
('work', '工作', 'system', 'ic_work', 'png', 19, 1),
('write', '写作', 'system', 'ic_write', 'png', 20, 1);

-- 3. 添加索引（可选，建议执行）
ALTER TABLE task ADD INDEX idx_task_icon (icon);
ALTER TABLE category ADD INDEX idx_category_icon (icon);
```

---

## 十、风险与注意事项

| 风险项 | 影响 | 缓解措施 |
|--------|------|----------|
| base64 存储占用空间大 | 中 | 限制图片尺寸（建议 64x64 或 128x128），压缩后再存储 |
| 自定义图标加载慢 | 中 | 前端实现缓存机制，避免重复解码 |
| 数据库查询性能 | 低 | icon_content 使用 TEXT 类型，可存储较大数据；添加合适索引 |
| 兼容性问题 | 低 | 保持 icon 字段字符串格式，旧数据完全兼容 |
