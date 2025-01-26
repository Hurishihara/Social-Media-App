import 'dotenv/config'
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

export const extractPublicId = (imageUrl: string): string => {
    const parts = imageUrl.split('/');
    const fileWithExtension = parts.pop();
    const publicId = fileWithExtension?.split('.')[0];
    const folderPath = parts.slice(7).join('/');
    return `${folderPath}/${publicId}`;
}

export default cloudinary;