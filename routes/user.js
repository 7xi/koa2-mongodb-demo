import Router from 'koa-router'
import User from '../controller/user/user'

const router = new Router()

router.post('/register', User.register)
router.post('/login', User.login)
router.post('/getUser', User.getUser)
router.post('/getUserAll', User.getUserAll)

export default router.routes()
