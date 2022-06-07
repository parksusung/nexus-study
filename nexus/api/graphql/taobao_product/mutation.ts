import { Prisma, Product, TaobaoProduct } from "@prisma/client";
import { add, isAfter, isBefore, sub } from "date-fns";
import { arg, extendType, floatArg, intArg, list, nonNull, stringArg } from "nexus";
import fetch from "node-fetch";
import { siilInfo } from "../sill";
import { IOBItem, IOBItemGetParam, IOBItemGetResponse, IOBItemSearchParam, IOBItemSearchResponse } from "../../onebound_api_types";
import { errors, throwError } from "../utils/error";
import { getFromS3, uploadToS3ByBuffer } from "../utils/file_manage";
import { wait } from "../utils/helpers";
import { getItemAndSave, getOBFetchUrl, IFeeInfo, publicParam, saveTaobaoItemToUser } from "../utils/local/onebound";
import Excel from "exceljs";
import { FileUpload } from "graphql-upload";
import { Context } from "../../types";
import { GraphQLResolveInfo } from "graphql";
import * as util from 'util'
import { ITranslateData } from "../../graphql/utils/translate_types";
import { publishUserLogData } from "../utils/local/pubsub";
// import { EXTERNAL_ADDRESS } from "../utils/constants";

interface IGetTaobaoItemUsingExcelFileArgs {
    categoryCode?: string | null;
    data: FileUpload;
    siilCode?: string | null;
}
interface IGetTaobaoItemUsingNumIidsArgs {
    categoryCode?: string | null;
    siilCode?: string | null;
    taobaoIds: string[];
}
interface IGetTaobaoItemsArgs {
    categoryCode?: string | null;
    endPrice?: number | null;
    orderBy: "_credit" | "_sale";
    page: number | null;
    pageCount: number | null;
    query: string;
    siilCode?: string | null;
    startPrice?: number | null;
}

