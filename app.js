const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');//将http响应格式化为json
const bodyParser = require('koa-bodyparser');//解析http请求体
const Router = require('@koa/router');
const cors = require('@koa/cors');
const router = new Router();
const pool = require('./db/index');

app.use(cors());
app.use(json());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

// app.listen(7000)
router.get('/test', ctx => {
    ctx.body = {
        msg: '后端连接成功'
    }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(3000, () => {
    console.log('server running')
})