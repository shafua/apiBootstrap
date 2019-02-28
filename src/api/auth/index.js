import compose from 'koa-compose';

import jwt from './strategies/jwt';

export default (passport) => {
  passport.use('jwt', jwt);
  return compose([
    passport.initialize(),
  ]);
};
