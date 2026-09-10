# 家庭管理工作台 (Family Management Workbench)

一个简单的家庭任务和家务管理应用，帮助家庭成员协作完成日常事务。

## 功能特性

- **待办事项管理**: 创建、分配、完成家庭待办事项
- **家务轮值表**: 每周家务分配和完成追踪
- **家庭成员管理**: 邀请码机制，家长/成员角色
- **首页仪表盘**: 今日待办和今日轮值一览

## 技术栈

- **框架**: Next.js 16+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: Cookie-based session (MVP stub)

## 快速开始

### 1. 安装依赖

```bash
cd family-workbench
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并配置数据库连接：

```bash
cp .env.example .env
```

编辑 `.env` 文件，设置 `DATABASE_URL`：

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/family_workbench?schema=public"
```

### 3. 初始化数据库

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev --name init

# (可选) 添加演示数据
npx prisma db seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 数据库模型

### Household (家庭)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| name | String | 家庭名称 |
| inviteCode | String | 唯一邀请码 |
| createdAt | DateTime | 创建时间 |

### Member (成员)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| householdId | String | 所属家庭 |
| name | String | 成员名称 |
| role | Role | PARENT 或 MEMBER |
| createdAt | DateTime | 创建时间 |

### Todo (待办)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| householdId | String | 所属家庭 |
| title | String | 待办标题 |
| assigneeId | String? | 负责人 |
| dueDate | DateTime? | 截止日期 |
| done | Boolean | 是否完成 |
| createdAt | DateTime | 创建时间 |

### Chore (家务)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| householdId | String | 所属家庭 |
| title | String | 家务名称 |
| createdAt | DateTime | 创建时间 |

### ChoreAssignment (家务分配)
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String | 主键 |
| choreId | String | 家务ID |
| memberId | String | 负责人ID |
| weekStart | Date | 周开始日期 |
| done | Boolean | 是否完成 |
| createdAt | DateTime | 创建时间 |

## 页面路由

| 路由 | 说明 |
|------|------|
| `/` | 首页 - 今日待办和轮值 |
| `/todos` | 待办列表 - 创建、分配、完成 |
| `/chores` | 家务表 - 本周家务分配 |
| `/family` | 家庭管理 - 成员、角色、邀请码 |
| `/onboarding` | 引导页 - 创建/加入家庭 |

## 认证说明

当前使用简单的 Cookie-based session 作为 MVP 认证方案。Session 数据以 Base64 编码存储在 HTTP-only cookie 中。

### 扩展认证系统

参见 `src/lib/auth.ts` 中的详细说明，可扩展为：

1. **JWT 认证**: 使用 jose 或 jsonwebtoken 库
2. **OAuth**: 集成 next-auth，支持 Google/GitHub 登录
3. **密码认证**: 添加 passwordHash 字段，使用 bcrypt
4. **安全增强**: iron-session 加密、CSRF 防护、限流

## 开发命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务
npm run start

# 代码检查
npm run lint

# Prisma Studio (数据库可视化)
npx prisma studio

# 重置数据库
npx prisma migrate reset
```

## MVP 范围

### 已实现
- ✅ 家庭创建和邀请码加入
- ✅ 待办事项 CRUD
- ✅ 家务轮值分配
- ✅ 首页今日视图
- ✅ 成员角色管理

### 待实现 (Out of Scope)
- ❌ 账单管理
- ❌ 文档存储
- ❌ 真实 OAuth 认证
- ❌ 像素级 UI 设计
- ❌ 推送通知

## 许可证

MIT
