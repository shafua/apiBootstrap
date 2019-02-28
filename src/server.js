import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import mount from 'koa-mount';

import api from './api';

const app = new Koa();
app
  .use(cors())
  .use(bodyParser());


app.use(mount(api));

export {
  app,
};
