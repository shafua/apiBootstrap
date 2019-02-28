import Koa from 'koa';
import passport from 'koa-passport';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';

import auth from './auth';

import {
  User,
} from '../db';
import config from '../../config';

import usersRoutes from './routes/users';

const app = new Koa();
app.use(auth(passport));

const router = new Router({
  prefix: '/api',
});

router.post('/auth/token', async (ctx) => {
  const { name } = ctx.request.body;

  const user = await User.findOne({
    name,
  });
  if (user) {
    const jwtToken = jwt.sign(
      {
        userId: user._id,
      },
      config.jwtSecret,
    );
    ctx.body = {
      success: true,
      jwtToken,
    };
    return;
  }
  ctx.status = 500;
  ctx.body = {
    success: false,
    errorMessage: 'Something wrong',
  };
});

router.use(usersRoutes.routes());

app.use(router.routes());

export default app;
