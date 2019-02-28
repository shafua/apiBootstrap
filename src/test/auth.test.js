import chai from 'chai';

import {
  loginUser,
} from './utils';

const { expect } = chai;

describe('Auth', () => {
  it('POST "/api/auth/token" should return token', async () => {
    const meta = {};
    await new Promise(loginUser(meta, { name: 'admin', password: 'password' }));
    expect(meta).to.have.any.keys('token');
  });

  it('POST "/api/auth/token" should return 400 on wrong password', async () => {
    const meta = {};
    await new Promise(loginUser(meta, { name: 'admin', password: 'wrongPassword' }));
    expect(meta.statusCode).to.be.equal(400);
  });
});
