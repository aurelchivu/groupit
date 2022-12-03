import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const groupRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.group.create({
        data: {
          name: input.name,
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const groups = await prisma?.group.findMany();
    return groups;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.group.findFirst({
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma?.group.delete({
      where: {
        id: input,
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.group.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
