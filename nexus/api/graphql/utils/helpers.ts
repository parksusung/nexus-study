import { PrismaClient } from '@prisma/client'
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { sign, verify } from 'jsonwebtoken'
import { Context, Token } from '../types'
import { APP_REFRESH_SECRET, APP_SECRET, REDIS_HOST, REDIS_PORT, REDIS_SECRET, tokens } from './constants'
// import { PubSub } from 'apollo-server-express';
import Redis, { RedisOptions } from 'ioredis' // redis 사용시 활성화
import { Iamport } from 'iamport-rest-client-nodejs';
import { getPurchaseInfo, PurchaseLogPlanInfoType } from '../graphql';
import * as CryptoJS from "crypto-js";
import { shake256 } from 'js-sha3';
import { throwError, errors } from './error';

export const generateToken = (id: number, type: "userId" | "adminId", isRefresh: boolean) => {
    if (!isRefresh) {
        const privateClaim: any = {}
        privateClaim[type] = id;
        return sign(
            privateClaim,
            APP_SECRET,
            {
                expiresIn: tokens.access.expiry,
            }
        )
    }
    else {
        const privateClaim: any = {}
        privateClaim[type] = id;
        privateClaim["isRefresh"] = true;
        return sign(
            privateClaim,
            APP_REFRESH_SECRET,
            {
                expiresIn: tokens.access.refreshExpiry,
                algorithm: "HS512"
            }
        )
    }
}
// export const prisma = new PrismaClient();
export const prisma = new PrismaClient({
    log: [
        {
            emit: 'event',
            level: 'query',
        },
    ],
})

// const pubsub = new PubSub();

const redisOption: RedisOptions = {
    host: REDIS_HOST,
    port: +REDIS_PORT,
    password: REDIS_SECRET,
    retryStrategy: times => {
        return Math.min(times * 50, 2000);
    }
}

export const pubsub = new RedisPubSub({
    publisher: new Redis(redisOption),
    subscriber: new Redis(redisOption),
});

export const withCancel = (asyncIterator: AsyncIterator<any, any, undefined>, onCancel: () => void) => {
    const asyncReturn = asyncIterator.return;

    asyncIterator.return = () => {
        onCancel();
        return asyncReturn ? asyncReturn.call(asyncIterator) : Promise.resolve({ value: undefined, done: true });
    };

    return asyncIterator;
};

export const createContext = (ctx: any): Context => {
    let token: Token | null;
    try {
        let Authorization = ''
        try {
            // for queries and mutations
            Authorization = ctx.req.get('Authorization')
        } catch (e) {
            // specifically for subscriptions as the above will fail
            Authorization = ctx?.connection?.context?.Authorization
        }
        const tokenString = Authorization.replace('Bearer ', '')
        let verifiedToken: any;
        verifiedToken = verify(tokenString, APP_SECRET) as Token;
        if (!verifiedToken.userId && !verifiedToken.adminId)
            token = null;
        else token = verifiedToken
    } catch (e) {
        token = null
    }
    return {
        ...ctx,
        prisma,
        pubsub,
        token,
    }
}

export const getModifierString = (token: Token | null) => {
    if (token?.userId) return `User ${token.userId}`;
    else if (token?.adminId) return `Admin ${token.adminId}`;
    else return "Unknown";
}

export const wait = (amount = 0) => new Promise(resolve => setTimeout(resolve, amount));



export const iamport = new Iamport({ apiKey: process.env.IAMPORT_API_KEY!, apiSecret: process.env.IAMPORT_API_SECRET! });

export const generateUserToken = async (prisma: PrismaClient, id: number) => {
    const purchaseInfo = await getPurchaseInfo(prisma, id);
    const purchaseInfos = await prisma.purchaseLog.findMany({ where: { userId: id, state: "ACTIVE", expiredAt: { gte: new Date() } } });
    const processedInfos = purchaseInfos.map(v => ({ ...v, planInfo: JSON.parse(v.planInfo) as PurchaseLogPlanInfoType }))
        .sort((a, b) => (b.planInfo.planLevel ?? 0) - (a.planInfo.planLevel ?? 0))
    const levelInfo = processedInfos.find(v => v.planInfo.planLevel);
    const privateClaim: Omit<Token, "iat" | "exp"> = {}
    privateClaim.userId = id;
    privateClaim.level = { exp: Math.floor(purchaseInfo.levelExpiredAt.getTime() / 1000), level: purchaseInfo.level }
    privateClaim.additionalPerm = purchaseInfo.additionalInfo.map(v => ({ exp: Math.floor(v.expiredAt.getTime() / 1000), type: v.type }));
    return sign(
        privateClaim,
        APP_SECRET,
        {
            expiresIn: tokens.access.expiry,
        }
    )
}

export const decrypt = (encryptedString: string, key: string) => {
    const decryptKey = Buffer.from(shake256(key, 192), "hex").toString("base64");
    const code = CryptoJS.AES.decrypt(encryptedString, decryptKey).toString(CryptoJS.enc.Utf8);
    return code;
}




const printStringWithParticle = (targetString: string) => targetString === "" ? "" : (targetString.charCodeAt(targetString.length - 1) - 0xAC00) % 28 === 0 ? targetString + '를' : targetString + '을';

export function validateStringLength(ctx: Context, targetString: string | null | undefined, maxLength: number, description: string, allowEmptyString?: boolean): asserts targetString is string {
    if (!allowEmptyString && (!targetString || targetString.length === 0)) throw throwError(errors.etc(`${printStringWithParticle(description)} 입력하세요.`), ctx);
    if ((targetString?.length ?? 0) > maxLength) throw throwError(errors.etc(`${printStringWithParticle(description)} ${maxLength}자 이하로 입력하세요.`), ctx);
}