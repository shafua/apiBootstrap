import mongoose from 'mongoose';

import config from '../config';

mongoose.Promise = global.Promise;

mongoose.connect(
  config.mongo,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
  },
);

const usersSchema = mongoose.Schema(
  {
    name: { type: String, index: true },
    password: { type: String },
  },
  {
    versionKey: false,
  },
);

export const User = mongoose.model('User', usersSchema);
