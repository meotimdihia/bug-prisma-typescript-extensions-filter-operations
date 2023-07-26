import { Prisma, PrismaClient } from "@prisma/client";
import { sub } from "date-fns";

const prisma = new PrismaClient({ log: ["query"] }).$extends({
  query: {
    post: {
      async $allOperations({ args, query, operation, model }) {
        if (operation != "create" && operation != "update") {
          return await query(args);
        }
        // works fine but duplicated code
        if (operation == "create") {
          const cur = await query(args);
          await prisma.post.update({
            data: {
              title: "abcedf",
            },
            where: {
              id: cur.id,
            },
          });
        }

        // works fine but duplicated code
        if (operation == "update") {
          const cur = await query(args);
          await prisma.post.update({
            data: {
              title: "abcedf",
            },
            where: {
              id: cur.id,
            },
          });
        }
        if (operation == "create" || operation == "update") {
          const cur = await query(args);
          // doesn't work, we need a solution for this problem
          await prisma.post.update({
            data: {
              title: "abcedf",
            },
            where: {
              id: cur.id, // Property 'id' does not exist on type 'number | PayloadToResult<PostPayload<DefaultArgs>, RenameAndNestPayloadKeys<PostPayload<DefaultArgs>>> | ... 4 more ... | Optional<...>'.
              // Property 'id' does not exist on type 'number'.ts(2339)
            },
          });
        }
      },
    },
  },
});

async function main() {}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
