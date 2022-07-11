const mongooes = require("mongoose")

const dataValidationschema = new mongooes.Schema({
title : String,
image : String,
price : String,
rating : String,

})

module.exports= mongooes.model("validationschema",dataValidationschema);