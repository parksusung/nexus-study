import { arg, decorateType, extendType, nonNull, objectType } from 'nexus'
import { GraphQLUpload } from 'graphql-upload'
import { DateTimeResolver } from 'graphql-scalars'
import { enumType } from 'nexus'

export * from './user'
export * from './admin'
export * from './product'


export * from './auth'

export const t_token = objectType({
    name: "SignInType",
    definition(t) {
        t.nonNull.string("accessToken");
        t.nonNull.string("refreshToken");
    }
})

export const Upload = decorateType(GraphQLUpload, {
    sourceType: "FileUpload",
    asNexusMethod: "upload",
});
export const DateTime = decorateType(DateTimeResolver, {
    sourceType: "Date",
    asNexusMethod: "date",
});

export enum ProductStoreStateEnum {

       /**
     * 상품 업로드 요청
     */
        REGISTER_REQUESTED = 1,

        /**
         * 판매중
         */
        ON_SELL = 2,
    
        /**
         * 상품 업로드 실패
         */
        REGISTER_FAILED = 3
};


export const t_social = enumType({
    name: "UserSocialType",
    members: ["EMAIL", "KAKAO", "NAVER"]
});

export const t_admin_social = enumType({
    name: "UserLoginType",
    members: ["ADMIN", "EMAIL", "KAKAO", "NAVER"]
});

export const t_taobao_item_orderby = enumType({
    name: "TaobaoItemOrderBy",
    members: [{
        name: "SALE",
        value: "_sale",
        description: "판매량순"
    }, {
        name: "CREDIT",
        value: "_credit",
        description: "판매자 신용 순"
    },]
});

// export const query_etc = extendType({
//     type: "Query",
//     definition(t) {
//         t.field("whoami", {
//             type: "String",
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                  //   if (isDev()) return getModifierString(ctx.token);

//                     if (ctx.token?.userId) return `User`;
//                     else if (ctx.token?.adminId) return `Admin`;
//                     else return "Unknown";
//                 } catch (error) {
//                     return throwError(error, ctx);
//                 }
//             }
//         });
//     }
// });
