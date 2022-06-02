import { Request, Response } from "express"
import { join } from 'path'
import * as fs from 'fs';
import { uploadToS3AvoidDuplicateByBuffer, uploadToS3ByBuffer } from "../graphql/utils/file_manage";
import { IPAJobCallbackDoneResponse, IPAJobCallbackResponse, IPAJobCallbackRegistProdResultJson, IPAJobCallbackFailedResultJson, shopDataUrlInfo } from "../playauto_api_type";
import { Prisma, PrismaClient, ProductStoreLogUploadState } from "@prisma/client";
import { ProductStoreStateEnum } from "../graphql";
import { publishUserLogData } from "../graphql/utils/local/pubsub";
import { pubsub } from "../graphql/utils/helpers";

function isDoneResponse(response: IPAJobCallbackResponse<IPAJobCallbackRegistProdResultJson>): response is IPAJobCallbackDoneResponse<IPAJobCallbackRegistProdResultJson> {
    return (<IPAJobCallbackDoneResponse<IPAJobCallbackRegistProdResultJson>>response).results !== undefined;
}

function isFailedResponse(response: IPAJobCallbackRegistProdResultJson[] | IPAJobCallbackFailedResultJson): response is IPAJobCallbackFailedResultJson {
    return (<IPAJobCallbackFailedResultJson>response).Result !== undefined;
}
const numberToState: { [key: number]: ProductStoreLogUploadState } = {
    0: 'WAIT',
    1: "SUCCESS",
    2: "FAIL",
    3: "CANCEL",
    4: "ON_PROGRESS"
}

