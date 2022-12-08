import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const personRouter = router({
  create: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.person.create({
        data: {
          firstName: input.name,
          lastName: input.name,
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const people = await prisma?.person.findMany();
    return people;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.person.findFirst({
      where: {
        id: input,
      },
    });
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    return await prisma?.person.delete({
      where: {
        id: input,
      },
    });
  }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma?.person.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
});
