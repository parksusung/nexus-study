import { extendType, floatArg, intArg, nonNull } from "nexus";
import { errors, throwError } from "../../utils/error";

export const mutation_setting = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateCnyRateByAdmin", {
            type: nonNull("Float"),
            args: {
                cnyRate: nonNull(floatArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    // category_test.Sheet0.map(async(data) => {
                    //     var category_result = await ctx.prisma.category.update({
                    //         where: {
                    //             a077Code: data['스마트스토어']
                    //         },

                    //         data: {
                    //             a112Code: parseInt(data['11번가'])
                    //         }
                    //     });

                    //     console.log(`${data['스마트스토어']} to ${data['11번가']} done ${category_result}`);
                    // });

                    // console.log("done");
                    console.log("test");

                    await ctx.prisma.setting.update({ where: { name: "CNY_RATE" }, data: { value: args.cnyRate.toString() } });
                    return args.cnyRate;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updateTaobaoRefreshDayByAdmin", {
            type: nonNull("Int"),
            args: {
                day: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    await ctx.prisma.setting.update({ where: { name: "TAOBAO_PRODUCT_REFRESH_DAY" }, data: { value: args.day.toString() } });
                    return args.day;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updateFreeUserProductLimitByAdmin", {
            type: nonNull("Int"),
            args: {
                day: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    await ctx.prisma.setting.update({ where: { name: "FREE_USER_PRODUCT_LIMIT" }, data: { value: args.day.toString() } });
                    return args.day;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("updateFreeUserDayLimitByAdmin", {
            type: nonNull("Int"),
            args: {
                day: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    await ctx.prisma.setting.update({ where: { name: "FREE_USER_DAY_LIMIT" }, data: { value: args.day.toString() } });
                    return args.day;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
    }
});