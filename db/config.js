const mongoose = require('mongoose');


const connectDB = async () => {
  try{
      const db = await mongoose.connect(process.env.BD_CNN, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true})
      console.log('DB connected')
  }catch (err){
      console.log('Error mongo: ',err)
  }
}

module.exports = {
  connectDB
}