import { extendType, nonNull } from "nexus";
import { errors, throwError } from "../../utils/error";

export const query_setting = extendType({
    type: "Query",
    definition(t) {
        t.field("selectCnyRateByEveryone", {
            type: nonNull("Float"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await ctx.prisma.setting.findUnique({ where: { name: "CNY_RATE" } });
                    if (!result) return throwError(errors.notInitialized, ctx);
                    return parseFloat(result.value);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("selectTaobaoRefreshDayByEveryone", {
            type: nonNull("Int"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await ctx.prisma.setting.findUnique({ where: { name: "TAOBAO_PRODUCT_REFRESH_DAY" } });
                    if (!result) return throwError(errors.notInitialized, ctx);
                    return parseInt(result.value);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("selectFreeUserProductLimitByAdmin", {
            type: nonNull("Int"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
                    if (!result) return throwError(errors.notInitialized, ctx);
                    return parseInt(result.value);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("selectFreeUserDayLimitByAdmin", {
            type: nonNull("Int"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_DAY_LIMIT" } });
                    if (!result) return throwError(errors.notInitialized, ctx);
                    return parseInt(result.value);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
    }
});