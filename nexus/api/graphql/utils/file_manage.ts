import { AWSError, S3 } from 'aws-sdk';
import { FileUpload } from "graphql-upload";
import { AWS_BUCKET, isDev, regexPattern } from './constants';
import { errors, throwError } from "./error";
import * as HTTP from 'http'

export const S3ADDRESS = "http://118.35.126.70:2000"; //endpoing  원래는 http://localhost:9000 
export const EXTERNAL_S3_ADDRESS = "http://118.35.126.70:2000/sellforyou";//image 버킷 주소 원래 https://img.sellforyou.co.kr/sellforyou/ (아마 포트 3000, 3001) 쓸듯 

const agent = new HTTP.Agent({
    // Infinity is read as 50 sockets
    maxSockets: Infinity,
});
//s3 사용하기위한 셋팅이네 그냥 
export const S3Client = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,//ID
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,//PASSWORD
    params: { Bucket: AWS_BUCKET },//AWS_BUCKET = sellforyou ; 내가만든건 parksuseong
    region: 'ap-northeast-2',//region설정 
    ...(isDev() ? { // minio용 설정
        
        endpoint: S3ADDRESS,
        s3ForcePathStyle: true,
        signatureVersion: 'v4',
    } : {}),
    httpOptions: { agent }
});

export interface S3UploadResult {
    /**
     * Key
     */
    url: string;
    /**
     * Full Path
     */
    location: string;
}



export const uploadToS3 = async (file: FileUpload, path: (string | number)[] = [], filename?: string): Promise<S3UploadResult> => {
    const { createReadStream, filename: filenameOfFile, mimetype, encoding } = await file;
    path.push(filename ?? filenameOfFile);
    const stream = createReadStream();

    const response = await S3Client.upload({
        Key: path.join("/"),//파일 저장 경로 
        ACL: 'public-read',//권한 정보
        Body: stream,//보낼 파일 스트림

        ContentType: mimetype,//컨텐츠 타입
        Bucket: AWS_BUCKET,//버킷이름
    }).promise();

    return {
        location: response.Location,
        url: response.Key
    }
}


//headObject는 객체가있는지 확인하는 AWS S3 모듈이다. 
export const checkFileExistAtS3 = async (Key: string): Promise<boolean> => {
    return await S3Client.headObject({ Key, Bucket: AWS_BUCKET, }).promise().then(() => true).catch(() => false);
}
//getObject는 해당 bucket에서 key에 해당하는 애를 받아오는것 
export const getFromS3 = async (Key: string) => {
    return await S3Client.getObject({ Key, Bucket: AWS_BUCKET, }).promise();
}
//object 삭제인듯 그냥 
export const deleteFromS3 = async (Key: string): Promise<boolean> => {
    return await S3Client.deleteObject({ Key, Bucket: AWS_BUCKET }).promise().then(result => result.$response.error ? false : true).catch(() => false);
}
//s3에 업로드하는 로직인듯 todo 보는중 
export const uploadToS3AvoidDuplicate = async (pfile: FileUpload, pathArray: (string | number)[], fileNameExcludeExtension?: string) => {
    const file = await pfile;
    let filename = fileNameExcludeExtension ? fileNameExcludeExtension + file.filename.replace(regexPattern.fileNameAndExtension, ".$2") : file.filename;
    let tmpnumber = 0;
    while (true) {

        const result = await checkFileExistAtS3(pathArray.concat(filename.replace(regexPattern.fileNameAndExtension, `$1${tmpnumber ? (tmpnumber.toString()) : ""}.$2`)).join('/'));
        if (!result) break;
        tmpnumber += 1;
    }
    filename = filename.replace(regexPattern.fileNameAndExtension, `$1${tmpnumber ? (tmpnumber.toString()) : ""}.$2`);
    return (await uploadToS3(file, pathArray, filename)).url;
};


export const uploadToS3ByBuffer = async (file: Buffer, filename: string, mimetype: string, path: (string | number)[] = []): Promise<S3UploadResult> => {
    path.push(filename);
    if (mimetype === "image/jpg") mimetype = "image/jpeg";

    const response = await S3Client.upload({
        Key: path.join("/"),
        ACL: 'public-read',
        Body: file,
        ContentType: mimetype,
        Bucket: AWS_BUCKET,
    }).promise();

    return {
        location: response.Location,
        url: response.Key
    }
}

export const uploadToS3AvoidDuplicateByBuffer = async (pfile: Buffer, filename: string, mimetype: string, pathArray: (string | number)[], fileNameExcludeExtension?: string) => {
    filename = fileNameExcludeExtension ? fileNameExcludeExtension + filename.replace(regexPattern.fileNameAndExtension, ".$2") : filename;
    let tmpnumber = 0;
    while (true) {

        const result = await checkFileExistAtS3(pathArray.concat(filename.replace(regexPattern.fileNameAndExtension, `$1${tmpnumber ? (tmpnumber.toString()) : ""}.$2`)).join('/'));
        if (!result) break;
        tmpnumber += 1;
    }
    filename = filename.replace(regexPattern.fileNameAndExtension, `$1${tmpnumber ? (tmpnumber.toString()) : ""}.$2`);
    return (await uploadToS3ByBuffer(pfile, filename, mimetype, pathArray)).url;
};


export const uploadToS3WithEditor = async (content: string, pathArray: (string | number)[], fileNameExcludeExtension: string | null) => {
    const result = content.match(/<img src="data:(image\/.*?);base64,(.*?)"[ /]*?>/g);
    let descriptionContents = content;
    //console.log(result); //이미지 데이터 추출
    if (result) {
        const urlArray = await Promise.all(result.map(async (v, i) => {
            const a = v.replace(/<img src="data:(image\/.*?);base64,(.*?)"[ /]*?>/g, "$1*$*~$2").split("*$*~");

            const [mimetype, buffer] = [a[0], Buffer.from(a[1], "base64")];
            return await uploadToS3AvoidDuplicateByBuffer(buffer, `image${i}.${mimetype.slice(mimetype.indexOf("/") + 1, 10)}`, mimetype, [...pathArray]);
        }))
        descriptionContents = result?.reduce((p, c, i) => p.replace(c, `<img src="${EXTERNAL_S3_ADDRESS}/${urlArray[i]}">`), descriptionContents);
    }
    descriptionContents = descriptionContents.replace(/(?<!<p ?>)(<img [^>]*?>)(?!<p>)/g, "<p>$1</p>")
    if (fileNameExcludeExtension) {
        const description = (await uploadToS3ByBuffer(Buffer.from(descriptionContents, "utf8"), `${fileNameExcludeExtension}.html`, 'text/html', [...pathArray])).url;
        return description;
    }
    return descriptionContents;
}
