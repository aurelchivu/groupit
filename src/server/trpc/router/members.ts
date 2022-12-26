import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const memberRouter = router({
  create: protectedProcedure
    .input(z.object({ fullName: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return await prisma?.member.create({
        data: {
          fullName: input.fullName,
          createdById: ctx.session.user.id,
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const members = await prisma?.member.findMany({
      include: {
        createdBy: true,
        leaderOf: {
          include: {
            leader: true,
          },
        },
      },
    });
    return members;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.member.findFirst({
      where: {
        id: input,
      },
      include: {
        createdBy: true,
        leaderOf: {
          include: {
            leader: true,
          },
        },
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
      z.object({
        id: z.string(),
        fullName: z.string(),
        groupId: z.string().optional(),
        isLeader: z.boolean().optional(),
      })
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

  addMemberToGroup: protectedProcedure
    .input(
      z.object({
        memberId: z.string(),
        groupId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { groupId } = input;
      return await prisma?.member.update({
        where: {
          id: input.memberId,
        },
        data: {
          groups: {
            connect: { id: groupId },
          },
        },
      });
    }),
});
