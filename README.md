## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).


# PostForge

Nest 博客

框架 ：Nestjs
数据库 ：Mysql
缓存 ：Redis
ORM ：prisma
部署: Docker Compose

(1) 用户表 (User)
字段 类型 说明 索引
id String (UUID) 或 Int 主键 主键
username String(50) 唯一用户名 唯一索引
email String(100) 唯一邮箱 唯一索引
passwordHash String 加密后的密码（如 bcrypt） -
role Enum 用户角色（USER, ADMIN） -
createdAt DateTime 创建时间 -
updatedAt DateTime 更新时间 -

(2) 文章表 (Post)
字段 类型 说明 索引
id String (UUID) 或 Int 主键 主键
title String(200) 文章标题 全文索引
content Text 文章正文（Markdown/HTML） -
slug String(200) SEO 友好的 URL 标识（唯一） 唯一索引
status Enum 状态（DRAFT, PUBLISHED） -
authorId String 或 Int 外键关联 User.id 外键索引
categoryId String 或 Int 外键关联 Category.id 外键索引
createdAt DateTime 创建时间 -
updatedAt DateTime 更新时间 -

(3) 分类表 (Category)
字段 类型 说明 索引
id String (UUID) 或 Int 主键 主键
name String(50) 分类名称（唯一） 唯一索引
slug String(50) URL 标识（如 tech, life） 唯一索引


(4) 标签表 (Tag)
字段 类型 说明 索引
id String (UUID) 或 Int 主键 主键
name String(50) 标签名称（唯一） 唯一索引
slug String(50) URL 标识（如 nestjs, prisma） 唯一索引
