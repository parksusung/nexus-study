import { Request as Req, Response as Res } from "express"
import { join } from 'path'
import * as fs from 'fs';
import { generateUserToken, iamport, prisma, pubsub } from "../graphql/utils/helpers";
import { SortingEnum, StatusEnum } from "iamport-rest-client-nodejs/dist/enum";
import { Request } from "iamport-rest-client-nodejs";
import Payment from "iamport-rest-client-nodejs/dist/response/Payment";
import { add } from "date-fns";
import { PurchaseLogPlanInfoType } from "../graphql";
import { publishUserLogData } from "../graphql/utils/local/pubsub";

export const iamportCallbackHandler = async (req: Req, res: Res) => {
    try {
        if (!(req.headers["x-real-ip"] === "52.78.100.19") && !(req.headers["x-real-ip"] === "52.78.48.223")) {
            res.sendStatus(403);
        }
        const param = req.params['0']
        // console.log("iamportCallbackHandler : ", JSON.stringify({ params: req.params, body: req.body, query: req.query, headers: req.headers, files: req.files ? Object.values(req.files).map(v => ({ ...v, buffer: undefined })) : null }));
        const data: { imp_uid: string, merchant_uid: string, status: StatusEnum } = req.body;
        console.log(data);
        const log = await prisma.purchaseLog.findUnique({ where: { pay_id: data.merchant_uid } });
        //TODO: 타오바오 배송대행 주문 결제건에 대한 조회 추가
        if (log) {
            const payRequest = Request.Payments.getByMerchantUid({ merchant_uid: data.merchant_uid, sorting: SortingEnum.STARTED_DESC, status: StatusEnum.ALL });
            const result = await payRequest.request(iamport).then(result => result.data.response as Payment).catch((e) => { console.log(e); return null; })
            console.log("data", JSON.stringify(data));
            console.log("result", JSON.stringify(result));
            console.log("order", JSON.stringify(log));
            const purchaseInfo = JSON.parse(log.plan_info) as PurchaseLogPlanInfoType;
            if (result) {
                if (result.amount === log.pay_amount && result.status === data.status && result.imp_uid === data.imp_uid) { //정상결제 위조 점검
                    if (data.status === 'ready') { //가상계좌
                        const orderResult = await prisma.purchaseLog.update({
                            where: { pay_id: data.merchant_uid },
                            data: {
                                state: "WAIT_DEPOSIT",
                            },
                        });
                    }
                    else if (data.status === 'paid') { //가상계좌 입금, 카드, 계좌이체 등
                        const orderResult = await prisma.purchaseLog.update({
                            where: { pay_id: data.merchant_uid },
                            data: {
                                state: "ACTIVE",
                                purchased_at: new Date(),
                                expired_at: add(new Date(), { months: purchaseInfo.month }),
                            },
                        });
                        
                        const accessToken = await generateUserToken(prisma, orderResult.user_id);

                        publishUserLogData({ prisma, pubsub, token: { userId: orderResult.user_id } }, { type: "purchaseRenewed", title: '', renewedAccessToken: accessToken })
                    }
                    else if (data.status === 'cancelled') { //카드사에 의한 환불의 경우
                        console.log(`처리되지 않은 환불 상태 : ${result}`)
                        const updatedOrder = await prisma.purchaseLog.update({
                            where: { id: log.id },
                            data: {
                                state: "REFUNDED",
                                expired_at: new Date(),
                                pay_amount: 0,
                            }
                        });
                    }
                    else {
                        console.log(`처리되지 않은 상태 : ${JSON.stringify({ data: JSON.stringify(data), result: JSON.stringify(result), order: JSON.stringify(log) })}`)
                    }
                }
                else {
                    console.log(`위조된 결제 시도입니다. ${JSON.stringify({ data: JSON.stringify(data), result: JSON.stringify(result), order: JSON.stringify(log) })}`)
                }
            }
            //TODO: 타오바오 배송대행 주문 결제건에 대한 조건 및 처리 추가
            else {
                console.log("Callback : API Call Error");
            }
        }
        else {
            console.log(`Callback : 해당 결제건이 없습니다. ${JSON.stringify({ data: JSON.stringify(data), result: null, order: null })}`)
        }

        res.sendStatus(200);
    }
    catch (e) {
        console.log(e);
        res.sendStatus(500)
    }
}