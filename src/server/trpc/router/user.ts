import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma?.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });
    return user;
  }),
});

