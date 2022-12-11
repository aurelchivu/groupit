import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const memberRouter = router({
  create: protectedProcedure
    .input(z.object({ firstName: z.string(), lastName: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.member.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const members = await prisma?.member.findMany();
    return members;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.member.findFirst({
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma?.member.delete({
      where: {
        id: input,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({ id: z.string(), firstName: z.string(), lastName: z.string() })
    )
    .mutation(async ({ input }) => {
      return await prisma?.member.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
