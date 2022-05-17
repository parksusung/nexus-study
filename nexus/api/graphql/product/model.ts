import { objectType , nonNull , list } from 'nexus';

export const t_Product = objectType({
    name: "Product",
    definition(t) {
        t.model.id();
        t.model.user_id();
        t.model.admin_id();
        t.model.taobao_product_id();
        t.model.product_code();
        t.model.state();
        t.model.name();
        t.model.is_name_translated();
        t.model.is_image_translated();
        t.model.price();
        t.model.local_shipping_fee();
        t.model.description();
        t.model.created_at();
        t.model.modified_at();
        t.model.stock_updated_at();
        t.model.category_code();
        t.model.siil_code();
        t.model.image_thumbnail_data();
        t.field("imageThumbnail", {
            type: nonNull(list(nonNull("String"))),
            resolve: async (src, args, ctx, info) => {
                try {
                    return JSON.parse(src.imageThumbnailData)
                } catch (e) {
                    return [];
                    // return throwError(e, ctx);
                }
            }
        });
        t.model.siil_data();
        t.model.user();
      
    }
})