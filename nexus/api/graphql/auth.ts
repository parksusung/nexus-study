import { Token } from '../types';
import { verify } from 'jsonwebtoken';
import { extendType, nonNull, objectType,stringArg } from 'nexus';
import { APP_REFRESH_SECRET, APP_SECRET } from './utils/constants';
import { errors, throwError } from './utils/error';


export const t_PhoneVerification = objectType({
    name : "PhoneVerification",
    definition(t){
        t.model.id();
        t.model.tel();
        t.model.verificationNumber();
        t.model.createdAt()
    }
})

export const mutation_auto = extendType({
    type : "Mutation",
    definition(t) {
        t.field("renewToken", {
            type : "SignInType",
            args : {
                accessToken : nonNull(stringArg()),
                refreshToken : nonNull(stringArg()),
            },
            resolve : async (src, args, ctx , info ) => {
                try {
                    let accessToken = "";
                    let refreshToken = ""; 
                    try{
                        const accessTokenInfo = verify(args.accessToken, APP_SECRET, {ignoreExpiration : true}) as Token;
                        const now = Date.now() / 1000;
                        const refreshTokenInfo = verify(args.refreshToken, APP_REFRESH_SECRET, { algorithms: ["HS512"]  })  as Token;
                        if ( refreshTokenInfo.userId){
                            if(accessTokenInfo.userId != refreshTokenInfo.userId) return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);
                        }
                    }
                }
            }
        })
    }
})