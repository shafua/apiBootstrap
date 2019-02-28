import pkg from '../package.json';
import config from '../config';
import {
  app,
} from './server';

/* eslint-disable */
const banner = `
*********************************************************************************************
*
* ${pkg.description}
* @version ${pkg.version}
*
*********************************************************************************************`;
/* eslint-enable */

console.log(banner);
(async () => {
  app.listen(config.port, () => {
    console.log(`App started on port ${config.port}`);
  });
})();
