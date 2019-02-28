import chai from 'chai';

import {
  loginUser,
} from './utils';

const { expect } = chai;

describe('Auth', () => {
  it('POST "/api/auth/token" should return token', async () => {
    const meta = {};
    await new Promise(loginUser(meta, { name: 'admin', password: 'password' }));
    expect(meta).to.have.all.keys('token');
  });
});
