import supertest from 'supertest';

import {
  app,
} from '../server';

import config from '../../config';

export const request = supertest.agent(app.listen(config.port));
