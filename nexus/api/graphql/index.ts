import { arg, decorateType, extendType, nonNull, objectType } from 'nexus'
import { GraphQLUpload } from 'graphql-upload'
import { DateTimeResolver } from 'graphql-scalars'
import { isDev } from './utils/constants'
import { getModifierString } from './utils/helpers'
import { throwError } from './utils/error'

export * from './user'
export * from './admin'
export * from './product'
export * from './purchase'
export * from './category'
export * from './taobao_product'


export * from './auth'
export * from './enum'
export * from './external_api'

export const t_token = objectType({
    name: "SignInType",
    definition(t) {
        t.nonNull.string("accessToken");
        t.nonNull.string("refreshToken");
    }
})


export const query_etc = extendType({
    type: "Query",
    definition(t) {
        t.field("whoami", {
            type: "String",
            resolve: async (src, args, ctx, info) => {
                try {
                    // if (!isDev()) return throwError(errors.notAuthenticated, ctx);
                    if (isDev()) return getModifierString(ctx.token);
                    if (ctx.token?.userId) return `User`;
                    else if (ctx.token?.adminId) return `Admin`;
                    else return "Unknown";
                } catch (error) {
                    return throwError(error, ctx);
                }
            }
        });
    }
});


export const Upload = decorateType(GraphQLUpload, {
    sourceType: "FileUpload",
    asNexusMethod: "upload",
});
export const DateTime = decorateType(DateTimeResolver, {
    sourceType: "Date",
    asNexusMethod: "date",
});
