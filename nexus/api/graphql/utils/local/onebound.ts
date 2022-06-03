import { Prisma, PrismaClient, Product, TaobaoProduct, UserInfo } from "@prisma/client";
import { isBefore, sub } from "date-fns";
import fetch from "node-fetch";
import { IOBApiType, IOBItem, IOBItemGetParam, IOBItemGetResponse, IOBPublicParameter, IQueryParam } from "../../../onebound_api_types";
import { ITranslateData } from "../translate_types";
import { Context } from "../../../types";
// import { EXTERNAL_ADDRESS, TRANSLATE_ITEM_SERVER } from "../constants";
import { errors, throwError } from "../error";
import { getFromS3, uploadToS3ByBuffer, uploadToS3WithEditor,uploadToS3AvoidDuplicateByBuffer } from "../file_manage";
import { wait } from "../helpers";
import { publishUserLogData } from "./pubsub";
import { calculatePrice } from './calculate-product-price';

var axios = require('axios');

export const publicParam: IOBPublicParameter = {
    key: "tel17537715186",
    secret: "20201206",
}
const OB_API_URL = "https://api-gw.onebound.cn/taobao/";

export function getOBFetchUrl<T extends IQueryParam>(apiName: IOBApiType, params: T) {
    return OB_API_URL + apiName + "?" + Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k] ?? "")).join('&');
}
export interface IGetItemAndSaveOption {
    /**
     *카테고리 코드(입력시 해당 카테고리 자동 저장)
     *
     * @author Kuhave
     * @memberof IGetItemAndSaveOption
     */
    categoryCode?: string;
    /**
     *수집하는 그룹 아이디
     *
     * @author Kuhave
     * @memberof IGetItemAndSaveOption
     */
    collectGroupId?: number;
    /**
     *고시정보코드
     *
     * @author Kuhave
     * @memberof IGetItemAndSaveOption
     */
    siilCode?: string;
    /**
     * 무료회원여부
     * @author Kuhave
     * @memberof IGetItemAndSaveOption
     */
    isRestricted: boolean;
    /**
     * 관리자 작업 여부
     * @author Kuhave
     * @memberof IGetItemAndSaveOption
     */
    isAdmin: boolean;
}

export interface IFeeInfo {
    marginRate: number
    marginUnitType: string
    cnyRate: number
    defaultShippingFee: number
    extraShippingFee: number
}

export const getTranslateData = (taobaoData: IOBItem, isTranslated?: boolean) => {
    //productOptionName 분석
    const firstPropertyInfo = taobaoData.skus.sku.length === 0 ? undefined : taobaoData.skus.sku[0]?.properties_name?.match(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g)
    const res = firstPropertyInfo?.map((v, i) => {
        const result = v.match(/([-\d]+):[-\d]+:(.+):.*;?/);
        if (result) {
            return { taobaoPid: result[1], name: result[2] };
        }
        else throw new Error("파싱 중 문제 발생 " + JSON.stringify(taobaoData));
    });

    if (res) {
        //productOptionValue 분석
        const productOptionValues = Object.entries(taobaoData.props_list).map(([key, value]) => { // 직렬처리 필요?
            const a = key.match(/([-\d]+):([-\d]+)/)!;
            const b = value.match(/^(.+):(.+)$/)!;
            // 차례대로 1:2 : 3:4 라고 하면
            // a[1]:1, a[2] : 2, b[1] : 3, b[2] : 4
            const productOptionName = res.find(v => v.taobaoPid === a[1])!;
            return {
                name: b[2],
                taobaoVid: a[2],
                taobaoPid: productOptionName.taobaoPid,
            }
        });
        return { taobaoNumIid: taobaoData.num_iid, title: taobaoData.title, optionName: res, optionValue: productOptionValues, video: null, description: taobaoData.desc, isTranslated: isTranslated ?? false };

    }
    return { taobaoNumIid: taobaoData.num_iid, title: taobaoData.title, optionName: [], optionValue: [], video: null, description: taobaoData.desc, isTranslated: isTranslated ?? false };
}

export async function getItemAndSave(ctx: Context, taobaoIids: string[], option: IGetItemAndSaveOption) {}

