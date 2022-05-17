import fetch from "node-fetch";
import { ElementCompact, xml2js } from "xml-js";

export const getPersonalEcmValidity = async (name: string, ecm: string) => {
    const xml = await fetch(encodeURI(`https://unipass.customs.go.kr:38010/ext/rest/persEcmQry/retrievePersEcm?crkyCn=j260j221x046z292y040z030n0&pltxNm=${name}&persEcm=${ecm}`)).then(res => res.text());
    // console.log(result);
    const result = xml2js(xml, { compact: true }) as ElementCompact;
    if (result.persEcmQryRtnVo.tCnt._text === '1') return true;
    else if (result.persEcmQryRtnVo.tCnt._text === '0') return false;
    else throw new Error(`개인통관고유부호 조회 API 오류 :${JSON.stringify(result.persEcmQryRtnVo)}`);
}