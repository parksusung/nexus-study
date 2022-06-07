
import * as fs from 'fs';
import { XOR } from './types';

export const shopDataEtcInfo = [
    ["A001", "", "", "", "", "", "",],
    ["A522", "", "", "", "", "", "",],
    ["A006", "", "", "", "", "", "",],
    ["A523", "", "", "", "", "", "",],
    ["A077", "API ID", "", "", "API연동용ID", "", "네이버 ID 로그인 유무",], //etc2인 도메인 ID는 내부 EMP프로그램용으로 제거
    ["A027", "0", "회사명(공급업체명)", "사업자구분(계약유형)", "리스트순서(공급계약번호)", "", "",],
    ["A112", "", "", "", "", "", "",],
    ["A113", "", "", "", "", "", "",],
    ["B955", "SNS용 API인증키", "", "", "", "", "",],
    ["B118", "호스팅주소", "", "", "", "", "",],
    ["B378", "Access Key", "Secret Key", "", "", "업체코드(vendorId)", "",],
    ["B956", "파트너 API KEY", "", "", "", "", "",],
    ["B430", "", "", "", "", "", "",],
    ["B719", "API 인증키", "", "", "", "", "",],
    ["C003", "", "", "", "", "", "",],
    ["C010", "API 인증키", "", "", "", "", "",],
    ["A088", "", "", "", "", "", "",],
    ["B579", "", "", "", "", "", "",],
    ["A011", "", "", "", "", "", "",],
    ["A012", "", "", "", "", "", "",],
    ["A004", "협력사코드", "", "", "", "", "",],
    ["B008", "", "", "", "", "", "",],
    ["A131", "협력사 코드", "2차 협력사 코드", "API인증키", "2차 비밀번호", "", "",],
    ["B009", "", "", "", "", "", "",],
    ["B617", "", "", "", "", "", "",],
    ["A017", "", "", "", "", "", "",],
    ["A065", "API ID", "", "", "", "", "",],
    ["A024", "", "", "", "", "", "",],
    ["B394", "API ID", "API PW", "", "", "", "",],
    ["A118", "", "API 인증키", "", "", "", "",],
    ["B666", "API 인증키", "", "", "", "", "",],
    ["B733", "", "", "", "", "", "",],
    ["B612", "회사ID", "사업자번호", "", "", "", "",],
    ["B614", "업체코드", "API KEY", "", "", "", "",],
    ["B007", "", "", "", "", "", "",],
    ["B957", "", "", "", "", "", "",],
    ["A032", "API 인증키", "", "", "", "", "",],
    ["B609", "API 인증키", "2차패스워드", "", "", "", "",],
    ["B048", "", "", "", "", "", "",],
    ["B041", "", "2차패스워드", "", "", "", "",],
    ["B051", "", "", "", "", "", "",],
    ["B599", "", "", "", "", "", "",],
    ["B046", "", "", "", "", "", "",],
    ["B888", "API 인증키", "", "", "", "", "",],
    ["B572", "", "", "", "", "", "",],
    ["B087", "", "", "", "", "", "",],
    ["A132", "협력사 코드", "2차 협력사 코드", "API인증키", "2차 비밀번호", "", "",],
    ["B325", "관리자유형", "", "", "", "", "",],
    ["A085", "API 인증키", "", "", "", "", "",],
    ["B701", "거래처 번호", "사용자 인증키", "", "", "", "",],
    ["B690", "업체코드", "", "", "", "", "",],
    ["B771", "API 인증키", "", "", "", "", "",],
    ["A100", "휴대폰번호", "", "", "", "", "",],
    ["B661", "OA ID", "OA PW", "출고지번호", "", "", "",],
    ["B693", "", "", "", "", "", "",],
    ["B668", "", "", "", "", "", "",],
    ["B730", "", "", "", "", "", "",],
    ["B669", "", "", "", "", "", "",],
    ["B682", "", "", "", "", "", "",],
    ["B685", "", "협력사코드", "하위협력사코드", "협력사인증키", "", "",],
    ["B688", "API 인증키", "", "", "", "", "",],
    ["B953", "", "", "", "", "", "",],
    ["B694", "", "", "", "", "", "",],
    ["A133", "사업소코드", "협력사 코드", "API인증키", "", "", "",],
    ["B696", "API 인증키", "", "", "", "", "",],
    ["B502", "API 인증키", "", "", "", "", "",],
    ["B959", "", "", "", "", "", "",],
    ["A524", "API 인증키", "거래처번호", "", "", "", "",],
    ["B880", "", "", "", "", "", "",],
]

