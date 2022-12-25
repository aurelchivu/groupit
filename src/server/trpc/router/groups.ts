import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const groupRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        leaderId: z.string().optional(),
        members: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { leaderId } = input;
      return await prisma?.groupp.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
          leaderId: input.leaderId,
          members: {
            create: [{ member: { connect: { id: leaderId } } }],
          },
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    const groups = await prisma?.groupp.findMany({
      include: {
        leader: true,
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
      include: {
        members: { include: { member: true } },
        leader: true,
        createdBy: true,
      },
    });
  }),

  getByName: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.groupp.findFirst({
      where: {
        name: input,
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
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
      })
    )
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
  addMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        membersToAdd: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma?.groupp.update({
        where: {
          id: input.groupId,
        },
        data: {
          members: {
            create: [
              ...input.membersToAdd.map((id) => ({
                member: {
                  connect: {
                    id,
                  },
                },
              })),
            ],
          },
        },
      });
    }),
  removeMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        membersToRemove: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma?.groupp.update({
        where: {
          id: input.groupId,
        },
        data: {
          members: {
            disconnect: [
              ...input.membersToRemove.map((id) => ({
                id,
              })),
            ],
          },
        },
      });
    }),
});
