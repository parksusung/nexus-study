import deepmerge from "deepmerge";
import { extendType, nonNull } from "nexus";
import { errors, throwError } from "../utils/error";

export const query_product = extendType({
    type: "Query",
    definition(t) {
        t.crud.products({
            alias: "selectMyProductByUser",
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    args.where = deepmerge<typeof args.where>(args.where, { user_id: { equals: ctx.token!.userId! } });
                    if (args.where?.state?.equals === null) {
                        args.where.state.equals = undefined;
                    }
                    if (args.where?.is_image_translated?.equals === null) {
                        args.where.is_image_translated.equals = undefined;
                    }
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.field("selectMyProductsCountByUser", {
            type: nonNull("Int"),
            args: {
                where: "ProductWhereInput"
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    args.where = deepmerge<typeof args.where>(args.where, { user_id: { equals: ctx.token!.userId! } });
                    if (args.where?.state?.equals === null) {
                        args.where.state.equals = undefined;
                    }
                    if (args.where?.is_image_translated?.equals === null) {
                        args.where.is_image_translated.equals = undefined;
                    }
                    return ctx.prisma.product.count({ where: args.where as any });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.crud.products({
            alias: "selectProductsByAdmin",
            filtering: true,
            ordering: true,
            pagination: true,
        })
        t.field("selectProductsCountByAdmin", {
            type: "Int",
            args: {
                where: "ProductWhereInput"
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    return ctx.prisma.product.count({ where: args.where as any });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.crud.products({
            alias: "selectProductsBySomeone",
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    if (ctx.token?.userId) {
                        args.where = deepmerge<typeof args.where>(args.where, { user_id: { equals: ctx.token.userId } });
                    }
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.field("selectProductsCountBySomeone", {
            type: "Int",
            args: {
                where: "ProductWhereInput"
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (ctx.token?.userId) {
                        args.where = deepmerge<typeof args.where>(args.where, { user_id: { equals: ctx.token.userId } });
                    }
                    return ctx.prisma.product.count({ where: args.where as any });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});