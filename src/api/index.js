import Koa from 'koa';
import Router from 'koa-router';

const app = new Koa();

// app.use(auth(passport));

const router = new Router({
  prefix: '/api',
});

router.get('/test', async (ctx) => {
  ctx.body = {
    test: true,
  };
});

app.use(router.routes());

export default app;
