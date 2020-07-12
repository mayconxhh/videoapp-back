var cloudinary = require('cloudinary').v2;
var path = require('path');
var fs = require('fs');
const ThumbnailGenerator = require('video-thumbnail-generator').default;

// function UploadMedia (req, res, next){
function UploadMedia (file){

  console.log(file.size)
  // console.log(req.files.media)
  return new Promise (function(resolve, reject){

      // console.log(file)

    if(file.size > 30000000 ){
      reject({
        message: 'Archivo demasiado pesado'
      });
    } else {
      
      Upload(file).then(result => {
        resolve(result);
      })
    }

  })
}

async function Upload(file){
  const ext = path.extname(file.originalFilename);
  const uniqueFilename = Date.now()+ext;

  const tg = new ThumbnailGenerator({
    sourcePath: file.path,
    thumbnailPath: './tmp/',
    tmpDir: './tmp/'
  });

  let thumbnailIm = '';
  let ThumbnailImg = {}

  try {
    let thumbnailVideo = await tg.generateOneByPercentCb(90,{size: '854x480'},(err, result) => {
      if(err){
        console.log(err)
      }

      thumbnailIm = result;

      let route = path.resolve(__dirname);

      cloudinary.uploader.upload(`${route}/../tmp/${thumbnailIm}`, {
        folder: '/thumb_videoapp',
        public_id: `/${uniqueFilename}`
      }, (err, result)=>{
        if(err) console.log(err);
        var filePath = `${route}/../tmp/${thumbnailIm}`; 
        fs.unlinkSync(filePath);
        ThumbnailImg = result;
        return;
      })
    
    });

    let videoUp = await cloudinary.uploader.upload(file.path, {
      resource_type: "video", 
      public_id: `/${uniqueFilename}`,
      chunk_size: 600000000,                                  
      eager_async: true,
      folder: '/videoapp',
      tags: 'video'
    }, (err, result)=>{
      return result;
    })

    return {
      url: videoUp.url,
      secure_url: videoUp.secure_url,
      thumbnail_url: ThumbnailImg.url,
      secure_thumbnail_url: ThumbnailImg.secure_url
    }

  } catch(err){
    throw err;
  }

}

module.exports = {
  UploadMedia
}