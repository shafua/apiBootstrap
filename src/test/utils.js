import supertest from 'supertest';

import {
  app,
} from '../server';

import config from '../../config';

export const request = supertest.agent(app.listen(config.port));

export function loginUser(meta, { name, password }) {
  return (done) => {
    request
      .post('/api/auth/token')
      .send({
        name,
        password,
      })
      .expect(200)
      .end((err, res) => {
        meta.token = res.body.result.jwtToken;
        meta.statusCode = res.body.status;
        return done();
      });
  };
}
