import { getFromS3 } from "../../file_manage";
import * as iconv from "iconv-lite"
import { serialize } from 'php-serialize'

export async function getEncodedSetData(key: string) {
    const file = await getFromS3(key);
    // return file.Body!.toString("base64");
    const content = JSON.parse(file.Body!.toString("utf8"));
    Object.keys(content).map(key => {
        if (key.startsWith("b64")) {
            const buf = iconv.encode(content[key] as unknown as string, "euc-kr");
            // console.log("euc", buf.toString("base64"));
            const buf2 = Buffer.from((content[key]) as unknown as string);
            // console.log("utf", buf2.toString("base64"));
            content[key] = encodeURIComponent(buf.toString("base64"));
        }
    });
    const result: { [key: string]: string; } = {
        name: content.name ?? "",
        mall_cate_name: content.mall_cate_name ?? "",
        content: content,
    };
    // const serializedResult = Object.keys(result).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(result[k])).join('&');
    // return Buffer.from(JSON.stringify(result)).toString("base64");
    return Buffer.from(serialize(result)).toString("base64");
}