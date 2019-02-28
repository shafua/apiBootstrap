import faker from 'faker';
import bcrypt from 'bcrypt';
import {
  ObjectId,
} from 'mongodb';

const users = [
  {
    _id: ObjectId(),
    name: 'admin',
    password: bcrypt.hashSync('password', 10),
  },
  ...[...(new Array(100)).keys()].map(key => ({
    _id: ObjectId(),
    name: faker.name.firstName(),
    password: bcrypt.hashSync(`password${key}`, 10),
  })),
];

module.exports = users;
