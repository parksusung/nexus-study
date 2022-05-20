import { PrismaClient } from ".prisma/client";
import { arg, enumType, extendType, intArg, list, nonNull, stringArg } from "nexus";
import { NexusGenAllTypes } from "../typegen";
import { Context } from "../types";
import { errors, throwError } from "./utils/error";
import { translateTextByPapagoAPI } from "./utils/local/translate";

export const enum_translate_engine_type = enumType({
    name: "TranslateEngineEnumType",
    members: [{
        name: "PAPAGO",
        value: "papago"
    }, {
        name: "GOOGLE",
        value: "google"
    }, {
        name: "BAIDU",
        value: "baidu"
    },]
})

export const enum_translate_target_type = enumType({
    name: "TranslateTargetEnumType",
    members: [{
        name: "PRODUCT_ALL",
        description: "상품 전체 일괄번역,id:Product",
    }, {
        name: "PRODUCT_OPTION_ALL",
        description: "상품 옵션 일괄번역,id:ProductOptionName"
    }, {
        name: "PRODUCT_NAME",
        description: "상품 이름 번역,id:Product"
    }, {
        name: "PRODUCT_OPTION_NAME",
        description: "상품 옵션 이름 번역,id:ProductOptionName"
    }, {
        name: "PRODUCT_OPTION_VALUE",
        description: "상품 옵션별 이름 번역,id:ProductOptionValue"
    },]
})

export const query_external_api = extendType({
    type: "Query",
    definition(t) {
        t.field("translateText", {
            type: nonNull("String"),
            args: {
                engine: nonNull(arg({ type: "TranslateEngineEnumType", default: "papago" })),
                text: nonNull(stringArg())
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (/^[\x00-\x7F가-힣ㄱ-ㅎㅏ-ㅣ]+$/g.test(args.text)) return args.text;
                    return await translateTextByPapagoAPI(args.text);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});

const isNeedToTranslate = <T extends { name: string }>(object: T) => !/^[\x00-\x7F가-힣ㄱ-ㅎㅏ-ㅣ]+$/g.test(object.name);

// const translateProduct = async (ctx: Context, type: NexusGenAllTypes["TranslateTargetEnumType"], id: number): Promise<string> => {
//     let ids: number[] = [];
//     let isTranslated = false;
//     console.log("translate :", { type, id });
//     //상품 이름 번역
//     if (['PRODUCT_ALL', 'PRODUCT_NAME'].includes(type)) {
//         const product = await ctx.prisma.product.findUnique({ where: { id: id }, include: { productOptionName: { select: { id: true } } } });
//         if (!product) return throwError(errors.noSuchData, ctx);
//         if (!product.isNameTranslated) {
//             const name = isNeedToTranslate(product) ? await translateTextByPapagoAPI(product.name) : product.name;
//             console.log(`translate: ${id} 상품이름 번역 완료`)
//             isTranslated = isTranslated || isNeedToTranslate(product);
//             await ctx.prisma.product.update({ where: { id: product.id }, data: { isNameTranslated: true, name } });
//         }
//         if (type === 'PRODUCT_ALL') {
//             ids = ids.concat(product.productOptionName.map(v => v.id));
//         }
//     }
//     if (['PRODUCT_OPTION_ALL', 'PRODUCT_OPTION_NAME'].includes(type)) {
//         ids = [id];
//     }
//     if (ids.length > 0) {
//         const valueIds = (await Promise.all(ids.map(async id => {
//             const productOptionName = await ctx.prisma.productOptionName.findUnique({ where: { id }, include: { productOptionValue: { select: { id: true } } } });
//             if (!productOptionName) return throwError(errors.noSuchData, ctx);
//             if (!productOptionName.isNameTranslated) {
//                 const name = isNeedToTranslate(productOptionName) ? await translateTextByPapagoAPI(productOptionName.name) : productOptionName.name;
//                 console.log(`translate: ${id} 상품옵션 종류 번역 완료`)
//                 isTranslated = isTranslated || isNeedToTranslate(productOptionName);
//                 await ctx.prisma.productOptionName.update({ where: { id: productOptionName.id }, data: { isNameTranslated: true, name } });
//             }
//             if (['PRODUCT_ALL', 'PRODUCT_OPTION_ALL'].includes(type)) return productOptionName.productOptionValue.map(v => v.id)
//             return null;
//         }))).filter((v): v is number[] => v !== null).flat();
//         ids = [...valueIds];
//     }
//     if (['PRODUCT_OPTION_VALUE'].includes(type)) {
//         ids = [id];
//     }
//     if (ids.length > 0) {
//         await Promise.all(ids.map(async id => {
//             const productOptionValue = await ctx.prisma.productOptionValue.findUnique({ where: { id } });
//             if (!productOptionValue) return throwError(errors.noSuchData, ctx);
//             if (!productOptionValue.isNameTranslated) {
//                 console.log(`translate: ${id} 상품옵션 이름 번역 완료`)
//                 const name = isNeedToTranslate(productOptionValue) ? await translateTextByPapagoAPI(productOptionValue.name) : productOptionValue.name;
//                 isTranslated = isTranslated || isNeedToTranslate(productOptionValue);
//                 await ctx.prisma.productOptionValue.update({ where: { id: productOptionValue.id }, data: { isNameTranslated: true, name } });
//             }
//         }));
//     }
//     if (!isTranslated) return `이미 번역된 ${type === 'PRODUCT_ALL' ? '상품' : '항목'}입니다.`;
//     return "번역되었습니다."

// }

export const mutation_external_api = extendType({
    type: "Mutation",
    definition(t) {
        t.field("translateProductTextByUser", {
            type: nonNull("String"),
            args: {
                type: nonNull(arg({ type: "TranslateTargetEnumType" })),
                id: nonNull(intArg())
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await translateProduct(ctx, args.type, args.id);
                    if (/^이미 번역된/.test(result)) return throwError(errors.etc(result), ctx);
                    return result;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.field("translateProductsTextByUser", {
            type: nonNull("String"),
            args: {
                type: nonNull(arg({ type: "TranslateTargetEnumType" })),
                ids: nonNull(list(nonNull(intArg()))),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const result = await Promise.all(args.ids.map(v => translateProduct(ctx, args.type, v)));
                    const successfulCount = result.filter(v => v === '번역되었습니다.').length;
                    const failedCount = result.filter(v => v !== '번역되었습니다.').length;
                    if (args.ids.length === successfulCount) return `${successfulCount}개의 상품이 번역되었습니다.`
                    else if (args.ids.length === failedCount) return `${failedCount}개의 상품 모두 이미 번역된 ${args.type === 'PRODUCT_ALL' ? '상품' : '항목'}입니다.`
                    return `이미 번역된 ${failedCount}개를 제외한 ${successfulCount}개의 상품이 번역되었습니다.`
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});