export const shopDataNameInfo: { [key: string]: string } = {
    "A001": "옥션",
    "A522": "옥션2.0",
    "A006": "G마켓",
    "A523": "G마켓2.0",
    "A077": "스마트스토어",
    "A027": "인터파크",
    "A112": "11번가 글로벌",
    "A113": "11번가 일반",
    "B955": "마이소",
    "B118": "메이크샵",
    "B378": "쿠팡",
    "B956": "티몬",
    "B430": "위메프",
    "B719": "위메프 2.0",
    "C003": "Qoo10(sg)",
    "C010": "Qoo10(jp)",
    "A088": "멸치쇼핑",
    "B579": "NH마켓",
    "A011": "GS SHOP",
    "A012": "롯데닷컴",
    "A004": "CJmall",
    "B008": "half club",
    "A131": "현대H몰 (Hmall)",
    "B009": "LOTTE DEPARTMENT STORE",
    "B617": "오가게",
    "A017": "Akmall",
    "A065": "iSTYLE 24",
    "A024": "WIZWID",
    "B394": "the galleria",
    "A118": "ns홈쇼핑",
    "B666": "MUSINSA",
    "B733": "PLAYER",
    "B612": "LOTTE MART",
    "B614": "홈앤쇼핑",
    "B007": "패션플러스",
    "B957": "W컨셉",
    "A032": "SSG(통합) - 신세계몰, SSG(이마트몰), 이마트트레이더스몰",
    "B609": "다이소몰",
    "B048": "1300k",
    "B041": "텐바이텐",
    "B051": "바보사랑",
    "B599": "인터파크 도서",
    "B046": "예스24",
    "B888": "후추통",
    "B572": "골핑(B2C)",
    "B087": "sbs골프닷컴",
    "A132": "현대H몰(백화점)",
    "B325": "이지웰",
    "A085": "SSG(신세계백화점)",
    "B701": "삼성카드쇼핑",
    "B690": "K쇼핑",
    "B771": "제로투세븐",
    "A100": "롯데아이몰",
    "B661": "이랜드몰",
    "B693": "도매꾹",
    "B668": "도매창고",
    "B730": "오너클랜",
    "B669": "머스트잇",
    "B682": "브리치",
    "B685": "공영홈쇼핑",
    "B688": "카카오톡스토어",
    "B953": "POOM",
    "B694": "핫트랙스",
    "A133": "더현대닷컴",
    "B696": "하이마트",
    "B502": "홈플러스",
    "B959": "오늘의집",
    "A524": "롯데온 글로벌",
    "A525": "롯데온 일반",
    "B880": "펀앤쇼핑",
}

interface IShopDataUrlInfo {
    /**
     * 네이버 : 상품ID, 쿠팡 : productId
     */
    id: string;
    /**
     * 네이버 : 스토어 아이디
     */
    storeName?: string | null;
    /**
     * storeFullPath? : 
     */
    storeFullPath?: string | null;
    /**
     * 쿠팡 : vendorItemId
     */
    vendorId?: string | null;
}