const getTaobaoItemUsingExcelFileResolver = (isAdmin: boolean) => async (src: {}, args: IGetTaobaoItemUsingExcelFileArgs, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        if (args.siilCode) {
            if (siilInfo.findIndex(v => v.infoCode === args.siilCode) === -1) return throwError(errors.etc("잘못된 상품고시정보입니다."), ctx);
        }
        if (args.categoryCode) {
            // const splitedCode = args.categoryCode.split("_");
            // if (splitedCode.length !== 4 || splitedCode.some(v => v.length !== 2)) return throwError(errors.etc("잘못된 코드입니다."), ctx);
            const category = await ctx.prisma.category.findUnique({ where: { code: args.categoryCode } });
            if (!category) return throwError(errors.etc("잘못된 카테고리입니다."), ctx);
        }

        const file = await args.data;
        if (!file.mimetype.includes("spreadsheet")) return throwError(errors.etc("엑셀 형식의 파일이 아닙니다."), ctx);
        const workbook = new Excel.Workbook();
        await workbook.xlsx.read(file.createReadStream());
        const dailyMissionSheet = workbook.worksheets[0];
        const data: string[] = [];
        try {
            dailyMissionSheet.eachRow((r, i) => {
                if (i === 1) return;
                let cell = r.getCell(1);
                data.push(cell.text);
            });
        }
        catch (e) {
            throw e;
        }

        let taobaoIids = data.reduce((p, c) => {
            if (/^\d+$/.test(c)) {
                return [...p, c];
            }
            else if (/[?&]id=([0-9]+)/.test(c)) {
                return [...p, c.match(/[?&]id=([0-9]+)/)![1]];
            }
            return p;
        }, [] as string[])

        const ctx2 = ctx;
        let isRestricted = false;
        if (!ctx.token?.adminId && (!ctx.token?.level || ctx.token.level.level === 0)) {
            let result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_DAY_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserDayLimit = parseInt(result.value);
            // const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { createdAt: true } })
            const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { created_at: true, user_info: { select: { product_collect_count: true } } } })
            if (isAfter(new Date(), add(user!.created_at, { days: freeUserDayLimit }))) return throwError(errors.etc("무료체험기간이 지났습니다."), ctx);


            result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserProductLimit = parseInt(result.value);

            // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
            const productCount = user!.user_info!.product_collect_count;
            if (productCount >= freeUserProductLimit) return throwError(errors.etc("무료 이용량을 초과하였습니다."), ctx);
            taobaoIids = taobaoIids.slice(0, freeUserProductLimit - productCount);
            isRestricted = true;
        }
        if (ctx.token?.userId) {
            // const userInfo = await ctx.prisma.userInfo.findUnique({ where: { userId: ctx.token.userId }, select: { maxProductLimit: true } });
            const userInfo = await ctx.prisma.userInfo.findUnique({ where: { user_id: ctx.token.userId }, select: { product_collect_count: true, max_product_limit: true } });
            if (!userInfo) return throwError(errors.noSuchData, ctx);
            if (userInfo.max_product_limit) {
                // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
                const productCount = userInfo.product_collect_count;
                if (productCount >= userInfo.max_product_limit) return throwError(errors.etc("이용 가능한 최대 상품 수집량을 초과하였습니다."), ctx);
                taobaoIids = taobaoIids.slice(0, userInfo.max_product_limit - productCount);
            }
        }
        getItemAndSave(ctx2, taobaoIids, { categoryCode: args.categoryCode ?? undefined, siilCode: args.siilCode ?? undefined, isRestricted, isAdmin }).then(() => { console.log("getTaobaoItemUsingNumIidsByUser done.") });

        // 리턴
        return taobaoIids.length;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const getTaobaoItemUsingNumIidsResolver = (isAdmin: boolean) => async (src: {}, args: IGetTaobaoItemUsingNumIidsArgs, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        let taobaoIids = args.taobaoIds.reduce((p, c) => {
            if (/^\d+$/.test(c)) {
                return [...p, c];
            }
            else if (/[?&]id=([0-9]+)/.test(c)) {
                return [...p, c.match(/[?&]id=([0-9]+)/)![1]];
            }
            return p;
        }, [] as string[])
        if (args.siilCode) {
            if (siilInfo.findIndex(v => v.infoCode === args.siilCode) === -1) return throwError(errors.etc("잘못된 상품고시정보입니다."), ctx);
        }
        if (args.categoryCode) {
            // const splitedCode = args.categoryCode.split("_");
            // if (splitedCode.length !== 4 || splitedCode.some(v => v.length !== 2)) return throwError(errors.etc("잘못된 코드입니다."), ctx);
            const category = await ctx.prisma.category.findUnique({ where: { code: args.categoryCode } });
            if (!category) return throwError(errors.etc("잘못된 카테고리입니다."), ctx);
        }

        const ctx2 = ctx;
        let isRestricted = false;
        if (!ctx.token?.adminId && (!ctx.token?.level || ctx.token.level.level === 0)) {
            let result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_DAY_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserDayLimit = parseInt(result.value);
            // const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { createdAt: true } })
            const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { created_at: true, user_info: { select: { product_collect_count: true } } } })
            if (isAfter(new Date(), add(user!.created_at, { days: freeUserDayLimit }))) return throwError(errors.etc("무료체험기간이 지났습니다."), ctx);


            result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserProductLimit = parseInt(result.value);

            // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
            const productCount = user!.user_info!.product_collect_count;
            if (productCount >= freeUserProductLimit) return throwError(errors.etc("무료 이용량을 초과하였습니다."), ctx);
            taobaoIids = taobaoIids.slice(0, freeUserProductLimit - productCount);
            isRestricted = true;
        }
        if (ctx.token?.userId) {
            // const userInfo = await ctx.prisma.userInfo.findUnique({ where: { userId: ctx.token.userId }, select: { maxProductLimit: true } });
            const userInfo = await ctx.prisma.userInfo.findUnique({ where: { user_id: ctx.token.userId }, select: { product_collect_count: true, max_product_limit: true } });
            if (!userInfo) return throwError(errors.noSuchData, ctx);
            if (userInfo.max_product_limit) {
                // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
                const productCount = userInfo.product_collect_count;
                if (productCount >= userInfo.max_product_limit) return throwError(errors.etc("이용 가능한 최대 상품 수집량을 초과하였습니다."), ctx);
                taobaoIids = taobaoIids.slice(0, userInfo.max_product_limit - productCount);
            }
        }
        getItemAndSave(ctx2, taobaoIids, { categoryCode: args.categoryCode ?? undefined, siilCode: args.siilCode ?? undefined, isRestricted, isAdmin }).then(() => { console.log("getTaobaoItemUsingNumIidsByUser done.") });

        // 리턴
        return taobaoIids.length;
    } catch (e) {
        return throwError(e, ctx);
    }
}

