import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const memberRouter = router({
  create: protectedProcedure
    .input(z.object({ fullName: z.string(), details: z.string().optional() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const member = await prisma?.member.create({
          data: {
            ...input,
            createdById: ctx.session.user.id,
          },
        });
        return member;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while creating the member, please try again later.",
        });
      }
    }),

  getAll: protectedProcedure.query(async () => {
    try {
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
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected error occurred while getting the members, please try again later.",
      });
    }
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
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected error occurred while getting the group, please try again later.",
      });
    }
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    try {
      const member = await prisma?.member.delete({
        where: {
          id: input,
        },
      });
      if (!member) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Member with id ${input} not found!`,
        });
      }
      return member;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          "An unexpected error occurred while deleting the member, please try again later.",
      });
    }
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
      try {
        const member = await prisma?.member.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
        if (!member) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.id} not found!`,
          });
        }
        return member;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while updating the member, please try again later.",
        });
      }
    }),
});
