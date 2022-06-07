import { extendType, intArg, list, nonNull, stringArg } from "nexus";
import { errors, throwError } from "../utils/error";
// import { copyProductsToUser } from "..";
import { shopDataUrlInfo } from "../../playauto_api_type";
import fetch from "node-fetch";

const endpoint_kooza = "http://www.sellforyou.co.kr:3001/api/" //todo

export const mutation_product_store_store = extendType({
    type: "Mutation",
    definition(t) {
        t.field("updateProductStoreUrlInfoBySomeone", {
            type: nonNull("String"),
            args: {
                productStoreId: nonNull(intArg()),
                etcVendorItemId: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const productStore = await ctx.prisma.productStore.findUnique({ where: { id: args.productStoreId }, select: { store_product_id: true, user_id: true, site_code: true } });
                    const userInfo = await ctx.prisma.userInfo.findUnique({ where: { user_id: ctx.token?.adminId ? productStore?.user_id : ctx.token!.userId! } });
                    if (!productStore) return throwError(errors.etc("해당 판매상품이 없습니다."), ctx);
                    if (ctx.token?.userId) {
                        if (productStore.user_id !== ctx.token.userId) return throwError(errors.forbidden, ctx);
                    }
                    
                    if (!userInfo) return throwError(errors.etc("회원정보를 찾을 수 없습니다."), ctx);

                    const refresh_body = {
                        "accesskey": userInfo.coupang_access_key,
                        "secretkey": userInfo.coupang_secret_key,
                
                        "path": "/v2/providers/seller_api/apis/api/v1/marketplace/seller-products/" + args.etcVendorItemId,
                        "query": "",
                        "method": "GET",
                
                        "data": {}
                    }
                
                    var refresh_resp = await fetch(endpoint_kooza + "coupang", {
                        method: "POST",
                        headers: {
                        'Content-Type': 'application/json; charset=UTF-8'
                        },
                        body: JSON.stringify(refresh_body)
                    });
                
                    var refresh_json = await refresh_resp.json();
                
                    if (refresh_json.code === "SUCCESS") {
                        if (refresh_json.data.productId) {
                            const id = refresh_json.data.productId.toString();

                            await ctx.prisma.productStore.update({
                                where: { id: args.productStoreId },
                                data: {
                                    store_product_id: id,
                                    store_url: id ? shopDataUrlInfo[productStore.site_code]({ id, storeFullPath: userInfo.naver_store_url }) : undefined,
                                }
                            });

                            return id + "(OK)";
                        } else {
                            if (refresh_json.data.statusName === '승인반려') {
                                await ctx.prisma.productStoreLog.deleteMany({
                                    where: { product_store_id: args.productStoreId }
                                });

                                await ctx.prisma.productStore.delete({
                                    where: { id: args.productStoreId }
                                });
                            }

                            return refresh_json.data.statusName;
                        }
                    } else {
                        return "승인 중";
                    }
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});
