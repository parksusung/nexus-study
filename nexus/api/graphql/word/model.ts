import { objectType } from "nexus";

export const t_WordTable = objectType({
    name: "WordTable",
    definition(t) {
        t.model.id();
        t.model.user_id();
        t.model.find_word();
        t.model.replace_word();
        t.model.user();
    }
});