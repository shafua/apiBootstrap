import chai from 'chai';
import {
  ObjectId,
} from 'mongodb';

import {
  request,
} from './utils';

const { expect } = chai;

describe('Users -- read', () => {
  it('"/api/users" should return first 10 elements', async () => {
    const {
      body: {
        status,
        result,
      },
    } = await request
      .get('/api/users');

    expect(status).to.be.equal(200);
    expect(result).to.have.all.keys('users');
    expect(result.users).to.be.an('array');
    // lets set 10 items perpage and assume that fixtures are loaded
    expect(result.users.length).to.be.equal(10);
    expect(result.users[0]).to.have.all.keys('name', '_id');
  });

  it('"/api/users" should return second 10 elements', async () => {
    const {
      body: {
        status,
        result,
      },
    } = await request
      .get('/api/users?page=2');

    expect(status).to.be.equal(200);
    expect(result).to.have.all.keys('users');
    expect(result.users).to.be.an('array');
    // lets set 10 items perpage and assume that fixtures are loaded
    expect(result.users.length).to.be.equal(10);
    expect(result.users[0]).to.have.all.keys('name', '_id');
    // TODO: check pagination differently
    expect(result.users[0].name).to.be.not.equal('admin');
  });

  it('"/api/users/{_id}" should return user', async () => {
    const { body: { result } } = await request
      .get('/api/users');
    const firstUserId = result?.users?.[0]?._id;
    expect(firstUserId).to.be.a('string');

    const {
      body: {
        status: singleUserStatus,
        result: singleUserResult,
      },
    } = await request
      .get(`/api/users/${firstUserId}`);

    expect(singleUserStatus).to.be.equal(200);

    expect(singleUserResult).to.have.all.keys('user');
    expect(singleUserResult.user).to.have.all.keys('name', '_id');
  });

  it('"/api/users/{_id}" should return 404 for non existing user', async () => {
    const { body: { status: singleUserStatus } } = await request
      .get(`/api/users/${ObjectId()}`);

    expect(singleUserStatus).to.be.equal(404);
  });
});