// export async function getItemAndSave(ctx: Context, taobaoIids: string[], option: IGetItemAndSaveOption) {
//     // 가져온 상품 id 쿼리하기
//     const refreshDay = await ctx.prisma.setting.findUnique({ where: { name: "TAOBAO_PRODUCT_REFRESH_DAY" } });
//     if (!refreshDay) return throwError(errors.notInitialized, ctx);
//     let taobaoProducts: ((TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null }) | null)[] = [];

//     // 현재 본인이 가진 상품 중 중복상품이 있는지 검사
//     const checkUserId = await ctx.prisma.product.findMany({
//         where: { userId: ctx.token?.userId ?? null, taobaoProduct: { taobaoNumIid: { in: taobaoIids } } },
//         select: { taobaoProduct: { select: { taobaoNumIid: true } } }
//     });

//     const filteredTaobaoIids = taobaoIids.filter(v => checkUserId.findIndex(v2 => v2.taobaoProduct.taobaoNumIid === v) === -1);

//     console.log(taobaoIids.length, taobaoIids, filteredTaobaoIids, filteredTaobaoIids.length);
//     if (filteredTaobaoIids.length === 0) {
//         if (ctx.token?.userId) {
//             publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 ${taobaoIids.length} 개는 모두 등록된 상품입니다.` });
//         }
//         return;
//     }

//     // await Promise.all(taobaoIids.map(async num_iid => {
//     for (const num_iid of filteredTaobaoIids) {
//         const product = await ctx.prisma.taobaoProduct.findUnique({ where: { taobaoNumIid: num_iid } });
//         if (!product || isBefore(product.modifiedAt, sub(new Date(), { days: parseInt(refreshDay.value) }))) {
//             let params: IOBItemGetParam = { ...publicParam, num_iid, is_promotion: 1 };

//             const maxAttempt = 10;
//             let result: IOBItemGetResponse | null = null;
//             for (let attempt = 1; attempt <= maxAttempt; attempt++) {
//                 result = await fetch(getOBFetchUrl<IOBItemGetParam>("item_get", params)).then(res => res.json()).catch(async e => {
//                     console.log(`attempt ${attempt} :`, "Onebound item_get parse error :", e);
//                     return null;
//                 }) as IOBItemGetResponse | null;
//                 if (result) {
//                     if (result.error !== '') {
//                         const errorInfo = (({ error, error_code, reason, request_id }) => ({ error, error_code, reason, request_id, time: new Date().toLocaleString() }))(result);
//                         console.log(`attempt ${attempt} :`, "item_get 에러", errorInfo);
//                     }
//                     else if (result.item) {
//                         break;
//                     }
//                 }
//                 await wait(200);
//             }

//             if (!result) continue;
//             if (!result.item) continue;

//             const item = result.item;
//             console.log("collecting ", item.num_iid);

//             const originalData = JSON.stringify(item);

//             let price = parseFloat(item.price);
//             if (isNaN(price)) price = 0;

//             try {
//                 const updatedProduct = await ctx.prisma.taobaoProduct.upsert({
//                     where: { taobaoNumIid: num_iid },
//                     create: {
//                         taobaoNumIid: num_iid,
//                         brand: item.brand,
//                         imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
//                         originalData,
//                         price,
//                         taobaoBrandId: item.brandId?.toString() ?? null,
//                         taobaoCategoryId: item.rootCatId,
//                         name: item.title,
//                     },
//                     update: {
//                         brand: item.brand,
//                         imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
//                         originalData,
//                         price: price !== 0 ? price : undefined,
//                         taobaoBrandId: item.brandId?.toString() ?? null,
//                         taobaoCategoryId: item.rootCatId,
//                         name: item.title,
//                     }
//                 })
//                 taobaoProducts.push({ ...updatedProduct, itemData: item, translateDataObject: null });
//             }
//             catch (e) {
//                 console.log("taobaoProduct upsert error : ", e, JSON.stringify({
//                     where: { taobaoNumIid: num_iid },
//                     create: {
//                         taobaoNumIid: num_iid,
//                         brand: item.brand,
//                         imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
//                         originalData,
//                         price: parseFloat(item.price),
//                         taobaoBrandId: item.brandId?.toString() ?? null,
//                         taobaoCategoryId: item.rootCatId,
//                         name: item.title,
//                     },
//                     update: {
//                         brand: item.brand,
//                         imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
//                         originalData,
//                         price: parseFloat(item.price),
//                         taobaoBrandId: item.brandId?.toString() ?? null,
//                         taobaoCategoryId: item.rootCatId,
//                         name: item.title,
//                     }
//                 }));

