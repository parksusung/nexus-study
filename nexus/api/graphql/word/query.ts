// import deepmerge from "deepmerge";
// import { extendType } from "nexus";
// import { errors, throwError } from "../utils/error";

// export const query_word = extendType({
//     type: "Query",
//     definition(t) {
//         t.crud.wordTables({
//             alias: "selectWordTablesBySomeone",
//             filtering: true,
//             ordering: true,
//             pagination: true,
//             resolve: async (src, args, ctx, info, ori) => {
//                 try {
//                     if (ctx.token?.userId) {
//                         args.where = deepmerge<typeof args.where>(args.where, { userId: { equals: ctx.token.userId } });
//                     }
//                     return ori(src, args, ctx, info);
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         })
//     }
// });