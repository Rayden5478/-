const Router = require ('express')
const router = new Router()
const UserController = require('../Controllers/UserController')

router.get('/user', UserController.getAllUsers)
router.post('/user', UserController.createUser)
router.put('/user/:id', UserController.updateUser)
router.delete('/user/:id', UserController.deleteUser)


module.exports = router