//             }
//             // return updatedProduct;

//         }
//         else {
//             const taobaoData = JSON.parse(product.originalData) as IOBItem;
//             const translateDataObject = product.translateData ? JSON.parse(product.translateData) as ITranslateData : null;
//             console.log("data:", taobaoData);
//             taobaoProducts.push({ ...product, itemData: taobaoData, translateDataObject });
//         }
//         // return product;
//     }

//     // 마진율 붙여서 본인 상품 만들기
//     const cnyRateSetting = await ctx.prisma.setting.findUnique({ where: { name: "CNY_RATE" } });
//     if (!cnyRateSetting) return throwError(errors.notInitialized, ctx);
//     const cnyRate = parseFloat(cnyRateSetting.value);
//     const userInfo = await ctx.prisma.userInfo.findUnique({ where: { userId: ctx.token!.userId ?? 0 } });
//     let info: IFeeInfo = {
//         marginRate: 0,
//         cnyRate,
//         defaultShippingFee: 0,
//     };
//     if (userInfo) {
//         info.marginRate = userInfo.marginRate;
//         info.cnyRate = userInfo.cnyRate;
//         info.defaultShippingFee = userInfo.defaultShippingFee;
//     }
//     if (!option.isAdmin && option.isRestricted) {
//         const result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
//         if (!result) return throwError(errors.notInitialized, ctx);
//         const freeUserProductLimit = parseInt(result.value);

//         const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
//         if (productCount >= freeUserProductLimit) return throwError(errors.etc("무료 이용량을 초과하였습니다."), ctx);
//         taobaoProducts = taobaoProducts.slice(0, freeUserProductLimit - productCount);
//     }
//     if (userInfo?.maxProductLimit) {
//         const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
//         if (productCount >= userInfo.maxProductLimit) return throwError(errors.etc("이용 가능한 최대 상품 수집량을 초과하였습니다."), ctx);
//         taobaoProducts = taobaoProducts.slice(0, userInfo.maxProductLimit - productCount);
//         await ctx.prisma.userInfo.update({ where: { userId: userInfo.userId }, data: { productCollectCount: { increment: taobaoProducts.length } } });
//     }

//     const taobaoProductTranslateRequest = await ctx.prisma.taobaoProductTranslateRequest.create({
//         data: { taobaoIidArray: JSON.stringify(taobaoProducts.map(v => v!.taobaoNumIid)), adminId: ctx.token!.adminId, userId: ctx.token!.userId, categoryCode: option.categoryCode, siilCode: option.siilCode }
//     })
//     const jsonData = {
//         requestId: taobaoProductTranslateRequest.id,
//         callbackUrl: `${EXTERNAL_ADDRESS}/callback/translate`,
//         data: taobaoProducts.map(v => getTranslateData(v!.itemData))
//     };
//     try {
//         const requestResult = await fetch(TRANSLATE_ITEM_SERVER, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(jsonData)
//         }).then(async (res) => ({ code: res.status, data: await res.text() }))
//         console.log("translateRequest:", requestResult)
//         if (requestResult.code !== 200) throw new Error(requestResult.data);
//         return;
//     }
//     catch (e) {
//         console.log("번역 요청 실패 추정 : ", e);
//         await ctx.prisma.taobaoProductTranslateRequest.delete({ where: { id: taobaoProductTranslateRequest.id } });
//         if (userInfo) {
//             await ctx.prisma.userInfo.update({ where: { userId: userInfo.userId }, data: { productCollectCount: { decrement: taobaoProducts.length } } });
//         }
//         publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 ${taobaoProducts.length} 개 수집 요청에 실패하였습니다.` });
//         return;
//     }
// }

export const getNameFromCookie = (cookie: string) => {
    const decodedCookie = Buffer.from(cookie, "base64").toString("utf8");
    console.log(decodedCookie)
    let result = decodedCookie.match(/; lgc=(.*?)(; ?)|($)/);
    if (result) return result[1];
    result = decodedCookie.match(/; tracknick=(.*?)(; ?)|($)/);
    if (result) return result[1];
    result = decodedCookie.match(/; dnk=(.*?)(; ?)|($)/);
    if (result) return result[1];
    return null;
}

