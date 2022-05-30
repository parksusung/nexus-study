import { Prisma, ProductStore } from "@prisma/client";
import deepmerge from "deepmerge";
import { arg, inputObjectType, intArg, list, nonNull, objectType } from "nexus";
import { SiilEncodedSavedData } from "../sill";
import { errors, throwError } from "../utils/error";
import { getOptionHeaderHtmlByProductId } from "../utils/local/playauto";



export const t_Product = objectType({
    name: "Product",
    definition(t) {
        t.model.id();
        t.model.user_id();
        t.model.admin_id();
        t.model.taobao_product_id();
        t.model.product_code();
        t.model.state();
        t.model.name();
        t.model.is_name_translated();
        t.model.is_image_translated();
        t.model.price();
        t.model.local_shipping_fee();
        t.model.local_shipping_code();
        t.model.description();
        t.model.created_at();
        t.model.modified_at();
        t.model.stock_updated_at();
        t.model.category_code();
        t.model.siil_code();
        t.model.image_thumbnail_data();
        t.model.search_tags();

        
        t.field("imageThumbnail", {
            type: nonNull(list(nonNull("String"))),
            resolve: async (src, args, ctx, info) => {
                try {
                    return JSON.parse(src.image_thumbnail_data)
                } catch (e) {
                    return [];
                    // return throwError(e, ctx);
                }
            }
        });
        t.model.siil_data();
        t.field("siilInfo", {
            type: "SiilSavedData",
            resolve: async (src, args, ctx, info) => {
                try {
                    if (src.siil_data) {
                        const info = JSON.parse(src.siil_data) as SiilEncodedSavedData;
                        return { code: info.c, data: info.d.map(v => ({ code: v.c, value: v.v })) }
                    }
                    return null;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.model.category();

        t.model.category_a077();
        t.model.category_a077_name();

        t.model.category_b378();
        t.model.category_b378_name();

        t.model.category_a112();
        t.model.category_a112_name();

        t.model.category_a027();
        t.model.category_a027_name();

        t.model.category_a001();
        t.model.category_a001_name();
        
        t.model.category_a006();
        t.model.category_a006_name();

        t.model.category_a113();
        t.model.category_a113_name();

        t.model.category_b719();
        t.model.category_b719_name();

        t.model.category_a524();
        t.model.category_a524_name();
        
        t.model.category_a525();
        t.model.category_a525_name();

        t.model.category_b956();
        t.model.category_b956_name();

        t.model.taobao_product();
        t.model.user();
        t.model.admin();
        t.model.product_option({
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    args.where = {
                        AND: [
                            { ...args.where },
                            {
                                AND: [
                                    { product_option1: { is_active: { equals: true } } },
                                    {
                                        OR: [
                                            { option_value2_id: { equals: null } },
                                            { product_option2: { is_active: { equals: true } } },
                                        ]
                                    },
                                    {
                                        OR: [
                                            { option_value3_id: { equals: null } },
                                            { product_option3: { is_active: { equals: true } } },
                                        ]
                                    },
                                ]
                            }
                        ]
                    };
                    args.orderBy = [{ option_string: "asc" }, ...(args.orderBy ?? [])]
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.model.product_option_name({
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    args.orderBy = [{ order: "asc" }, ...(args.orderBy ?? [])]
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.model.product_store({
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    args.orderBy = [{ site_code: "asc" }, ...(args.orderBy ?? [])]
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("activeProductStore", {
            type: nonNull(list(nonNull("ProductStore"))),
            resolve: async (src, args, ctx, info) => {
                try {
                    const where: Prisma.ProductStoreWhereInput = {
                        product_id: src.id,
                        state: 2
                    }

                    let smartStore = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A077",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let coupang = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "B378",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let street = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A112",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let action = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A001",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let gmarket = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A006",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let interpark = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A027",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let street_normal = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A113",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let wemakeprice = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "B719",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let lotteon = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A524",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let lotteon_normal = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "A525",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    let tmon = await ctx.prisma.productStore.findFirst({
                        where: {
                            ...where,
                            site_code: "B956",
                        },
                        orderBy: [{ id: "desc" }]
                    });

                    const data = [smartStore, coupang, street, action, gmarket, interpark, street_normal, wemakeprice, lotteon, lotteon_normal, tmon].filter((v): v is ProductStore => v !== null);
                    if (src.state === 'UPLOAD_FAILED') {
                        const errorData = await ctx.prisma.productStore.findFirst({
                            where: {
                                product_id: src.id,
                                state: 3,
                            },
                            orderBy: [{ id: "desc" }]
                        });
                        if (errorData) {
                            return [errorData].concat(data);
                        }
                    }
                    return data;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("optionInfoHtml", {
            type: nonNull("String"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const id = src.id;
                    return await getOptionHeaderHtmlByProductId(ctx.prisma, id, "Y", 1);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.model.margin_rate();
        t.model.margin_unit_type();
        t.model.cny_rate();
        t.model.shipping_fee();
    }
});

export const t_ProductOption = objectType({
    name: "ProductOption",
    definition(t) {
        t.model.id();
        t.model.product_id();
        t.model.option_value1_id();
        t.model.option_value2_id();
        t.model.option_value3_id();
        t.field("name", {
            type: nonNull("String"),
            resolve: async (src, args, ctx, info) => {
                try {
                    const optionValues = await ctx.prisma.productOptionValue.findMany({
                        where: { id: { in: [src.option_value1_id, src.option_value2_id ?? -1, src.option_value3_id ?? -1] } },
                        include: { product_option_name: true }
                    });
                    optionValues.sort((a, b) => a.option_name_order - b.option_name_order);
                    return optionValues.reduce((p, c) => p + `${c.product_option_name.name}:${c.name}, `, "").slice(0, -2);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.model.is_active();
        t.model.taobao_sku_id();
        t.model.price_cny();
        t.model.price();
        t.model.stock();
        t.model.option_string();
        t.model.product_option1();
        t.model.product_option2();
        t.model.product_option3();
        t.model.product();
    }
});

export const t_ProductOptionName = objectType({
    name: "ProductOptionName",
    definition(t) {
        t.model.id();
        t.model.product_id();
        t.model.order();
        t.model.name();
        t.model.is_name_translated();
        t.model.taobao_pid();
        t.model.product();
        t.model.product_option_value({
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    args.orderBy = [{ number: "asc" }, ...(args.orderBy ?? [])]
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
    }
});


export const t_ProductOptionValue = objectType({
    name: "ProductOptionValue",
    definition(t) {
        t.model.id();
        t.model.product_option_name();
        t.model.option_name_order();
        t.model.name();
        t.model.is_name_translated();
        t.model.taobao_vid();
        t.model.image();
        t.model.number();
        t.model.is_active();
        t.model.product_option_name();
        t.field("productOption", {
            type: nonNull(list(nonNull("ProductOption"))),
            args: {
                where: arg({ type: "ProductOptionWhereInput" }),
                orderBy: list(arg({ type: "ProductOptionOrderByWithRelationInput" })),
                take: intArg(),
                skip: intArg(),
                cursor: arg({ type: "ProductOptionWhereUniqueInput" }),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const a = src.option_name_order;
                    args.where = deepmerge<typeof args.where>(args.where,
                        a === 1 ? { is_active: { equals: true }, option_value1_id: { equals: src.id } }
                            : a === 2 ? { is_active: { equals: true }, option_value2_id: { equals: src.id } }
                                : { is_active: { equals: true }, option_value3_id: { equals: src.id } }
                    );

                    return ctx.prisma.productOption.findMany({
                        where: args.where,
                        order_by: args.orderBy,
                        skip: args.skip,
                        take: args.take,
                        cursor: args.cursor,
                    } as any)
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.model.option_value1({
            filtering: true,
            ordering: true,
            pagination: true,
        });
        t.model.option_value2({
            filtering: true,
            ordering: true,
            pagination: true,
        });
        t.model.option_value3({
            filtering: true,
            ordering: true,
            pagination: true,
        });
    }
});


export const t_ProductOptionUpdateInput = inputObjectType({
    name: "ProductOptionUpdateInput",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.int("price");
        t.nonNull.boolean("isActive");
        t.nonNull.int("stock");
    }
});
export const t_ProductOptionNameUpdateInput = inputObjectType({
    name: "ProductOptionNameUpdateInput",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
    }
});
export const t_ProductOptionValueUpdateInput = inputObjectType({
    name: "ProductOptionValueUpdateInput",
    definition(t) {
        t.nonNull.int("id");
        t.nonNull.string("name");
        t.boolean("isActive");
        t.string("image")
        t.upload("newImage")
        t.string("newImageBase64")
    }
});
export const t_ProductOptionValueImageUpdateInput = inputObjectType({
    name: "ProductOptionValueImageUpdateInput",
    definition(t) {
        t.nonNull.int("id");
        t.string("image")
        t.string("newImageBase64")
    }
});
export const t_ProductThumbnailUpdateInput = inputObjectType({
    name: "ProductThumbnailUpdateInput",
    definition(t) {
        t.nonNull.string("defaultImage");
        t.upload("uploadImage");
    }
});
export const t_ProductThumbnailImageUpdateInput = inputObjectType({
    name: "ProductThumbnailImageUpdateInput",
    definition(t) {
        t.nonNull.string("defaultImage");
        t.string("uploadImageBase64");
    }
});