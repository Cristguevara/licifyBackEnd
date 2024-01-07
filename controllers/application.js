const { response } = require('express');
const Application = require('../models/application')

const getAllUserAplications = async(req, res = response ) => {

  try {
    const { email } =  req.body
    const applications = await Application.find({applicant:email})

    return res.status(200).json({
        ok: true,
        applications: applications
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

const allApplicationsByProyectId = async(req, res = response ) => {

  try {
    const {id} = req.body
    const applications = await Application.find({proyectId:id})

    if(!applications){
      return res.status(404).json({
          ok: false,
          msg: 'Sin aplicaciones en el proyecto'
      });
    }

    return res.status(200).json({
        ok: true,
        applications: applications
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

const applicationByProyectId = async(req, res = response ) => {

  try {
    const {id,email} = req.body
    const application = await Application.find({proyectId:id,applicant:email})

    if(!application){
      return res.status(404).json({
          ok: false,
          msg: 'Aplicación no encontrado'
      });
    }

    return res.status(200).json({
        ok: true,
        application: application
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

const createApplication = async(req, res = response ) => {

  try {

    const body = await req.body

    const {proyectId, applicant, items} = body

    if(!proyectId || !applicant || !items ){
      return res.status(400).json({
        ok: false,
        msg: 'Toda la información es requerida.'
      });
    }

    const newApplocation = new Application(body)
    await newApplocation.save()


    return res.status(200).json({
        ok: true,
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

module.exports = {
  createApplication,
  getAllUserAplications,
  applicationByProyectId,
  allApplicationsByProyectId
}