export const shopDataUrlInfo: { [key: string]: (data: IShopDataUrlInfo) => string } = {
    "A001": (data) => `http://itempage3.auction.co.kr/DetailView.aspx?ItemNo=${data.id}&frm3=V2`,
    "A522": (data) => `옥션2.0`,
    "A006": (data) => `http://item.gmarket.co.kr/Item?goodscode=${data.id}`,
    "A523": (data) => `G마켓2.0`,
    "A077": (data) => data.storeFullPath ? `${data.storeFullPath.replace(/\/$/, "")}/products/${data.id}` : `https://smartstore.naver.com/${data.storeName ?? ""}/products/${data.id}`,
    "A027": (data) => `https://shopping.interpark.com/product/productInfo.do?prdNo=${data.id}`,
    "A112": (data) => `https://www.11st.co.kr/products/${data.id}`,
    "A113": (data) => `https://www.11st.co.kr/products/${data.id}`,
    "B955": (data) => `마이소`,
    "B118": (data) => `메이크샵`,
    "B378": (data) => `https://www.coupang.com/vp/products/${data.id}`,
    "B956": (data) => `https://www.tmon.co.kr/deal/${data.id}`,
    "B430": (data) => `위메프`,
    "B719": (data) => `https://front.wemakeprice.com/product/${data.id}`,
    "C003": (data) => `Qoo10(sg)`,
    "C010": (data) => `Qoo10(jp)`,
    "A088": (data) => `멸치쇼핑`,
    "B579": (data) => `NH마켓`,
    "A011": (data) => `GS SHOP`,
    "A012": (data) => `롯데닷컴`,
    "A004": (data) => `CJmall`,
    "B008": (data) => `half club`,
    "A131": (data) => `현대H몰 (Hmall)`,
    "B009": (data) => `LOTTE DEPARTMENT STORE`,
    "B617": (data) => `오가게`,
    "A017": (data) => `Akmall`,
    "A065": (data) => `iSTYLE 24`,
    "A024": (data) => `WIZWID`,
    "B394": (data) => `the galleria`,
    "A118": (data) => `ns홈쇼핑`,
    "B666": (data) => `MUSINSA`,
    "B733": (data) => `PLAYER`,
    "B612": (data) => `LOTTE MART`,
    "B614": (data) => `홈앤쇼핑`,
    "B007": (data) => `패션플러스`,
    "B957": (data) => `W컨셉`,
    "A032": (data) => `SSG(통합) - 신세계몰, SSG(이마트몰), 이마트트레이더스몰`,
    "B609": (data) => `다이소몰`,
    "B048": (data) => `1300k`,
    "B041": (data) => `텐바이텐`,
    "B051": (data) => `바보사랑`,
    "B599": (data) => `인터파크 도서`,
    "B046": (data) => `예스24`,
    "B888": (data) => `후추통`,
    "B572": (data) => `골핑(B2C)`,
    "B087": (data) => `sbs골프닷컴`,
    "A132": (data) => `현대H몰(백화점)`,
    "B325": (data) => `이지웰`,
    "A085": (data) => `SSG(신세계백화점)`,
    "B701": (data) => `삼성카드쇼핑`,
    "B690": (data) => `K쇼핑`,
    "B771": (data) => `제로투세븐`,
    "A100": (data) => `롯데아이몰`,
    "B661": (data) => `이랜드몰`,
    "B693": (data) => `도매꾹`,
    "B668": (data) => `도매창고`,
    "B730": (data) => `오너클랜`,
    "B669": (data) => `머스트잇`,
    "B682": (data) => `브리치`,
    "B685": (data) => `공영홈쇼핑`,
    "B688": (data) => `카카오톡스토어`,
    "B953": (data) => `POOM`,
    "B694": (data) => `핫트랙스`,
    "A133": (data) => `더현대닷컴`,
    "B696": (data) => `하이마트`,
    "B502": (data) => `홈플러스`,
    "B959": (data) => `오늘의집`,
    "A524": (data) => `https://www.lotteon.com/p/product/${data.id}`,
    "A525": (data) => `https://www.lotteon.com/p/product/${data.id}`,
    "B880": (data) => `펀앤쇼핑`,
}


export interface PAShopInfo {
    action: number[],
    account_code: string,
    site_code: string,
    encoding: "utf-8" | "euc-kr",
    id: string;
    id2: string;
    pw: string;
    etc: string;
    etc2: string;
    etc3: string;
    etc4: string;
    etc5: string;
    etc6: string;
    global_yn: string;
    prod_codes: string[];
    DataDataSet: any;
    DataDataSetFileName: string;
    syncList: string[];
    fromState: string;
    SetNo: string;
    Desc: string;
    dummy1: number;
}

