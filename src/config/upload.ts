import uuid from 'uuid';
import { diskStorage, StorageEngine } from 'multer';
import { extname } from 'path';

interface IUploadConfig {
  multerConfig: {
    storage: StorageEngine;
  };
}

export default {
  multerConfig: {
    storage: diskStorage({
      destination: './tmp/uploads',
      filename: (req, file, cb) => {
        const fileName = `${uuid.v4()}${extname(file.originalname)}`;

        return cb(null, fileName);
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
