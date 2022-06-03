import { PrismaClient } from "@prisma/client";
import { objectType, nonNull ,list,enumType} from "nexus";
import { NexusGenAllTypes } from '../../typegen';
import { throwError } from "../utils/error";
import { PurchaseLogPlanInfoType } from '../purchase';

export const getPurchaseInfo = async (prisma: PrismaClient, userId: number): Promise<NexusGenAllTypes["UserPurchaseInfo"]> => {
  if (!userId) return { level: 0, levelExpiredAt: new Date(9990, 11, 31), additionalInfo: [] };
  const purchaseInfos = await prisma.purchaseLog.findMany({ where: { user_id : userId, state: "ACTIVE", expired_at: { gte: new Date() } } });
  const processedInfos = purchaseInfos.map(v => ({ ...v, planInfo: JSON.parse(v.plan_info) as PurchaseLogPlanInfoType }))
      .sort((a, b) => (b.planInfo.plan_level ?? 0) - (a.planInfo.plan_level ?? 0));
  
      
  const additionalInfo: NexusGenAllTypes["UserPurchaseAdditionalInfo"][] = [];
  const imageTranslate = processedInfos.find(v => v.planInfo.external_feature_variable_id === 'IMAGE_TRANSLATE');
  const stock = processedInfos.find(v => v.planInfo.external_feature_variable_id === 'STOCK');
  if (imageTranslate) {
      additionalInfo.push({ type: "IMAGE_TRANSLATE", expiredAt: imageTranslate.expired_at });
  }
  if (stock) {
      additionalInfo.push({ type: "STOCK", expiredAt: stock.expired_at });
  }
  //결제 플랜 계산
  const levelInfo = processedInfos.find(v => v.planInfo.plan_level);
  if (!levelInfo) return { level: 0, levelExpiredAt: new Date(9990, 11, 31), additionalInfo };
  return { level: levelInfo.planInfo.plan_level!, levelExpiredAt: levelInfo.expired_at, additionalInfo };
}

export const t_User = objectType({
  name: "User",
  definition(t) {
    t.model.token();
    t.model.created_token();
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
    t.model.created_token();
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
    t.nonNull.field("purchaseInfo", {
        type: nonNull("UserPurchaseInfo"),
        resolve: async (src, args, ctx, info) => {
            try {
                return getPurchaseInfo(ctx.prisma, src.id);
            } catch (e) {
                return throwError(e, ctx);
            }
        }
    })
    t.nonNull.int("productCount", {
        resolve: async (src, args, ctx, info) => {
            try {
                return ctx.prisma.product.count({ where: { user_id: src.id } })
            } catch (e) {
                return throwError(e, ctx);
            }
        }
    })
  },
});

export const enum_UserPurchaseAdditionalInfoEnum = enumType({
  name: "UserPurchaseAdditionalInfoEnumType",
  members: ["IMAGE_TRANSLATE", "STOCK"]
})


export const t_UserPurchaseAdditionalInfo = objectType({
  name: "UserPurchaseAdditionalInfo",
  definition(t) {
      t.nonNull.field("type", { type: 'UserPurchaseAdditionalInfoEnumType' });
      t.nonNull.date("expiredAt");
  }
});


export const t_UserPurchaseInfo = objectType({
  name: "UserPurchaseInfo",
  definition(t) {
      t.nonNull.int("level");
      t.nonNull.date("levelExpiredAt");
      t.nonNull.list.nonNull.field("additionalInfo", {
          type: "UserPurchaseAdditionalInfo"
      });
  }
});


// export const t_UserPurchaseInfo = objectType({
//   name: "UserPurchaseInfo",
//   definition(t) {
//       t.nonNull.int("level");
//       t.nonNull.date("levelExpiredAt");
//       t.nonNull.list.nonNull.field("additionalInfo", {
//           type: "UserPurchaseAdditionalInfo"
//       });
//   }
// });


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
    t.model.product_collect_count();
    t.model.max_product_limit();
    t.model.additional_shipping_fee_jeju();
    t.model.as_tel();
    t.model.as_information();
    t.model.refund_shipping_fee();
    t.model.exchange_shipping_fee();
    t.model.naver_origin_code();
    t.model.naver_origin();
    t.model.naver_store_url();
    t.model.naver_store_only();
    t.model.naver_fee();
    t.model.coupang_outbound_shipping_time_day();
    t.model.coupang_union_delivery_type();
    t.model.coupang_maximum_buy_for_person();
    t.model.coupang_login_id();
    t.model.coupang_vendor_id();
    t.model.coupang_access_key();
    t.model.coupang_secret_key();
    t.model.coupang_image_opt();
    t.model.coupang_fee();
    t.model.coupang_default_outbound();
    t.model.coupang_default_inbound();
    t.model.street_api_key();
    t.model.street_seller_type();
    t.model.street_fee();
    t.model.street_default_outbound();
    t.model.street_default_inbound();
    t.model.street_normal_api_key();
    t.model.street_normal_outbound();
    t.model.street_normal_inbound();
    t.model.street_normal_fee();
    t.model.interpark_cert_key();
    t.model.interpark_secret_key();
    t.model.interpark_fee();
    t.model.esmplus_master_id();
    t.model.esmplus_auction_id();
    t.model.esmplus_gmarket_id();
    t.model.gmarket_fee();
    t.model.auction_fee();
    t.model.lotteon_vendor_id();
    t.model.lotteon_api_key();
    t.model.lotteon_fee();
    t.model.lotteon_normal_fee();
    t.model.wemakeprice_id();
    t.model.wemakeprice_fee();
    t.model.tmon_id();
    t.model.tmon_fee();
    t.model.option_align_top();
    t.model.option_twoways();
    t.model.option_index_type();
    t.model.discount_amount();
    t.model.discount_unit_type();
    t.model.description_show_title();
    t.model.collect_timeout();
    t.model.collect_stock();
    t.model.margin_unit_type();
    t.model.extra_shipping_fee();
    t.model.user();
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
