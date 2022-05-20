import { enumType } from "nexus";


export enum ProductStoreStateEnum {

    /**
     * 상품 업로드 요청
     */
    REGISTER_REQUESTED = 1,

    /**
     * 판매중
     */
    ON_SELL = 2,

    /**
     * 상품 업로드 실패
     */
    REGISTER_FAILED = 3
};

export const t_social = enumType({
    name: "UserSocialType",
    members: ["EMAIL", "KAKAO", "NAVER"]
});

export const t_admin_social = enumType({
    name: "UserLoginType",
    members: ["ADMIN", "EMAIL", "KAKAO", "NAVER"]
});

export const t_taobao_item_orderby = enumType({
    name: "TaobaoItemOrderBy",
    members: [{
        name: "SALE",
        value: "_sale",
        description: "판매량순"
    }, {
        name: "CREDIT",
        value: "_credit",
        description: "판매자 신용 순"
    },]
});