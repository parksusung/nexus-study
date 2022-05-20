import { add } from "date-fns";
import { booleanArg, extendType, intArg, nonNull, stringArg } from "nexus";
import { NexusGenAllTypes } from "../../typegen";
import { errors, throwError } from "../utils/error";
import { getPurchaseInfo } from "../user";

export const mutation_purchase = extendType({
    type: "Mutation",
    definition(t) {
        t.field("purchasePlanByUser", {
            type: nonNull("Int"),
            args: {
                planInfoId: nonNull(intArg()),
                merchantUid: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const plan = await ctx.prisma.planInfo.findUnique({ where: { id: args.planInfoId } });
                    if (!plan) return throwError(errors.noSuchData, ctx);
                    if (!plan.is_active) return throwError(errors.etc("구매할 수 없는 상품입니다."), ctx);
                    const { description, is_active, ...etcPlanData } = plan;
                    const existingInfo = await getPurchaseInfo(ctx.prisma, ctx.token!.userId!);
                    if (plan.plan_level) {
                        if (existingInfo.level === plan.plan_level) return throwError(errors.etc("이미 해당 상품을 이용중입니다."), ctx);
                        else if (existingInfo.level >= plan.plan_level) return throwError(errors.etc("하위 단계의 상품을 주문할 수 없습니다. 고객센터로 문의해주세요."), ctx);
                    }
                    if (plan.external_feature_variable_id) {
                        if (existingInfo.additionalInfo.find(v => v.type === plan.external_feature_variable_id)) return throwError(errors.etc("이미 해당 상품을 이용중입니다."), ctx);
                    }
                    await ctx.prisma.purchaseLog.create({
                        data: {
                            type: plan.plan_level !== null ? "PLAN" : plan.external_feature_variable_id as NexusGenAllTypes["PurchaseLogType"], //TODO: 나중에 애드온나오면 뒷부분 수정
                            plan_info: JSON.stringify(etcPlanData),
                            pay_amount: plan.price,
                            state: "WAIT_PAYMENT",
                            pay_id: args.merchantUid,
                            user_id: ctx.token!.userId!,
                            expired_at: new Date(0),
                            purchased_at: new Date(0),
                        }
                    })
                    return 0;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("cancelPurchasePlanByUser", {
            type: nonNull("Boolean"),
            args: {
                merchantUid: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const log = await ctx.prisma.purchaseLog.findUnique({ where: { pay_id: args.merchantUid } });
                    if (!log) return throwError(errors.etc("해당 결제건이 없습니다."), ctx);
                    await ctx.prisma.purchaseLog.delete({ where: { id: log.id } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updatePlanInfoByAdmin", {
            type: nonNull("PlanInfo"),
            args: {
                planId: nonNull(intArg()),
                name: stringArg(),
                description: stringArg(),
                price: intArg(),
                isActive: booleanArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const plan = await ctx.prisma.planInfo.findUnique({ where: { id: args.planId } });
                    if (!plan) return throwError(errors.noSuchData, ctx);
                    if (args.name && args.name.length > 50) return throwError(errors.etc("이름은 50자 이내로 입력해주세요."), ctx);
                    if (args.price && args.price < 0) return throwError(errors.etc("올바른 금액을 입력하세요."), ctx);
                    return await ctx.prisma.planInfo.update({
                        where: { id: plan.id },
                        data: {
                            name: args.name ?? undefined,
                            price: args.price ?? undefined,
                            description: args.description ?? undefined,
                            is_active: args.isActive ?? undefined,
                        }
                    });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("setPurchaseInfoByAdmin", {
            type: nonNull("Boolean"),
            args: {
                userId: nonNull(intArg()),
                planInfoId: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const plan = await ctx.prisma.planInfo.findUnique({ where: { id: args.planInfoId } });
                    if (!plan) return throwError(errors.noSuchData, ctx);
                    if (!plan.is_active) return throwError(errors.etc("구매할 수 없는 상품입니다."), ctx);
                    const { description, is_active, ...etcPlanData } = plan;
                    const existingInfo = await getPurchaseInfo(ctx.prisma, args.userId);
                    const user = await ctx.prisma.user.findUnique({ where: { id: args.userId } });
                    if (!user) return throwError(errors.etc("해당 유저가 없습니다."), ctx);
                    const userEmail = user.email;
                    if (user.state !== 'ACTIVE') return throwError(errors.etc(userEmail + " 유저는 활성화 상태가 아닙니다."), ctx);
                    // console.log(existingInfo);
                    if (plan.plan_level) {
                        if (existingInfo.level === plan.plan_level) return throwError(errors.etc(userEmail + ": 이미 해당 상품을 이용중입니다."), ctx);
                        else if (existingInfo.level >= plan.plan_level) return throwError(errors.etc(userEmail + ": 하위 단계의 상품을 주문할 수 없습니다. 먼저 기존 주문의 무효화 처리를 해주세요."), ctx);
                    }
                    if (plan.external_feature_variable_id) {
                        if (existingInfo.additionalInfo.find(v => v.type === plan.external_feature_variable_id)) return throwError(errors.etc(userEmail + ": 이미 해당 상품을 이용중입니다."), ctx);
                    }
                    await ctx.prisma.purchaseLog.create({
                        data: {
                            type: plan.plan_level !== null ? "PLAN" : plan.external_feature_variable_id as NexusGenAllTypes["PurchaseLogType"],
                            plan_info: JSON.stringify(etcPlanData),
                            pay_amount: plan.price,
                            state: "ACTIVE",
                            pay_id: null,
                            user_id: args.userId,
                            expired_at: add(new Date(), { months: etcPlanData.month }),
                            purchased_at: new Date(),
                        }
                    })
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("invalidatePurchaseInfoByAdmin", {
            type: nonNull("Boolean"),
            args: {
                purchaseLogId: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const plan = await ctx.prisma.purchaseLog.findUnique({ where: { id: args.purchaseLogId } });
                    if (!plan) return throwError(errors.noSuchData, ctx);
                    await ctx.prisma.purchaseLog.update({
                        where: { id: args.purchaseLogId },
                        data: {
                            state: "ENDED",
                            expired_at: new Date(),
                        }
                    })
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
    }
});