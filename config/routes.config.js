const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller')
const petsController = require('../controllers/pets.controller')
const breedsController = require('../controllers/breeds.controller')
const upload = require ('./storage.config')
const authMiddleware = require('../middlewares/auth.middleware')

// Users routes
// router.get('/', authMiddleware.isAuthenticated, usersController.user)
router.post('/users/create', usersController.create)
router.post('/users/auth', usersController.aunthenticate)
router.get('/users/me', authMiddleware.isAuthenticated, usersController.get)

router.get('/pets/list', authMiddleware.isAuthenticated, petsController.getAll)
router.get('/pets/user/:id', authMiddleware.isAuthenticated, petsController.list)
router.post('/pets/create/:user', authMiddleware.isAuthenticated, upload.single('file'), petsController.create)
router.get('/pets/pet/:id', authMiddleware.isAuthenticated, petsController.get)
router.put('/pets/editfield/:id', authMiddleware.isAuthenticated, petsController.editPetUser)
router.put('/pets/editfieldschedule/:id', authMiddleware.isAuthenticated, petsController.editPetUserSchedule)
router.put('/pets/deletefieldschedule/:id', authMiddleware.isAuthenticated, petsController.deletePetUserSchedule)
router.put('/pets/edit/:id', authMiddleware.isAuthenticated,upload.single('file'), petsController.editOnePetUser)
router.put('/pets/delete/:id', authMiddleware.isAuthenticated, petsController.deletePetUser)

router.get('/pets/:id', authMiddleware.isAuthenticated, petsController.get)

router.get('/breeds/list/', authMiddleware.isAuthenticated, breedsController.list)
router.get('/breeds/group/:group/:page/:limit', authMiddleware.isAuthenticated, breedsController.group)
router.get('/breeds/breed/:breed', authMiddleware.isAuthenticated, breedsController.breed)



module.exports = router;