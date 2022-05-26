// import { extendType, intArg, list, nonNull, stringArg } from "nexus";
// import { errors, throwError } from "../utils/error";

// export const query_category = extendType({
//     type: "Query",
//     definition(t) {
//         t.crud.categories({
//             alias: "selectCategoriesBySomeone",
//             filtering: true,
//             ordering: true,
//             pagination: true,
//         });

//         t.field("searchCategoriesByA077Code", {
//             type: nonNull(list(nonNull("Category"))),
//             args: {
//                 a077Code: nonNull(list(nonNull(stringArg()))),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const a = await ctx.prisma.category.findMany({
//                         where: {
//                             a077Code: {
//                                 in: args.a077Code
//                             }
//                         },
//                         orderBy: { id: "asc" }
//                     });
                    
//                     return a;
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoriesBySomeone", {
//             type: nonNull(list(nonNull("Category"))),
//             args: {
//                 keyword: nonNull(stringArg()),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const a = await ctx.prisma.category.findMany({
//                         where: {
//                             OR: [
//                                 { c1Name: { contains: args.keyword } },
//                                 { c2Name: { contains: args.keyword } },
//                                 { c3Name: { contains: args.keyword } },
//                                 { c4Name: { contains: args.keyword } },
//                             ]
//                         },
//                         orderBy: { id: "asc" }
//                     });
//                     return a;
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA077BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA077.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA077.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoB378BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoB378.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoB378.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA112BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA112.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA112.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA027BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA027.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA027.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA001BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA001.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA001.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA006BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA006.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA006.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoB719BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoB719.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoB719.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA113BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA113.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA113.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA524BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA524.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA524.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoA525BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoA525.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoA525.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("searchCategoryInfoB956BySomeone", {
//             type: nonNull(list(nonNull("CategoryInformationType"))),
//             args: {
//                 code: stringArg(),
//                 keyword: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     let result: any = [];

//                     if (args.code) {
//                         result = await ctx.prisma.categoryInfoB956.findMany({
//                             where: {
//                                 code: { contains: args.code }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (args.keyword) {
//                         result = await ctx.prisma.categoryInfoB956.findMany({
//                             where: {
//                                 name: { contains: args.keyword }
//                             },
//                             orderBy: { name: "asc" }
//                         });
//                     }

//                     if (result.length > 0) {
//                         return result;
//                     } else {
//                         return throwError(errors.etc("카테고리를 찾을 수 없습니다."), ctx);
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });

//         t.field("selectCategoriesByHierarchicalBySomeone", {
//             type: nonNull(list(nonNull("CategorySelectType"))),
//             args: {
//                 code: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const splitedCode = args.code?.split("_");
//                     if (splitedCode?.length === 4) return [];
//                     const byCondition = "c" + ((splitedCode?.length ?? 0) + 1) as "c1" | "c2" | "c3" | "c4";
//                     const byConditionName = "c" + ((splitedCode?.length ?? 0) + 1) + "Name" as "c1Name" | "c2Name" | "c3Name" | "c4Name";
//                     const a = await ctx.prisma.category.groupBy({
//                         by: [byCondition, byConditionName], _count: { _all: true }, where: {
//                             c1: splitedCode ? splitedCode[0] : "",
//                             c2: splitedCode ? splitedCode[1] : "",
//                             c3: splitedCode ? splitedCode[2] : "",
//                             c4: splitedCode ? splitedCode[3] : "",
//                         }
//                     });
//                     const result = await Promise.all(a.map(async v => {
//                         if (v._count._all === 1) {
//                             const currentCode = [...(splitedCode ?? []), v[byCondition]]
//                             const category = await ctx.prisma.category.findFirst({
//                                 where: {
//                                     c1: currentCode ? currentCode[0] : "",
//                                     c2: currentCode ? currentCode[1] : "",
//                                     c3: currentCode ? currentCode[2] : "",
//                                     c4: currentCode ? currentCode[3] : "",
//                                 }
//                             })
//                             return { code: category!.code, name: category![byConditionName] }
//                         }
//                         return {
//                             code: (args.code ?? "") + (args.code ? "_" : "") + v[byCondition],
//                             name: v[byConditionName],
//                         }
//                     }));
//                     return Array.from(new Set(result));
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         });
//     }
// });