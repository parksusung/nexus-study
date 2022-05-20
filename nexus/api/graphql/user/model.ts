import { PrismaClient } from "@prisma/client";
import { objectType, nonNull ,list,enumType} from "nexus";
import { NexusGenAllTypes } from '../../typegen';
import { throwError } from "../utils/error";
import { PurchaseLogPlanInfoType } from '../purchase';

export const getPurchaseInfo = async (prisma: PrismaClient, userId: number): Promise<NexusGenAllTypes["UserPurchaseInfo"]> => {
  if (!userId) return { level: 0, levelExpiredAt: new Date(9990, 11, 31), additionalInfo: [] };
  const purchaseInfos = await prisma.purchaseLog.findMany({ where: { user_id : userId, state: "ACTIVE", expired_at: { gte: new Date() } } });
  const processedInfos = purchaseInfos.map(v => ({ ...v, planInfo: JSON.parse(v.plan_info) as PurchaseLogPlanInfoType }))
      .sort((a, b) => (b.planInfo.planLevel ?? 0) - (a.planInfo.planLevel ?? 0));
  
      
  const additionalInfo: NexusGenAllTypes["UserPurchaseAdditionalInfo"][] = [];
  const imageTranslate = processedInfos.find(v => v.planInfo.externalFeatureVariableId === 'IMAGE_TRANSLATE');
  const stock = processedInfos.find(v => v.planInfo.externalFeatureVariableId === 'STOCK');
  if (imageTranslate) {
      additionalInfo.push({ type: "IMAGE_TRANSLATE", expiredAt: imageTranslate.expired_at });
  }
  if (stock) {
      additionalInfo.push({ type: "STOCK", expiredAt: stock.expired_at });
  }
  //결제 플랜 계산
  const levelInfo = processedInfos.find(v => v.planInfo.planLevel);
  if (!levelInfo) return { level: 0, levelExpiredAt: new Date(9990, 11, 31), additionalInfo };
  return { level: levelInfo.planInfo.planLevel!, levelExpiredAt: levelInfo.expired_at, additionalInfo };
}

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


// export const t_User = objectType({
//   name: "User",
//   definition(t) {
//       t.model.id();
//       t.model.email();
//       t.field("password", {
//           type: "String",
//           resolve: () => ""
//       })
//       t.model.state();
//       t.model.naver_id();
//       t.model.kakao_id();
//       t.model.created_at();
//       t.model.product({
//           filtering: true,
//           ordering: true,
//           pagination: true,
//       });
//       t.model.user_info();
//       t.model.user_log({
//           filtering: true,
//           ordering: true,
//           pagination: true,
//       });
//       t.nonNull.field("purchaseInfo", {
//           type: nonNull("UserPurchaseInfo"),
//           resolve: async (src, args, ctx, info) => {
//               try {
//                   return getPurchaseInfo(ctx.prisma, src.id);
//               } catch (e) {
//                   return throwError(e, ctx);
//               }
//           }
//       })
//       // t.nonNull.int("productCount", {
//       //     resolve: async (src, args, ctx, info) => {
//       //         try {
//       //             return ctx.prisma.product.count({ where: { userId: src.id } })
//       //         } catch (e) {
//       //             return throwError(e, ctx);
//       //         }
//       //     }
//       // })
//   }
// });

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
