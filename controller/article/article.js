import ArticleModel from '../../models/article';
import {
    get_user_info
} from '../../utils/auth';

import xss from 'xss'

class Article {
    constructor() {}

    /**
     * @route   GET api/articles
     * @desc    获取所有资讯
     * @access  public
     */
    async getAll(ctx) {
        const params = ctx.request.body
        let {
            page = 1, limit = 10
        } = params;
        const findResult = await ArticleModel.find().limit(limit).skip(limit * page - limit);
        if (findResult.length) {
            ctx.status = 200
            ctx.body = {
                code: 10000,
                data: findResult,
                msg: '获取成功！',
                status: 'success'
            }
        } else {
            ctx.status = 404
            ctx.body = {
                code: 40010,
                msg: '查询结果为空！',
                status: 'error'
            }
        }
    }

    /**
     * @route   POST api/articles/add
     * @desc    获取所有资讯
     * @access  public
     */
    async add(ctx) {
        const params = ctx.request.body;
        let {
            title,
            content
        } = params;

        if (title && content) {
            let userinfo = await get_user_info(ctx);

            // 转义，防止xss攻击
            title = xss(title);
            content = xss(content);

            await ArticleModel({
                title,
                content,
                email: userinfo.email
            }).save().then(request => {
                ctx.status = 200
                ctx.body = {
                    code: 10000,
                    msg: '添加成功！',
                    status: 'success'
                }
            }).catch(err => {
                console.log(err)
            })
        } else {
            ctx.status = 500
            ctx.body = {
                code: '50010',
                msg: '请检查信息是否完整',
                status:'error'
            }
        }
    }


    /**
     * @route   GET api/articles/:id
     * @desc    获取某个资讯详情
     * @access  public
     */
    async getDetail(ctx) {
        const params = ctx.params
        console.log(params)
        const findResult = await ArticleModel.find({
            _id: params.id
        })
        if (findResult.length > 0) {
            ctx.status = 200
            ctx.body = {
                code: 10000,
                data: findResult[0],
                msg: '获取成功！',
                status: 'success'
            }
        } else {
            ctx.status = 404
            ctx.body = {
                code: 40010,
                msg: '查询结果为空！',
                status: 'error'
            }
        }
    }
}

export default new Article()