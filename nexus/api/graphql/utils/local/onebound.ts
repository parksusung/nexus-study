import { Prisma, PrismaClient, Product, TaobaoProduct, UserInfo } from "@prisma/client";
import { isBefore, sub } from "date-fns";
import fetch from "node-fetch";
import { IOBApiType, IOBItem, IOBItemGetParam, IOBItemGetResponse, IOBPublicParameter, IQueryParam } from "../../onebound_api_types";
import { ITranslateData } from "../../translate_types";
import { Context } from "../../types";
import { EXTERNAL_ADDRESS, TRANSLATE_ITEM_SERVER } from "../constants";
import { errors, throwError } from "../error";
import { getFromS3, uploadToS3ByBuffer, uploadToS3WithEditor } from "../file_manage";
import { wait } from "../helpers";
import { publishUserLogData } from "./pubsub";


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
    cnyRate: number
    defaultShippingFee: number
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
            const urlInfo = taobaoData.prop_imgs.prop_img.find(v => v.properties === key);
            return {
                name: b[2],
                taobaoVid: a[2],
                taobaoPid: productOptionName.taobaoPid,
            }
        });
        const optionData = taobaoData.skus.sku.map((sku) => {
            return {
                priceCny: parseFloat(sku.price),
                name: sku.properties_name.replace(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g, "$1:$2, ").slice(0, -2),
                taobaoOptionName: sku.properties_name,
                taobaoSkuId: sku.sku_id,
            }
        })
        return { taobaoNumIid: taobaoData.num_iid, title: taobaoData.title, optionName: res, optionValue: productOptionValues, video: null, description: taobaoData.desc, isTranslated: isTranslated ?? false };

    }
    return { taobaoNumIid: taobaoData.num_iid, title: taobaoData.title, optionName: [], optionValue: [], video: null, description: taobaoData.desc, isTranslated: isTranslated ?? false };
}