export interface IPAApi {
    amp_key: String,
    /**
     *EMP 기준 사용자별 고유 코드
     *
     * @author Kuhave
     * @memberof IPAApi
     */
    amp_program_code: string;
    /**
     *사용자별 고유 타입
     *
     * @author Kuhave
     * @memberof IPAApi
     */
    amp_program_type: string;
    /**
     *사용자별 기본 디렉토리 경로(필수X)
     *
     * @author Kuhave
     * @memberof IPAApi
     */
    amp_program_homedir: string;
    /**
     *사용자별 기본 URL 경로(필수X)
     *
     * @author Kuhave
     * @memberof IPAApi
     */
    amp_program_homeurl: string;
}

export interface IPADataOpt {
    /**
     *옵션별 고유 코드
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    number: number;
    /**
     *옵션 종류
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    type: string;
    /**
     *마스터상품코드
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    code: string;
    /**
     *관리코드(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    manage_code: string;
    /**
     *옵션타입1 옵션명
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    opt1: string;
    /**
     *옵션타입2 옵션명(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    opt2: string;
    /**
     *옵션타입3 옵션명(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    opt3: string;
    /**
     *옵션 추가 가격
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    price: number;
    /**
     *옵션 수량
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    stock: number;
    /**
     *품절여부(0:미품절, 1:품절)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    soldout: number;
    /**
     *등록일자(2018-03-09 15:20:20)(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    wdate: string;
    /**
     *옵션이미지 (url)(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    optimg: string | null;
    /**
     *옵션타입1 명칭
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    misc1: string;
    /**
     *옵션타입2 명칭(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    misc2: string;
    /**
     *옵션타입3 명칭(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    misc3: string;
    /**
     *추가무게(필수X)
     *
     * @author Kuhave
     * @memberof IPADataOpt
     */
    weight: string;
}

export interface IPADataSlave {
    /**
     *마스터 상품코드
     *
     * @author Kuhave
     * @memberof IPADataSlave
     */
    code: string;
    /**
     *저장된 템플릿 내용(세트?)
     *
     * @author Kuhave
     * @memberof IPADataSlave
     */
    set_data: string;
}

export interface IPAData {
    wdate: string;
    edate: string;
    code: string;
    name3: string;
    name2: string;
    eng_name: string;
    bonus: string;
    cate1: string;
    cate2: string;
    cate3: string;
    cate4: string;
    cate_code: string;
    tax: string;
    model: string;
    brand: string;
    maker: string;
    madein: string;
    nprice: number;
    wprice1: number;
    wprice2: number;
    sprice: number;
    buy: number;
    deliv: string;
    deliv_fee: number;
    stock: number;
    misc1: string;
    misc2: string;
    misc3: string;
    misc4: string;
    misc5: string;
    made_date: string;
    expr_date: string;
    opt_type: string;
    use_addopt: boolean;
    model_id: string;
    use_siil_data: boolean;
    use_cert: string;
    opt_type_select: string;
    tmall_catalog_id: string;
    inpark_catalog_id: string;
    name_short: string;
    use_optImg: boolean;
    china_name: string;
    japan_name: string;
    weight: number;
    content: string;
    content2: string;
    content3: string;
    catalog_etc: string;
    keyword1: string;
    keyword2: string;
    keyword3: string;
    keyword4: string;
    keyword5: string;
    addon_opt: string | null;
    cert: boolean;
    model_etc: string;
    siil_data: string;
    tmall_catalog_etc: string;
    inpark_catalog_etc: string;
    eng_keyword: string;
    china_keyword: string;
    japan_keyword: string;
    made_country: string;
    hs_code: string;
    eng_content: string;
    china_content: string;
    japan_content: string;
    imgtag: string;
    site_code: string;
    site_id: string;
    site_sprice: number;
    site_stock: number;
    site_buy: number;
    slave_state: string;
    slave_state_old: string;
    slave_state_date: string;
    slave_wdate: string;
    slave_reg_edate: string;
    slave_reg_code: string;
    slave_type: string;
    deliv2: string;
    deliv_fee2: number;
    cate_code2: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    img5: string;
    img6: string;
    img7: string;
    img8: string;
    img9: string;
    img10: string;
    img1_blob: string;
    img2_blob: string;
    img3_blob: string;
    img4_blob: string;
    img5_blob: string;
    img6_blob: string;
    img7_blob: string;
    img8_blob: string;
    img9_blob: string;
    img10_blob: string;
    optImg_URL: string | null;
    result: boolean | null;
    result_error: string | null;
    result_error_code: string | null;
}

