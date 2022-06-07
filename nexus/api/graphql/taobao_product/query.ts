import deepmerge from "deepmerge";
import { extendType } from "nexus";
import { errors, throwError } from "../utils/error";

export const query_taobao_product = extendType({
    type: "Query",
    definition(t) {
        t.crud.taobaoProducts({
            alias: "selectTaobaoProductsByUser",
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.crud.taobaoProducts({
            alias: "selectTaobaoProductsByAdmin",
            filtering: true,
            ordering: true,
            pagination: true,
        })
        t.field("selectTaobaoProductsCountByAdmin", {
            type: "Int",
            args: {
                where: "TaobaoProductWhereInput"
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    return ctx.prisma.taobaoProduct.count({ where: args.where as any });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});