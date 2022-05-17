import { arg, decorateType, extendType, nonNull, objectType } from 'nexus'
import { GraphQLUpload } from 'graphql-upload'

export * from './user'




// export const Upload = decorateType(GraphQLUpload, {
//     sourceType: "FileUpload",
//     asNexusMethod: "upload",
// });
// // export const DateTime = decorateType(DateTimeResolver, {
// //     sourceType: "Date",
// //     asNexusMethod: "date",
// // });

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

// export const t_token = objectType({
//     name: "SignInType",
//     definition(t) {
//         t.nonNull.string("accessToken");
//         t.nonNull.string("refreshToken");
//     }
// })