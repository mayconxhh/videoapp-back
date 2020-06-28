var cloudinary = require('cloudinary').v2;
var path = require('path');
var fs = require('fs');
const ThumbnailGenerator = require('video-thumbnail-generator').default;

cloudinary.config({ 
  cloud_name: 'mayconxhh', 
  api_key: '427942691184476', 
  api_secret: 'vbEzyC89Hx9KPIWjhgAER_z__4c' 
});

exports.UploadMedia = function(req, res, next){
  const file = req.files.media;
  // console.log(req.files.media)

  console.log(req.body)
  console.log(file)

  Upload(file).then(result => {
    // console.log('------------------------------------')
    // console.log(result)
    // console.log('------------------------------------')
    res.videoapp = result;
    next();
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
      // console.log('image');
      // console.log(result)
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