export interface IPAConfig {
    ProdUseDenyKeyword: boolean | string;
    ProdUseDenyKeywordString: string;
    ProdUseCancelMsg: boolean | string;
    ProdUseCancelMsgString: string;
    ProdSearchDate: string;
    ProdUseEditImg: boolean | string;
    OrderSearchDate: string; //주문 및 문의 수집 기간
}
export interface IPADataDataSet {
    api: IPAApi[];
    config: IPAConfig[]
}

export interface IPADataDataSet10 extends IPADataDataSet {
    data_opt: IPADataOpt[];
    data_slave: IPADataSlave[];
    data_set: [],
    data: IPAData[],
}
export interface IPADataDataSet3 extends IPADataDataSet {
    confirm_order: IPAConfirmOrder[];
}

export interface IPAConfirmOrder {
    confirm_doit: boolean
}

export interface IPADShopInfo<T extends IPADataDataSet> {
    action: number[];
    account_code: string;
    site_code: string;
    dll_code: string;
    site_name: string;
    encoding: string;
    id: string;
    id2: string;
    pw: string;
    etc: string;
    etc2: string;
    etc3: string;
    etc4: string;
    etc5: string;
    etc6: string;
    global_yn: string;
    prod_codes: string[];
    DataDataSet: T;
    DataDataSetFileName: string;
    syncList: string[] | string;
    fromState: string;
    SetNo: string;
    Desc: string;
    dummy1: number;
}

