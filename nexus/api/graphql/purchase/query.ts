import deepmerge from "deepmerge";
import { extendType, nonNull, stringArg } from "nexus";
import { errors, throwError } from "../utils/error";
import { generateToken, generateUserToken } from "../utils/helpers";

export const query_purchase = extendType({
    type: "Query",
    definition(t) {
        t.crud.planInfos({
            alias: "selectPlanInfosForEveryone",
            filtering: true,
            ordering: true,
            pagination: true,
            resolve: async (src, args, ctx, info, ori) => {
                try {
                    if (!ctx.token || ctx.token.userId) {
                        args.where = deepmerge<typeof args.where>(args.where, { is_active: { equals: true } });
                    }
                    return ori(src, args, ctx, info);
                } catch (e) {
                    return throwError(e, ctx);
                }
            }
        });
    }
});