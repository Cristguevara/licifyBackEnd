const cloudinary = require('cloudinary').v2;
      
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true, 
});

const saveCloudinaryImage = async ( fileUri ) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileUri, {
      invalidate: true
    })
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

const deleteCloudinaryImage = async ( id ) => {
  cloudinary.uploader.destroy(id).then(result=>{
    return result
  });
}

module.exports= {
  saveCloudinaryImage,
  deleteCloudinaryImage
}