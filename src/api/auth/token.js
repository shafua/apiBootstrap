import passport from 'koa-passport';

export function authorize() {
  return (
    req,
    next,
  ) => passport.authenticate(
    'jwt',
    {
      session: false,
    },
    (error, user) => {
      if (error || !user) {
        req.status = 401;
        if (error && error.message) {
          req.body = {
            error: error.message,
          };
        }
        return;
      }
      if (user) {
        req.state.user = user;
      }
      return next(); // eslint-disable-line consistent-return
    },
  )(req, next);
}
