import { Request, Response } from "express"
import { uploadToS3ByBuffer } from "../graphql/utils/file_manage";

const xml2js = require("xml2js");

export const jsonToXmlUploader = async(req: Request, res: Response) => {
    try {
        var productId = req.body.productId;
        var objData = req.body.data;

        var xmlBuilder = new xml2js.Builder({
            // xmldec: {
            //     version: "1.0",
            //     encoding: "euc-kr"
            // }
        });

        var xmlData = xmlBuilder.buildObject(objData) ?? null;
        var pathArray: (string | number)[] = ["product", productId];

        const xmlPath = xmlData ? (await uploadToS3ByBuffer(Buffer.from(xmlData, "utf8"), `interpark.xml`, 'text/xml', [...pathArray])).url : null;

        if (!xmlPath) {
            res.sendStatus(500);
            
            return;
        }

        res.send(xmlPath);
    }
    catch (e) {
        res.sendStatus(500);
    }
}