import { GraphQLResolveInfo } from "graphql";
import { arg, extendType, floatArg, intArg, list, nonNull, stringArg } from "nexus";
import { ArgsValue, booleanArg } from "nexus/dist/core";
import { Context } from "../../types";
import { errors, throwError } from "../utils/error";
import { uploadToS3AvoidDuplicate, uploadToS3AvoidDuplicateByBuffer, uploadToS3WithEditor } from "../utils/file_manage";
import { calculatePrice } from "../utils/local/calculate-product-price";
import { publishUserLogData } from "../utils/local/pubsub";
import { SiilEncodedSavedData, siilInfo } from "../sill";

const initProductImageByUser = async (src: {}, args: ArgsValue<"Mutation", "initProductImageByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const product = await ctx.prisma.product.findUnique({ where: { id: args.productId }, include: { taobao_product: true, product_option: true, product_option_name: { include: { product_option_value: true } } } });
        
        if (!product) {
            return throwError(errors.noSuchData, ctx);
        }

        let taobaoData = JSON.parse(product.taobao_product.original_data);

        let imageThumbnailData = JSON.stringify(taobaoData.item_imgs.map((v: any) => "http:" + v.url.replace(/^https?:/, "")));
        let desc_html = ``;

        for (var i in taobaoData.desc_img) {
            desc_html += `<img src=${taobaoData.desc_img[i]} alt="" />`;
        }

        await ctx.prisma.product.update({
            where: { id: product.id }, data: {
                description: desc_html,
                image_thumbnail_data:imageThumbnailData,
                is_image_translated: false
            }
        });

        product.product_option_name.map((v: any) => {
            if (v.productId === product.id) {
                v.productOptionValue.map((w: any) => {
                    let code = `${v.taobaoPid}:${w.taobaoVid}`;

                    taobaoData.prop_imgs.prop_img.map(async (x: any) => {
                        if (code === x.properties) {
                            await ctx.prisma.productOptionValue.update({ 
                                where: { id: w.id }, data: { 
                                    image: x.url,
                                }
                            });
                        }
                    })
                })
            }
        });

        return "OK";
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateProductResolver = async (src: {}, args: ArgsValue<"Mutation", "updateProductByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const product = await ctx.prisma.product.findUnique({ where: { id: args.productId }, include: { product_store: true, product_option: true, product_option_name: { include: { product_option_value: true } } } });
        
        if (!product) return throwError(errors.noSuchData, ctx);

        if (ctx.token?.userId && product.user_id !== ctx.token.userId) {
            return throwError(errors.etc("해당 상품을 수정할 수 없습니다."), ctx);
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA077 && v.site_code === "A077")) {
            args.categoryA077 = product.category_a077;
            args.categoryA077Name = product.category_a077_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryB378 && v.site_code === "B378")) {
            args.categoryB378 = product.category_b378;
            args.categoryB378Name = product.category_b378_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA112 && v.site_code === "A112")) {
            args.categoryA112 = product.category_a112;
            args.categoryA112Name = product.category_a112_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA027 && v.site_code === "A027")) {
            args.categoryA027 = product.category_a027;
            args.categoryA027Name = product.category_a027_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA001 && v.site_code === "A001")) {
            args.categoryA001 = product.category_a001;
            args.categoryA001Name = product.category_a001_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA006 && v.site_code === "A006")) {
            args.categoryA006 = product.category_a006;
            args.categoryA006Name = product.category_a006_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryB719 && v.site_code === "B719")) {
            args.categoryB719 = product.category_b719;
            args.categoryB719Name = product.category_b719_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA113 && v.site_code === "A113")) {
            args.categoryA113 = product.category_a113;
            args.categoryA113Name = product.category_a113_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA524 && v.site_code === "A524")) {
            args.categoryA524 = product.category_a524;
            args.categoryA524Name = product.category_a524_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryA525 && v.site_code === "A525")) {
            args.categoryA525 = product.category_a525;
            args.categoryA525Name = product.category_a525_name;
        }

        if (product.product_store.find(v => v.state === 2 && args.categoryB956 && v.site_code === "B956")) {
            args.categoryB956 = product.category_b956;
            args.categoryB956Name = product.category_b956_name;
        }

        if (args.siilCode) {
            if (siilInfo.findIndex(v => v.infoCode === args.siilCode) === -1) return throwError(errors.etc("잘못된 상품고시정보입니다."), ctx);
        }
        
        const siil: SiilEncodedSavedData | null = (args.siilCode && args.siilData) ? { c: args.siilCode, d: args.siilData!.map(v => ({ c: v.code, v: v.value })) } : null;

        if (args.optionNames.length !== product.product_option_name.length) {
            return throwError(errors.etc("옵션명 중 누락된 부분이 발견되었습니다."), ctx);
        }

        if (args.optionValues.length !== product.product_option_name.flatMap(v => v.product_option_value).length) {
            return throwError(errors.etc("옵션값 중 누락된 부분이 발견되었습니다."), ctx);
        }

        var productPrice = Math.round((args.price ?? product.price) / 100) * 100;

        if (args.options.length > 0) {
            productPrice = Math.min(...args.options.map(v => Math.round((v.price) / 100) * 100));
        }

        await Promise.all(product.product_option.map(async w => {
            var enabled = false;

            await Promise.all(args.options.map(async v => {
                if (v.id === w.id) {
                    await ctx.prisma.productOption.update({ where: { id: v.id }, data: { price: Math.round(v.price / 100) * 100, is_active: true, stock: v.stock } });

                    enabled = true;
                }
            }));

            if (!enabled) {
                await ctx.prisma.productOption.update({ where: { id: w.id }, data: { is_active: false } });
            }
        }));

        await Promise.all(args.optionNames.map(async v => {
            await ctx.prisma.productOptionName.update({ where: { id: v.id }, data: { name: v.name.trim(), } });
        }));

        for (let v of args.optionValues) {
            let image = v.image ?? undefined;

            if (v.newImage) {
                image = await uploadToS3AvoidDuplicate(v.newImage, ["product", product.id]);
            }

            await ctx.prisma.productOptionValue.update({ where: { id: v.id }, data: { name: v.name.trim(), image, is_active: v.isActive ?? true } });
        }

        let imageThumbnailData = product.image_thumbnail_data;

        if (args.thumbnails && args.thumbnails.length > 0) {
            let imageArray: string[] = [];

            for (let v of args.thumbnails) {
                let image = v.defaultImage;

                if (v.uploadImage) {
                    image = await uploadToS3AvoidDuplicate(v.uploadImage, ["product", product.id]);
                }

                //썸네일 https 수정
                imageArray.push(image.replace(/^https?:/, "http:"));
            }
            imageThumbnailData = JSON.stringify(imageArray);
        }
    
        const description = args.description ? await uploadToS3WithEditor(args.description, ["product", product.id], "description") : undefined;

        const result = await ctx.prisma.product.update({
            where: { id: product.id }, data: {
                name: args.name ?? undefined,
                price: productPrice ?? undefined,
                description: description,
                local_shipping_fee: args.localShippingFee ? (Math.round(args.localShippingFee / 100) * 100) : undefined,
                local_shipping_code: args.localShippingCode,
                shipping_fee: args.shippingFee ? (Math.round(args.shippingFee / 100) * 100) : undefined,
                category_code: args.categoryCode ?? undefined,
                category_a077: args.categoryA077 ?? undefined,
                category_a077_name: args.categoryA077Name ?? undefined,
                category_b378: args.categoryB378 ?? undefined,
                category_b378_name: args.categoryB378Name ?? undefined,
                category_a112: args.categoryA112 ?? undefined,
                category_a112_name: args.categoryA112Name ?? undefined,
                category_a027: args.categoryA027 ?? undefined,
                category_a027_name: args.categoryA027Name ?? undefined,
                category_a001: args.categoryA001 ?? undefined,
                category_a001_name: args.categoryA001Name ?? undefined,
                category_a006: args.categoryA006 ?? undefined,
                category_a006_name: args.categoryA006Name ?? undefined,
                category_b719: args.categoryB719 ?? undefined,
                category_b719_name: args.categoryB719Name ?? undefined,
                category_a113: args.categoryA113 ?? undefined,
                category_a113_name: args.categoryA113Name ?? undefined,
                category_a524: args.categoryA524 ?? undefined,
                category_a524_name: args.categoryA524Name ?? undefined,
                category_a525: args.categoryA525 ?? undefined,
                category_a525_name: args.categoryA525Name ?? undefined,
                category_b956: args.categoryB956 ?? undefined,
                category_b956_name: args.categoryB956Name ?? undefined,
                siil_data: siil === null ? null : JSON.stringify(siil),
                siil_code: args.siilCode ?? undefined,
                search_tags: args.searchTags ?? undefined,
                image_thumbnail_data:imageThumbnailData
            }
        });

        return result;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateProductNameResolver = async (src: {}, args: ArgsValue<"Mutation", "updateProductNameByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const product = await ctx.prisma.product.findUnique({ where: { id: args.productId }, include: { product_option: true, product_option_name: { include: { product_option_value: true } } } });
        if (!product) return throwError(errors.noSuchData, ctx);
        if (ctx.token?.userId && product.user_id !== ctx.token.userId) return throwError(errors.etc("해당 상품을 수정할 수 없습니다."), ctx);
        if (args.name.trim().length === 0) return throwError(errors.etc("이름을 입력하세요."), ctx);
        const result = await ctx.prisma.product.update({
            where: { id: product.id }, data: {
                name: args.name.trim(),
            }
        });
        return result;

    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateManyProductTagResolver = async (src: {}, args: ArgsValue<"Mutation", "updateManyProductTagByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const products = await ctx.prisma.product.findMany({
            where: { ...(ctx.token?.userId ? { userId: ctx.token.userId } : {}), id: { in: args.productIds } },
            select: { id: true, name: true }
        });

        await Promise.all(products.map(async v => {
            await ctx.prisma.product.update({
                where: { id: v.id },
                data: {
                    search_tags: args.searchTags
                }
            });

            return 0;
        }))

        return "OK"
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateManyProductNameResolver = async (src: {}, args: ArgsValue<"Mutation", "updateManyProductNameByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const products = await ctx.prisma.product.findMany({
            where: { ...(ctx.token?.userId ? { userId: ctx.token.userId } : {}), id: { in: args.productIds } },
            select: { id: true, name: true }
        });

        let head = args.head === "" ? "" : args.head + " ";
        let tail = args.tail === "" ? "" : " " + args.tail;
        
        await Promise.all(products.map(async v => {
            await ctx.prisma.product.update({
                where: { id: v.id },
                data: {
                    name: head + (args.body === "" ? v.name : args.body) + tail
                }
            });

            return 0;
        }))

        return "OK"
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateManyProductCategoryResolver = async (src: {}, args: ArgsValue<"Mutation", "updateManyProductCategoryByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        // const category = await ctx.prisma.category.findUnique({ where: { code: args.categoryCode } });
        // if (!category) return throwError(errors.etc("잘못된 카테고리입니다."), ctx);
        
        const result = args.productIds.map(async (id) => {
            const product = await ctx.prisma.product.findUnique({ where: { id: id }, include: { product_store: true } });
            
            if (!product) return;
    
            if (ctx.token?.userId && product.user_id !== ctx.token.userId) {
                return;
            }

            let categoryInfo = {
                categoryA077: args.categoryA077,
                categoryA077Name: args.categoryA077Name,
                categoryB378: args.categoryB378,
                categoryB378Name: args.categoryB378Name,
                categoryA112: args.categoryA112,
                categoryA112Name: args.categoryA112Name,
                categoryA027: args.categoryA027,
                categoryA027Name: args.categoryA027Name,
                categoryA001: args.categoryA001,
                categoryA001Name: args.categoryA001Name,
                categoryA006: args.categoryA006,
                categoryA006Name: args.categoryA006Name,
                categoryB719: args.categoryB719,
                categoryB719Name: args.categoryB719Name,
                categoryA113: args.categoryA113,
                categoryA113Name: args.categoryA113Name,
                categoryA524: args.categoryA524,
                categoryA524Name: args.categoryA524Name,
                categoryA525: args.categoryA525,
                categoryA525Name: args.categoryA525Name,
                categoryB956: args.categoryB956,
                categoryB956Name: args.categoryB956Name
            };

            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA077 && v.site_code === "A077")) {
                categoryInfo.categoryA077 = product.category_a077;
                categoryInfo.categoryA077Name = product.category_a077_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryB378 && v.site_code === "B378")) {
                categoryInfo.categoryB378 = product.category_b378;
                categoryInfo.categoryB378Name = product.category_b378_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA112 && v.site_code === "A112")) {
                categoryInfo.categoryA112 = product.category_a112;
                categoryInfo.categoryA112Name = product.category_a112_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA027 && v.site_code === "A027")) {
                categoryInfo.categoryA027 = product.category_a027;
                categoryInfo.categoryA027Name = product.category_a027_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA001 && v.site_code === "A001")) {
                categoryInfo.categoryA001 = product.category_a001;
                categoryInfo.categoryA001Name = product.category_a001_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA006 && v.site_code === "A006")) {
                categoryInfo.categoryA006 = product.category_a006;
                categoryInfo.categoryA006Name = product.category_a006_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryB719 && v.site_code === "B719")) {
                categoryInfo.categoryB719 = product.category_b719;
                categoryInfo.categoryB719Name = product.category_b719_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA113 && v.site_code === "A113")) {
                categoryInfo.categoryA113 = product.category_a113;
                categoryInfo.categoryA113Name = product.category_a113_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA524 && v.site_code === "A524")) {
                categoryInfo.categoryA524 = product.category_a524;
                categoryInfo.categoryA524Name = product.category_a524_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryA525 && v.site_code === "A525")) {
                categoryInfo.categoryA525 = product.category_a525;
                categoryInfo.categoryA525Name = product.category_a525_name;
            }
    
            if (product.product_store.find(v => v.state === 2 && categoryInfo.categoryB956 && v.site_code === "B956")) {
                categoryInfo.categoryB956 = product.category_b956;
                categoryInfo.categoryB956Name = product.category_b956_name;
            }

            await ctx.prisma.product.update({
                where: { 
                    id: id, 
                },
    
                data: { 
                    category_a077: categoryInfo.categoryA077 ?? undefined,
                    category_a077_name: categoryInfo.categoryA077Name ?? undefined,
                    category_b378: categoryInfo.categoryB378 ?? undefined,
                    category_b378_name: categoryInfo.categoryB378Name ?? undefined,
                    category_a112: categoryInfo.categoryA112 ?? undefined,
                    category_a112_name: categoryInfo.categoryA112Name ?? undefined,
                    category_a027: categoryInfo.categoryA027 ?? undefined,
                    category_a027_name: categoryInfo.categoryA027Name ?? undefined,
                    category_a001: categoryInfo.categoryA001 ?? undefined,
                    category_a001_name: categoryInfo.categoryA001Name ?? undefined,
                    category_a006: categoryInfo.categoryA006 ?? undefined,
                    category_a006_name: categoryInfo.categoryA006Name ?? undefined,
                    category_b719: categoryInfo.categoryB719 ?? undefined,
                    category_b719_name: categoryInfo.categoryB719Name ?? undefined,
                    category_a113: categoryInfo.categoryA113 ?? undefined,
                    category_a113_name: categoryInfo.categoryA113Name ?? undefined,
                    category_a524: categoryInfo.categoryA524 ?? undefined,
                    category_a524_name: categoryInfo.categoryA524Name ?? undefined,
                    category_a525: categoryInfo.categoryA525 ?? undefined,
                    category_a525_name: categoryInfo.categoryA525Name ?? undefined,
                    category_b956: categoryInfo.categoryB956 ?? undefined,
                    category_b956_name: categoryInfo.categoryB956Name ?? undefined,
                }
            });
        }).length;

        return result;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateManyProductSiilInfoResolver = async (src: {}, args: ArgsValue<"Mutation", "updateManyProductSiilInfoByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        if (siilInfo.findIndex(v => v.infoCode === args.siilCode) === -1) return throwError(errors.etc("잘못된 상품고시정보입니다."), ctx);
        const result = await ctx.prisma.product.updateMany({ where: { user_id: ctx.token!.userId, id: { in: args.productIds } }, data: { siil_code: args.siilCode } });
        return result.count;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const deleteProductResolver = async (src: {}, args: ArgsValue<"Mutation", "deleteProductByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const product = await ctx.prisma.product.findUnique({
            where: { id: args.productId },
            select: { id: true, user_id: true, product_store: true, product_option_name: { select: { id: true } } }
        });
        if (!product) return throwError(errors.noSuchData, ctx);
        if (ctx.token?.userId && product.user_id !== ctx.token.userId) return throwError(errors.etc("해당 상품을 삭제할 수 없습니다."), ctx);

        await ctx.prisma.productStoreLog.deleteMany({ where: { product_store_id: { in: product.product_store.map(v => v.id) } } });
        await ctx.prisma.productStore.deleteMany({ where: { id: { in: product.product_store.map(v => v.id) } } });

        await ctx.prisma.productOption.deleteMany({ where: { product_id: product.id } });
        await ctx.prisma.productOptionValue.deleteMany({ where: { product_option_name_id: { in: product.product_option_name.map(v => v.id) } } });
        await ctx.prisma.productOptionName.deleteMany({ where: { product_id: product.id } });
        await ctx.prisma.product.delete({ where: { id: product.id } });

        return true;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const updateProductPriceResolver = async (src: {}, args: ArgsValue<"Mutation", "updateProductPriceByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const boundCalculatePrice = (cnyPrice: number, cnyRate: number, localShippingFee: number) => calculatePrice.bind(null, cnyPrice, args.marginRate, args.marginUnitType, cnyRate, localShippingFee)();

        const products = await ctx.prisma.product.findMany({
            where: { ...(ctx.token?.userId ? { userId: ctx.token.userId } : {}), id: { in: args.productIds } },
            select: { id: true, cny_rate: true, local_shipping_fee: true, local_shipping_code: true, product_option: { select: { id: true, price_cny: true } }, taobao_product: { select: { price: true, original_data: true } } }
        });
        
        await Promise.all(products.map(async v => {
            let taobao = JSON.parse(v.taobao_product.original_data);
            
            let cnyRate = args.cnyRate;
            let localShippingFee = args.localShippingFee;
            let localShippingCode = args.localShippingCode;
            
            if (taobao.shop_id === "express" && !args.localShippingCode) {
                cnyRate = v.cny_rate;
                localShippingFee = v.local_shipping_fee;
                localShippingCode = v.local_shipping_code;
            }

            await ctx.prisma.product.update({
                where: { id: v.id },
                data: {
                    price: boundCalculatePrice(v.taobao_product.price, cnyRate, localShippingFee),
                    cny_rate: cnyRate,
                    margin_rate: args.marginRate,
                    margin_unit_type: args.marginUnitType,
                    shipping_fee: args.shippingFee,
                    local_shipping_fee: localShippingFee,
                    local_shipping_code: localShippingCode
                }
            });
            await Promise.all(v.product_option.map(async v => {
                await ctx.prisma.productOption.update({ where: { id: v.id }, data: { price: boundCalculatePrice(v.price_cny, cnyRate, localShippingFee) } });
            }))
            return 0;
        }))

        return products.length;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const endProductSellStateResolver = async (src: {}, args: ArgsValue<"Mutation", "endProductSellStateByUser">, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        const products = await ctx.prisma.product.updateMany({ where: { user_id: ctx.token!.userId, id: { in: args.productIds } }, data: { state: "SELL_DONE" } });
        return products.count;
    } catch (e) {
        return throwError(e, ctx);
    }
}


