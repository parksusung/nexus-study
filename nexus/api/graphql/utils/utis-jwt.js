import promisify from 'util';
import jwt from 'jsonwebtoken';
import { redisClient } from './redis.js'


const secret = '069707a2e309cb247d7ff838665a2a2b38bc24e39fb7efc6dcbe35e543518282';

export const myjwt = {
    sign: (user) => { // access token 발급
        const payload = {// access token에 들어갈 payload 는 오픈되므로 비밀번호같은 것은 넣지않는게 좋다.
            id: user.id,
            role: user.role,
        };

        return jwt.sign(payload, secret, {// secret으로 sign하여 발급하고 return
            algorithm: 'HS256', // 암호화 알고리즘
            expiresIn: '1h'// 유효기간
        });
    },
    verify: (token) => {// access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
                role: decoded.role,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message
            };
        }
    },
    refresh: async () => {// refresh token 발급
        return jwt.sign({}, secret, {// refresh token은 payload 없이 발급
            algorithm: 'HS512',
            expiresIn: '14d'
        })
    },
    refreshVerify: async (token, userId) => { // refresh token 검증
        /* redis 모듈은 기본적으로 promise를 반환하지 않으므로,
             promisify를 이용하여 promise를 반환하게 해줍니다.*/

        const getAsync = promisify(redisClient.get).bind(redisClient);

        try {
            const data = await getAsync(userId); // refresh token 가져오기
            if (token === data) {
                try {
                    jwt.verify(token, secret);
                    return true;
                } catch (err) {
                    return false;
                }
            } else { return false }

        } catch (err) {
            return false;
        }
    }
}

