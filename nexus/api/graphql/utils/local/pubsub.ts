import { PrismaClient, UserLog } from "@prisma/client";
import { RedisPubSub } from "graphql-redis-subscriptions";
import { UserLogPayload } from "../../../graphql";
import { Context } from "../../../types";

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
            user_id: ctx.token!.userId!,
            title: payload.title,
            payload_data: JSON.stringify(payload)
        }
    }) : {
        user_id: ctx.token!.userId!,
        title: payload.title,
        payload_data: JSON.stringify(payload),
        created_at: new Date(),
        id: -1,
        is_read: false
    }
    await ctx.pubsub.publish<UserLog>(`user_${ctx.token!.userId!}`, log);
}