export async function copyProductsToUser(targetProductIds: number[], ctx: Context, userId: number) {
    const targetProducts = await ctx.prisma.product.findMany({
        where: { id: { in: targetProductIds } },
        include: {
            product_option: {
                include: { product_option1: true, product_option2: true, product_option3: true }
            },
            product_option_name: { include: { product_option_value: true } },
            taobao_product: { select: { taobao_num_iid: true } }
        }
    });
    return await Promise.all(targetProducts.map(async (product) => {
        const { taobao_product, product_option, product_option_name, ...data } = product;
        let newProduct = await ctx.prisma.product.create({
            data: {
                ...data,
                state: 'COLLECTED',
                user_id: userId,
                admin_id: ctx.token!.adminId!,
                product_code: "",
                id: undefined,
                created_at: new Date(),
                modified_at: new Date(),
                stock_updated_at: new Date(),
            }
        });
        newProduct = await ctx.prisma.product.update({ where: { id: newProduct.id }, data: { product_code: "SFYA_" + newProduct.id.toString(36) } });

        const newProductOptionName = await Promise.all(product_option_name.map(async (v) => {
            return await ctx.prisma.productOptionName.create({
                data: {
                    product_id: newProduct.id,
                    order: v.order,
                    name: v.name,
                    taobao_pid: v.taobao_pid,
                    is_name_translated: v.is_name_translated,
                    has_image: v.has_image,
                    product_option_value: {
                        createMany: {
                            data: v.product_option_value.map(v => {
                                const { id, product_option_name_id, ...etc } = v;
                                return etc;
                            })
                        }
                    }
                },
                include: { product_option_value: true }
            });
        }));

        await ctx.prisma.productOption.createMany({
            data: product.product_option.map(productOption => {
                const { product_option1, product_option2, product_option3, ...etc } = productOption;
                return {
                    ...etc,
                    id: undefined,
                    product_id: newProduct.id,
                    option_value1_id: newProductOptionName.find(v => v.order === 1)!.product_option_value.find(v => v.taobao_vid === productOption.product_option1.taobao_vid)!.id,
                    option_value2_id: newProductOptionName.find(v => v.order === 2)?.product_option_value.find(v => v.taobao_vid === productOption.product_option2?.taobao_vid)?.id ?? null,
                    option_value3_id: newProductOptionName.find(v => v.order === 3)?.product_option_value.find(v => v.taobao_vid === productOption.product_option3?.taobao_vid)?.id ?? null,
                };
            })
        });
        return newProduct;
    }));
}

