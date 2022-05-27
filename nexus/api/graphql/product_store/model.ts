import { objectType } from "nexus";
import { shopDataUrlInfo } from "../../playauto_api_type";
import { throwError } from "../utils/error";


export const t_ProductStore = objectType({
    name: "ProductStore",
    definition(t) {
        t.model.id();
        t.model.productId();
        t.model.userId();
        t.model.user();
        t.model.siteCode();
        t.model.state();
        t.model.productStoreState();
        t.model.storeProductId();
        t.model.product();
        t.model.productStoreLog({
            filtering: true,
            ordering: true,
            pagination: true,
        });
        t.model.etcVendorItemId();
        t.model.storeUrl();
        t.model.connectedAt();
    }
});

export const t_ProductStoreState = objectType({
    name: "ProductStoreState",
    definition(t) {
        t.model.id();
        t.model.name();
        t.model.description();
    }
});

export const t_ProductStoreLog = objectType({
    name: "ProductStoreLog",
    definition(t) {
        t.model.id();
        t.model.productStoreId();
        t.model.jobId();
        t.model.destState();
        t.model.uploadState();
        t.model.errorMessage();
        t.model.createdAt();
        t.model.modifiedAt();
        t.model.productStoreState();
        t.model.productStore();
    }
});