export const saveTaobaoItemToUser = async <T extends IFeeInfo>(prisma: PrismaClient, productCode: string | undefined, taobaoProducts: ((TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null }) | null)[], userId: number | null, userInfo: T, categoryCode?: string | null, siilCode?: string | null, adminId?: number) => {
    const boundCalculatePrice = (cnyPrice: number, cnyRate: number, defaultShippingFee: number) => 
    calculatePrice.bind(null, cnyPrice, userInfo.marginRate, userInfo.marginUnitType, cnyRate, defaultShippingFee)();
    // 메모 const calculatePrice: any = (cnyPrice: string | number, marginRate: number, marginUnitType: string, cnyRate: number, shippingFee: number) => {
    //     if (marginUnitType === "WON") {
    //         return Math.round((Math.floor(parseFloat(cnyPrice.toString()) * cnyRate) + shippingFee + marginRate) / 100) * 100;
    //     } else {
    //         return Math.round((Math.floor(parseFloat(cnyPrice.toString()) * cnyRate) + shippingFee) * (100 + marginRate) / 10000) * 100;
    //     }
    // }
    return await Promise.all(taobaoProducts.filter((v): v is TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null } => v !== null).map(async v => {
        const taobaoData = v.itemData;
        const translateData = v.translateDataObject;

        let product = await prisma.product.findUnique({ where: { UQ_user_id_taobao_product_id: { taobao_product_id: v.id, user_id: userId ?? 0 } } })

        //productOptionName 분석
        const firstPropertyInfo = taobaoData.skus.sku.length === 0 ? undefined : taobaoData.skus.sku[0]?.properties_name?.match(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g)

        if ((firstPropertyInfo?.length ?? 0) > 3) {
            throw new Error("옵션이 4개 이상인 상품은 수집이 불가합니다.");
        }

        const res = firstPropertyInfo?.map((v, i) => {
            const result = v.match(/([-\d]+):[-\d]+:(.+):.*;?/);
            if (result) {
                return { taobaoPid: result[1], name: result[2], order: i + 1 };
            }
            else throw new Error("파싱 중 문제 발생 " + JSON.stringify(taobaoData));
        });

        if (!product) {
            var description = (translateData?.description ?? taobaoData.desc).replace(/(?<!<p ?>)(<img [^>]*?>)(?!<p>)/g, "<p>$1</p>");

            let code = 0;
            let price = parseFloat(taobaoData.price);

            if (isNaN(price)) price = 0;

            let cnyRate = 0;
            let defaultShippingFee = 0;

            if (taobaoData.shop_id === "express") {
                for (var i in taobaoData.props) {
                    if (taobaoData.props[i].default) {
                        code = parseInt(i);

                        break;
                    }
                }

                cnyRate = 1;
                defaultShippingFee = taobaoData.props[code].value;
            } else {
                cnyRate = userInfo.cnyRate;
                defaultShippingFee = userInfo.defaultShippingFee;
            }

            price = boundCalculatePrice(price, cnyRate, defaultShippingFee);

            if (isNaN(price)) price = 0;
            
            let searchTags = ""
            let title_list = translateData?.title.split(" ") ?? [];
    
            for (let i in title_list) {
                searchTags += title_list[i];

                if (parseInt(i) < title_list.length - 1) {
                    searchTags += ", ";
                }
            }

            let categories: any = {};
            
            if (categoryCode) {
                let result_b378 = await prisma.categoryInfoB378.findUnique({ where: { code: categoryCode }});
                let result_a077 = await prisma.categoryInfoA077.findUnique({ where: { code: result_b378?.code_a077 }});
                let result_a112 = await prisma.categoryInfoA112.findUnique({ where: { code: result_a077?.code_a112 }});
                let result_a113 = await prisma.categoryInfoA113.findUnique({ where: { code: result_a077?.code_a113 }});
                let result_a027 = await prisma.categoryInfoA027.findUnique({ where: { code: result_a077?.code_a027 }});
                let result_a001 = await prisma.categoryInfoA001.findUnique({ where: { code: result_a077?.code_a001 }});
                let result_a006 = await prisma.categoryInfoA006.findUnique({ where: { code: result_a077?.code_a006 }});
                let result_b719 = await prisma.categoryInfoB719.findUnique({ where: { code: result_a077?.code_b719 }});
                let result_a524 = await prisma.categoryInfoA524.findUnique({ where: { code: result_a077?.code_a524 }});
                let result_a525 = await prisma.categoryInfoA525.findUnique({ where: { code: result_a077?.code_a525 }});
                let result_b956 = await prisma.categoryInfoB956.findUnique({ where: { code: result_a077?.code_b956 }});

                categories['B378'] = result_b378?.code;
                categories['B378_name'] = result_b378?.name;

                categories['A077'] = result_a077?.code;
                categories['A077_name'] = result_a077?.name;

                categories['A112'] = result_a112?.code;
                categories['A112_name'] = result_a112?.name;

                categories['A113'] = result_a113?.code;
                categories['A113_name'] = result_a113?.name;

                categories['A027'] = result_a027?.code;
                categories['A027_name'] = result_a027?.name;

                categories['A001'] = result_a001?.code;
                categories['A001_name'] = result_a001?.name;

                categories['A006'] = result_a006?.code;
                categories['A006_name'] = result_a006?.name;

                categories['B719'] = result_b719?.code;
                categories['B719_name'] = result_b719?.name;

                categories['A524'] = result_a524?.code;
                categories['A524_name'] = result_a524?.name;

                categories['A525'] = result_a525?.code;
                categories['A525_name'] = result_a525?.name;

                categories['B956'] = result_b956?.code;
                categories['B956_name'] = result_b956?.name;
            }

            product = await prisma.product.create({
                data: {
                    name: taobaoData.nick !== "" ? taobaoData.nick : translateData?.title ?? taobaoData.title,
                    description,
                    price,
                    shipping_fee: userInfo.extraShippingFee,
                    user_id : userId,
                    admin_id : adminId,
                    taobao_product_id: v.id,

                    // categoryCode: categoryCode,

                    category_a077: categories['A077'],
                    category_a077_name: categories['A077_name'],

                    category_b378: categories['B378'],
                    category_b378_name: categories['B378_name'],

                    category_a112: categories['A112'],
                    category_a112_name: categories['A112_name'],

                    category_a027: categories['A027'],
                    category_a027_name: categories['A027_name'],

                    category_a001: categories['A001'],
                    category_a001_name: categories['A001_name'],

                    category_a006: categories['A006'],
                    category_a006_name: categories['A006_name'],

                    category_a113: categories['A113'],
                    category_a113_name: categories['A113_name'],

                    category_b719: categories['B719'],
                    category_b719_name: categories['B719_name'],

                    category_a524: categories['A524'],
                    category_a524_name: categories['A524_name'],

                    category_a525: categories['A525'],
                    category_a525_name: categories['A525_name'],

                    category_b956: categories['B956'],
                    category_b956_name: categories['B956_name'],

                    siil_code: siilCode,
                    image_thumbnail_data: JSON.stringify(taobaoData.item_imgs.map(v => "http:" + v.url.replace(/^https?:/, ""))),
                    product_code: "",
                    margin_rate: userInfo.marginRate,
                    margin_unit_type: userInfo.marginUnitType,
                    cny_rate: cnyRate,
                    local_shipping_fee: defaultShippingFee,
                    local_shipping_code: code,
                    search_tags: taobaoData.desc_short !== "" ? taobaoData.desc_short : searchTags
                },
            });

            // VVIC Thumbnails/Descriptions Upload
            if (taobaoData.shop_id === 'vvic') {
                if (taobaoData.item_imgs.length > 0) {
                    var new_imgs = await Promise.all(taobaoData.item_imgs.map(async(v, i) => {
                        let image_resp = await axios.get(v.url, {responseType: 'arraybuffer'});
                        let image_raw = Buffer.from(image_resp.data).toString('base64');
                        let image_base64 = "data:" + image_resp.headers["content-type"] + ";base64," + image_raw;

                        const res = image_base64.match(/data:(image\/.*?);base64,(.*)/);

                        if (product && res) {
                            const [mimetype, buffer] = [res[1], Buffer.from(res[2], "base64")];
                            
                            var image_ext = mimetype.slice(mimetype.indexOf("/") + 1, mimetype.length);

                            if (image_ext === 'jpeg') {
                                image_ext = 'jpg';
                            }

                            var image_url = `https://img.sellforyou.co.kr/sellforyou/${await uploadToS3AvoidDuplicateByBuffer(buffer, `thumbnail${(i + 1).toString().padStart(2, '0')}.${image_ext}`, mimetype, ["product", product.id])}`;

                            return {
                                "url": image_url
                            };
                        }

                        return {
                            "url": ""
                        };
                    }));

                    if (new_imgs.length > 0) {
                        var sorted_imgs = new_imgs.sort(function compare(a: any, b: any) {
                            if ( a.url < b.url ) {
                                return -1;
                            }

                            if ( a.url > b.url ) {
                                return 1;
                            }

                            return 0;
                        });

                        taobaoData.item_imgs = sorted_imgs;
                    }
                }

                if (taobaoData.desc_img.length > 0) {
                    var desc_imgs = await Promise.all(taobaoData.desc_img.map(async(v, i) => {
                        let image_resp = await axios.get(v, {responseType: 'arraybuffer'});
                        let image_raw = Buffer.from(image_resp.data).toString('base64');
                        let image_base64 = "data:" + image_resp.headers["content-type"] + ";base64," + image_raw;
    
                        const res = image_base64.match(/data:(image\/.*?);base64,(.*)/);
    
                        if (product && res) {
                            const [mimetype, buffer] = [res[1], Buffer.from(res[2], "base64")];
                            
                            var image_ext = mimetype.slice(mimetype.indexOf("/") + 1, mimetype.length);

                            if (image_ext === 'jpeg') {
                                image_ext = 'jpg';
                            }

                            return `https://img.sellforyou.co.kr/sellforyou/${await uploadToS3AvoidDuplicateByBuffer(buffer, `description${(i + 1).toString().padStart(2, '0')}.${image_ext}`, mimetype, ["product", product.id])}`;
                        }
                    }));
    
                    if (desc_imgs.length > 0) {
                        var sorted_desc_imgs = desc_imgs.sort();
                        var sorted_desc_html = ``;
        
                        for (var i in sorted_desc_imgs) {
                            sorted_desc_html += `<img src=${sorted_desc_imgs[i]} alt="" />`;
                        }
        
                        if (translateData) {
                            translateData.description = sorted_desc_html;
                        }

                        description = (translateData?.description ?? taobaoData.desc).replace(/(?<!<p ?>)(<img [^>]*?>)(?!<p>)/g, "<p>$1</p>");
                    }
                }

                product = await prisma.product.update({
                    where: { 
                        id: product.id 
                    },
                    data: { 
                        description,
                        image_thumbnail_data: JSON.stringify(taobaoData.item_imgs.map(v => v.url)),
                    }
                });
            }

            product = await prisma.product.update({
                where: { 
                    id: product.id 
                },
                data: { 
                    product_code: productCode ?? `SFY${adminId ? "A" : ""}_` + product.id.toString(36) 
                }
            });
            
            if (res) { //옵션 있는 상품의 경우
                const productOptionNames = await Promise.all(res!.map(async function (v) {
                        const name = translateData?.optionName.find(v2 => v2.taobaoPid === v.taobaoPid)?.name ?? v.name;
                        const urlInfo = taobaoData.prop_imgs.prop_img.find(v2 => v2.properties.split(":")[0] === v.taobaoPid);

                        return await prisma.productOptionName.create({ data: { taobao_pid : v.taobaoPid , order : v.order , has_image: !!urlInfo, product_id: product!.id, name } });
                    }));

                //productOptionValue 분석
                const propsLengthInfo = Object.keys(taobaoData.props_list).map(v => v.match(/([-\d]+):([-\d]+)/)![1]).reduce((p, c) => {
                    const index = p.findIndex(v => v.l === c);
                    if (index !== -1) {
                        p[index].c = p[index].c + 1;
                    }
                    else {
                        const index2 = p.findIndex(v => v.l === ""); //하나는 분명 있음(옵션은 최대 3개)
                        p[index2].l = c;
                        p[index2].c = 1;
                    }

                    return p;
                }, [{ l: "", c: 0 }, { l: "", c: 0 }, { l: "", c: 0 },] as { l: string, c: number }[])

                propsLengthInfo[2].c = propsLengthInfo[1].c + propsLengthInfo[0].c;
                propsLengthInfo[1].c = propsLengthInfo[0].c;
                propsLengthInfo[0].c = 0;

                const productOptionValues = await Promise.all(Object.entries(taobaoData.props_list).map(async ([key, value], i) => { // 직렬처리 필요?
                    const a = key.match(/([-\d]+):([-\d]+)/)!;
                    const b = value.match(/^(.+):(.+)$/)!;

                    // 차례대로 1:2 : 3:4 라고 하면
                    // a[1]:1, a[2] : 2, b[1] : 3, b[2] : 4
                    const productOptionName = productOptionNames.find(v => v.taobao_pid === a[1])!;
                    const urlInfo = taobaoData.prop_imgs.prop_img.find(v => v.properties === key);
                    const name = translateData?.optionValue.find(v2 => v2.taobaoPid === a[1] && v2.taobaoVid === a[2])?.name ?? b[2];

                    let image = urlInfo ? /^https?:\/\//.test(urlInfo.url) ? urlInfo.url : ("http://" + urlInfo.url) : null;

                    image = image !== null ? image.replace(/^https?:\/\/\/\//, "http://") : image;

                    var temp = i - propsLengthInfo.find(v => v.l === a[1])!.c + 1;

                    if (taobaoData.shop_id === 'vvic' && image) {
                        let image_resp = await axios.get(image, {responseType: 'arraybuffer'});
                        let image_raw = Buffer.from(image_resp.data).toString('base64');
                        let image_base64 = "data:" + image_resp.headers["content-type"] + ";base64," + image_raw;

                        const res = image_base64.match(/data:(image\/.*?);base64,(.*)/);

                        if (product && res) {
                            const [mimetype, buffer] = [res[1], Buffer.from(res[2], "base64")];
                            
                            var image_ext = mimetype.slice(mimetype.indexOf("/") + 1, mimetype.length);

                            if (image_ext === 'jpeg') {
                                image_ext = 'jpg';
                            }

                            image = `https://img.sellforyou.co.kr/sellforyou/${await uploadToS3AvoidDuplicateByBuffer(buffer, `option${(i + 1).toString().padStart(2, '0')}.${image_ext}`, mimetype, ["product", product.id])}`;
                        }
                    }

                    return await prisma.productOptionValue.create({
                        data: {
                            name,
                            image,
                            option_name_order: productOptionName.order,
                            taobao_vid: a[2],
                            product_option_name_id: productOptionName.id,
                            number: temp,
                        }
                    });
                }));

                await Promise.all(taobaoData.skus.sku.map(async sku => {
                    const match = sku.properties.match(/^([-\d]+):([-\d]+);?([-\d]+)?:?([-\d]+)?;?([-\d]+)?:?([-\d]+)?/)!;

                    const optionString = [
                        productOptionValues.find(v => v.option_name_order === 1 && v.taobao_vid === match[2])!.number,
                        productOptionValues.find(v => v.option_name_order === 2 && v.taobao_vid === match[4])?.number,
                        productOptionValues.find(v => v.option_name_order === 3 && v.taobao_vid === match[6])?.number,
                    ].filter((v): v is number => typeof v === 'number').map(v => ("00" + v).slice(-2)).join('_');

                    return await prisma.productOption.create({
                        data: {
                            product_id: product!.id,
                            option_value1_id: productOptionValues.find(v => v.option_name_order === 1 && v.taobao_vid === match[2])!.id,
                            option_value2_id: productOptionValues.find(v => v.option_name_order === 2 && v.taobao_vid === match[4])?.id,
                            option_value3_id: productOptionValues.find(v => v.option_name_order === 3 && v.taobao_vid === match[6])?.id,
                            taobao_sku_id: sku.sku_id,
                            price_cny: parseFloat(sku.price),
                            price: taobaoData.shop_id === "express" ? boundCalculatePrice(parseFloat(sku.price), 1, taobaoData.props[code].value) : boundCalculatePrice(parseFloat(sku.price), cnyRate, defaultShippingFee),
                            stock: parseInt(sku.quantity ?? "0"),
                            option_string : optionString 
                        }
                    });
                }));
            }
        }

        return product;
    }))
}
