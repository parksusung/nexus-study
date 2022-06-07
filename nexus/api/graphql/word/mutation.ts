// import { booleanArg, extendType, intArg, nonNull, stringArg } from "nexus";
// import { errors, throwError } from "../../utils/error";
// import Excel from "exceljs";

// export const mutation_word = extendType({
//     type: "Mutation",
//     definition(t) {
//         t.field("addWordByUser", {
//             type: nonNull("Boolean"),
//             args: {
//                 findWord: nonNull(stringArg()),
//                 replaceWord: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const userId = ctx.token!.userId!;
//                     const findWord = args.findWord.trim();
//                     const replaceWord = args.replaceWord?.trim() ?? null;
//                     const word = await ctx.prisma.wordTable.findUnique({ where: { UQ_word_table_word: { findWord, userId } } })
//                     if (word) {
//                         if (word.replaceWord !== null) { //치환 -> 금지어로 변경, 치환->치환 (덮어쓰기)
//                             await ctx.prisma.wordTable.update({ where: { id: word.id }, data: { replaceWord } });
//                             return true;
//                         }
//                         else if (word.replaceWord === null && replaceWord !== null) return throwError(errors.etc(`${findWord} : 이미 금지어로 등록된 단어입니다.`), ctx);
//                         return true;
//                     }
//                     await ctx.prisma.wordTable.create({
//                         data: { findWord: args.findWord, replaceWord: args.replaceWord, userId }
//                     });
//                     return true;
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         })
//         t.field("modifyWordByUser", {
//             type: nonNull("Boolean"),
//             args: {
//                 wordId: nonNull(intArg()),
//                 findWord: nonNull(stringArg()),
//                 replaceWord: stringArg(),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const userId = ctx.token!.userId!;
//                     const findWord = args.findWord.trim();
//                     const replaceWord = args.replaceWord?.trim() ?? null;
//                     const word = await ctx.prisma.wordTable.findUnique({
//                         where: { id: args.wordId },
//                     });
//                     const word2 = await ctx.prisma.wordTable.findUnique({
//                         where: { UQ_word_table_word: { findWord, userId } },
//                     });
//                     if (!word) return throwError(errors.noSuchData, ctx);
//                     if (word.userId !== userId) return throwError(errors.noSuchData, ctx);

//                     if (word2) { // 변경하고자 하는 동일 단어 있는경우
//                         return throwError(errors.etc(`${findWord} : 이미 ${word2.replaceWord === null ? "금지어" : "치환단어"}로 등록된 단어입니다.`), ctx);
//                     }
//                     if (word.replaceWord === null) { // 금지어 우선
//                         return true;
//                     }
//                     else {
//                         await ctx.prisma.wordTable.update({ where: { id: word.id }, data: { replaceWord } });
//                         return true;
//                     }
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         })
//         t.field("deleteWordByUser", {
//             type: nonNull("Boolean"),
//             args: {
//                 wordId: nonNull(intArg()),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const word = await ctx.prisma.wordTable.findUnique({
//                         where: { id: args.wordId },
//                     });
//                     if (!word) return throwError(errors.noSuchData, ctx);
//                     if (word.userId !== ctx.token?.userId) return throwError(errors.noSuchData, ctx);
//                     await ctx.prisma.wordTable.delete({
//                         where: { id: args.wordId },
//                     });
//                     return true;
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         })
//         t.field("addWordByExcelByUser", {
//             type: nonNull("Boolean"),
//             args: {
//                 data: nonNull("Upload"),
//                 isReplace: nonNull(booleanArg()),
//             },
//             resolve: async (src, args, ctx, info) => {
//                 try {
//                     const userId = ctx.token!.userId!;
//                     const file = await args.data;
//                     if (!file.mimetype.includes("spreadsheet")) return throwError(errors.etc("엑셀 형식의 파일이 아닙니다."), ctx);
//                     const workbook = new Excel.Workbook();
//                     await workbook.xlsx.read(file.createReadStream());
//                     const worksheet = workbook.worksheets[0];
//                     const data: [string, string | null][] = [];
//                     try {
//                         worksheet.eachRow((r, i) => {
//                             if (i === 1) return;
//                             let findWord = r.getCell(1).text.trim();
//                             let replaceWord = r.getCell(2).text.trim() === "" ? " " : r.getCell(2).text.trim();
//                             data.push([findWord, args.isReplace ? replaceWord : null]);
//                         });
//                     }
//                     catch (e) {
//                         throw e;
//                     }
//                     await Promise.all(data.map(async ([findWord, replaceWord]) => {
//                         const word = await ctx.prisma.wordTable.findUnique({ where: { UQ_word_table_word: { userId, findWord } } });
//                         if (!word) {
//                             try {
//                                 await ctx.prisma.wordTable.create({ data: { findWord, replaceWord, userId } });
//                             } catch {
//                                 return;
//                             }

//                             return;
//                         }
//                         if (word.replaceWord === null) return;
//                         await ctx.prisma.wordTable.update({ where: { id: word.id }, data: { replaceWord } });
//                     }))
//                     return true;
//                 } catch (e) {
//                     return throwError(e, ctx);
//                 }
//             }
//         })
//     }
// });