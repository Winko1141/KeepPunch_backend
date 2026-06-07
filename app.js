const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const bodyParser = require('koa-bodyparser');
const Router = require('@koa/router');
const cors = require('@koa/cors');
const router = new Router();

const taskRouter = require('./routes/task');
const recordRouter = require('./routes/record');
const statsRouter = require('./routes/stats');
const categoryRouter = require('./routes/category');
const iconRouter = require('./routes/icon');

app.use(cors());
app.use(json());
app.use(bodyParser({
    jsonLimit: '10mb',
    formLimit: '10mb',
    textLimit: '10mb'
}));

router.get('/test', ctx => {
    ctx.body = {
        msg: '后端连接成功'
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(taskRouter.routes());
app.use(taskRouter.allowedMethods());

app.use(recordRouter.routes());
app.use(recordRouter.allowedMethods());

app.use(statsRouter.routes());
app.use(statsRouter.allowedMethods());

app.use(categoryRouter.routes());
app.use(categoryRouter.allowedMethods());

app.use(iconRouter.routes());
app.use(iconRouter.allowedMethods());

app.listen(3000, () => {
    console.log('server running on port 3000');
});
