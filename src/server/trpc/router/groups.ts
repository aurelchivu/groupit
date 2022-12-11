import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const groupRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await prisma?.groupp.create({
        data: {
          name: input.name,
          createdById: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const groups = await prisma?.groupp.findMany({
      include: {
        members: true,
        createdBy: true,
      },
    });
    return groups;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.groupp.findFirst({
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma?.groupp.delete({
      where: {
        id: input,
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.groupp.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
