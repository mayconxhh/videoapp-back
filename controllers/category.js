'use strict'

const Category = require('../models/category');

function GetCategories(req, res, next){
  Category.find((err, categories)=>{
    if (err) {

      return res
              .status(500)
              .send({
                success:false,
                message: 'Ocurrió un error al obtener las categorias',
                err
              });
    }

    if (!categories) {
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
                categories,
              });
  })
}

function NewCategory(req, res, next){
  
  let params = req.body;
  let category = new Category(params);

  console.log(category)

  category.save((err, category)=>{
    if (err) {

      return res
              .status(500)
              .send({
                success:false,
                message: 'Ocurrió un error al crear categoria',
                err
              });
    }

    if (!category) {
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
                category,
              });
  })
}

module.exports = {
  NewCategory,
  GetCategories
}