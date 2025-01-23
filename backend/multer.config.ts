import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './src/db/cloudinary';


const storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: async (req, file) => {
            return {
                folder: `user_uploads`,
                public_id: uuidv4()
            }
        }
    })

export const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });
