import UserModel from '../../models/user';
import {
    create_token
} from '../../utils/auth';
import {
    PWD_ENCODE_STR
} from '../../utils/config'
import sha1 from 'sha1'
import xss from 'xss'

class User {
    constructor() {}
    /**
     * @route   POST api/users/register
     * @desc    注册
     * @access  public
     */
    async register(ctx) {
        const params = ctx.request.body
        const findResult = await UserModel.find({
            email: params.email
        })
        if (findResult.length > 0) {
            ctx.status = 500
            ctx.body = {
                code:50010,
                msg: '邮箱被占用啦！',
                status:'error'
            }
        } else {
            let {
                nickName,
                password,
                email,
                gender
            } = params;

            // 转义，防止xss攻击
            email = xss(email);
            // 加密密码
            password = sha1(sha1(password + PWD_ENCODE_STR));
            console.log(nickName , password , email , gender)
            if (nickName && password && email && gender) {
                const newUser = new UserModel({
                    nickName,
                    password,
                    email,
                    gender
                })
                await newUser.save().then(user => {
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
                    code: 50010,
                    msg: '请检查信息是否完整!',
                    status: 'error'
                }
            }
        }
    }

    /**
     * @route   POST api/users/login
     * @desc    登录
     * @access  public
     */
    async login(ctx) {
        const params = ctx.request.body
        let {
            email,
            password
        } = params;
        if (email && password) {
            password = sha1(sha1(password + PWD_ENCODE_STR));
            let findResult = await UserModel.findOne({
                email,
                password
            })
            if (!findResult) {
                ctx.status = 500
                ctx.body = {
                    code: 50010,
                    msg: '登录失败，用户名或者密码错误!',
                    status: 'error'
                }
                return
            }
            let token = await create_token(email);
            findResult.token = token;
            findResult.save();
            ctx.status = 200
            ctx.body = {
                code: 10000,
                msg: '登录成功!',
                status: 'success',
                data: {
                    _id: findResult._id,
                    email: findResult.email
                }
            }
        } else {
            ctx.status = 500
            ctx.body = {
                code: 50010,
                msg: '请检查信息是否完整!',
                status: 'error',
            }
        }
    }

    /**
     * @route   POST api/users/getUser
     * @desc    获取用户信息
     * @access  public
     */
    async getUser(ctx) {
        const params = ctx.params
        const findResult = await UserModel.find({
            nickName: params.name
        })
        if (findResult.length > 0) {
            ctx.body = findResult[0]
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
     * @route   POST api/users/getUserAll
     * @desc    获取所有用户信息
     * @access  public
     */
    async getUserAll(ctx) {
        const findResult = await UserModel.find()
        if (findResult.length > 0) {
            ctx.body = findResult
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

export default new User()