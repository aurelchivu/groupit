import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const memberRouter = router({
  create: protectedProcedure
    .input(z.object({ fullName: z.string(), details: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      return await prisma?.member.create({
        data: {
          ...input,
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
        groups: {
          include: {
            group: true,
          },
        },
      },
      orderBy: {
        fullName: "asc",
      },
    });
    return members;
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const member = await prisma?.member.findFirst({
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
          groups: {
            include: {
              group: true,
            },
          },
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Member with id ${input} not found!`,
        });
      }
      return member;
    } catch (error) {
      throw error;
    }
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
        details: z.string().optional(),
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