export async function getItemAndSave(ctx: Context, taobaoIids: string[], option: IGetItemAndSaveOption) {
    // 가져온 상품 id 쿼리하기
    const refreshDay = await ctx.prisma.setting.findUnique({ where: { name: "TAOBAO_PRODUCT_REFRESH_DAY" } });
    if (!refreshDay) return throwError(errors.notInitialized, ctx);
    let taobaoProducts: ((TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null }) | null)[] = [];

    // 현재 본인이 가진 상품 중 중복상품이 있는지 검사
    const checkUserId = await ctx.prisma.product.findMany({
        where: { userId: ctx.token?.userId ?? null, taobaoProduct: { taobaoNumIid: { in: taobaoIids } } },
        select: { taobaoProduct: { select: { taobaoNumIid: true } } }
    });
    const filteredTaobaoIids = taobaoIids.filter(v => checkUserId.findIndex(v2 => v2.taobaoProduct.taobaoNumIid === v) === -1);

    console.log(taobaoIids.length, taobaoIids, filteredTaobaoIids, filteredTaobaoIids.length);
    if (filteredTaobaoIids.length === 0) {
        if (ctx.token?.userId) {
            publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 ${taobaoIids.length} 개는 모두 등록된 상품입니다.` });
        }
        return;
    }



    // await Promise.all(taobaoIids.map(async num_iid => {
    for (const num_iid of filteredTaobaoIids) {
        const product = await ctx.prisma.taobaoProduct.findUnique({ where: { taobaoNumIid: num_iid } });
        if (!product || isBefore(product.modifiedAt, sub(new Date(), { days: parseInt(refreshDay.value) }))) {
            let params: IOBItemGetParam = { ...publicParam, num_iid, is_promotion: 1 };

            const maxAttempt = 10;
            let result: IOBItemGetResponse | null = null;
            for (let attempt = 1; attempt <= maxAttempt; attempt++) {
                result = await fetch(getOBFetchUrl<IOBItemGetParam>("item_get", params)).then(res => res.json()).catch(async e => {
                    console.log(`attempt ${attempt} :`, "Onebound item_get parse error :", e);
                    return null;
                }) as IOBItemGetResponse | null;
                if (result) {
                    if (result.error !== '') {
                        const errorInfo = (({ error, error_code, reason, request_id }) => ({ error, error_code, reason, request_id, time: new Date().toLocaleString() }))(result);
                        console.log(`attempt ${attempt} :`, "item_get 에러", errorInfo);
                    }
                    else if (result.item) {
                        break;
                    }
                }
                await wait(200);
            }

            if (!result) continue;
            if (!result.item) continue;

            // console.log(result);
            // console.log(JSON.stringify(result));
            const item = result.item;
            // console.log(item.brandId, typeof item.brandId);
            console.log("collecting ", item.num_iid);

            const originalData = JSON.stringify(item);

            let price = parseFloat(item.price);
            if (isNaN(price)) price = 0;

            try {
                const updatedProduct = await ctx.prisma.taobaoProduct.upsert({
                    where: { taobaoNumIid: num_iid },
                    create: {
                        taobaoNumIid: num_iid,
                        brand: item.brand,
                        imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
                        originalData,
                        price,
                        taobaoBrandId: item.brandId?.toString() ?? null,
                        taobaoCategoryId: item.rootCatId,
                        name: item.title,
                    },
                    update: {
                        brand: item.brand,
                        imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
                        originalData,
                        price: price !== 0 ? price : undefined,
                        taobaoBrandId: item.brandId?.toString() ?? null,
                        taobaoCategoryId: item.rootCatId,
                        name: item.title,
                    }
                })
                taobaoProducts.push({ ...updatedProduct, itemData: item, translateDataObject: null });
            }
            catch (e) {
                console.log("taobaoProduct upsert error : ", e, JSON.stringify({
                    where: { taobaoNumIid: num_iid },
                    create: {
                        taobaoNumIid: num_iid,
                        brand: item.brand,
                        imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
                        originalData,
                        price: parseFloat(item.price),
                        taobaoBrandId: item.brandId?.toString() ?? null,
                        taobaoCategoryId: item.rootCatId,
                        name: item.title,
                    },
                    update: {
                        brand: item.brand,
                        imageThumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
                        originalData,
                        price: parseFloat(item.price),
                        taobaoBrandId: item.brandId?.toString() ?? null,
                        taobaoCategoryId: item.rootCatId,
                        name: item.title,
                    }
                }));

            }
            // return updatedProduct;

        }
        else {
            const taobaoData = JSON.parse(product.originalData) as IOBItem;
            const translateDataObject = product.translateData ? JSON.parse(product.translateData) as ITranslateData : null;
            console.log("data:", taobaoData);
            taobaoProducts.push({ ...product, itemData: taobaoData, translateDataObject });
        }
        // return product;
    }




    // 마진율 붙여서 본인 상품 만들기
    const cnyRateSetting = await ctx.prisma.setting.findUnique({ where: { name: "CNY_RATE" } });
    if (!cnyRateSetting) return throwError(errors.notInitialized, ctx);
    const cnyRate = parseFloat(cnyRateSetting.value);
    const userInfo = await ctx.prisma.userInfo.findUnique({ where: { userId: ctx.token!.userId ?? 0 } });
    let info: IFeeInfo = {
        marginRate: 0,
        cnyRate,
        defaultShippingFee: 0,
    };
    if (userInfo) {
        info.marginRate = userInfo.marginRate;
        info.cnyRate = userInfo.cnyRate;
        info.defaultShippingFee = userInfo.defaultShippingFee;
    }
    if (!option.isAdmin && option.isRestricted) {
        const result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
        if (!result) return throwError(errors.notInitialized, ctx);
        const freeUserProductLimit = parseInt(result.value);

        const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
        if (productCount >= freeUserProductLimit) return throwError(errors.etc("무료 이용량을 초과하였습니다."), ctx);
        taobaoProducts = taobaoProducts.slice(0, freeUserProductLimit - productCount);
    }
    if (userInfo?.maxProductLimit) {
        const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
        if (productCount >= userInfo.maxProductLimit) return throwError(errors.etc("이용 가능한 최대 상품 수집량을 초과하였습니다."), ctx);
        taobaoProducts = taobaoProducts.slice(0, userInfo.maxProductLimit - productCount);
        await ctx.prisma.userInfo.update({ where: { userId: userInfo.userId }, data: { productCollectCount: { increment: taobaoProducts.length } } });
    }

    // if (TRANSLATE_ITEM_SERVER !== "") {
    const taobaoProductTranslateRequest = await ctx.prisma.taobaoProductTranslateRequest.create({
        data: { taobaoIidArray: JSON.stringify(taobaoProducts.map(v => v!.taobaoNumIid)), adminId: ctx.token!.adminId, userId: ctx.token!.userId, categoryCode: option.categoryCode, siilCode: option.siilCode }
    })
    const jsonData = {
        requestId: taobaoProductTranslateRequest.id,
        callbackUrl: `${EXTERNAL_ADDRESS}/callback/translate`,
        data: taobaoProducts.map(v => getTranslateData(v!.itemData))
    };
    try {
        const requestResult = await fetch(TRANSLATE_ITEM_SERVER, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        }).then(async (res) => ({ code: res.status, data: await res.text() }))
        console.log("translateRequest:", requestResult)
        if (requestResult.code !== 200) throw new Error(requestResult.data);
        return;
    }
    catch (e) {
        console.log("번역 요청 실패 추정 : ", e);
        await ctx.prisma.taobaoProductTranslateRequest.delete({ where: { id: taobaoProductTranslateRequest.id } });
        if (userInfo) {
            await ctx.prisma.userInfo.update({ where: { userId: userInfo.userId }, data: { productCollectCount: { decrement: taobaoProducts.length } } });
        }
        publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 ${taobaoProducts.length} 개 수집 요청에 실패하였습니다.` });
        return;
    }

    // }



    // const products = await saveTaobaoItemToUser(ctx.prisma, taobaoProducts, ctx.token!.userId ?? null, info, option.categoryCode, option.siilCode, ctx.token!.adminId);



    // const resultProducts = products.filter((v): v is Product => v !== null);
    // console.log(`상품 ${products.length} 개 중 ${resultProducts.length}개 추가완료 :${resultProducts.map(v => "SFY_" + v.id.toString(36))}`)
    // publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 ${products.length} 개 중 ${resultProducts.length}개 추가 완료되었습니다.\n상품 ID : ${resultProducts.map(v => "SFY_" + v.id.toString(36)).join(",")}` });
}



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

