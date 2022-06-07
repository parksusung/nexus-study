import { extendType, nonNull } from "nexus";
import { throwError } from "../utils/error";

export const query_user = extendType({
    type: "Query",
    definition(t) {
        t.field("selectMyInfoByUser", {
            type: nonNull("User"),
            resolve: async (src, args, ctx, info) => {
                try {
                    // console.log("test",ctx.token);
                    const test =   await ctx.prisma.user.findUnique({ where: { id: ctx.token!.userId! } })
                    console.log("selectMyInfoByUser",test);
                    return (test)!;//front에서 access Token 보내도록 (수성 )
                    
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
        t.crud.users({
            alias: "selectUsersByAdmin",
            filtering: true,
            ordering: true,
            pagination: true,
        })
        t.field("selectUsersCountByAdmin", {
            type: nonNull("Int"),
            args: {
                where: "UserWhereInput"
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    return ctx.prisma.user.count({ where: args.where as any });
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});