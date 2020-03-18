import multer from 'multer';
// import crypto from 'cr'
import { resolve } from 'path';

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    filename: (req, file, cb) => {
      console.log(file);
      console.log(req);

      return cb(null, 'BATATA.png');
    },
  }),
};