export const addJobCallbackHandler = async (req: Request, res: Response) => {
    try {
        // console.log("AddJob Callback : ", JSON.stringify({ params: req.params, body: req.body, query: req.query, headers: req.headers, files: req.files ? Object.values(req.files).map(v => ({ ...v, buffer: undefined })) : null }));
        const response: IPAJobCallbackResponse<IPAJobCallbackRegistProdResultJson> = req.body;
        // console.log(JSON.stringify(req.headers));
        // console.log(JSON.stringify(req.body));
        if (!response.job_id) {
            res.sendStatus(400);
            return;
        }
        if (isDoneResponse(response)) {
            const result = response.results["result.json"];
            const config = response.results["config.json"];
            if (isFailedResponse(result)) {
                console.log("addJobCallbackHandler : Internal Server Error", response)
                res.sendStatus(400);
                return;
            }
            result.map((v, i, a) => a[i].setdata = '_생략_')
            const prisma = new PrismaClient();
            try {
                const results = await Promise.all(result.map(async v => {
                    if (v.state !== 1) {
                        console.log("오류 발생", { result: v, config, jobId: response.job_id });
                    }
                    const name = v.code.split('_');
                    const productId = parseInt(name[1], 36);
                    const product = await prisma.product.findUnique({
                        where: { id: productId },
                        include: {
                            product_store: {
                                orderBy: [{ id: "desc" }],
                            },
                            user: { select: { user_info: { select: { naver_store_url: true } } } }
                        }
                    });
                    if (!product) {
                        console.log("addJob 정보 없음 : ", v);
                        return;
                    }
                    const productStore = product.product_store.find(v2 => v2.site_code === v.site_code);
                    if (!productStore) {
                        if (response.job_id === 'KOOZA') { //확장프로그램
                            if (v.state !== 1 && v.state !== 2) {
                                console.log("addJob 콜백 : state가 1,2가 아님");
                                return;
                            }
                            const productStoreState = v.state === 1 ? { connect: { id: ProductStoreStateEnum.ON_SELL } } : { connect: { id: ProductStoreStateEnum.REGISTER_FAILED } };
                            const etcVendorItemId = v.site_code === 'B378' ? v.slave_reg_code_sub : undefined;
                            const updatedResult = await prisma.productStore.create({
                                data: {
                                    store_product_id: v.slave_reg_code !== '' ? v.slave_reg_code : undefined,
                                    product_store_state:productStoreState,
                                    product_store_log: {
                                        create: {
                                            job_id: response.job_id,
                                            dest_state: ProductStoreStateEnum.ON_SELL,
                                            upload_state: numberToState[v.state],
                                            error_message: v.msg,
                                        }
                                    },
                                    product: { connect: { id: product.id } },
                                    etc_vendor_item_id : etcVendorItemId,
                                    store_url:  v.slave_reg_code !== '' ? shopDataUrlInfo[v.site_code]({ id: v.slave_reg_code, storeFullPath: product.user?.user_info?.naver_store_url, vendorId: etcVendorItemId }) : undefined,
                                    site_code: v.site_code,
                                    user: { connect: { id: product.user_id! } },
                                }
                            })
                            await prisma.product.update({
                                where: { id: updatedResult.product_id }, data: {
                                    state: v.state === 1 ? 'ON_SALE' : v.state === 2 ? 'UPLOAD_FAILED' : undefined,
                                }
                            })
                            return { userId: product.user_id, productId: product.id, reason: v.msg, state: v.state };
                        }
                        else {
                            console.log("addJob 정보 없음(인덱스 찾기 실패) : ", JSON.stringify({ result, product: require('util').inspect(product, undefined, 8) }));
                        }
                        return;
                    }
                    else {
                        const productStoreState = v.state === 1 ? { connect: { id: ProductStoreStateEnum.ON_SELL } } : { connect: { id: ProductStoreStateEnum.REGISTER_FAILED } };
                        const etcVendorItemId = v.site_code === 'B378' ? v.slave_reg_code_sub : undefined;
                        const updatedResult = await prisma.productStore.update({
                            where: { id: productStore.id },
                            data: {
                                store_product_id: v.slave_reg_code !== '' ? v.slave_reg_code : undefined,
                                product_store_state : productStoreState,
                                product_store_log: {
                                    create: {
                                        job_id: response.job_id,
                                        dest_state: ProductStoreStateEnum.ON_SELL,
                                        upload_state: numberToState[v.state],
                                        error_message: v.msg,
                                    }
                                },
                                product: { connect: { id: product.id } },
                                etc_vendor_item_id : etcVendorItemId,
                                store_url: v.slave_reg_code !== '' ? shopDataUrlInfo[v.site_code]({ id: v.slave_reg_code, storeFullPath: product.user?.user_info?.naver_store_url, vendorId: etcVendorItemId }) : undefined,
                                site_code: v.site_code,
                                user: { connect: { id: product.user_id! } },
                            }
                        })
                        await prisma.product.update({
                            where: { id: updatedResult.product_id }, data: {
                                state: v.state === 1 ? 'ON_SALE' : v.state === 2 ? 'UPLOAD_FAILED' : undefined,
                            }
                        })
                    }
                    return { userId: product.user_id, productId: product.id, reason: v.msg, state: v.state };
                }))
                const userId = results.find(v => v?.userId)?.userId;
                if (userId) {
                    const successfulMessage = results.filter(v => v && v?.state === 1).map(v => `등록되었습니다. (SFY_${v!.productId.toString(36)})`).join('\n')
                    const failedMessage = results.filter(v => v && v?.state !== 1).map(v => `등록되지 않았습니다. (SFY_${v!.productId.toString(36)}) 실패 사유: ${v!.reason}`).join('\n')
                    
                    await publishUserLogData({ prisma, pubsub, token: { userId } }, { type: "registerProduct", title: `상품이 오픈마켓에 \n${successfulMessage}\n${failedMessage}` });
                }
            }
            catch (e) {
                console.log('addJob Update Error');
                console.log(e);
                console.log({ result, config, jobId: response.job_id });
                res.sendStatus(500)

            }
            finally {
                prisma.$disconnect();
            }
        }
        else {
        }
        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        console.log(req.body);
        res.sendStatus(500)
    }
}