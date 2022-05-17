import { PrismaClient, UserLog } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { UserLogPayload } from "../../graphql";
import { Context } from "../../types";

interface IPublishUserLogDataContext {
    prisma: PrismaClient
    pubsub: RedisPubSub
    token: {
        userId?: number
    } | null
}
export const publishUserLogData = async (ctx: IPublishUserLogDataContext, payload: UserLogPayload, isNeedLogging: boolean = true) => {
    const log: UserLog = isNeedLogging ? await ctx.prisma.userLog.create({
        data: {
            userId: ctx.token!.userId!,
            title: payload.title,
            payloadData: JSON.stringify(payload)
        }
    }) : {
        userId: ctx.token!.userId!,
        title: payload.title,
        payloadData: JSON.stringify(payload),
        createdAt: new Date(),
        id: -1,
        isRead: false
    }
    await ctx.pubsub.publish<UserLog>(`user_${ctx.token!.userId!}`, log);
}