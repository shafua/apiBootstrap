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
    const response = await request
      .get('/api/users');

    expect(response.res.statusCode).to.be.equal(200);
    expect(response.body).to.have.all.keys('users');
    expect(response.body.users).to.be.an('array');
    // lets set 10 items perpage and assume that fixtures are loaded
    expect(response.body.users.length).to.be.equal(10);
    expect(response.body.users[0]).to.have.all.keys('name', '_id');
  });

  it('"/api/users" should return second 10 elements', async () => {
    const response = await request
      .get('/api/users?page=2');

    expect(response.res.statusCode).to.be.equal(200);
    expect(response.body).to.have.all.keys('users');
    expect(response.body.users).to.be.an('array');
    // lets set 10 items perpage and assume that fixtures are loaded
    expect(response.body.users.length).to.be.equal(10);
    expect(response.body.users[0]).to.have.all.keys('name', '_id');
    // TODO: check pagination differently
    expect(response.body.users[0].name).to.be.not.equal('admin');
  });

  it('"/api/users/{_id}" should return user', async () => {
    const response = await request
      .get('/api/users');
    const firstUserId = response.body?.users?.[0]?._id;
    expect(firstUserId).to.be.a('string');

    const singleUserResponse = await request
      .get(`/api/users/${firstUserId}`);

    expect(singleUserResponse.res.statusCode).to.be.equal(200);

    expect(singleUserResponse.body).to.have.all.keys('user');
    expect(singleUserResponse.body.user).to.have.all.keys('name', '_id');
  });

  it('"/api/users/{_id}" should return 404 for non existing user', async () => {
    const singleUserResponse = await request
      .get(`/api/users/${ObjectId()}`);

    expect(singleUserResponse.res.statusCode).to.be.equal(404);
  });
});
