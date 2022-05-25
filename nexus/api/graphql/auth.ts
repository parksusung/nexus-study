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
                refreshToken : nonNull(stringArg()),
            },
            resolve : async (src, args, ctx , info ) => {
                try {
                    let accessToken = "";
                    let now = new Date();
                    let day = 0;
                    let refreshToken = ""; 
                    try{
                        const refreshTokenInfo = verify(args.refreshToken, APP_REFRESH_SECRET, { algorithms: ["HS512"]  })  as Token; // 이건 이제 id가아니라 어떤 Token인지
                        if(refreshTokenInfo.type == "userId"){ //return 값 userId or adminId 
                            const userInfo = await ctx.prisma.user.findUnique({
                                where : {
                                    token : args.refreshToken,
                                }
                            })
                            if(!userInfo) {return throwError(errors.etc("해당 token을 가진 사용자가 존재하지 않습니다."),ctx)}
                            else {
                                day = ((now.getTime() - userInfo.created_token.getTime()) / (1000 * 3600 * 24)) ;
                                if(day >= 1) return throwError(errors.etc("토큰을 재발급 할수 없습니다."),ctx);//refresh Token 처음 생성일 기준으로 기한인 하루지나면 accessToken을 재발급해주지않음 
                                accessToken = await generateUserToken(ctx.prisma, userInfo.id);//accessToken 재생성 
                                refreshToken = generateToken(userInfo.id, "userId", true); //refreshToken도 재발급 왜냐면 노출이되서 보안상 해킹당했을수도잇으므로
                                
                                const Token = await ctx.prisma.user.update({
                                    where : {
                                        id : userInfo.id,
                                    },
                                    data : {
                                        token : refreshToken
                                    }
                                })
                                if(!Token) {return throwError(errors.etc("토큰을 재발급 하였으나, 저장에 실패하였습니다. "),ctx)}
                            }
                        }else if (refreshTokenInfo.type == "adminId")// admin 계정일 경우 
                        {
                            const adminInfo = await ctx.prisma.admin.findUnique({
                                where : {
                                    token : args.refreshToken,
                                }
                            })
                            if(!adminInfo) {return throwError(errors.etc("해당 token을 가진 사용자가 존재하지 않습니다."),ctx)}
                            else{
                                day = ((now.getTime() - adminInfo.created_token.getTime()) / (1000 * 3600 * 24)) ;
                                if(day >= 1) return throwError(errors.etc("토큰을 재발급 할수 없습니다."),ctx);//refresh Token 처음 생성일 기준으로 기한인 하루지나면 accessToken을 재발급해주지않음 
                                accessToken = generateToken(adminInfo.id, "adminId" , false);
                                refreshToken = generateToken(adminInfo.id, "adminId" , true); //refreshToken도 재발급 왜냐면 이걸 호출하면서 노출이되서 보안상 해킹당했을수도잇으므로
                                const Token = await ctx.prisma.admin.update({
                                    where : {
                                        id : adminInfo.id,
                                    },
                                    data : {
                                        token : refreshToken
                                    }
                                })
                                if(!Token) {return throwError(errors.etc("토큰을 재발급 하였으나, 저장에 실패하였습니다. "),ctx)}
                            }
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