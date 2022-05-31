import { objectType } from "nexus";
import { shopDataUrlInfo } from "../../playauto_api_type";
import { throwError } from "../utils/error";


export const t_ProductStore = objectType({
    name: "ProductStore",
    definition(t) {
        t.model.id();
        t.model.product_id();
        t.model.user_id();
        t.model.user();
        t.model.site_code();
        t.model.state();
        t.model.product_store_state();
        t.model.store_product_id();
        t.model.product();
        t.model.product_store_log({
            filtering: true,
            ordering: true,
            pagination: true,
        });
        t.model.etc_vendor_item_id();
        t.model.store_url();
        t.model.connected_at();
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
        t.model.product_store_id();
        t.model.job_id();
        t.model.dest_state();
        t.model.upload_state();
        t.model.error_message();
        t.model.created_at();
        t.model.modified_at();
        t.model.product_store_state();
        t.model.product_store();
    }
});