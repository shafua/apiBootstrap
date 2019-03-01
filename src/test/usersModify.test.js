import chai from 'chai';
import faker from 'faker';

import {
  request,
  loginUser,
} from './utils';

const { expect } = chai;

describe('Users -- create', () => {
  const meta = {};
  const metaWrongPass = {};
  before(loginUser(meta, { name: 'admin', password: 'password' }));
  before(loginUser(metaWrongPass, { name: 'admin', password: 'wrongPassword' }));

  it('POST "/api/users" should create new record', async () => {
    const name = `${faker.name.firstName()} Test`;
    const password = faker.name.firstName();

    const {
      body: {
        status,
        result,
      },
    } = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${meta.token}`)
      .send({
        name,
        password,
      });

    expect(status).to.be.equal(201);

    expect(result).to.have.all.keys('user');

    expect(result.user).to.have.all.keys('name', '_id');

    expect(result.user).to.not.have.any.keys('password');

    expect(result.user.name).to.be.equal(name);
  });

  it('POST "/api/users" should not allow to create with wrong password', async () => {
    const name = `${faker.name.firstName()} Test`;
    const password = faker.name.firstName();

    const { body: { status } } = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${metaWrongPass.token}`)
      .send({
        name,
        password,
      });

    expect(status).to.be.equal(401);
  });
});

describe('Users -- update', () => {
  const meta = {};
  before(loginUser(meta, { name: 'admin', password: 'password' }));

  it('PATCH "/api/users/:id" should update user', async () => {
    const { body: { result: usersResult } } = await request
      .get('/api/users');
    const secondUser = usersResult?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');

    const newName = `${secondUser.name} Updated ${Date.now()}`;

    const {
      body: {
        status,
        result,
      },
    } = await request
      .patch(`/api/users/${secondUser._id}`)
      .set('Authorization', `Bearer ${meta.token}`)
      .send({
        name: newName,
      });

    expect(status).to.be.equal(200);

    expect(result).to.have.all.keys('user');
    expect(result.user).to.have.all.keys('name', '_id');
    expect(result.user).to.not.have.any.keys('password');

    expect(result.user.name).to.be.equal(newName);
  });
});

describe('Users -- delete', () => {
  const meta = {};
  before(loginUser(meta, { name: 'admin', password: 'password' }));

  it('PATCH "/api/users/:id" should update user', async () => {
    const { body: { result: usersResult } } = await request
      .get('/api/users');
    const secondUser = usersResult?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');


    const { body: { status } } = await request
      .delete(`/api/users/${secondUser._id}`)
      .set('Authorization', `Bearer ${meta.token}`);

    expect(status).to.be.equal(200);

    const { body: { status: singleUserStatus } } = await request
      .get(`/api/users/${secondUser._id}`);

    expect(singleUserStatus).to.be.equal(404);
  });
});
