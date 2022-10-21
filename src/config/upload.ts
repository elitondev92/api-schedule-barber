import { randomBytes } from 'crypto';
import { diskStorage, StorageEngine } from 'multer';
import { extname, resolve } from 'path';

const tmpFolder = resolve(__dirname, '..', '..', 'tmp', 'uploads');

interface IUploadConfig {
  tmpFolder: string;

  multer: {
    storage: StorageEngine;
  };
}

export default {
  tmpFolder,

  multer: {
    storage: diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = randomBytes(10).toString('hex');
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'), false);
      }
    },
  },
} as IUploadConfig;
