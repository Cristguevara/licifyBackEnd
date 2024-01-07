const { Schema, model } = require('mongoose');


const ApplicationSchema = new Schema({
    proyectId: {
        type: String,
        required: true
    },
    applicant: {
        type: String,
        required: true,
    },
    items:{
      type: [{name:String,value:Number,newValue:Number}],
      required: true,
    },
});

module.exports = model('Application', ApplicationSchema );