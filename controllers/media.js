'use strict'

const Media = require('../models/media');
const { UploadMedia } = require('../helpers/UploadMedia');

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
  const file = req.files.media;

  UploadMedia(file)
    .then(function(result){
      return res
              .status(200)
              .send({
                success:true,
                casa:'kekeke',
                files: result
              })
    }, function(err){
      console.log(err)
      return res
          .status(500)
          .send({
            success:false,
            error:err
          })
    })

}

module.exports = {
  GetMedia,
  NewMedia
}