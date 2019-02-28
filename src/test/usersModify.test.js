import chai from 'chai';
import faker from 'faker';

import {
  request,
} from './utils';

const { expect } = chai;

describe('Users -- create', () => {
  it('POST "/api/users" should create new record', async () => {
    const name = `${faker.name.firstName()} Test`;
    const password = faker.name.firstName();

    const response = await request
      .post('/api/users')
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
});

describe('Users -- update', () => {
  it('PATCH "/api/users/:id" should update user', async () => {
    const usersResponse = await request
      .get('/api/users');
    const secondUser = usersResponse.body?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');

    const newName = `${secondUser.name} Updated ${Date.now()}`;

    const response = await request
      .patch(`/api/users/${secondUser._id}`)
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
  it('PATCH "/api/users/:id" should update user', async () => {
    const usersResponse = await request
      .get('/api/users');
    const secondUser = usersResponse.body?.users?.[2];
    expect(secondUser).to.have.all.keys('name', '_id');


    const response = await request
      .delete(`/api/users/${secondUser._id}`);

    expect(response.res.statusCode).to.be.equal(200);

    const singleUserResponse = await request
      .get(`/api/users/${secondUser._id}`);

    expect(singleUserResponse.res.statusCode).to.be.equal(404);
  });
});
