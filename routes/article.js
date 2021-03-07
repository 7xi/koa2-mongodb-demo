import Router from 'koa-router'
import Article from '../controller/article/article'

const router = new Router()

router.get('/', Article.getAll)
router.post('/add', Article.add)
router.post('/:id', Article.getDetail)

export default router.routes()