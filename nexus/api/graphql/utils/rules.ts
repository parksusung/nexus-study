import { ApolloError } from 'apollo-server-express'
import { isBefore } from 'date-fns'
import { shield, rule, or, deny } from 'graphql-shield'
import fetch from 'node-fetch'
import { NexusGenAllTypes } from '../../typegen'
import { Context } from '../../types'
import { isDev } from './constants'
import { getDebugInfo, throwError } from './error'
import { errors } from './error'

type IAdditionalInfo = NexusGenAllTypes["UserPurchaseAdditionalInfoEnumType"];

export const rules = {
    isAuthenticatedUser: (level: number, additionalInfoName?: IAdditionalInfo) => rule({ cache: 'contextual' })(
        async (_parent: any, _args: any, ctx: Context) => {
            try {
                if (ctx.token === null) {
                    return false;
                }
                if (ctx.token.isRefresh) return false;
                if (!ctx.token.userId) return false;
                if (level > 0) {
                    if (!ctx.token.level) throw errors.higherLevelRequired;
                    if (isBefore(new Date(ctx.token.level.exp * 1000), new Date())) throw errors.higherLevelRequired;
                    if (ctx.token.level.level < level) throw errors.higherLevelRequired;
                }
                else if (additionalInfoName) {
                    const d = ctx.token.additionalPerm?.find(v => v.type === additionalInfoName);
                    if (!d) return throwError(errors.additionalPermissionRequired, ctx);
                    if (isBefore(new Date(d.exp * 1000), new Date())) throw errors.additionalPermissionRequired;
                }
                return true
            } catch (e) {
                throw e
            }
        }
    ),
    isAuthenticatedAdmin: rule({ cache: 'contextual' })(
        async (_parent: any, _args: any, ctx: Context) => {
            try {
                if (ctx.token === null) {
                    return false;
                }
                if (ctx.token.isRefresh) return false;
                if (!ctx.token.adminId) return false;
                return true
            } catch (e) {
                throw e
            }
        }
    ),
    isAuthenticatedSomeone: rule({ cache: 'contextual' })(
        async (_parent: any, _args: any, ctx: Context) => {
            try {
                if (ctx.token === null) {
                    return false;
                }
                if (ctx.token.isRefresh) return false;
                let user = ctx.token.userId;
                let admin = ctx.token.adminId;
                if (!user && !admin) return false;
                return true
            } catch (e) {
                throw e
            }
        }
    ),
}

