import { PrismaClient } from "@prisma/client";
import { objectType, nonNull } from "nexus";

export const t_Admin = objectType({
    name:"Admin",
    definition(t) {
        t.model.id(),
        t.model.login_id(),
        t.model.state(),
        t.model.created_at()
    }
})