import { makeSchema } from "nexus";
import { join } from "path";
import { nexusPrisma } from "nexus-plugin-prisma";
import * as modelTypes from "./graphql";
export const schema = makeSchema({
  types: [modelTypes],
  // 백업 유형 .
  sourceTypes: { //이부분은 좀더 공부가 필요함.. 뭔지 몰겠고
      modules: [{ module: join(__dirname, 'types.ts'), alias: "upload" }],
      headers: [
          'import { FileUpload } from "./types"',
      ],
  },
  outputs: {
    typegen: join(__dirname, "typegen.ts"),
    schema: join(__dirname, "schema.graphql"),
  },
  contextType: { module: join(__dirname, "types.ts"), export: "Context" },
  plugins: [
    nexusPrisma({
      shouldGenerateArtifacts: true,
      paginationStrategy: "prisma",
      experimentalCRUD: true,
    }),
  ],
});
