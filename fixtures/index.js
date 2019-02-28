import Fixtures from 'node-mongodb-fixtures';
import path from 'path';

import {
  mongo as uri,
} from '../config';

const fixtures = new Fixtures({
  dir: path.join(__dirname, 'data'),
  filter: 'users.js',
});

fixtures
  .connect(uri)
  .then(() => fixtures.unload())
  .then(() => fixtures.load())
  .catch(e => console.error(e))
  .finally(() => {
    fixtures.disconnect();
  });
