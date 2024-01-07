const { response } = require('express');
const Project = require('../models/project');
const {saveCloudinaryImage} = require('../helpers/cloudinary')
const Application = require('../models/application')


const allProjects = async(req, res = response ) => {

  try {
    const projects = await Project.find()

    return res.status(200).json({
        ok: true,
        projects: projects
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

const projectById = async(req, res = response ) => {

  try {
    const {id} = req.body
    const project = await Project.findById(id)

    if(!project){
      return res.status(404).json({
          ok: false,
          msg: 'Proyecto no encontrado'
      });
    }

    return res.status(200).json({
        ok: true,
        project: project
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}

const createProject = async(req, res = response ) => {

  try {
    const projectInfo = await req.body
    if(!projectInfo){
      return res.status(400).json({
        ok: false,
        msg: 'Información del proyecto requerida'
      });
    }

    const body = JSON.parse(projectInfo.projectInfo)
    const images = req.files??[]
    let imgs = []

    if(images.length>0){
      await await Promise.all(images.map(async(img)=>{
        var mime = img.mimetype; 
        var encoding = 'base64'; 
        var base64Data = Buffer.from(img.buffer).toString('base64');
        var fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
        const response = await saveCloudinaryImage(fileUri)
        imgs.push({id:response.public_id,url:response.secure_url})
      }))
    }

    const {name, startDate, endDate, items} = body

    if(!name || !startDate || !endDate || !items ){
      return res.status(400).json({
        ok: false,
        msg: 'Toda la información es requerida.'
      });
    }

    const newProject = new Project({...body,images:imgs})
    await newProject.save()


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

const deleteProject = async(req, res = response ) => {

  try {
    const { id } = req.body
    const projects = await Project.findByIdAndDelete(id)
    await Application.deleteMany({proyectId:id})

    return res.status(200).json({
        ok: true
    });

  } catch (error) {
      return res.status(500).json({
          ok: false,
          msg: 'Hable con el administrador'
      });
  }
}


module.exports = {
  allProjects,
  projectById,
  createProject,
  deleteProject
}