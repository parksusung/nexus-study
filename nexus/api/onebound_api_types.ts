/**
 *원바운드 공통 인터페이스
 *
 * @export
 * @interface IOBPublicParameter
 */
export interface IOBPublicParameter {
    /**
     * API_KEY
     * @type {string}
     * @memberof IOBPublicParameter
     */
    key: string;
    /**
     *API密钥
     *
     * @type {string}
     * @memberof IOBPublicParameter
     */
    secret: string;
    /**
     *기본값 "yes"
     *
     * @type {("yes" | "no")}
     * @memberof IOBPublicParameter
     */
    cache?: "yes" | "no";
    /**
     *반환값
     *
     * @type {("json" | "jsonu" | "xml" | "serialize" | "var_export")}
     * @memberof IOBPublicParameter
     */
    result_type?: "json" | "jsonu" | "xml" | "serialize" | "var_export";
    /**
     *언어
     *
     * @type {("cn" | "en" | "ru")}
     * @memberof IOBPublicParameter
     */
    lang?: "cn" | "en" | "ru";
}

export type IOBApiType = "item_search" | "item_get" | "buyer_cart_list" | "buyer_order_list" | "buyer_order_detail";
export type IQueryParam = IOBPublicParameter & { [key: string]: string | number | boolean | undefined };

export type IOBItemSearchParam = IQueryParam & {
    q: string;
    start_price?: string;
    end_price?: string;
    /**
     *bid: total price, bid2: product price, sale: sales ,credit credit, add _ prefix to sort from largest to smallest
     *
     * @type {("bid"|"_bid"|"bid2"|"_bid2"|"_sale"|"_credit")}
     * @memberof IOB
     */
    sort?: "bid" | "_bid" | "bid2" | "_bid2" | "_sale" | "_credit"
    page?: number;
}

export type IOBItemGetParam = IQueryParam & {
    num_iid: string;
    is_promotion: 1 | 0;
}

export type IOBBuyerOrderListParam = IQueryParam & {
    page: number;
    tab_code: "all" | "waitPay" | "waitSend" | "waitConfirm" | "waitRate";
    cookie: string;
}

export type IOBBuyerOrderDetailParam = IQueryParam & {
    order_id: string;
    cookie: string;
}

/**
 *원바운드 타오바오 상품
 *
 * @export
 * @interface IOBItem
 */
export interface IOBItem {
    /**
     *상품명
     *
     * @type {string}
     * @memberof IOBItem
     */
    title: string;
    /**
     *대표 이미지
     *
     * @type {string}
     * @memberof IOBItem
     */
    pic_url: string;
    promotion_price: string;
    price: string;
    sales: number;
    /**
     *상품 ID(주소창에 나오는 그것)
     *
     * @type {string}
     * @memberof IOBItem
     */
    num_iid: string;
    seller_nick: string;
    seller_id: string;
    detail_url: string;
}

export interface IOBItems {
    page: number;
    real_total_results: number;
    total_results: number;
    page_size: number;
    data_from: string;
    item: IOBItem[];
    item_weight_update: number;
}

export interface IOBLanguage {
    default_lang: string;
    current_lang: string;
}

export interface IOBItemSearchCallArgs {
    q: string;
    start_price: string;
    end_price: string;
    page: string;
    cat: string;
}

export interface IOBResponse {
    error_code: string;
    reason: string;
    secache: string;
    secache_time: number;
    secache_date: string;
    translate_status: string;
    translate_time: number;
    language: IOBLanguage;
    error: string;
    cache: number;
    api_info: string;
    execution_time: number;
    server_time: string;
    client_ip: string;
    api_type: string;
    translate_language: string;
    translate_engine: string;
    server_memory: string;
    request_id: string;
}

export type IOBItemSearchResponse = IOBResponse & {
    call_args: IOBItemSearchCallArgs;
    items: IOBItems;
}

export type IOBItemGetResponse = IOBResponse & {
    call_args: IOBItemSearchCallArgs;
    item: IOBItem;
}

export type IOBOrderGetResponse = IOBResponse & {
    items: IOBOrderGetResult;
    call_args: IOBOrderGetCallArgs;
}


export interface IOBItem {
    num_iid: string;
    title: string
    desc_short: string;
    price: string
    total_price: string;
    suggestive_price: string;
    orginal_price: string;
    nick: string
    num: number
    detail_url: string;
    pic_url: string;
    brand: string
    brandId: string | null;
    rootCatId: string;
    cid: string
    desc: string
    item_imgs: IOBItemImg[];
    item_weight: string;
    post_fee: string;
    freight: string;
    express_fee: any;
    ems_fee: string;
    shipping_to: string;
    video: any;
    sample_id: string;
    props_name: string;
    prop_imgs: IOBPropImgs;
    props_imgs: IOBPropsImgs;
    property_alias: string;
    props: any;
    total_sold: string;
    skus: IOBSkus
    seller_id: string;
    sales: number
    shop_id: string;
    props_list: IOBPropsList;
    seller_info: IOBSellerInfo;
    tmall: boolean
    error: string
    fav_count: string;
    fans_count: string;
    location: string;
    data_from: string;
    has_discount: string;
    is_promotion: string;
    promo_type: any;
    props_img: IOBPropsImg;
    rate_grade: string;
    desc_img: string[];
    shop_item: any[];
    relate_items: any[];
}

export interface IOBItemImg {
    url: string
}

export interface IOBPropImgs {
    prop_img: IOBPropImg[]
}

export interface IOBPropImg {
    properties: string
    url: string
}

export interface IOBPropsImgs {
    prop_img: IOBPropImg[]
}
export interface IOBProp {
    name: string
    value: string
}

export interface IOBSkus {
    sku: IOBSku[]
}

export interface IOBSku {
    price: string
    total_price: number
    orginal_price: string
    properties: string
    properties_name: string
    quantity: string
    sku_id: string
}

export interface IOBPropsList {
    [key: string]: string;
}

export interface IOBSellerInfo {
    nick: string
    item_score: string
    score_p: string
    delivery_score: string
    shop_type: string
    user_num_id: string
    sid: string
    title: string
    zhuy: string
    shop_name: string
}

export interface IOBPropsImg {
    [key: string]: string;
}

export interface IOBItemGetCallArgs {
    num_iid: string
    is_promotion: string
}

// export interface IOBOrderGetResponse {
//     items: IOBOrderGetResult
//     error: string
//     reason: string
//     error_code: string
//     cache: number
//     api_info: string
//     execution_time: number
//     server_time: string
//     client_ip: string
//     call_args: IOBOrderGetCallArgs
//     api_type: string
//     translate_language: string
//     translate_engine: string
//     server_memory: string
//     request_id: string
// }

export interface IOBOrderGetResult {
    item: IOBOrderItem[]
    page: string
    total_page: string
    page_size: string
}

export interface IOBOrderItem {
    order_id: string
    createDay: string
    shop_name: string
    seller_id: string
    seller_nick: string
    goods: IOBOrderGood[]
    total_price: string
    freight: any
    trading_status: string
    countdown: any
}

export interface IOBOrderGood {
    goods_name: string
    goods_id: string
    goods_image: string
    unit_price?: string
    original_price: any
    goods_count?: string
    goods_info?: string
}

export interface IOBOrderGetCallArgs {
    page: string
    tab_code: string
}
