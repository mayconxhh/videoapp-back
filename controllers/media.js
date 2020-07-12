'use strict'

const Media = require('../models/media');
const { UploadMedia } = require('../helpers/UploadMedia');

function GetMedia(req, res, next){
  Media
    .find()
    .select('name description date author thumbnail secure_thumbnail')
    .exec((err, medias)=>{
      if (err) {

        return res
                .status(500)
                .send({
                  success:false,
                  message: 'Ocurrió un error al encontrar videos.',
                  err
                });

      }

      if (!medias) {
        return res
                .status(404)
                .send({
                  success:false,
                  message: 'No se completó la operación.'
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
  const media = req.body;
  media.author = req.user.sub;
  media.date = new Date();
  const file = req.files.media;

  UploadMedia(file)
    .then(function(result){
      media.url = result.url;
      media.secure_url = result.secure_url;
      media.thumbnail = result.thumbnail_url;
      media.secure_thumbnail = result.secure_thumbnail_url;
      const newMedia = new Media(media);
      newMedia.save((err, media)=>{
        if ( err ){
          return res
                    .status(500)
                    .send({
                      success: false,
                      message: 'Error al subir video.',
                      err: err
                    });
       }

        if ( media ) {
          media.password = undefined;
          res
            .status(200)
            .send({
              success: true,
              media: media,
              message: 'Publicación creada con éxito.'
            });
        } else {
          res
            .status(404)
            .send({
              success: false,
              message: 'No se ha podido crear la publicación'
            });
        }
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