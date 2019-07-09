const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = new Router();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const logsFrameworkNameMiddleware = async (ctx, next) => {
  console.log('Koa');
  await next();
};

router.post('/', (ctx, next) => {
  console.log('body:', ctx.body);
  console.log('query:', ctx.query);
  console.log('params:', ctx.request.params);
  console.log('headers:', ctx.header);
  ctx.satus = 200;
  ctx.body =  { hello: 'world' };
});

router.post('/error', (ctx, next) => {
  ctx.throw(500, 'This is an Error');
});

router.post('/async', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Hi /async';
  sleep(2500).then(() => console.log('--- SLEEP AFTER 2.5S ---'));
});

router.post('/async/error', (ctx, next) => {
  ctx.status = 200;
  ctx.body = 'Hi /async/error';
  sleep(3000).then(() => ctx.throw(500, '--- ERROR AFTER 3S ---', { some: 'property' }));
});

app
  .use(logsFrameworkNameMiddleware)
  .use(router.routes());

app.listen(3000);
