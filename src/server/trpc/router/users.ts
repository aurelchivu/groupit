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
});