export const saveTaobaoItemToUser = async <T extends IFeeInfo>(prisma: PrismaClient, taobaoProducts: ((TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null }) | null)[], userId: number | null, userInfo: T, categoryCode?: string | null, siilCode?: string | null, adminId?: number) => {
    return await Promise.all(taobaoProducts.filter((v): v is TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null } => v !== null).map(async v => {
        const taobaoData = v.itemData;
        const translateData = v.translateDataObject;
        // console.log(taobaoData);
        let product = await prisma.product.findUnique({ where: { UQ_user_id_taobao_product_id: { taobaoProductId: v.id, userId: userId ?? 0 } } })

        //productOptionName 분석
        const firstPropertyInfo = taobaoData.skus.sku.length === 0 ? undefined : taobaoData.skus.sku[0]?.properties_name?.match(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g)
        if ((firstPropertyInfo?.length ?? 0) > 3) {
            console.log("수집실패 : 옵션 4개 이상")
            return null;
        }
        const res = firstPropertyInfo?.map((v, i) => {
            const result = v.match(/([-\d]+):[-\d]+:(.+):.*;?/);
            if (result) {
                return { taobaoPid: result[1], name: result[2], order: i + 1 };
            }
            else throw new Error("파싱 중 문제 발생 " + JSON.stringify(taobaoData));
        });

        if (!product) {
            const description = (translateData?.description ?? taobaoData.desc).replace(/(?<!<p ?>)(<img [^>]*?>)(?!<p>)/g, "<p>$1</p>");
            let price = Math.round((Math.floor(parseFloat(taobaoData.price) * (100 + userInfo.marginRate) * userInfo.cnyRate / 100) + userInfo.defaultShippingFee) / 10) * 10;
            if (isNaN(price)) price = 0;
            product = await prisma.product.create({
                data: {
                    name: translateData?.title ?? taobaoData.title,
                    description,
                    price: Math.round((Math.floor(parseFloat(taobaoData.price) * (100 + userInfo.marginRate) * userInfo.cnyRate / 100) + userInfo.defaultShippingFee) / 10) * 10,
                    localShippingFee: 0,
                    userId,
                    adminId,
                    taobaoProductId: v.id,
                    categoryCode: categoryCode,
                    siilCode: siilCode,
                    imageThumbnailData: JSON.stringify(taobaoData.item_imgs.map(v => "http:" + v.url.replace(/^https?:/, ""))),
                    productCode: "",
                    marginRate: userInfo.marginRate,
                    cnyRate: userInfo.cnyRate,
                    shippingFee: userInfo.defaultShippingFee,
                },
            });
            await prisma.product.update({ where: { id: product.id }, data: { productCode: "SFY_" + product.id.toString(36) + "_" + v.itemData.num_iid } });
            if (res) { //옵션 있는 상품의 경우
                const productOptionNames = await Promise.all(res!.map(async v => {
                    const name = translateData?.optionName.find(v2 => v2.taobaoPid === v.taobaoPid)?.name ?? v.name;
                    const urlInfo = taobaoData.prop_imgs.prop_img.find(v2 => v2.properties.split(":")[0] === v.taobaoPid);
                    return await prisma.productOptionName.create({ data: { ...v, hasImage: !!urlInfo, productId: product!.id, name } })
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
                    const productOptionName = productOptionNames.find(v => v.taobaoPid === a[1])!;
                    const urlInfo = taobaoData.prop_imgs.prop_img.find(v => v.properties === key);
                    const name = translateData?.optionValue.find(v2 => v2.taobaoPid === a[1] && v2.taobaoVid === a[2])?.name ?? b[2];
                    let image = urlInfo ? /^http:\/\//.test(urlInfo.url) ? urlInfo.url : ("http://" + urlInfo.url) : null;
                    image = image !== null ? image.replace(/http:\/\/\/\//, "http://") : image;
                    return await prisma.productOptionValue.create({
                        data: {
                            name,
                            image,
                            optionNameOrder: productOptionName.order,
                            taobaoVid: a[2],
                            productOptionNameId: productOptionName.id,
                            number: i - propsLengthInfo.find(v => v.l === a[1])!.c + 1,
                        }
                    })
                }));

                await Promise.all(taobaoData.skus.sku.map(async sku => {
                    const match = sku.properties.match(/^([-\d]+):([-\d]+);?([-\d]+)?:?([-\d]+)?;?([-\d]+)?:?([-\d]+)?/)!;
                    // console.log({
                    //     optionValue1Id: productOptionValues.find(v => v.optionNameOrder === 1 && v.taobaoVid === match[2])!.id,
                    //     optionValue2Id: productOptionValues.find(v => v.optionNameOrder === 2 && v.taobaoVid === match[4])?.id,
                    //     optionValue3Id: productOptionValues.find(v => v.optionNameOrder === 3 && v.taobaoVid === match[6])?.id,
                    // })
                    const optionString = [
                        productOptionValues.find(v => v.optionNameOrder === 1 && v.taobaoVid === match[2])!.number,
                        productOptionValues.find(v => v.optionNameOrder === 2 && v.taobaoVid === match[4])?.number,
                        productOptionValues.find(v => v.optionNameOrder === 3 && v.taobaoVid === match[6])?.number,
                    ].filter((v): v is number => typeof v === 'number').map(v => ("00" + v).slice(-2)).join('_');
                    return await prisma.productOption.create({
                        data: {
                            productId: product!.id,
                            optionValue1Id: productOptionValues.find(v => v.optionNameOrder === 1 && v.taobaoVid === match[2])!.id,
                            optionValue2Id: productOptionValues.find(v => v.optionNameOrder === 2 && v.taobaoVid === match[4])?.id,
                            optionValue3Id: productOptionValues.find(v => v.optionNameOrder === 3 && v.taobaoVid === match[6])?.id,
                            taobaoSkuId: sku.sku_id,
                            priceCny: parseFloat(sku.price),
                            price: Math.round((Math.floor(parseFloat(sku.price) * (100 + userInfo.marginRate) * userInfo.cnyRate / 100) + userInfo.defaultShippingFee) / 10) * 10,
                            stock: parseInt(sku.quantity ?? "0"),
                            optionString
                        }
                    })
                }))
            }
        }
        else { //상품은 당겼는데 이미 있는 상품인 경우 -> 처리해줘야하나?
            // product = await prisma.product.update({
            //     where: { UQ_user_id_taobao_product_id: { taobaoProductId: v.id, userId } },
            //     data: {
            //         price: Math.floor(parseFloat(taobaoData.price) * (100 + userInfo.marginRate) * userInfo.cnyRate / 100),
            //         localShippingFee: 0,
            //     },
            //     include: { productOptionName: { include: { productOptionValue: true } }, productOption: true }
            // });
            // if (res) { //옵션 있는 상품의 경우
            //     const productOptionNames = await Promise.all(res!.map(async v => {
            //         return await prisma.productOptionName.create({ data: { ...v, productId: product!.id } })
            //     }));
            //     //productOptionValue 분석
            //     const productOptionValues = await Promise.all(Object.entries(taobaoData.props_list).map(async ([key, value]) => { // 직렬처리 필요?
            //         const a = key.match(/([-\d]+):([-\d]+)/)!;
            //         const b = key.match(/^(\d+):(\d+)$/)!;
            //         // 차례대로 1:2 : 3:4 라고 하면
            //         // a[1]:1, a[2] : 2, b[1] : 3, b[2] : 4
            //         const productOptionName = productOptionNames.find(v => v.taobaoPid === a[1])!;
            //         return await prisma.productOptionValue.create({
            //             data: {
            //                 name: b[2],
            //                 image: "http:" + taobaoData.prop_imgs.prop_img.find(v => v.properties === key)!.url,
            //                 optionNameOrder: productOptionName.order,
            //                 taobaoVid: a[2],
            //                 productOptionNameId: productOptionName.id
            //             }
            //         })
            //     }));

            //     await Promise.all(taobaoData.skus.sku.map(async sku => {
            //         return await prisma.productOption.create({
            //             data: {
            //                 productId: product!.id,
            //                 optionValue1Id: productOptionValues.find(v => v.optionNameOrder === 1)!.id,
            //                 optionValue2Id: productOptionValues.find(v => v.optionNameOrder === 2)?.id,
            //                 optionValue3Id: productOptionValues.find(v => v.optionNameOrder === 3)?.id,
            //                 taobaoSkuId: sku.sku_id,
            //                 priceCny: parseFloat(sku.price),
            //                 price: Math.floor(parseFloat(sku.price) * (100 + userInfo.marginRate) * userInfo.cnyRate / 100),
            //                 stock: parseInt(sku.quantity ?? "0"),
            //             }
            //         })
            //     }))
            // }
        }
        return product;
    }))
}