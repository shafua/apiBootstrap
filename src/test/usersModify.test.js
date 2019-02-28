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

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${meta.token}`)
      .send({
        name,
        password,
      });

    expect(response.res.statusCode).to.be.equal(201);

    expect(response.body).to.have.all.keys('user');

    expect(response.body.user).to.have.all.keys('name', '_id');

    expect(response.body.user).to.not.have.any.keys('password');

    expect(response.body.user.name).to.be.equal(name);
  });

  it('POST "/api/users" should not allow to create with wrong password', async () => {
    const name = `${faker.name.firstName()} Test`;
    const password = faker.name.firstName();

    const response = await request
      .post('/api/users')
      .set('Authorization', `Bearer ${metaWrongPass.token}`)
      .send({
        name,
        password,
      });

    expect(response.res.statusCode).to.be.equal(401);
  });
});

describe('Users -- update', () => {
  const meta = {};
  before(loginUser(meta, { name: 'admin', password: 'password' }));

  it('PATCH "/api/users/:id" should update user', async () => {
    const usersResponse = await request
      .get('/api/users');
    const secondUser = usersResponse.body?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');

    const newName = `${secondUser.name} Updated ${Date.now()}`;

    const response = await request
      .patch(`/api/users/${secondUser._id}`)
      .set('Authorization', `Bearer ${meta.token}`)
      .send({
        name: newName,
      });

    expect(response.res.statusCode).to.be.equal(200);

    expect(response.body).to.have.all.keys('user');
    expect(response.body.user).to.have.all.keys('name', '_id');
    expect(response.body.user).to.not.have.any.keys('password');

    expect(response.body.user.name).to.be.equal(newName);
  });
});

describe('Users -- delete', () => {
  const meta = {};
  before(loginUser(meta, { name: 'admin', password: 'password' }));

  it('PATCH "/api/users/:id" should update user', async () => {
    const usersResponse = await request
      .get('/api/users');
    const secondUser = usersResponse.body?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');


    const response = await request
      .delete(`/api/users/${secondUser._id}`)
      .set('Authorization', `Bearer ${meta.token}`);

    expect(response.res.statusCode).to.be.equal(200);

    const singleUserResponse = await request
      .get(`/api/users/${secondUser._id}`);

    expect(singleUserResponse.res.statusCode).to.be.equal(404);
  });
});
