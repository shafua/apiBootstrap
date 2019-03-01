import passport from 'koa-passport';

export function authorize() {
  return (
    ctx,
    next,
  ) => passport.authenticate(
    'jwt',
    {
      session: false,
    },
    (error, user) => {
      if (error || !user) {
        ctx.status = 401;
        if (error && error.message) {
          ctx.body = {
            error: error.message,
          };
        }
        return;
      }
      if (user) {
        ctx.state.user = user;
      }
      return next(); // eslint-disable-line consistent-return
    },
  )(ctx, next);
}
