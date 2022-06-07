import { list, nonNull, objectType } from "nexus";
//import { IOBItem } from "../../onebound_api_types";
import { throwError } from "../utils/error";

export const t_TaobaoProduct = objectType({
    name: "TaobaoProduct",
    definition(t) {
        t.model.id();
        t.model.taobao_num_iid();
        t.model.name();
        t.model.image_thumbnail();
        t.model.price();
        t.model.brand();
        t.model.taobao_brand_id();
        t.model.taobao_category_id();
        t.model.original_data();
        t.model.video_url();
        t.model.created_at();
        t.model.modified_at();
        t.model.product();
        // t.field("options", {
        //     type: nonNull("TaobaoProductOptionInfo"),
        //     resolve: async (src, args, ctx, info) => {
        //         try {
        //             const taobaoData = JSON.parse(src.originalData) as IOBItem;


        //             //productOptionName 분석
        //             const firstPropertyInfo = taobaoData.skus.sku.length === 0 ? undefined : taobaoData.skus.sku[0]?.properties_name?.match(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g)
        //             const res = firstPropertyInfo?.map((v, i) => {
        //                 const result = v.match(/([-\d]+):[-\d]+:(.+):.*;?/);
        //                 if (result) {
        //                     return { taobaoPid: result[1], name: result[2], order: i + 1 };
        //                 }
        //                 else throw new Error("파싱 중 문제 발생 " + JSON.stringify(taobaoData));
        //             });

        //             if (res) {
        //                 //productOptionValue 분석
        //                 const productOptionValues = await Promise.all(Object.entries(taobaoData.props_list).map(async ([key, value]) => { // 직렬처리 필요?
        //                     const a = key.match(/([-\d]+):([-\d]+)/)!;
        //                     const b = value.match(/^(.+):(.+)$/)!;
        //                     // 차례대로 1:2 : 3:4 라고 하면
        //                     // a[1]:1, a[2] : 2, b[1] : 3, b[2] : 4
        //                     const productOptionName = res.find(v => v.taobaoPid === a[1])!;
        //                     const urlInfo = taobaoData.prop_imgs.prop_img.find(v => v.properties === key);
        //                     return {
        //                         name: b[2],
        //                         image: urlInfo ? "http:" + urlInfo.url : null,
        //                         // optionNameOrder: productOptionName.order,
        //                         taobaoVid: a[2],
        //                     }
        //                 }));
        //                 const optionData = taobaoData.skus.sku.map((sku) => {
        //                     return {
        //                         // priceCny: parseFloat(sku.price),
        //                         name: sku.properties_name.replace(/[-\d]+?:[-\d]+?:(.+?):([^;]+);?/g, "$1:$2, ").slice(0, -2),
        //                         // taobaoOptionName: sku.properties_name,
        //                         taobaoSkuId: sku.sku_id,
        //                     }
        //                 })
        //                 return { option: optionData, optionName: res, optionValue: productOptionValues };

        //             }
        //             return { option: [], optionName: [], optionValue: [] };
        //         } catch (e) {
        //             return throwError(e, ctx);
        //         }
        //     }
        // })
    }
});

export const t_TaobaoProductOptionInfo = objectType({
    name: "TaobaoProductOptionInfo",
    definition(t) {
        t.nonNull.list.nonNull.field("option", { type: "TaobaoProductOption" });
        t.nonNull.list.nonNull.field("optionName", { type: "TaobaoProductOptionName" });
        t.nonNull.list.nonNull.field("optionValue", { type: "TaobaoProductOptionValue" });
    }
});

export const t_TaobaoProductOptionName = objectType({
    name: "TaobaoProductOptionName",
    definition(t) {
        t.nonNull.string("taobaoPid");
        t.nonNull.string("name");
    }
});
export const t_TaobaoProductOptionValue = objectType({
    name: "TaobaoProductOptionValue",
    definition(t) {
        t.nonNull.string("taobaoVid");
        t.nonNull.string("name");
        t.string("image");
    }
});
export const t_TaobaoProductOption = objectType({
    name: "TaobaoProductOption",
    definition(t) {
        t.nonNull.string("taobaoSkuId");
        t.nonNull.string("name");
    }
});