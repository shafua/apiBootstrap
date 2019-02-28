import faker from 'faker';
import {
  ObjectId,
} from 'mongodb';

const users = [
  {
    _id: ObjectId(),
    name: 'admin',
  },
  ...[...(new Array(100)).keys()].map(() => ({
    _id: ObjectId(),
    name: faker.name.firstName(),
  })),
];

module.exports = users;