const getTaobaoItemsResolver = (isAdmin: boolean) => async (src: {}, args: IGetTaobaoItemsArgs, ctx: Context, info: GraphQLResolveInfo) => {
    try {
        // 타오바오 상품 가져오기
        let taobaoIids: string[] = [];
        args.page = args.page ?? 1;
        args.pageCount = args.pageCount ?? 1;
        if (args.page < 1) return throwError(errors.etc("page는 1 이상입니다."), ctx);
        if (args.pageCount < 1) return throwError(errors.etc("pageCount는 1 이상입니다."), ctx);
        if (args.siilCode) {
            if (siilInfo.findIndex(v => v.infoCode === args.siilCode) === -1) return throwError(errors.etc("잘못된 상품고시정보입니다."), ctx);
        }
        if (args.categoryCode) {
            // const splitedCode = args.categoryCode.split("_");
            // if (splitedCode.length !== 4 || splitedCode.some(v => v.length !== 2)) return throwError(errors.etc("잘못된 코드입니다."), ctx);
            const category = await ctx.prisma.category.findUnique({ where: { code: args.categoryCode } });
            if (!category) return throwError(errors.etc("잘못된 카테고리입니다."), ctx);
        }

        for (let i = args.page; i < args.page + args.pageCount; ++i) {
            let params: IOBItemSearchParam = { ...publicParam, q: args.query, sort: args.orderBy, page: i, start_price: args.startPrice?.toString() ?? undefined, end_price: args.endPrice?.toString() ?? undefined };
            if (params.start_price === '0') params.start_price = undefined;
            if (params.end_price === '0') params.end_price = undefined;
            const taobaoItemSearchResult = await fetch(getOBFetchUrl<IOBItemSearchParam>("item_search", params)).then(res => res.json()) as IOBItemSearchResponse;
            if (taobaoItemSearchResult.error !== "") {
                const errorInfo = (({ error, error_code, reason, request_id }) => ({ error, error_code, reason, request_id, time: new Date().toLocaleString() }))(taobaoItemSearchResult);
                console.log("item_search 에러", errorInfo);
                if (errorInfo.error_code === '4008') {
                    await wait(200);
                    i -= 1;
                }
                else if (errorInfo.error_code === '5000') { //
                    if (taobaoIids.length === 0) return throwError(errors.etc("가져온 상품이 없습니다. 페이지를 확인하세요."), ctx);
                    break;
                }
                else {
                    return throwError(errors.oneboundAPIError(JSON.stringify(errorInfo)), ctx);
                }
            } else {
                try {
                    taobaoIids = taobaoIids.concat(taobaoItemSearchResult.items.item.map(v => v.num_iid.toString()));
                }
                catch (e) {
                    console.log(e, taobaoItemSearchResult)
                }
                await wait(200);
            }
        }

        const ctx2 = ctx;

        let isRestricted = false;
        if (!ctx.token?.adminId && (!ctx.token?.level || ctx.token.level.level === 0)) {
            let result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_DAY_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserDayLimit = parseInt(result.value);
            // const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { createdAt: true } })
            const user = await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! }, select: { created_at: true, user_info: { select: { product_collect_count: true } } } })
            if (isAfter(new Date(), add(user!.created_at, { days: freeUserDayLimit }))) return throwError(errors.etc("무료체험기간이 지났습니다."), ctx);


            result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
            if (!result) return throwError(errors.notInitialized, ctx);
            const freeUserProductLimit = parseInt(result.value);

            // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
            const productCount = user!.user_info!.product_collect_count;
            if (productCount >= freeUserProductLimit) return throwError(errors.etc("무료 이용량을 초과하였습니다."), ctx);

            taobaoIids = taobaoIids.slice(0, freeUserProductLimit - productCount);
            isRestricted = true;
        }
        if (ctx.token?.userId) {
            // const userInfo = await ctx.prisma.userInfo.findUnique({ where: { userId: ctx.token.userId }, select: { maxProductLimit: true } });
            const userInfo = await ctx.prisma.userInfo.findUnique({ where: { user_id: ctx.token.userId }, select: { product_collect_count: true, max_product_limit: true } });
            if (!userInfo) return throwError(errors.noSuchData, ctx);
            if (userInfo.max_product_limit) {
                // const productCount = await ctx.prisma.product.count({ where: { userId: ctx.token!.userId! } });
                const productCount = userInfo.product_collect_count;
                if (productCount >= userInfo.max_product_limit) return throwError(errors.etc("이용 가능한 최대 상품 수집량을 초과하였습니다."), ctx);
                taobaoIids = taobaoIids.slice(0, userInfo.max_product_limit - productCount);
            }
        }

        getItemAndSave(ctx2, Array.from(new Set([...taobaoIids])), { categoryCode: args.categoryCode ?? undefined, siilCode: args.siilCode ?? undefined, isRestricted, isAdmin }).then(() => { console.log("getTaobaoItemsByUser done.") });

        // 리턴
        return true;
    } catch (e) {
        return throwError(e, ctx);
    }
}

