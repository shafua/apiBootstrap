import Router from 'koa-router';

import {
  User,
} from '../../db';

const perPage = 10;

const router = new Router({
  prefix: '/users',
});

router.get('/', async (ctx) => {
  const page = 1;
  const users = await User.find()
    .select('-password')
    .skip(perPage * (page - 1))
    .limit(parseInt(perPage, 10));

  ctx.body = {
    users,
  };
});

router.get('/:id', async (ctx) => {
  const user = await User.findOne({
    _id: ctx.params.id,
  })
    .select('-password');

  ctx.body = {
    user,
  };
});


export default router;
