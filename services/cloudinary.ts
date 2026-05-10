import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export async function uploadMedia(file: string, folder = 'inkingi') {
  const result = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: 'auto'
  });
  return {
    publicId: result.public_id,
    imageUrl: result.secure_url
  };
}
