import { group } from "console";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const groupRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        leaderId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { leaderId } = input;
      return await prisma?.groupp.create({
        data: {
          ...input,
          createdById: ctx.session.user.id,
          // This is nice!!!! --> https://github.com/tc39/proposal-object-rest-spread/issues/45
          ...(leaderId && {
            members: {
              create: {
                member: {
                  connect: {
                    id: leaderId,
                  },
                },
                isLeader: true,
              },
            },
          }),
        },
      });
    }),

  getAll: protectedProcedure.query(async () => {
    return await prisma?.groupp.findMany({
      include: {
        leader: true,
        createdBy: true,
        // members: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    return await prisma?.groupp.findFirst({
      where: {
        id: input,
      },
      include: {
        members: {
          include: {
            member: {
              include: {
                createdBy: true,
                groups: {
                  include: {
                    group: true,
                  },
                },
              },
            },
          },
        },
        leader: true,
        createdBy: true,
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
      const group = await prisma?.groupp.update({
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
          leader: {
            disconnect: true,
          },
        },
      });

      // I don't like this. I should disconnect the group from the member, updating the member model.
      input.membersToRemove.map(async (id) => {
        await prisma?.grouppMembers.delete({
          where: {
            id,
          },
          // data: {
          //   groups: {
          //     disconnect: [{ id: input.groupId }],
          //   },
          // },
        });
      });
      return group;
    }),

  setLeader: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        leaderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma?.groupp.update({
        where: { id: input.groupId },
        data: {
          leader: {
            connect: { id: input.leaderId },
          },
          members: {
            updateMany: {
              where: {
                memberId: input.leaderId,
              },
              data: {
                isLeader: true,
              },
            },
          },
        },
      });
    }),

  changeLeader: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        leaderId: z.string(),
        newLeaderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma?.groupp.update({
        where: { id: input.groupId },
        data: {
          leader: {
            connect: { id: input.newLeaderId },
          },
          members: {
            updateMany: [
              {
                where: {
                  memberId: input.newLeaderId,
                },
                data: {
                  isLeader: true,
                },
              },
              {
                where: {
                  memberId: input.leaderId,
                },
                data: {
                  isLeader: false,
                },
              },
            ],
          },
        },
      });
    }),
});
