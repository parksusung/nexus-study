import { PrismaClient } from "@prisma/client";
import { objectType, nonNull ,list} from "nexus";

export const t_User = objectType({
  name: "User",
  definition(t) {
    t.model.id();
    t.model.email();
    t.field("password", {
      type: "String",
      resolve: () => "",
    });
    t.model.state();
    t.model.naver_id();
    t.model.kakao_id();
    t.model.created_at();
    t.model.product({
      filtering: true,
      ordering: true,
      pagination: true,
    });
    t.model.user_info();
    t.model.user_log({
      filtering: true,
      ordering: true,
      pagination: true,
    });
    // t.nonNull.field("purchaseInfo", {
    //     type: nonNull("UserPurchaseInfo"),
    //     resolve: async (src, args, ctx, info) => {
    //         try {
    //             return getPurchaseInfo(ctx.prisma, src.id);
    //         } catch (e) {
    //             return throwError(e, ctx);
    //         }
    //     }
    // })
    // t.nonNull.int("productCount", {
    //     resolve: async (src, args, ctx, info) => {
    //         try {
    //             return ctx.prisma.product.count({ where: { userId: src.id } })
    //         } catch (e) {
    //             return throwError(e, ctx);
    //         }
    //     }
    // })
  },
});

export const t_UserInfo = objectType({
  name: "UserInfo",
  definition(t) {
    t.model.user_id();
    t.model.phone();
    t.model.margin_rate();
    t.model.default_shipping_fee();
    t.model.fix_image_top();
    t.model.fix_image_bottom();
    t.model.cny_rate();
    t.model.user();
    t.model.product_collect_count();
    t.model.max_product_limit();
    t.model.as_tel();
    t.model.as_information();
    t.model.refund_shipping_fee();
    t.model.exchange_shipping_fee();
  },
});

// export const t_UserCompanyInfo = objectType({
//     name: "UserCompanyInfo",
//     definition(t) {
//         t.model.userId();
//         t.model.name();
//         t.model.code();
//         t.model.ownerName();
//         t.model.user();
//     }
// });

export const t_AccountInfo = objectType({
  name: "AccountInfo",
  definition(t) {
    t.nonNull.string("bankName");
    t.nonNull.string("accountHolder");
    t.nonNull.string("accountNumber");
  },
});

export interface UserLogPayload {
  type: "scrapOrder" | "registerProduct" | "getTaobaoItem" | "purchaseRenewed" | "updateProductImage";
  title: string;
  // 아래부터는 optional

  /**
   * type이 "purchaseRenewed"인 경우에는 필수로 들어감
   *
   * @author Kuhave
   * @memberof UserLogPayload
   */
  renewedAccessToken?: string;
}

export const t_UserLog = objectType({
  name: "UserLog",
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.title();
    t.model.payload_data();
    t.model.is_read();
    t.model.created_at();
    t.model.user();
  },
});
