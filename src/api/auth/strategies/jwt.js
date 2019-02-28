import passportJwt from 'passport-jwt';

import config from '../../../../config';

import {
  User,
} from '../../../db';

const opts = {};
opts.jwtFromRequest = passportJwt.ExtractJwt.fromAuthHeaderWithScheme('Bearer');
opts.secretOrKey = config.jwtSecret;

export default new passportJwt.Strategy(opts, async (payload, done) => {
  try {
    const user = await User.findOne({
      _id: payload.userId,
    });
    if (!user) {
      console.log('User not found ==> %s', payload.user.id);
      return done(null, false);
    }
    return done(null, user, { scope: '*' });
  } catch (error) {
    return done(error);
  }
});
