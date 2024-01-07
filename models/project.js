const { Schema, model } = require('mongoose');


const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    images:{
      type: [{id:String,url:String}],
      required: false,
    },
    items:{
      type: [{name:String,value:Number}],
      required: true,
    },
});

module.exports = model('Project', ProjectSchema );