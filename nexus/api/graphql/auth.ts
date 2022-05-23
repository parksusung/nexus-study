import { Token } from '../types';
import { verify } from 'jsonwebtoken';
import { extendType, nonNull, objectType,stringArg } from 'nexus';
import { APP_REFRESH_SECRET, APP_SECRET, regexPattern } from './utils/constants';
import { errors, throwError } from './utils/error';
import { generateUserToken ,generateToken } from './utils/helpers';
import { differenceInMinutes } from 'date-fns';
import { getRandomVerificationNumber } from './utils/local/phone_verification';


export const t_PhoneVerification = objectType({
    name : "PhoneVerification",
    definition(t){
        t.model.id();
        t.model.tel();
        t.model.verification_number();
        t.model.created_at()
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
                        const accessTokenInfo = verify(args.accessToken, APP_SECRET, {ignoreExpiration : true}) as Token;//인증결과는 decoded된 게 나옴 
                        const now = Date.now() / 1000;
                        const refreshTokenInfo = verify(args.refreshToken, APP_REFRESH_SECRET, { algorithms: ["HS512"]  })  as Token;
                        if ( refreshTokenInfo.userId){
                            if(accessTokenInfo.userId != refreshTokenInfo.userId) return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);//그냥 2개 decoded 해서 id같은지봄 
                            const user = await ctx.prisma.admin.findUnique({where : {id : refreshTokenInfo.userId}});
                            if(!user) return throwError(errors.notAuthenticated, ctx);
                            accessToken = await generateUserToken(ctx.prisma, refreshTokenInfo.userId);
                            refreshToken = generateToken(refreshTokenInfo.userId, "userId", true);
                        }
                        else if(refreshTokenInfo.adminId) {
                            if(accessTokenInfo.adminId != refreshTokenInfo.adminId) return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);
                            const admin = await ctx.prisma.admin.findUnique({ where : { id : refreshTokenInfo.adminId}});
                            if (!admin) return throwError(errors.notAuthenticated, ctx);
                            accessToken = generateToken(refreshTokenInfo.adminId, "adminId" , false);
                            refreshToken = generateToken(refreshTokenInfo.adminId, "adminId" , true);
                        }
                    }
                    catch(e){
                        console.log(e);
                        return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);
                    }
                    return { accessToken,refreshToken};
                
                }catch (error) {
                    return throwError(error,ctx);
                }
            }
        });
        t.field("requestPhoneVerificationByEveryone",{
            type : nonNull("Boolean"),
            args : {
                phoneNumber : nonNull(stringArg())
            },
            resolve: async ( src,args,ctx,info) => {
                try { 
                    if (!regexPattern.phone.test(args.phoneNumber)) return throwError(errors.etc("휴대폰 번호 형식이 잘못되었습니다."),ctx);
                    const tel = args.phoneNumber.replace(regexPattern.phone, "0$1$2$3");
                    const verification = await ctx.prisma.phoneVerification.findFirst({ where : {tel} , orderBy : {created_at : "desc"}});
                    if(verification){
                        if (differenceInMinutes(new Date(),verification.created_at) < 1 ) return throwError(errors.etc("잠시 후에 다시 시도해주세요."), ctx);
                    }
                    const verification_number  = getRandomVerificationNumber();
                    console.log(`인증 번호 발송) ${tel} : ${verification_number}`);
                    {
                        await ctx.prisma.phoneVerification.create({ data: { tel, verification_number } });
                        return throwError(errors.etc(`인증 번호 발송) ${tel} : ${verification_number }`),null);
                    }
                }catch(error){
                    return throwError(errors,ctx);
                }

            }
        });
        
        t.field("verifyPhoneByEveryone", {
            type: nonNull("Int"),
            args: {
                phoneNumber: nonNull(stringArg()),
                verificationNumber: nonNull(stringArg())
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (!regexPattern.phone.test(args.phoneNumber)) return throwError(errors.etc("휴대폰 번호 형식이 잘못되었습니다."), ctx);
                    const tel = args.phoneNumber.replace(regexPattern.phone, "0$1$2$3");
                    const verification = await ctx.prisma.phoneVerification.findFirst({ where: { tel, verification_number: args.verificationNumber } });
                    if (!verification) return throwError(errors.etc("인증 번호가 일치하지 않습니다."), ctx);
                    if (differenceInMinutes(new Date(), verification.created_at) > 3) {
                        await ctx.prisma.phoneVerification.delete({ where: { id: verification.id } });
                        return throwError(errors.etc("인증 정보가 만료되었습니다. 다시 시도해주세요."), ctx);
                    }
                    return verification.id;
                } catch (error) {
                    return throwError(error, ctx);
                }
            }
        });
    }
})