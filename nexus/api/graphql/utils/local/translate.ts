import fetch from "node-fetch";

export interface TranslateResponse {
    data: TranslateData
    apiname: string
    apiversion: string
    apiauthor: string
}

export interface TranslateData {
    delayedTime: number
    translatedText: string
    translator: string
    queriedText: string
}

// 파파고 크롤링 API
// export async function translateText(translateMethod: "papago" | "google" | "baidu", toTranslate: string) {
//     const result = await fetch(`http://59.21.95.219:3001/api/translate?translator=${translateMethod}&sentence=${encodeURIComponent(toTranslate)}`).then(res => res.json() as Promise<TranslateResponse>);
//     if (toTranslate !== result.data.queriedText) throw new Error(`API Error : 번역 요청이 서로 다릅니다. 요청 : ${toTranslate},응답 : ${result.data.queriedText}`);
//     return result.data.translatedText;
// }

export interface PapagoTranslateRequest {
    source: "zh-CN";
    target: "ko";
    text: string;
    honorific?: boolean;
}

export interface PapagoTranslateResponse {
    message: PapagoTranslateData
}

export interface PapagoTranslateData {
    "@type": string
    "@service": string
    "@version": string
    result: PapagoTranslateResult
}

export interface PapagoTranslateResult {
    srcLangType: string
    tarLangType: string
    translatedText: string
}


// 파파고 API
export async function translateTextByPapagoAPI(toTranslate: string) {
    const target: PapagoTranslateRequest = {
        source: "zh-CN",
        target: "ko",
        text: toTranslate
    }
    const result = await fetch(`https://naveropenapi.apigw.ntruss.com/nmt/v1/translation`, {
        method: "POST",
        headers: {
            "X-NCP-APIGW-API-KEY-ID": process.env.X_NCP_APIGW_API_KEY_ID!,
            "X-NCP-APIGW-API-KEY": process.env.X_NCP_APIGW_API_KEY!,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(target)
    }).then(res => res.json() as Promise<PapagoTranslateResponse>).catch(e => { console.log("번역 API 에러 :", e); throw new Error(e) });
    // if (toTranslate !== result.data.queriedText) throw new Error(`API Error : 번역 요청이 서로 다릅니다. 요청 : ${toTranslate},응답 : ${result.data.queriedText}`);
    return result.message.result.translatedText;
}