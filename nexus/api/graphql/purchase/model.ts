import { objectType } from "nexus";


export interface PurchaseLogPlanInfoType {
    id: number;
    plan_level: number | null;
    name: string;
    month: number;
    price: number;
    external_feature_variable_id: string | null;
}


export const t_PlanInfo = objectType({
    name: "PlanInfo",
    definition(t) {
        t.model.id();
        t.model.plan_level();
        t.model.name();
        t.model.description();
        t.model.month();
        t.model.price();
        t.model.external_feature_variable_id();
        t.model.is_active();
    }
});

export const t_PurchaseLog = objectType({
    name: "PurchaseLog",
    definition(t) {
        t.model.id();
        t.model.user_id();
        t.model.pay_amount();
        t.model.pay_id();
        t.model.state();
        t.model.plan_info();
        t.model.type();
        t.model.purchased_at();
        t.model.expired_at();
        t.model.user();
    }
});