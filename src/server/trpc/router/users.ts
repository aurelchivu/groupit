import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma?.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
  getById: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.prisma.user.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user?.id) {
      throw new Error("Not authenticated");
    }
    // if (ctx.session.user.role !== "ADMIN") {
    //   throw new Error("Not authorized");
    // }
    const users = await ctx.prisma.user.findMany();
    return users;
  }),
});
