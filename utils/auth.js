import {
    TOKEN_ENCODE_STR,
    URL_YES_PASS
} from './config';
import UserModel from '../models/user';
import jwt from 'jsonwebtoken'

// 生成登录 token
function create_token(str) {
    return jwt.sign({
        str
    }, TOKEN_ENCODE_STR, {
        expiresIn: '7 days'
    })
}
/*
  验证登录 token 是否正确  => 写成中间件
  get 请求与设置的请求不拦截验证，其余均需登录
*/
async function check_token(ctx, next) {
    let url = ctx.url
    if (ctx.method !== 'GET' && !URL_YES_PASS.includes(url)) {
        let token = ctx.get('Authorization');
        if (token === '') {
            // 直接抛出错误
            ctx.status = 501
            ctx.body = {
                code: 50010,
                msg: '你还没有登录，快去登录吧!',
                status: 'error'
            }
            return
        };
        try {
            // 验证token是否过期
            let verify = await jwt.verify(token, TOKEN_ENCODE_STR);
            let email = verify.str;
            // 验证token与账号是否匹配
            let findResult = await UserModel.find({
                email,
                token
            })

            if (findResult.length === 0) {
                ctx.status = 501
                ctx.body = {
                    code: 50010,
                    msg: '登录过期,请重新登录!',
                    status: 'error'
                }
                return
            } else {
                // 如果token存活，判断token是否需要更新
                let nowDate = new Date().getTime().toString().substr(0, 10);
                let outDate = verify.exp;
                if ((outDate - nowDate) < 60 * 60 * 24) {
                    let token = create_token(email);
                    findResult[0].token = token;
                    findResult[0].save();
                }
            }
        } catch (e) {
            ctx.status = 501
            ctx.body = {
                code: 50010,
                msg: '登录过期,请重新登录!',
                status: 'error'
            }
            return
        }
    }
    await next()
}

/*
  获取用户信息
*/
async function get_user_info(ctx) {
    let token = ctx.get('Authorization');
    let verify = await jwt.verify(token, TOKEN_ENCODE_STR);
    let email = verify.str;
    // 验证token与账号是否匹配
    let findResult = await UserModel.find({
        email,
        token
    });
    if (findResult.length === 0) {
        return null
    } else {
        return findResult[0]
    }
}
module.exports = {
    create_token,
    check_token,
    get_user_info
}