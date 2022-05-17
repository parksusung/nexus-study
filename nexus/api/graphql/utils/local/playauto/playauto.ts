import FormData from "form-data";
import temp from "temp";
import archiver from "archiver";
import * as fs from 'fs';
import { IPAAddJobReqFullParameter, IPAAddJobReqParameter, IPAAddJobResponse } from "../../../playauto_api_type";
import fetch from "node-fetch";

export const getFormData = (object: any) => Object.keys(object).reduce((formData, key) => {
    formData.append(key, object[key]);
    return formData;
}, new FormData());

export function encodeObjectToKeyEqualsValueNewline<T>(object: T) {
    const a = Object.keys(object).reduce((p, c) => {
        if (object[c as keyof T] === undefined) return p;
        let val = ((c.startsWith("key")) ? `${c}=${Array.isArray(object[c as keyof T]) ? (object[c as keyof T] as unknown as any[])[0] : object[c as keyof T]}\n` : "")
        if (c.startsWith("b64")) {
            const buf = Buffer.from((object[c as keyof T]) as unknown as string)
            val = `${c}=${encodeURIComponent(buf.toString("base64"))}\n`
            // console.log(object[c as keyof T], buf, `${c}=${encodeURIComponent(buf.toString("base64"))}\n`)
        }
        return p + val;
    }, ""
    ).slice(0, -1);
    return a;
}


export const playauto_configJson = {
    sol_code: "KOOZA"
}


export const makeJobZip = async (configJson: any, jobJson: any): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        try {
            temp.track();
            const tempInfo = temp.openSync({ suffix: ".zip" });

            if (!archiver.isRegisteredFormat("zip-encryptable")) {
                archiver.registerFormat("zip-encryptable", require('archiver-zip-encryptable'));
            }

            let output = fs.createWriteStream(tempInfo.path);
            let archive = archiver('zip-encryptable' as archiver.Format & 'zip-encryptable', {
                zlib: { level: 6 },
                password: "wqEqRdddrf!!2019",
            } as archiver.ArchiverOptions & { password: string });
            archive.pipe(output);
            archive.append(Buffer.from(JSON.stringify(configJson)), { name: "config.json" });
            archive.append(Buffer.from(JSON.stringify(jobJson)), { name: "job.json" });
            await archive.finalize();
            resolve(tempInfo.path);
        } catch (e) {
            console.log(`${e} + makeJobZip Error`);
            reject(e);
        }
        //완료시 temp.cleanupSync()
    });
}

export async function sendPlayAutoJob<T>(parameter: IPAAddJobReqParameter, jobJson: T, callbackUrl: string): Promise<IPAAddJobResponse> {
    const res = await makeJobZip(playauto_configJson, jobJson);
    const jobReqParameter: IPAAddJobReqFullParameter = {
        ...parameter,
        domain: "playauto.co.kr", //도메인 고정
        sol_type: "TEST", //발급받은 sol_type을 입력해 주시기 바랍니다.
        sol_code: playauto_configJson.sol_code,
        runner_type: "SERVER", //고정
        runner_os: "WINDOWS", //고정
        runner_env: "", //고정
        result_runner_type: "SERVER", //고정
        result_runner_os: "WINDOWS", //고정
        job_priority: "normal", //고정
        job_file: fs.createReadStream(res),
        result_callback_url: callbackUrl,
    }
    const body = getFormData(jobReqParameter);
    const result = await fetch("https://engine.playapi.playauto.org/api/addJob", {
        method: "POST",
        body,
        headers: {
            Accept: "application/json,multipart/form-data"
        }
    }).then(res => res.json());
    return result;
}