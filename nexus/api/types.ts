import { PrismaClient, User } from '@prisma/client'
import { PubSub } from 'graphql-subscriptions'
import { S3 } from 'aws-sdk'
import { Request, Response } from 'express'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { IncomingMessage } from 'http'
import { closestIndexTo } from 'date-fns'

export { FileUpload } from "graphql-upload";

export interface Context {
    prisma: PrismaClient
    req: Request
    res: Response
    pubsub: RedisPubSub
    token: Token | null
}

export interface SocketContext {
    prisma: PrismaClient
    req: IncomingMessage
    pubsub: PubSub
}

interface PermissionLevelInfo {
    level: number;
    exp: number;
}
interface PermissionAdditionalInfo {
    type: 'IMAGE_TRANSLATE' | 'STOCK';
    exp: number;
}
//Token 인증시 return해서 받아올 값 정의 ,, 즉 Token생성시 payload값들 
export interface Token {
    userId?: number;
    adminId?: number;
    isRefresh?: boolean;
    level?: PermissionLevelInfo;
    additionalPerm?: PermissionAdditionalInfo[];
    iat: number;
    exp: number;
    type? : string;
    //aud: string;
}


type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
