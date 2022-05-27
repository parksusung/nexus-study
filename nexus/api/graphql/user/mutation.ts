import { hashSync, compareSync } from "bcryptjs";
import { isBefore } from "date-fns";
 import { getPurchaseInfo } from ".";
import { APP_REFRESH_SECRET, APP_SECRET, regexPattern } from "../utils/constants";
 import { throwError, errors } from "../utils/error";
 import { uploadToS3 } from "../utils/file_manage";
 import { generateToken, generateUserToken, validateStringLength } from "../utils/helpers";
import { verify } from 'jsonwebtoken';
import { arg, booleanArg, extendType, floatArg, intArg, nonNull, stringArg } from "nexus";
import { Token } from '../../types';

export const mutation_user = extendType({
    type: "Mutation",
    definition(t) {
        t.field("signUpUserByEveryone", {//수성완료  회원가입 
            type: nonNull("SignInType"),
            args: {
                email: nonNull(stringArg()),
                password: nonNull(stringArg()),
                phone: nonNull(stringArg()),
                verificationId: nonNull(intArg({ default: 0 })),//이제안씀 
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (!regexPattern.phone.test(args.phone)) return throwError(errors.etc("휴대폰 번호 형식이 잘못되었습니다."), ctx);
                    if (!regexPattern.email.test(args.email)) return throwError(errors.etc("이메일 형식이 잘못되었습니다."), ctx);
                    if (await ctx.prisma.user.findUnique({ where: { email: args.email } })) return throwError(errors.etc("해당 이메일이 이미 존재합니다."), ctx);
                    const tel = args.phone.replace(regexPattern.phone, "0$1$2$3");
                    if (args.verificationId !== 0) {
                        const verification = await ctx.prisma.phoneVerification.findUnique({ where: { id: args.verificationId } });
                        if (!verification) return throwError(errors.etc("인증 번호가 일치하지 않습니다."), ctx);
                        if (verification.tel !== tel) return throwError(errors.etc("인증 번호가 일치하지 않습니다."), ctx);
                        await ctx.prisma.phoneVerification.delete({ where: { id: verification.id } });
                    }

                    const user = await ctx.prisma.user.create({
                        data: {
                            email: args.email,
                            password: hashSync(args.password),
                            state: "ACTIVE",
                            user_info: {//다른 model에 data 삽입도 이런식으로 가능 하네 ! 
                                create: {
                                    phone: tel,
                                    margin_rate: 25,
                                    default_shipping_fee: 6000,
                                    cny_rate: 185.0,
                                    product_collect_count: 0,
                                    max_product_limit: 100,
                                    additional_shipping_fee_jeju: 5000,
                                    as_tel: "000-000-0000",
                                    as_information: "해외구매대행 상품은 국내에서 A/S가 불가능합니다.",
                                    refund_shipping_fee: 25000,
                                    exchange_shipping_fee: 50000,
                                    naver_origin_code: "0200037",
                                    naver_origin: "수입산",
                                    naver_store_url: "",
                                    naver_store_only: "N",
                                    naver_fee: 0,
                                    coupang_outbound_shipping_time_day: 12,
                                    coupang_union_delivery_type: "N",
                                    coupang_maximum_buy_for_person: 0,
                                    coupang_login_id: "",
                                    coupang_vendor_id: "",
                                    coupang_access_key: "",
                                    coupang_secret_key: "",
                                    coupang_image_opt: "Y",
                                    coupang_fee: 0,
                                    coupang_default_outbound: "",
                                    coupang_default_inbound: "",
                                    street_api_key: "",
                                    street_seller_type: 1,
                                    street_fee: 0,
                                    street_normal_api_key: "",
                                    street_default_outbound: "",
                                    street_default_inbound: "",
                                    street_normal_outbound: "",
                                    street_normal_inbound: "",
                                    street_normal_fee: 0,
                                    interpark_cert_key: "",
                                    interpark_secret_key: "",
                                    interpark_fee: 0,
                                    esmplus_master_id: "",
                                    esmplus_auction_id: "",
                                    esmplus_gmarket_id: "",
                                    gmarket_fee: 0,
                                    auction_fee: 0,
                                    lotteon_vendor_id: "",
                                    lotteon_api_key: "",
                                    lotteon_fee: 0,
                                    lotteon_normal_fee: 0,
                                    wemakeprice_id: "",
                                    wemakeprice_fee: 0,
                                    tmon_id: "",
                                    tmon_fee: 0,
                                    option_align_top: "Y",
                                    option_twoways: "Y",
                                    option_index_type: 1,
                                    discount_amount: 0,
                                    discount_unit_type: "WON",
                                    description_show_title: "Y",
                                    collect_timeout: 10,
                                    collect_stock: 0,
                                    margin_unit_type: "PERCENT",
                                    extra_shipping_fee: 0,
                                }
                            }
                        }
                    });

                    const accessToken = await generateUserToken(ctx.prisma, user.id);
                    const refreshToken = await generateToken(user.id, "userId", true); //추후 token 내부에 id받아오는거 없앨 예정 
                    //refresh token 생성 후 삽입 
                    const token = await ctx.prisma.user.update({
                        where : {
                            id : user.id,
                        },
                        data : {
                            token : refreshToken,
                            created_token : new Date(),
                        },
                    })
                    if(!token) return throwError(errors.etc("token 삽입에 실패하였습니다"),ctx)
                    
                    const plan = await ctx.prisma.planInfo.findUnique({ where: { id: 1 } });//기본 체험판 단계로 로그인 생성 
                    if (!plan) return throwError(errors.noSuchData, ctx);
                    const { description, is_active, ...etcPlanData } = plan;
                    await ctx.prisma.purchaseLog.create({
                        data: {
                            type: "PLAN",
                            plan_info: JSON.stringify(etcPlanData),
                            pay_amount: plan.price,
                            state: "ACTIVE",
                            pay_id: null,
                            user_id: user.id,
                            expired_at: new Date('9999-12-31'),
                            purchased_at: new Date(),
                        }
                    });
                     return { accessToken: accessToken, refreshToken: refreshToken };//front에서 token을 local에 저장은 해두어야하므로 .
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("signOutUserByEveryone",{//수성 임시 작성 refreshToken logout시 제거  로그아웃 
            type: nonNull("String"),
            args : {
                // userType: nonNull(arg({ type: "UserLoginType" })),
                // email: nonNull(stringArg()),
                accessToken : nonNull(stringArg()),
            },
            resolve : async (src, args, ctx , info ) => {
                try {

                    const accessTokenInfo = verify(args.accessToken, APP_SECRET, {ignoreExpiration : true}) as Token;//인증결과는 decoded된 게 나옴 
                    let status = "";
                    console.log("accessTokenInfo",accessTokenInfo)
                    try{
                        if(accessTokenInfo.userId){ //return 값 userId or adminId 
                        const userInfo = await ctx.prisma.user.update({
                            where : {
                                id : accessTokenInfo.userId,
                            },
                            data : {
                                token : null,
                                created_token : null
                            }
                        })
                        if(!userInfo) {return throwError(errors.etc("로그아웃 실패"),ctx)}
                        else{status = "success";}
                    }
                    
                    else if (accessTokenInfo.adminId)// admin 계정일 경우 
                    {
                        const adminInfo = await ctx.prisma.admin.update({
                            where : {
                                id : accessTokenInfo.adminId,
                            },
                            data : {
                                token : null,
                                created_token : null
                            }
                        })
                        if(!adminInfo) {return throwError(errors.etc("로그아웃 실패"),ctx)}
                        else{status = "success";}
                    }
                    }catch(e){
                        console.log(e);
                        return throwError(errors.etc("로그아웃 실패"),ctx);
                    }
                    return status ;
                
                }catch (error) {
                    return throwError(error,ctx);
                }
            }
        });
        t.field("signInUserByEveryone", {//todo 로그인
            type: nonNull("SignInType"),
            args: {
                userType: nonNull(arg({ type: "UserSocialType" })),
                email: nonNull(stringArg()),
                password: nonNull(stringArg({ description: "소셜의 경우 그냥 빈 문자열" })),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (args.userType === "EMAIL" && !regexPattern.email.test(args.email)) return throwError(errors.etc("이메일 형식이 잘못되었습니다."), ctx);
                    const where = args.userType === "EMAIL" ? { email: args.email } : args.userType === "NAVER" ? { naverId: args.email } : args.userType === "KAKAO" ? { kakaoId: args.email } : {}
                    const user = await ctx.prisma.user.findUnique({ where });
                    if (!user) return throwError(errors.invalidUser, ctx);
                    if (user.state !== 'ACTIVE') return throwError(errors.invalidUser, ctx);
                    if (args.userType === "EMAIL" && !compareSync(args.password, user.password)) return throwError(errors.invalidUser, ctx);
                   
                    const accessToken = await generateUserToken(ctx.prisma, user.id)
                    const refreshToken = generateToken(user.id, "userId", true)
                    const db = await ctx.prisma.user.update({
                        where : {
                            id : user.id
                        },
                        data : {
                            token : refreshToken,
                            created_token : new Date()
                        }
                    })
                    if(!db) return throwError(errors.etc("토큰 저장에 실패하였습니다."),ctx);
                    return { accessToken: accessToken, refreshToken: refreshToken };
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        // t.field("signInUserForImageProgramByEveryone", {//이거 안씀 
        //     type: nonNull("String"),//return type 
        //     args: {
        //         userType: nonNull(arg({ type: "UserLoginType" })),
        //         email: nonNull(stringArg()),
        //         password: nonNull(stringArg({ description: "소셜의 경우 그냥 빈 문자열" })),
        //     },
        //     resolve: async (src, args, ctx, info) => {
        //         try {
        //             if (args.userType === 'ADMIN') {
        //                 if (!regexPattern.email.test(args.email)) return throwError(errors.etc("이메일 형식이 잘못되었습니다."), ctx);
        //                 const admin = await ctx.prisma.admin.findUnique({ where: { login_id: args.email } });
        //                 if (!admin) return throwError(errors.invalidUser, ctx);
        //                 if (!compareSync(args.password, admin.password)) return throwError(errors.invalidUser, ctx);
        //                 return generateToken(admin.id, "adminId", false);
        //             }
        //             else {
        //                 if (args.userType === "EMAIL" && !regexPattern.email.test(args.email)) return throwError(errors.etc("이메일 형식이 잘못되었습니다."), ctx);
        //                 const where = args.userType === "EMAIL" ? { email: args.email } : args.userType === "NAVER" ? { naverId: args.email } : args.userType === "KAKAO" ? { kakaoId: args.email } : {}
        //                 const user = await ctx.prisma.user.findUnique({ where });
        //                 if (!user) return throwError(errors.invalidUser, ctx);
        //                 if (user.state !== 'ACTIVE') return throwError(errors.invalidUser, ctx);
        //                 if (args.userType === "EMAIL" && !compareSync(args.password, user.password)) return throwError(errors.invalidUser, ctx);
        //                 const purchaseInfo = await getPurchaseInfo(ctx.prisma, user.id);
        //                 const d = purchaseInfo.additionalInfo.find(v => v.type === 'IMAGE_TRANSLATE');
        //                 if (!d) return throwError(errors.additionalPermissionRequired, ctx);
        //                 if (isBefore(d.expiredAt, new Date())) throw errors.additionalPermissionRequired;
        //                 return await generateUserToken(ctx.prisma, user.id);
        //             }
        //         } catch (e) {
        //             return throwError(e, ctx);
        //         }
        //     }
        // });
        t.field("connectSocialIdByUser", {
            type: nonNull("User"),//return 타입 
            args: {
                userType: nonNull(arg({ type: "UserSocialType" })),
                socialId: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (args.userType === "EMAIL") return throwError(errors.etc("잘못된 소셜 타입입니다."), ctx);
                    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! } });
                    if (!user) return throwError(errors.invalidUser, ctx);
                    const data: { naverId?: string, kakaoId?: string } = {};
                    if (args.userType === "KAKAO") {
                        if (user.kakao_id) return throwError(errors.etc("카카오 계정은 이미 연동되어 있습니다."), ctx);
                        const existingUser = await ctx.prisma.user.count({ where: { kakao_id: { equals: args.socialId } } });
                        if (existingUser > 0) return throwError(errors.etc("해당 카카오 계정은 다른 계정과 연동되어 있습니다."), ctx);
                        data.kakaoId = args.socialId;
                    }
                    if (args.userType === "NAVER") {
                        if (user.naver_id) return throwError(errors.etc("네이버 계정은 이미 연동되어 있습니다."), ctx);
                        const existingUser = await ctx.prisma.user.count({ where: { naver_id: { equals: args.socialId } } });
                        if (existingUser > 0) return throwError(errors.etc("해당 네이버 계정은 다른 계정과 연동되어 있습니다."), ctx);
                        data.naverId = args.socialId;
                    }
                    return await ctx.prisma.user.update({ where: { id: user.id }, data })!;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updatePhoneByUser", {
            type: nonNull("Boolean"),
            args: {
                phone: nonNull(stringArg()),
                verificationId: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (!regexPattern.phone.test(args.phone)) return throwError(errors.etc("휴대폰 번호 형식이 잘못되었습니다."), ctx);
                    const tel = args.phone.replace(regexPattern.phone, "0$1$2$3");
                    const verification = await ctx.prisma.phoneVerification.findUnique({ where: { id: args.verificationId } });
                    if (!verification) return throwError(errors.etc("인증 번호가 일치하지 않습니다."), ctx);
                    await ctx.prisma.phoneVerification.delete({ where: { id: verification.id } });
                    await ctx.prisma.userInfo.update({ where: { user_id: ctx.token!.userId! }, data: { phone: tel } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updateMyImageByUser", {
            type: nonNull("Boolean"),
            args: {
                fixImageTop: stringArg(),
                fixImageBottom: stringArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    console.log("fixImageTop",args.fixImageTop);
                    await ctx.prisma.userInfo.update({
                        where: { userId: ctx.token!.userId! },
                        data: {
                            fixImageTop: args.fixImageTop && /^https?:/.test(args.fixImageTop) ? args.fixImageTop : undefined,
                            fixImageBottom: args.fixImageBottom && /^https?:/.test(args.fixImageBottom) ? args.fixImageBottom : undefined,
                        }
                    });

                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updateMyDataByUser", {//todo error
            type: nonNull("Boolean"),
            args: {
                marginRate: floatArg(),
                defaultShippingFee: intArg(),
                fixImageTop: arg({ type: "Upload" }),
                fixImageBottom: arg({ type: "Upload" }),
                cnyRate: floatArg(),
                additionalShippingFeeJeju: intArg(),
                asTel: stringArg(),
                asInformation: stringArg(),
                refundShippingFee: intArg(),
                exchangeShippingFee: intArg(),
                naverOriginCode: stringArg(),
                naverOrigin: stringArg(),
                naverStoreUrl: stringArg(),
                naverStoreOnly: stringArg(),
                naverFee: floatArg(),
                coupangOutboundShippingTimeDay: intArg(),
                coupangUnionDeliveryType: stringArg(),
                coupangMaximumBuyForPerson: intArg(),
                coupangLoginId: stringArg(),
                coupangVendorId: stringArg(),
                coupangAccessKey: stringArg(),
                coupangSecretKey: stringArg(),
                coupangImageOpt: stringArg(),
                coupangFee: floatArg(),
                coupangDefaultOutbound: stringArg(),
                coupangDefaultInbound: stringArg(),
                streetApiKey: stringArg(),
                streetSellerType: intArg(),
                streetFee: floatArg(),
                streetNormalApiKey: stringArg(),
                streetDefaultOutbound: stringArg(),
                streetDefaultInbound: stringArg(),
                streetNormalOutbound: stringArg(),
                streetNormalInbound: stringArg(),
                streetNormalFee: floatArg(),
                interparkCertKey: stringArg(),
                interparkSecretKey: stringArg(),
                interparkFee: floatArg(),
                esmplusMasterId: stringArg(),
                esmplusAuctionId: stringArg(),
                esmplusGmarketId: stringArg(),
                gmarketFee: floatArg(),
                auctionFee: floatArg(),
                lotteonVendorId: stringArg(),
                lotteonApiKey: stringArg(),
                lotteonFee: floatArg(),
                lotteonNormalFee: floatArg(),
                wemakepriceId: stringArg(),
                wemakepriceFee: floatArg(),
                tmonId: stringArg(),
                tmonFee: floatArg(),
                optionAlignTop: stringArg(),
                optionTwoWays: stringArg(),
                optionIndexType: intArg(),
                discountAmount: intArg(),
                discountUnitType: stringArg(),
                descriptionShowTitle: stringArg(),
                collectTimeout: intArg(),
                collectStock: intArg(),
                marginUnitType: stringArg(),
                extraShippingFee: intArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if ((args.marginRate ?? 1) < 0) return throwError(errors.etc("마진율은 음수일 수 없습니다."), ctx);
                    if ((args.defaultShippingFee ?? 1) < 0) return throwError(errors.etc("기본 해외배송비는 음수일 수 없습니다."), ctx);
                    
                    args.marginRate = args.marginRate ?? undefined;
                    args.defaultShippingFee = args.defaultShippingFee ?? undefined;
                    args.cnyRate = args.cnyRate ?? undefined;
                    console.log("topImage",args.fixImageTop);

                    let fixImageTop: string | null | undefined = args.fixImageTop ? "" : args.fixImageTop;
                    let fixImageBottom: string | null | undefined = args.fixImageBottom ? "" : args.fixImageBottom;

                    if (args.fixImageTop) {
                        fixImageTop = (await uploadToS3(args.fixImageTop, ["user", ctx.token!.userId!, "info"])).url;//db에 user/유저아디(352)/info/top.jpg
                    }

                    
                    if (args.fixImageBottom) {
                        fixImageBottom = (await uploadToS3(args.fixImageBottom, ["user", ctx.token!.userId!, "info"])).url;
                    }

                    const asTel = args.asTel ? args.asTel.trim() : undefined;
                    const asInformation = args.asInformation ? args.asInformation.trim() : undefined;

                    asTel && validateStringLength(ctx, asTel, 20, "A/S 전화번호");
                    asInformation && validateStringLength(ctx, asInformation, 1000, "A/S 안내내용");

                    await ctx.prisma.userInfo.update({
                        where: { user_id: ctx.token!.userId! },
                        data: {
                            margin_rate: args.marginRate,
                            default_shipping_fee: args.defaultShippingFee,
                            fix_image_top : fixImageTop,
                            fix_image_bottom : fixImageBottom,
                            cny_rate :  args.cnyRate,
                            additional_shipping_fee_jeju: args.additionalShippingFeeJeju ?? undefined,
                            as_tel : asTel,
                            as_information : asInformation,
                            refund_shipping_fee: args.refundShippingFee ?? undefined,
                            exchange_shipping_fee: args.exchangeShippingFee ?? undefined,
                            naver_origin_code: args.naverOriginCode ?? undefined,
                            naver_origin: args.naverOrigin ?? undefined,
                            naver_store_url: args.naverStoreUrl ?? undefined,
                            naver_store_only: args.naverStoreOnly ?? undefined,
                            naver_fee: args.naverFee ?? undefined,
                            coupang_outbound_shipping_time_day: args.coupangOutboundShippingTimeDay ?? undefined,
                            coupang_union_delivery_type: args.coupangUnionDeliveryType ?? undefined,
                            coupang_maximum_buy_for_person: args.coupangMaximumBuyForPerson ?? undefined,
                            coupang_login_id: args.coupangLoginId ?? undefined,
                            coupang_vendor_id: args.coupangVendorId ?? undefined,
                            coupang_access_key: args.coupangAccessKey ?? undefined,
                            coupang_secret_key: args.coupangSecretKey ?? undefined,
                            coupang_image_opt: args.coupangImageOpt ?? undefined,
                            coupang_default_outbound: args.coupangDefaultOutbound ?? undefined,
                            coupang_default_inbound: args.coupangDefaultInbound ?? undefined,
                            coupang_fee: args.coupangFee ?? undefined,
                            street_api_key: args.streetApiKey ?? undefined,
                            street_seller_type: args.streetSellerType ?? undefined,
                            street_fee: args.streetFee ?? undefined,
                            street_normal_api_key: args.streetNormalApiKey ?? undefined,
                            street_default_outbound: args.streetDefaultOutbound ?? undefined,
                            street_default_inbound: args.streetDefaultInbound ?? undefined,
                            street_normal_outbound: args.streetNormalOutbound ?? undefined,
                            street_normal_inbound: args.streetNormalInbound ?? undefined,
                            street_normal_fee: args.streetNormalFee ?? undefined,
                            interpark_cert_key: args.interparkCertKey ?? undefined,
                            interpark_secret_key: args.interparkSecretKey ?? undefined,
                            interpark_fee: args.interparkFee ?? undefined,
                            esmplus_master_id: args.esmplusMasterId ?? undefined,
                            esmplus_auction_id: args.esmplusAuctionId ?? undefined,
                            esmplus_gmarket_id: args.esmplusGmarketId ?? undefined,
                            gmarket_fee: args.gmarketFee ?? undefined,
                            auction_fee: args.auctionFee ?? undefined,
                            lotteon_vendor_id: args.lotteonVendorId ?? undefined,
                            lotteon_api_key: args.lotteonApiKey ?? undefined,
                            lotteon_fee: args.lotteonFee ?? undefined,
                            lotteon_normal_fee: args.lotteonNormalFee ?? undefined,
                            wemakeprice_id: args.wemakepriceId ?? undefined,
                            wemakeprice_fee: args.wemakepriceFee ?? undefined,
                            tmon_id: args.tmonId ?? undefined,
                            tmon_fee: args.tmonFee ?? undefined,
                            option_align_top: args.optionAlignTop ?? undefined,
                            option_twoways: args.optionTwoWays ?? undefined,
                            option_index_type: args.optionIndexType ?? undefined,
                            discount_amount: args.discountAmount ?? undefined,
                            discount_unit_type: args.discountUnitType ?? undefined,
                            description_show_title: args.descriptionShowTitle ?? undefined,
                            collect_timeout: args.collectTimeout ?? undefined,
                            collect_stock: args.collectStock ?? undefined,
                            margin_unit_type: args.marginUnitType ?? undefined,
                            extra_shipping_fee: args.extraShippingFee ?? undefined
                        }
                    });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("changePasswordByUser", {
            type: nonNull("Boolean"),
            args: {
                currentPassword: nonNull(stringArg()),
                newPassword: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! } });
                    if (!user) return throwError(errors.noSuchData, ctx);
                    if (!compareSync(args.currentPassword, user.password)) return throwError(errors.etc("현재 비밀번호가 다릅니다."), ctx);
                    const password = hashSync(args.newPassword);
                    await ctx.prisma.user.update({ where: { id: ctx.token!.userId! }, data: { password } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        // t.field("withdrawByUser", {
        //     type: nonNull("Boolean"),
        //     resolve: async (src, args, ctx, info) => {
        //         try {
        //             const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! } });
        //             if (!user) return throwError(errors.noSuchData, ctx);
        //             const withdraw = await ctx.prisma.withDraw.create({
        //                 data: {
        //                     email: user.email,
        //                     kakaoId: user.kakao_id,
        //                     naverId: user.naver_id,
        //                     withdrawAt: new Date(),
        //                 }
        //             });
        //             await ctx.prisma.user.update({
        //                 where: { id: user.id },
        //                 data: {
        //                     email: withdraw.id.toString(), naver_id: null, kakao_id: null,
        //                     state: "DELETED",
        //                 }
        //             })
        //             return true;
        //         } catch (e) {
        //             return throwError(e, ctx);
        //         }
        //     }
        // })
        t.field("setMaxProductLimitByAdmin", {
            type: nonNull("Boolean"),
            args: {
                userId: nonNull(intArg()),
                productLimit: intArg({ description: "미설정시 무제한" })
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const user = await ctx.prisma.userInfo.findUnique({ where: { user_id: args.userId } });
                    if (!user) return throwError(errors.etc("해당 유저가 없습니다."), ctx);
                    await ctx.prisma.userInfo.update({ where: { user_id: user.user_id }, data: { max_product_limit: args.productLimit ?? null } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});