export const permissions = shield({
    Query: {
        selectMyShopDataByUser: rules.isAuthenticatedUser(0),
        selectMySetDataByUser: rules.isAuthenticatedUser(0),
        selectMyInfoByUser: rules.isAuthenticatedUser(0),
        getUserSetObjectByUser: rules.isAuthenticatedUser(0),
        // refreshPurchaseStateForUser: rules.isAuthenticatedUser(0),

        // 1단계
        selectMyProductByUser: rules.isAuthenticatedUser(1),
        selectMyProductsCountByUser: rules.isAuthenticatedUser(1),
        getRegisterProductsDataByUser: rules.isAuthenticatedUser(1),

        // 2단계
        selectOrdersByUser: rules.isAuthenticatedUser(2),

        selectCategoriesBySomeone: rules.isAuthenticatedSomeone,
        selectSiilInfoBySomeone: rules.isAuthenticatedSomeone,
        translateText: rules.isAuthenticatedSomeone,
        getExcelSampleUrlBySomeone: rules.isAuthenticatedSomeone,
        selectWordTablesBySomeone: rules.isAuthenticatedSomeone,
        selectUserQuestionBySomeone: rules.isAuthenticatedSomeone,
        selectProductsCountBySomeone: rules.isAuthenticatedSomeone,
        selectProductsBySomeone: rules.isAuthenticatedSomeone,

        selectProductsByAdmin: rules.isAuthenticatedAdmin,
        selectTaobaoProductsByAdmin: rules.isAuthenticatedAdmin,
        selectShopDataByAdmin: rules.isAuthenticatedAdmin,
        selectSetDataByAdmin: rules.isAuthenticatedAdmin,
        selectProductsCountByAdmin: rules.isAuthenticatedAdmin,
        selectTaobaoProductsCountByAdmin: rules.isAuthenticatedAdmin,
        selectShopDataCountByAdmin: rules.isAuthenticatedAdmin,
        selectSetDataCountByAdmin: rules.isAuthenticatedAdmin,
        selectUsersByAdmin: rules.isAuthenticatedAdmin,
        selectUsersCountByAdmin: rules.isAuthenticatedAdmin,
        // selectRemainingTaobaoOrderQueueCountByAdmin: rules.isAuthenticatedAdmin,
        // selectTaobaoOrderQueuesByAdmin: rules.isAuthenticatedAdmin,

    },
    Mutation: {
        connectSocialIdByUser: rules.isAuthenticatedUser(0),
        createShopDataByUser: rules.isAuthenticatedUser(0),
        updateShopDataByUser: rules.isAuthenticatedUser(0),
        updateMyDataByUser: rules.isAuthenticatedUser(0),
        changePasswordByUser: rules.isAuthenticatedUser(0),
        addSetDataByUser: rules.isAuthenticatedUser(0),
        updatePhoneByUser: rules.isAuthenticatedUser(0),
        purchasePlanByUser: rules.isAuthenticatedUser(0),
        cancelPurchasePlanByUser: rules.isAuthenticatedUser(0),
        withdrawByUser: rules.isAuthenticatedUser(0),
        addWordByUser: rules.isAuthenticatedUser(0),
        modifyWordByUser: rules.isAuthenticatedUser(0),
        deleteWordByUser: rules.isAuthenticatedUser(0),
        addWordByExcelByUser: rules.isAuthenticatedUser(0),
        createUserQuestionByUser: rules.isAuthenticatedUser(0),

        // 1단계
        getTaobaoItemsByUser: rules.isAuthenticatedUser(1),
        getTaobaoItemUsingNumIidsByUser: rules.isAuthenticatedUser(1),
        getTaobaoItemUsingExcelFileByUser: rules.isAuthenticatedUser(1),
        getTaobaoItemUsingExtensionByUser: rules.isAuthenticatedUser(1),
        updateManyProductSiilInfoByUser: rules.isAuthenticatedUser(1),
        updateManyProductCategoryByUser: rules.isAuthenticatedUser(1),
        updateProductByUser: rules.isAuthenticatedUser(1),
        updateProductNameByUser: rules.isAuthenticatedUser(1),
        registerProductByUser: rules.isAuthenticatedUser(1),
        translateProductTextByUser: rules.isAuthenticatedUser(1),
        translateProductsTextByUser: rules.isAuthenticatedUser(1),
        endProductSellStateByUser: rules.isAuthenticatedUser(1),

        // 2단계
        scrapOrderByUser: rules.isAuthenticatedUser(2),
        changeOrderStateByUser: rules.isAuthenticatedUser(2),


        // 이미지 번역
        updateProductImageBySomeone: or(rules.isAuthenticatedUser(0, "IMAGE_TRANSLATE"), rules.isAuthenticatedAdmin),


        updateCnyRateByAdmin: rules.isAuthenticatedAdmin,
        updateTaobaoRefreshDayByAdmin: rules.isAuthenticatedAdmin,
        updateCategoryStoreDataByAdmin: rules.isAuthenticatedAdmin,
        signUpAdminByAdmin: rules.isAuthenticatedAdmin,
        changeMyPasswordByAdmin: rules.isAuthenticatedAdmin,
        createNoticeByAdmin: rules.isAuthenticatedAdmin,
        updateNoticeByAdmin: rules.isAuthenticatedAdmin,
        deleteNoticeByAdmin: rules.isAuthenticatedAdmin,
        createFaqCategoryByAdmin: rules.isAuthenticatedAdmin,
        modifyFaqCategoryByAdmin: rules.isAuthenticatedAdmin,
        sortFaqCategoryByAdmin: rules.isAuthenticatedAdmin,
        deleteFaqCategoryByAdmin: rules.isAuthenticatedAdmin,
        createFaqByAdmin: rules.isAuthenticatedAdmin,
        updateFaqByAdmin: rules.isAuthenticatedAdmin,
        deleteFaqByAdmin: rules.isAuthenticatedAdmin,
        updateUserQuestionByAdmin: rules.isAuthenticatedAdmin,
        setPurchaseInfoByAdmin: rules.isAuthenticatedAdmin,
        invalidatePurchaseInfoByAdmin: rules.isAuthenticatedAdmin,
        getTaobaoItemsByAdmin: rules.isAuthenticatedAdmin,
        getTaobaoItemUsingNumIidsByAdmin: rules.isAuthenticatedAdmin,
        getTaobaoItemUsingExcelFileByAdmin: rules.isAuthenticatedAdmin,
        updateProductByAdmin: rules.isAuthenticatedAdmin,
        updateProductNameByAdmin: rules.isAuthenticatedAdmin,
        updateManyProductCategoryByAdmin: rules.isAuthenticatedAdmin,
        updateManyProductSiilInfoByAdmin: rules.isAuthenticatedAdmin,
        deleteProductByAdmin: rules.isAuthenticatedAdmin,
        updateProductPriceByAdmin: rules.isAuthenticatedAdmin,
        endProductSellStateByAdmin: rules.isAuthenticatedAdmin,
        registerProductsByAdmin: rules.isAuthenticatedAdmin,
        transferProductsToUserByAdmin: rules.isAuthenticatedAdmin,
        setMaxProductLimitByAdmin: rules.isAuthenticatedAdmin,
    },
    Subscription: {
        subscribeUserEvent: rules.isAuthenticatedUser(0),

        subscribeTaobaoOrderQueueEventByAdmin: rules.isAuthenticatedAdmin,
    }
}, {
    fallbackError: async (thrownThing: null, parent: undefined, args: any, context: unknown, info: any) => {
        const ctx = context as unknown as Context;
        if (thrownThing instanceof ApolloError) {
            console.log(thrownThing);
            return thrownThing
        } else if (thrownThing instanceof Error) {
            console.error(thrownThing, getDebugInfo(ctx))
            return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
        } else {
            if ((thrownThing !== null || parent !== undefined) && ctx.token !== null) {
                console.warn('The resolver threw something that is not an error.')
                console.warn(thrownThing, parent, args, getDebugInfo(ctx))
            }
            return errors.notAuthenticated;
        }
    },
    allowExternalErrors: isDev(),
    debug: isDev(),
})