export const mutation_taobao_product = extendType({
    type: "Mutation",
    definition(t) {
        t.field("getTaobaoItemsByUser", {
            type: nonNull("Boolean"),
            description: "키워드 검색으로 상품 가져오기",
            args: {
                query: nonNull(stringArg()),
                orderBy: nonNull(arg({ type: "TaobaoItemOrderBy" })),
                startPrice: floatArg(),
                endPrice: floatArg(),
                page: intArg({ default: 1 }),
                pageCount: intArg({ default: 1 }),
                categoryCode: stringArg(),
                siilCode: stringArg(),
            },
            resolve: getTaobaoItemsResolver(false)
        });
        t.field("getTaobaoItemUsingNumIidsByUser", {
            type: nonNull("Int"),
            description: "상품 ID/URL로 상품 가져오기",
            args: {
                taobaoIds: nonNull(list(nonNull(stringArg()))),
                categoryCode: stringArg(),
                siilCode: stringArg(),
            },
            resolve: getTaobaoItemUsingNumIidsResolver(false)
        });
        t.field("getTaobaoItemUsingExcelFileByUser", {
            type: nonNull("Int"),
            description: "상품 ID/URL로 상품 가져오기",
            args: {
                data: nonNull("Upload"),
                categoryCode: stringArg(),
                siilCode: stringArg(),
            },
            resolve: getTaobaoItemUsingExcelFileResolver(false)
        });
        t.field("getTaobaoItemsByAdmin", {
            type: nonNull("Boolean"),
            description: "키워드 검색으로 상품 가져오기",
            args: {
                query: nonNull(stringArg()),
                orderBy: nonNull(arg({ type: "TaobaoItemOrderBy" })),
                startPrice: floatArg(),
                endPrice: floatArg(),
                page: intArg({ default: 1 }),
                pageCount: intArg({ default: 1 }),
                categoryCode: stringArg(),
                siilCode: stringArg(),
                userId: intArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const { userId, ...etcArgs } = args;
                    if (userId) {
                        const user = await ctx.prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
                        if (!user) return throwError(errors.noSuchData, ctx);
                        ctx.token!.userId = userId;
                    }
                    return getTaobaoItemsResolver(true)(src, etcArgs, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("getTaobaoItemUsingNumIidsByAdmin", {
            type: nonNull("Int"),
            description: "상품 ID/URL로 상품 가져오기",
            args: {
                taobaoIds: nonNull(list(nonNull(stringArg()))),
                categoryCode: stringArg(),
                siilCode: stringArg(),
                userId: intArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const { userId, ...etcArgs } = args;
                    if (userId) {
                        const user = await ctx.prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
                        if (!user) return throwError(errors.noSuchData, ctx);
                        ctx.token!.userId = userId;
                    }
                    return getTaobaoItemUsingNumIidsResolver(true)(src, etcArgs, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("getTaobaoItemUsingExcelFileByAdmin", {
            type: nonNull("Int"),
            description: "상품 ID/URL로 상품 가져오기",
            args: {
                data: nonNull("Upload"),
                categoryCode: stringArg(),
                siilCode: stringArg(),
                userId: intArg(),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const { userId, ...etcArgs } = args;
                    if (userId) {
                        const user = await ctx.prisma.user.findUnique({ where: { id: userId }, select: { id: true } })
                        if (!user) return throwError(errors.noSuchData, ctx);
                        ctx.token!.userId = userId;
                    }
                    return getTaobaoItemUsingExcelFileResolver(true)(src, etcArgs, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        t.field("getTaobaoItemUsingExtensionByUser", {
            type: nonNull("String"),
            args: {
                data: nonNull("String"),
            },
            resolve: async (src, args, ctx, info) => {
                //todo수성
                try {
                    const data = JSON.parse(args.data) as { onebound: { item: IOBItem }, sellforyou: { data: ITranslateData[] } };//JSON.parse는 JSON문자열 구문 분석해서 객체를 생성해냄 
                    //console.log("test1",data);
                    if (data.onebound?.item && (data.sellforyou?.data?.length > 0)) {
                        const translatedData = data.sellforyou.data[0];//번역한 데이터
                        const taobaoData = data.onebound.item;// 원본데이터 
                        // console.log("test2 - translatedData",translatedData);
                        // console.log("test3 - taobaoData",taobaoData)
                        if (translatedData.taobaoNumIid !== taobaoData.num_iid) {
                            return throwError(errors.etc("원문/번역데이터 고유값이 다릅니다."), ctx);
                        }

                        // 가져온 상품 id 쿼리하기
                        const refreshDay = await ctx.prisma.setting.findUnique({ where: { name: "TAOBAO_PRODUCT_REFRESH_DAY" } });
                        console.log("refreshDay",refreshDay);
                        if (!refreshDay) {
                            return throwError(errors.notInitialized, ctx);
                        }

                        let taobaoProducts: ((TaobaoProduct & { itemData: IOBItem, translateDataObject: ITranslateData | null }) | null)[] = [];

                        const num_iid = taobaoData.num_iid;
                        const item = taobaoData;//객체
                        const originalData = JSON.stringify(item);//객체를 string으로 변환했고 다시 
                        // console.log("originalData",originalData); //원본 데이터 
                        let price = parseFloat(item.price);//json의 item.price를 소수점인 float type으로 변환. 이유 object에 value는 현재 다 string value이므로 
                        //console.log("price = ",price);
                        if (isNaN(price)) price = 0;

                        var uniqueId = null;

                        // 현재 본인이 가진 상품 중 중복상품이 있는지 검사
                        const checkUserId = await ctx.prisma.product.findMany({
                            where: { user_id: ctx.token?.userId ?? null, taobao_product: { taobao_num_iid: num_iid } },
                            select: { id: true, category_code: true, user_id: true, product_code: true, product_store: true, product_option_name: { select: { id: true } }, state: true, taobao_product_id: true, taobao_product: { select: { taobao_num_iid: true, original_data: true } } }
                        });//쿼리문에서 select column 명 말하는것과 같은거같음 추가적으로 fk에 해당하는 모델들의 컬럼도 저렇게들고와지네 조건도 마찬가지로
                        console.log("test",ctx.token);
                        console.log("checkUserId",checkUserId);
                        if (checkUserId.length > 0) {
                            for (var i in checkUserId) {
                                var temp = JSON.parse(checkUserId[i].taobao_product.original_data);
                                
                                if (item.shop_id === temp.shop_id) {
                                    if (
                                        item.title !== temp.title ||
                                        item.price !== temp.price ||
                                        JSON.stringify(item.skus) !== JSON.stringify(temp.skus) ||
                                        JSON.stringify(item.props_list) !== JSON.stringify(temp.props_list)
                                    ) {
                                        uniqueId = checkUserId[i];
                                    }

                                    if (ctx.token?.userId) {
                                        publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품이 이미 최신 상태로 등록되어 있습니다. (${checkUserId[i].product_code})` });
                                    }

                                    return `상품이 이미 최신 상태로 등록되어 있습니다. (${checkUserId[i].product_code})`;
                                }
                            }
                        }
                        //console.log("dsadsad",item.video);
                        try {
                            let updatedProduct = await ctx.prisma.taobaoProduct.create({
                                data: {
                                    id: undefined,//index는 undefined로 입력을 하구나. .
                                    taobao_num_iid: num_iid,
                                    brand: item.brand ?? "",
                                    image_thumbnail: "http:" + item.pic_url.replace(/^https?:/, ""),
                                    original_data:originalData,
                                    price,
                                    taobao_brand_id: item.brandId?.toString() ?? null,
                                    taobao_category_id: item.rootCatId,
                                    name: item.title,
                                    video_url: item.video === "" || null ? null : item.video // 이부분 배열때문에 이슈가있엇음 
                                }
                            });
                            if(!updatedProduct) return throwError(errors.etc("updatedProduct"),ctx);
                            //console.log("updatedProduct = ",updatedProduct);
                            taobaoProducts.push({ ...updatedProduct, itemData: item, translateDataObject: translatedData });

                        }
                        catch (e) {
                            console.log("taobaoProduct Upsert Error : ", e);
                        }

                        const option = { isRestricted: false, isAdmin: !!ctx.token!.adminId };//isResricted:false 와 isAdmin : boolean 초기값생성 
                        //console.log("option = ",option);
                        if (!ctx.token?.adminId && (!ctx.token?.level || ctx.token.level.level < 2)) {
                            option.isRestricted = true;
                        }
                        //console.log("level",ctx.token?.level?.level);
                        console.log("option LEVEL = ",option);

                        // 마진율 붙여서 본인 상품 만들기
                        const cnyRateSetting = await ctx.prisma.setting.findUnique({ where: { name: "CNY_RATE" } });

                        if (!cnyRateSetting) {
                            return throwError(errors.notInitialized, ctx);
                        }
                        
                        const cnyRate = parseFloat(cnyRateSetting.value);
                        const userInfo = await ctx.prisma.userInfo.findUnique({ where: { user_id: ctx.token!.userId ?? 0 } });
                        //console.log("cnyRate = ",cnyRate);
                        //console.log("userInfo = ",userInfo);
                        let info: IFeeInfo = {
                            marginRate: 0,
                            marginUnitType: "PERCENT",
                            cnyRate,
                            defaultShippingFee: 0,
                            extraShippingFee: 0
                        };

                        if (userInfo) {
                            const productCount = await ctx.prisma.product.count({ where: { user_id: ctx.token!.userId! } });
                            //console.log("productCount = ",productCount);
                            info.marginRate = userInfo.margin_rate;
                            info.marginUnitType = userInfo.margin_unit_type ?? "PERCENT";
                            info.cnyRate = userInfo.cny_rate;
                            info.defaultShippingFee = userInfo.default_shipping_fee;
                            info.extraShippingFee = userInfo.extra_shipping_fee;
                            //console.log("info = ",info);

                            if (!option.isAdmin && option.isRestricted) {//user중에 level이 낮아서 이용하지 못한경우 무료유저는 100개까지 제한 
                                const result = await ctx.prisma.setting.findUnique({ where: { name: "FREE_USER_PRODUCT_LIMIT" } });
                                
                                if (!result) {
                                    return throwError(errors.notInitialized, ctx);
                                }

                                const freeUserProductLimit = parseInt(result.value);

                                if (userInfo.product_collect_count >= freeUserProductLimit) {
                                    if (ctx.token?.userId) {
                                        publishUserLogData(ctx, { type: "getTaobaoItem", title: `이용 가능한 상품 수집 횟수를 초과하였습니다.` });
                                    }

                                    return throwError(errors.etc("이용 가능한 상품 수집 횟수를 초과하였습니다."), ctx);
                                }
                                taobaoProducts = taobaoProducts.slice(0, freeUserProductLimit - productCount);
                            }

                            if (userInfo.max_product_limit) {//null이 아니면 무제한이면 null을 넣어줌 
                                if (productCount >= userInfo.max_product_limit) {
                                    if (ctx.token?.userId) {
                                        publishUserLogData(ctx, { type: "getTaobaoItem", title: `이용 가능한 상품 관리 개수를 초과하였습니다.` });
                                    }

                                    return throwError(errors.etc("이용 가능한 상품 관리 개수를 초과하였습니다."), ctx);
                                }
                                taobaoProducts = taobaoProducts.slice(0, userInfo.max_product_limit - productCount);
                                
                            }

                            // 만약 수집완료시 product 수집 갯수 증가 
                            await ctx.prisma.userInfo.update({ where: { user_id: userInfo.user_id }, data: { product_collect_count: { increment: taobaoProducts.length } } });
                        }

                        let category = null;

                        if (item.cid !== "") {
                            category = item.cid;
                        }

                        const userId = ctx.token?.userId ?? null
                        //return type IFeeInfo ,/ args type : prisma , productCode, taobaoProduct(IOBItem,ITranslateData)[],userid,userInfo,categorycode,sillcode,admin 
                        const products = await saveTaobaoItemToUser(ctx.prisma, undefined, taobaoProducts, userId, info, category, null, ctx.token?.adminId ?? undefined);
                        const resultProducts = products.filter((v): v is Product => v !== null);

                        if (userId) {
                            publishUserLogData(ctx, { type: "getTaobaoItem", title: `상품 수집이 완료되었습니다. (${resultProducts.map(v => v.product_code).join(",")})` });
                        }

                        return `상품 수집이 완료되었습니다. (${resultProducts.map(v => v.product_code).join(",")})`
                    }
                    
                    return throwError(errors.etc("데이터 형식이 올바르지 않습니다."), ctx);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});