export interface IPAAddJobReqFullParameter {
    domain: "playauto.co.kr";
    sol_type: string;
    sol_code: string;
    sol_user: string;
    site_code: string;
    site_name: string;
    site_id: string;
    runner_type: "SERVER";
    runner_os: "WINDOWS";
    runner_env: "";
    result_runner_type: "SERVER";
    result_runner_os: "WINDOWS";
    job_cate: string;
    job_type: string;
    job_name: string;
    job_priority: "normal";
    job_file: fs.ReadStream;
    result_callback_url: string;
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type SubPartial<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type IPAAddJobReqParameter = SubPartial<IPAAddJobReqFullParameter, "domain" | "sol_type" | "sol_code" | "runner_type" | "runner_os" | "runner_env" | "result_runner_type" | "result_runner_os" | "job_priority" | "job_file" | "result_callback_url">;

export interface IPAJobCallbackProcessingResponse {
    job_id: string
    current: number
    total: number
    state_msg: string
    job_cate: string
    sol_code: string
}
export interface IPAJobCallbackDoneResponse<T> {
    job_id: string
    title: string
    results: IPAJobCallbackResults<T>
}

export type IPAJobCallbackResponse<T> = IPAJobCallbackProcessingResponse | IPAJobCallbackDoneResponse<T>;

export interface IPAJobCallbackResults<T> {
    "config.json": IPAJobCallbackConfigJson
    "result.json": T[] | IPAJobCallbackFailedResultJson
}

export interface IPAJobCallbackFailedResultJson {
    Result: string
    Message: string
}

export interface IPAJobCallbackConfigJson {
    sol_code: string
}

export interface IPAJobCallbackRegistProdResultJson {
    state: number
    site_code: string
    site_id: string
    code: string
    sku_code: any
    single_yn: any
    groupkey: any
    slave_reg_code: string
    slave_reg_code_sub: string
    reg_type: string
    reg_sell_term: number
    reg_fee: number
    reg_premium: number
    slave_wdate: string
    slave_edate: string
    msg: string
    err_code: any
    setdata: string
    setName: string
    toState: string
    gmp_sale_no: any
    isSavedToDB: boolean
}
export interface IPAAddJobResponse {
    job_id: number
    sns_msg_id: string
    sns_topic_arn: string
    title: string
    priority: string
    delay: number
    expiry_ttl: number
    expiry_date: string
    is_job_in_storage: boolean
    queue_name: string
    result_callback_url: string
}


export interface IPAJobCallbackScrapOrderResultJson {
    wid: string | null
    site_code: string
    site_id: string
    tid: string
    wdate: string
    odate: string
    cdate: string
    ddate: string
    state_date: string
    deli_date: string
    remit_date: string
    state: number
    state_old: number
    state_msg: any
    ocode: string
    pay_method: number
    pcode: string
    pcode2: string
    pname: string
    pname2: string
    src_pname: string
    popt: string
    src_popt: string
    popt_plus: string
    popt_plus_price: number
    notice_msg: string
    wprice1: number
    wprice2: number
    price: number
    price1: number
    count: number
    deliv_method: number
    deliv_price: number
    oaid: string
    oname: string
    otel: string
    ohtel: string
    oemail: string
    gname: string
    gtel: string
    ghtel: string
    gzip: string
    gaddress: string
    msg: string
    msg2: string
    msg3: string
    fee: any
    tax_doc: any
    sender: string
    sendno: string
    master_code: string
    master_sdate: string
    master_edate: string
    master_stock_check: string
    master_etc1: any
    master_etc2: any
    master_etc3: any
    cancel_flag: number
    misc1: string
    misc2: string
    misc3: string
    misc4: string
    misc5: string
    misc6: string
    misc7: string
    misc8: string
    misc9: string
    misc10: string
    black: number
    outskirts: number
    airpost: number
    white: number
    match_popt: any
    match_popt_plus: any
    match_popt_ok: number
    pcode3: string
    misc11: string
    misc12: string
    misc13: string
    misc14: string
    misc15: string
    misc16: string
    misc17: string
    misc18: string
    misc19: string
    misc20: string
    customer: string
    popt_price: number
    msg_card: string
    gprivate_no: string
    gname_eng: string
    bonus: string
    shopInfo: IPAScrapOrderShopInfo
    ordinfo: any[]
    wprice: number
    add_price1: number
    add_price2: number
    sale_price: number
    tax_price: number
    qxpress: string
    sku_code: string
    invenopt: string
    currency: string
    leaders_status: any
    leaders_price: number
    priceOfB2B: number
    uniq_order_where: IPAScrapOrderUniqOrderWhere
}

export interface IPAScrapOrderShopInfo {
    position: string
    overlap_mode: string
    uniqKey: string
}

export interface IPAScrapOrderUniqOrderWhere { }


export const PlayAutoDelivMethod: { [key: number]: string } = {
    0: "무료배송",
    1: "선결제",
    2: "착불",
    3: "조건부배송",
    4: "방문수령",
    5: "퀵배송",
    6: "일반우편",
    7: "설치배송",
    8: "기타",
}

export const PlayAutoOrderState: { [key: number]: string } = {
    0: '신규주문',
    1: '송장출력',
    2: '송장입력',
    3: '출고',
    4: '배송중',
    5: '수취확인',
    6: '정산완료',
    7: '주문확인',
    8: '보류',
    9: '취소',
    10: '취소마감',
    11: '반품요청',
    12: '교환요청',
    13: '반품마감',
    14: '교환마감'
}

export interface IPACategoryResponse {
    success: boolean
    result: IPACategoryArrayResult
}

export interface IPACategoryArrayResult {
    success: boolean
    makeDate: string
    total: number
    result: (IPACategoryResult | IPACategoryStoreResult)[]
}

export interface IPACategoryResult {
    number: number
    code: string
    c1: string
    c2: string
    c3: string
    c4: string
    c1_nm: string
    c2_nm: string
    c3_nm: string
    c4_nm: string
}
export interface IPACategoryStoreResult {
    number: number
    acode: string
    pcode: string
    ccode: string
    dc1: string
    dc2: string
    dc3: string
    dc4: string
    dc1_nm: string
    dc2_nm: string
    dc3_nm: string
    dc4_nm: string
    state: string
    cate_state_pdate: number | null
    cate_state_cdate: number | null
}

export function isIPACategoryStoreResult(result: (IPACategoryResult | IPACategoryStoreResult)): result is IPACategoryStoreResult {
    return (result as IPACategoryStoreResult).acode !== undefined;
}