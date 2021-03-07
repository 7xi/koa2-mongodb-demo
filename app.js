import Koa from 'koa'
import Router from 'koa-router'
import BodyParser from 'koa-bodyparser'

import config from './config'
import chalk from 'chalk'

// routes
import user from './routes/user'
import article from './routes/article'

// jwt
const { check_token } = require('./utils/auth')

// MongoDB
import db from './mongodb'

const app = new Koa()
const router = new Router()
const port = config.port

// get request
app.use(BodyParser())

app.use(check_token)

// 配置路由
app.use(router.routes()).use(router.allowedMethods())

router.use('/api/users', user)
router.use('/api/articles', article)

// logger
app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })

// 启动服务
app.listen(port, () =>
    console.log(
        chalk.blue(`Server Started on ${port}...`)
    )
)