export const mutation_product = extendType({
    type: "Mutation",
    definition(t) {
        t.field("initProductImageByUser", {
            type: "String",
            args: {
                productId: nonNull(intArg())
            },
            resolve: initProductImageByUser
        });

        t.field("updateProductImageBySomeone", {
            type: nonNull("Product"),
            args: {
                productId: nonNull(intArg()),
                description: stringArg(),
                optionValues: nonNull(list(nonNull(arg({ type: "ProductOptionValueImageUpdateInput" })))),
                thumbnails: list(nonNull(arg({ type: "ProductThumbnailImageUpdateInput" }))),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    // if (1) return throwError(errors.etc("작업중입니다."), ctx);
                    const product = await ctx.prisma.product.findUnique({ where: { id: args.productId }, include: { product_store: true, product_option: true, product_option_name: { include: { product_option_value: true } } } });
                    
                    if (!product) {
                        return throwError(errors.noSuchData, ctx);
                    }

                    // if (product.isImageTranslated) {
                    //     if (ctx.token?.userId) {
                    //         publishUserLogData(ctx, { type: "updateProductImage", title: `이미 번역된 상품입니다. (${product.productCode})` });
                    //     }

                    //     return throwError(errors.etc("이미 번역된 상품입니다."), ctx);
                    // }

                    if (ctx.token?.userId && product.user_id !== ctx.token.userId) return throwError(errors.etc("해당 상품을 수정할 수 없습니다."), ctx);
                    const productOptionValues = product.product_option_name.flatMap(v => v.product_option_value);
                    if (args.optionValues.some(v => productOptionValues.findIndex(v2 => v2.id === v.id) === -1)) return throwError(errors.etc("해당 상품의 옵션이 아닌 옵션값이 있습니다."), ctx);

                    for (let v of args.optionValues) {
                        let image = v.image;
                        if (v.newImageBase64) {
                            const base64str = v.newImageBase64;
                            const res = base64str.match(/data:(image\/.*?);base64,(.*)/);
                            if (res) {
                                const [mimetype, buffer] = [res[1], Buffer.from(res[2], "base64")];
                                image = await uploadToS3AvoidDuplicateByBuffer(buffer, `option_${v.id}_.${mimetype.slice(mimetype.indexOf("/") + 1, 10)}`, mimetype, ["product", product.id]);
                            }
                            else {
                                image = undefined;
                            }
                        }
                        await ctx.prisma.productOptionValue.update({ where: { id: v.id }, data: { image } });
                    }
                    let imageThumbnailData = product.image_thumbnail_data;
                    if (args.thumbnails && args.thumbnails.length > 0) {
                        let imageArray: string[] = [];
                        for (let v of args.thumbnails) {
                            let image: string | undefined = v.defaultImage;
                            if (v.uploadImageBase64) {
                                const base64str = v.uploadImageBase64;
                                const res = base64str.match(/data:(image\/.*?);base64,(.*)/);
                                if (res) {
                                    const [mimetype, buffer] = [res[1], Buffer.from(res[2], "base64")];
                                    image = await uploadToS3AvoidDuplicateByBuffer(buffer, `thumbnail.${mimetype.slice(mimetype.indexOf("/") + 1, 10)}`, mimetype, ["product", product.id]);
                                }
                            }
                            //썸네일 https 수정
                            imageArray.push(image.replace(/^https?:/, "http:"));
                        }
                        imageThumbnailData = JSON.stringify(imageArray);
                    }

                    const description = args.description ? await uploadToS3WithEditor(args.description, ["product", product.id], "description") : undefined;
                    const result = await ctx.prisma.product.update({
                        where: { id: product.id }, data: {
                            is_image_translated: true,
                            description: description,
                            image_thumbnail_data:imageThumbnailData
                        }
                    });
                    if (ctx.token?.userId) {
                        publishUserLogData(ctx, { type: "updateProductImage", title: `상품의 이미지 정보가 수정되었습니다. (${result.product_code})` });
                    }
                    return result;

                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.field("updateProductByUser", {
            type: nonNull("Product"),
            args: {
                productId: nonNull(intArg()),
                name: stringArg(),
                price: intArg(),
                description: stringArg(),
                localShippingFee: intArg(),
                localShippingCode: intArg(),
                shippingFee: intArg(),
                options: nonNull(list(nonNull(arg({ type: "ProductOptionUpdateInput" })))),
                optionNames: nonNull(list(nonNull(arg({ type: "ProductOptionNameUpdateInput" })))),
                optionValues: nonNull(list(nonNull(arg({ type: "ProductOptionValueUpdateInput" })))),
                thumbnails: list(nonNull(arg({ type: "ProductThumbnailUpdateInput" }))),
                categoryCode: stringArg(),
                categoryA077: stringArg(),
                categoryA077Name: stringArg(),
                categoryB378: stringArg(),
                categoryB378Name: stringArg(),
                categoryA112: stringArg(),
                categoryA112Name: stringArg(),
                categoryA027: stringArg(),
                categoryA027Name: stringArg(),
                categoryA001: stringArg(),
                categoryA001Name: stringArg(),
                categoryA006: stringArg(),
                categoryA006Name: stringArg(),
                categoryB719: stringArg(),
                categoryB719Name: stringArg(),
                categoryA113: stringArg(),
                categoryA113Name: stringArg(),
                categoryA524: stringArg(),
                categoryA524Name: stringArg(),
                categoryA525: stringArg(),
                categoryA525Name: stringArg(),
                categoryB956: stringArg(),
                categoryB956Name: stringArg(),
                siilCode: stringArg(),
                siilData: list(nonNull(arg({ type: "SiilInput" }))),
                searchTags: stringArg(),
            },
            resolve: updateProductResolver
        })
        t.field("updateProductNameByUser", {
            type: nonNull("Product"),
            args: {
                productId: nonNull(intArg()),
                name: nonNull(stringArg()),
            },
            resolve: updateProductNameResolver
        })
        t.field("updateManyProductTagByUser", {
            type: nonNull("String"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                searchTags: nonNull(stringArg()),
            },
            resolve: updateManyProductTagResolver
        })
        t.field("updateManyProductNameByUser", {
            type: nonNull("String"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                head: stringArg(),
                body: stringArg(),
                tail: stringArg()
            },
            resolve: updateManyProductNameResolver
        })
        t.field("updateManyProductCategoryByUser", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                categoryA077: stringArg(),
                categoryA077Name: stringArg(),
                categoryB378: stringArg(),
                categoryB378Name: stringArg(),
                categoryA112: stringArg(),
                categoryA112Name: stringArg(),
                categoryA027: stringArg(),
                categoryA027Name: stringArg(),
                categoryA001: stringArg(),
                categoryA001Name: stringArg(),
                categoryA006: stringArg(),
                categoryA006Name: stringArg(),
                categoryB719: stringArg(),
                categoryB719Name: stringArg(),
                categoryA113: stringArg(),
                categoryA113Name: stringArg(),
                categoryA524: stringArg(),
                categoryA524Name: stringArg(),
                categoryA525: stringArg(),
                categoryA525Name: stringArg(),
                categoryB956: stringArg(),
                categoryB956Name: stringArg(),
                
            },
            resolve: updateManyProductCategoryResolver
        })
        t.field("updateManyProductSiilInfoByUser", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                siilCode: nonNull(stringArg()),
            },
            resolve: updateManyProductSiilInfoResolver
        })
        t.field("deleteProductByUser", {
            type: nonNull("Boolean"),
            args: {
                productId: nonNull(intArg())
            },
            resolve: deleteProductResolver
        })
        t.field("updateProductPriceByUser", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                cnyRate: nonNull(floatArg()),
                marginRate: nonNull(floatArg()),
                marginUnitType: nonNull(stringArg()),
                shippingFee: nonNull(intArg({ description: "유료배송비" })),
                localShippingFee: nonNull(intArg({ description: "해외배송비(배대지배송비)" })),
                localShippingCode: intArg()
            },
            resolve: updateProductPriceResolver
        })
        t.field("endProductSellStateByUser", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg())))
            },
            resolve: endProductSellStateResolver
        })
        ////////////////////////////////////
        t.field("updateProductByAdmin", {
            type: nonNull("Product"),
            args: {
                productId: nonNull(intArg()),
                name: stringArg(),
                price: intArg(),
                description: stringArg(),
                localShippingFee: intArg(),
                shippingFee: intArg(),
                options: nonNull(list(nonNull(arg({ type: "ProductOptionUpdateInput" })))),
                optionNames: nonNull(list(nonNull(arg({ type: "ProductOptionNameUpdateInput" })))),
                optionValues: nonNull(list(nonNull(arg({ type: "ProductOptionValueUpdateInput" })))),
                thumbnails: list(nonNull(arg({ type: "ProductThumbnailUpdateInput" }))),
                categoryCode: stringArg(),
                siilCode: stringArg(),
                siilData: list(nonNull(arg({ type: "SiilInput" }))),
            },
            resolve: updateProductResolver
        })
        t.field("updateProductNameByAdmin", {
            type: nonNull("Product"),
            args: {
                productId: nonNull(intArg()),
                name: nonNull(stringArg()),
            },
            resolve: updateProductNameResolver
        })
        t.field("updateManyProductCategoryByAdmin", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                categoryA077: stringArg(),
                categoryA077Name: stringArg(),
                categoryB378: stringArg(),
                categoryB378Name: stringArg(),
                categoryA112: stringArg(),
                categoryA112Name: stringArg(),
                categoryA027: stringArg(),
                categoryA027Name: stringArg(),
                categoryA001: stringArg(),
                categoryA001Name: stringArg(),
                categoryA006: stringArg(),
                categoryA006Name: stringArg(),
            },
            resolve: updateManyProductCategoryResolver
        })
        t.field("updateManyProductSiilInfoByAdmin", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                siilCode: nonNull(stringArg()),
            },
            resolve: updateManyProductSiilInfoResolver
        })
        t.field("deleteProductByAdmin", {
            type: nonNull("Boolean"),
            args: {
                productId: nonNull(intArg())
            },
            resolve: deleteProductResolver
        })
        t.field("updateProductPriceByAdmin", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                cnyRate: nonNull(floatArg()),
                marginRate: nonNull(floatArg()),
                marginUnitType: nonNull(stringArg()),
                shippingFee: nonNull(intArg({ description: "유료배송비" })),
                localShippingFee: nonNull(intArg({ description: "해외배송비(배대지배송비)" })),
                localShippingCode: intArg()
            },
            resolve: updateProductPriceResolver
        })
        t.field("endProductSellStateByAdmin", {
            type: nonNull("Int"),
            args: {
                productIds: nonNull(list(nonNull(intArg())))
            },
            resolve: endProductSellStateResolver
        })
        t.field("transferProductsToUserByAdmin", {
            type: nonNull("String"),
            args: {
                productIds: nonNull(list(nonNull(intArg()))),
                targetUserId: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const user = await ctx.prisma.user.findUnique({ where: { id: args.targetUserId } });
                    if (!user) return throwError(errors.etc("해당 유저가 없습니다."), ctx);
                    else if (user.state !== 'ACTIVE') return throwError(errors.etc("해당 유저가 없습니다."), ctx);
                    const targetProducts = await ctx.prisma.product.findMany({
                        where: { id: { in: args.productIds }, user_id: { equals: null } },
                        select: { id: true, taobao_product_id: true }
                    });
                    const userId = user.id;
                    const existingProducts = await ctx.prisma.product.findMany({
                        where: {
                            user_id: { equals: userId },
                            taobao_product_id: { in: targetProducts.map(v => v.taobao_product_id) }
                        },
                        select: { taobao_product_id: true }
                    });
                    const filteredTargetProducts = targetProducts.filter(v => existingProducts.findIndex(v2 => v2.taobao_product_id === v.taobao_product_id) === -1);

                    if (targetProducts.length > 0 && filteredTargetProducts.length === 0) return throwError(errors.etc("모든 상품이 해당 유저에 수집된 상품이거나, 관리자 상품이 아닙니다."), ctx);
                    const newProduct = await copyProductsToUser(filteredTargetProducts.map(v => v.id), ctx, userId)

                    return `${newProduct.length}개의 상품이 ${user.email} 유저 계정에 추가되었습니다.`

                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.field("setVisibleStateToProductOptionValueBySomeone", {
            type: nonNull("Boolean"),
            args: {
                productOptionValueId: nonNull(intArg()),
                isActive: nonNull(booleanArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const productOptionValue = await ctx.prisma.productOptionValue.findUnique({
                        where: { id: args.productOptionValueId },
                        select: { id: true, product_option_name: { select: { product: { select: { user_id: true } } } } }
                    });
                    if (!productOptionValue) return throwError(errors.etc("해당 옵션이 없습니다."), ctx);
                    if (ctx.token?.userId && productOptionValue?.product_option_name.product.user_id !== ctx.token.userId) return throwError(errors.etc("권한이 없습니다."), ctx);
                    await ctx.prisma.productOptionValue.update({
                        where: { id: productOptionValue.id },
                        data: { is_active: args.isActive }
                    })
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });

        t.field("disableUserOption", {
            type: nonNull("Boolean"),
            args: {
                id: nonNull(intArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const productOptionName = await ctx.prisma.productOptionName.findUnique({
                        where: { id: args.id }
                    });

                    if (!productOptionName) {
                        return throwError(errors.etc("해당 상품을 수정할 수 없습니다."), ctx);
                    }

                    const productOptionValue = await ctx.prisma.productOptionValue.findMany({ where: { productOptionNameId: productOptionName.id } });

                    const optionValueIds = productOptionValue.map((v) => {
                        return v.id;
                    })

                    await ctx.prisma.productOption.deleteMany({
                        where: {
                            product_id: productOptionName.product_id,
                            option_value1_id: productOptionName.order === 1 ? { not: optionValueIds[0] } : undefined,
                            option_value2_id: productOptionName.order === 2 ? { not: optionValueIds[0] } : undefined,
                            option_value3_id: productOptionName.order === 3 ? { not: optionValueIds[0] } : undefined,
                        }
                    });

                    const productOption = await ctx.prisma.productOption.findMany({
                        where: {
                            product_id: productOptionName.product_id,
                            option_value1_id: productOptionName.order === 1 ? { in: optionValueIds } : undefined,
                            option_value2_id: productOptionName.order === 2 ? { in: optionValueIds } : undefined,
                            option_value3_id: productOptionName.order === 3 ? { in: optionValueIds } : undefined,
                        }
                    });

                    await Promise.all(productOption.map(async (v) => {
                        if (v.option_value1_id && !v.option_value2_id && !v.option_value3_id) {
                            await ctx.prisma.productOption.delete({
                                where: {
                                    id: v.id
                                }
                            });
                        } else {
                            await ctx.prisma.productOption.update({
                                where: {
                                    id: v.id
                                },

                                data: {
                                    option_value1_id: productOptionName.order === 1 ? v.option_value2_id ?? 0 : undefined,
                                    option_value2_id: productOptionName.order === 1 || productOptionName.order === 2 ? v.option_value3_id ?? null : undefined,
                                    option_value3_id: null
                                }
                            });
                        }
                    }));

                    for (let i = productOptionName.order; i < 3; i++) {
                        await ctx.prisma.productOptionName.updateMany({
                            where: {
                                product_id: productOptionName.product_id,
                                order: i + 1
                            },
    
                            data: {
                                order: i
                            }
                        });

                        // await ctx.prisma.productOptionValue.updateMany({
                        //     where: {
                        //         productOptionNameId: productOptionName.id,
                        //         optionNameOrder: i + 1
                        //     },
    
                        //     data: {
                        //         optionNameOrder: i
                        //     }
                        // });
                    }

                    await ctx.prisma.productOptionValue.deleteMany({ where: { product_option_name_id: productOptionName.id } });
                    await ctx.prisma.productOptionName.delete({ where: { id: productOptionName.id } });

                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});
