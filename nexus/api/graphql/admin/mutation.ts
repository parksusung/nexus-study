import { hashSync, compareSync } from "bcryptjs";
import { arg, extendType, nonNull, stringArg } from "nexus";
import { regexPattern } from "../utils/constants";
import { errors, throwError } from "../utils/error";
import { generateToken } from "../utils/helpers";

export const mutation_admin = extendType({
    type: "Mutation",
    definition(t) {
        t.field("signUpAdminByAdmin", {
            type: nonNull("Boolean"),
            args: {
                id: nonNull(stringArg()),
                password: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    if (await ctx.prisma.admin.findUnique({ where: { login_id: args.id } })) return throwError(errors.etc("해당 이메일이 이미 존재합니다."), ctx);
                    const admin = await ctx.prisma.admin.create({ data: { login_id: args.id, password: hashSync(args.password), state: "ACTIVE", } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
        // t.field("signInAdminByEveryone", {
        //     type: nonNull("SignInType"),
        //     args: {
        //         id: nonNull(stringArg()),
        //         password: nonNull(stringArg({ description: "소셜의 경우 그냥 빈 문자열" })),
        //     },
        //     resolve: async (src, args, ctx, info) => {
        //         try {
        //             const admin = await ctx.prisma.admin.findUnique({ where: { login_id: args.id } });
        //             if (!admin) return throwError(errors.invalidUser, ctx);
        //             if (!compareSync(args.password, admin.password)) return throwError(errors.invalidUser, ctx);
        //             return { accessToken: generateToken(admin.id, "adminId", false), refreshToken: generateToken(admin.id, "adminId", true) };
        //         } catch (e) {
        //             return throwError(e, ctx);
        //         }
        //     }
        // });
        t.field("changeMyPasswordByAdmin", {
            type: nonNull("Boolean"),
            args: {
                currentPassword: nonNull(stringArg()),
                newPassword: nonNull(stringArg()),
            },
            resolve: async (src, args, ctx, info) => {
                try {
                    const admin = await ctx.prisma.admin.findUnique({ where: { id: ctx.token!.adminId! } });
                    if (!admin) return throwError(errors.noSuchData, ctx);
                    if (!compareSync(args.currentPassword, admin.password)) return throwError(errors.etc("현재 비밀번호가 다릅니다."), ctx);
                    const password = hashSync(args.newPassword);
                    await ctx.prisma.admin.update({ where: { id: ctx.token!.adminId! }, data: { password } });
                    return true;
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        })
    }
});