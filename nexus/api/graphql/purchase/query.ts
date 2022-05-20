import deepmerge from "deepmerge";
import { extendType, nonNull, stringArg } from "nexus";
import { errors, throwError } from "../utils/error";
import { generateToken, generateUserToken } from "../utils/helpers";

export const query_purchase = extendType({
    type: "Query",
    definition(t) {
        t.crud.planInfos({
            alias: "selectPlanInfosForEveryone",
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    if (!ctx.token || ctx.token.userId) {
                        args.where = deepmerge<typeof args.where>(args.where, { isActive: { equals: true } });
                    }
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        // t.field("refreshPurchaseStateForUser", {
        //     type: "SignInType",
        //     args: {
        //         merchantUid: nonNull(stringArg()),
        //     },
        //     resolve: async (src, args, ctx, info) => {
        //         try {
        //             const purchaseLog = await ctx.prisma.purchaseLog.findUnique({ where: { payId: args.merchantUid } });
        //             if (!purchaseLog) return throwError(errors.noSuchData, ctx);
        //             if (purchaseLog.state === 'ACTIVE') {
        //                 return { accessToken: await generateUserToken(ctx.prisma, ctx.token!.userId!), refreshToken: generateToken(ctx.token!.userId!, "userId", true) };
        //             }
        //             return null;
        //         } catch (e) {
        //             return throwError(e, ctx);
        //         }
        //     }
        // })
    }
});