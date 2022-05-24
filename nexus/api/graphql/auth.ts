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
        t.field("silentRefreshToken", { // 수성완료 silent refresh 
            type : "SignInType",//SignIntype은 return값이 accesstoken , refresh token string임 
            args : {
                accessToken : nonNull(stringArg()),
                refreshToken : nonNull(stringArg()),
            },
            resolve : async (src, args, ctx , info ) => {
                try {
                    let accessToken = "";
                    // let refreshToken = ""; 
                    try{
                        const accessTokenInfo = verify(args.accessToken, APP_SECRET, {ignoreExpiration : true}) as Token;//인증결과는 decoded된 게 나옴 
                        const now = Date.now() / 1000;
                        const refreshTokenInfo = verify(args.refreshToken, APP_REFRESH_SECRET, { algorithms: ["HS512"]  })  as Token; // 이건 이제 id가아니라 어떤 Token인지
                        if(refreshTokenInfo.type == "userId"){ //return 값 userId or adminId 
                        const userInfo = await ctx.prisma.user.findFirst({
                            where : {
                                token : args.refreshToken,
                            }
                        })
                        if(!userInfo) {return throwError(errors.etc("해당 token을 가진 사용자가 존재하지 않습니다."),ctx)}
                        else {
                            if(accessTokenInfo.userId != userInfo.id) return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);//그냥 2개 decoded 해서 id같은지봄 
                            accessToken = await generateUserToken(ctx.prisma, userInfo.id);//accessToken 재생성 
                            // refreshToken = generateToken(userInfo.id, "userId", true); 이건 만들필요없는거같은데 ? renewToken이 언제 프론트에서 호출하는지 보고 수정하자 
                        }
                    }else if (refreshTokenInfo.type == "adminId")// admin 계정일 경우 
                    {
                        const adminInfo = await ctx.prisma.admin.findFirst({
                            where : {
                                token : args.refreshToken,
                            }
                        })
                        if(!adminInfo) {return throwError(errors.etc("해당 token을 가진 사용자가 존재하지 않습니다."),ctx)}
                        else{
                            if(accessTokenInfo.adminId != adminInfo.id) return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);
                            accessToken = generateToken(adminInfo.id, "adminId" , false);
                            // refreshToken = generateToken(adminInfo.id, "adminId" , true); 이건 만들필요없는거같은데 ? renewToken이 언제 프론트에서 호출하는지 보고 수정하자 
                        }
                    }
                    }
                    catch(e){
                        console.log(e);
                        return throwError(errors.etc("유효한 토큰이 아닙니다."),ctx);
                    }
                    return { accessToken,refreshToken :args.refreshToken};
                
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