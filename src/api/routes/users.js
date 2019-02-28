import Router from 'koa-router';
import mongoose from 'mongoose';

import {
  User,
} from '../../db';

import {
  authorize,
} from '../auth/token';

const perPage = 10;

const router = new Router({
  prefix: '/users',
});

router.get('/', async (ctx) => {
  const page = ctx.query?.page || 1;
  const users = await User.find()
    .select('-password')
    .skip(perPage * (page - 1))
    .limit(parseInt(perPage, 10));

  ctx.status = 200;
  ctx.body = {
    users,
  };
});

router.post('/', authorize(), async (ctx) => {
  const attributes = ctx.request.body;

  try {
    const newUser = new User({ ...attributes }, []);
    await newUser.save();

    const user = await User.findOne({
      _id: newUser._id,
    })
      .select('-password');

    ctx.status = 201;
    ctx.body = {
      user,
    };
  } catch (e) {
    console.log('Error', e);
    ctx.status = 500;
  }
});

router.patch('/:id', authorize(), async (ctx) => {
  const attributes = ctx.request.body;

  try {
    const user = await User.findByIdAndUpdate(
      ctx.params.id,
      {
        ...attributes,
      },
      {
        new: true,
      },
    )
      .select('-password');

    if (user) {
      ctx.status = 200;
      ctx.body = {
        user,
      };
    } else {
      ctx.status = 404;
    }
  } catch (error) {
    if (error.message instanceof mongoose.Error.CastError) {
      ctx.status = 404;
      return;
    }
    ctx.status = 500;
  }
});

router.delete('/:id', authorize(), async (ctx) => {
  try {
    await User.findByIdAndDelete(ctx.params.id);
    ctx.status = 200;
  } catch (error) {
    if (error.message instanceof mongoose.Error.CastError) {
      ctx.status = 404;
      return;
    }
    ctx.status = 500;
  }
});

router.get('/:id', async (ctx) => {
  try {
    const user = await User.findOne({
      _id: ctx.params.id,
    })
      .select('-password');

    if (user) {
      ctx.status = 200;
      ctx.body = {
        user,
      };
    } else {
      ctx.status = 404;
    }
  } catch (error) {
    if (error.message instanceof mongoose.Error.CastError) {
      ctx.status = 404;
      return;
    }
    ctx.status = 500;
  }
});


export default router;
