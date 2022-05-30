import { objectType, unionType } from "nexus";

export const t_Category = objectType({
    name: "Category",
    definition(t) {
        t.model.id();
        t.model.code();
        t.model.c1();
        t.model.c2();
        t.model.c3();
        t.model.c4();
        t.model.c1_name();
        t.model.c2_name();
        t.model.c3_name();
        t.model.c4_name();
        t.model.siil_code();
        t.model.a077_code();
        t.model.b378_code();
    }
});

export const t_CategoryStore = objectType({
    name: "CategoryStore",
    definition(t) {
        t.model.id();
        t.model.acode();
        t.model.pcode();
        t.model.ccode();
        t.model.dc1();
        t.model.dc2();
        t.model.dc3();
        t.model.dc4();
        t.model.dc1_name();
        t.model.dc2_name();
        t.model.dc3_name();
        t.model.dc4_name();
        t.model.state();
        t.model.cate_state_pdate();
        t.model.cate_state_cdate();
    }
});

export const t_CategoryPartialType = objectType({
    name: "CategorySelectType",
    definition(t) {
        t.nonNull.string("code");
        t.nonNull.string("name");
    }
});

export const t_CategoryInformationType = objectType({
    name: "CategoryInformationType",
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('code');
        t.nonNull.string('depth1');
        t.nonNull.string('depth2');
        t.nonNull.string('depth3');
        t.nonNull.string('depth4');
        t.nonNull.string('depth5');
        t.nonNull.string('depth6');
        t.nonNull.string('name');

        t.nullable.string('code_a077');
        t.nullable.string('code_b378');
        t.nullable.string('code_a112');
        t.nullable.string('code_a027');
        t.nullable.string('code_a001');
        t.nullable.string('code_a006');
        t.nullable.string('code_b719');
        t.nullable.string('code_a113');
        t.nullable.string('code_a524');
        t.nullable.string('code_a525');
        t.nullable.string('code_b956');
    }
});