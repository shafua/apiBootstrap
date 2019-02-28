import chai from 'chai';

import {
  request,
} from './utils';

const { expect } = chai;

describe('Users -- test', () => {
  it('test', async () => {
    const response = await request
      .get('/api/test');

    expect(
      response.body.test,
    ).to.equal(true);
  });

  it('"/api/users" should return first 10 elements', async () => {
    const response = await request
      .get('/api/users');

    expect(response.body).to.have.all.keys('users');
    expect(response.body.users).to.be.an('array');
    // lets set 10 items perpage and assume that fixtures are loaded
    expect(response.body.users.lenght).to.be.equal(10);
    expect(response.body.users[0]).to.have.all.keys('name', '_id');
  });

  it('"/api/users/{_id}" should return user', async () => {
    const response = await request
      .get('/api/users');
    const firstUserId = response.body?.users?.[0]?._id;
    expect(firstUserId).to.be.a('string');

    const singleUserResponse = await request
      .get(`/api/users/${firstUserId}`);

    expect(singleUserResponse.body).to.have.all.keys('user');
    expect(singleUserResponse.body.user).to.have.all.keys('name');
  });
});