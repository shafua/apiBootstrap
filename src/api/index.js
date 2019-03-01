import Koa from 'koa';
import passport from 'koa-passport';
import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
  const {
    name,
    password,
  } = ctx.request.body;

  const user = await User.findOne({
    name,
  });
  const savedPassword = user.password;
  if (user) {
    if (!(savedPassword && bcrypt.compareSync(password, savedPassword))) {
      ctx.status = 400;
      ctx.body = {
        success: false,
        errorMessage: 'Wrong username or password',
      };
      return;
    }
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
  ctx.status = 400;
  ctx.body = {
    success: false,
    errorMessage: 'Wrong username or password',
  };
});

router.use(usersRoutes.routes());

app.use(async (ctx, next) => {
  try {
    await next();
    if (!ctx.body && (!ctx.status || ctx.status >= 400)) throw new Error('Something wrong');
    ctx.body = {
      status: ctx.status,
      result: ctx.body,
      error: false,
    };
  } catch (e) {
    ctx.body = {
      status: ctx.status || 500,
      result: ctx.body,
      error: true,
      message: e.message,
    };
  }
});

app.use(router.routes());

export default app;
