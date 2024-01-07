const { Router } = require('express');
const { createProject,allProjects, deleteProject, projectById } = require('../controllers/projects')
const {createApplication, getAllUserAplications, applicationByProyectId,allApplicationsByProyectId} = require('../controllers/application')
const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const router = Router();

router.get( '/', allProjects );
router.post( '/', projectById );
router.post( '/new', upload.array('images', 5), createProject );
router.post( '/delete', deleteProject );

router.post( '/applications', getAllUserAplications );
router.post( '/newApplication', createApplication );
router.post( '/userAplication', applicationByProyectId );
router.post( '/proyectApplications', allApplicationsByProyectId );

module.exports = router;