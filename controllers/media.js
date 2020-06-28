'use strict'

const Media = require('../models/media');
var cloudinary = require('cloudinary').v2

cloudinary.config({ 
  cloud_name: 'mayconxhh', 
  api_key: '427942691184476', 
  api_secret: 'vbEzyC89Hx9KPIWjhgAER_z__4c'
});

function GetMedia(req, res, next){
  Media.find((err, medias)=>{
    if (err) {

      return res
              .status(500)
              .send({
                success:false,
                message: 'Ocurrió un error al encontrar animes',
                err
              });

    }

    if (!animes) {
      return res
              .status(404)
              .send({
                success:false,
                message: 'No se completó la operación'
              });
    }

    return res
              .status(200)
              .send({
                success:true,
                medias,
              });
  })
}

function NewMedia(req, res) {
  // console.log(req)
  // let params = req.body;
  console.log(res.videoapp)

  return res
          .status(200)
          .send({
            success:true,
            files: res.videoapp
          })

  

}

module.exports = {
  GetMedia,
  NewMedia
}