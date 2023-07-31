const deviseController = require('../controllers/deviceController')
const Router = require('express')
const router = new Router()

router.post('/', deviseController.create)
router.get('/', deviseController.getAll)
router.get('/:id', deviseController.getOnce)

module.exports = router