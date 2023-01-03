import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

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
      try {
        const group = await prisma?.groupp.create({
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
        return group;
      } catch (error: any) {
        if (error.code === "P2002") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Error: Group with that name already exists!",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  getAll: protectedProcedure.query(async () => {
    try {
      const groups = await prisma?.groupp.findMany({
        include: {
          leader: true,
          createdBy: true,
          // members: true,
        },
        orderBy: {
          name: "asc",
        },
      });
      return groups;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  }),

  getById: protectedProcedure.input(z.string()).query(async ({ input }) => {
    try {
      const group = await prisma?.groupp.findFirst({
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
                  leaderOf: true,
                },
              },
            },
          },
          leader: true,
          createdBy: true,
        },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id ${input} not found!`,
        });
      }
      return group;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
  }),

  delete: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    try {
      const group = await prisma?.groupp.delete({
        where: {
          id: input,
        },
      });
      if (!group) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Group with id ${input} not found!`,
        });
      }
      return group;
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: error.message,
      });
    }
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
      try {
        const group = await prisma?.groupp.update({
          where: {
            id: input.id,
          },
          data: {
            ...input,
          },
        });
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.id} not found!`,
          });
        }
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  addMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        membersToAdd: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const group = await prisma?.groupp.update({
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
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.groupId} not found!`,
          });
        }
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        membersToRemove: z.string().array(),
      })
    )
    .mutation(async ({ input }) => {
      try {
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

        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.groupId} not found!`,
          });
        }

        // I don't like this. I should disconnect the group from the member, updating the member model.
        input.membersToRemove.map(async (id) => {
          try {
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
            if (!id) {
              throw new TRPCError({
                code: "NOT_FOUND",
                message: `Member with id ${id} not found!`,
              });
            }
          } catch (error: any) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error.message,
            });
          }
        });
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),

  setLeader: protectedProcedure
    .input(
      z.object({
        groupId: z.string(),
        leaderId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const group = await prisma?.groupp.update({
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
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.groupId} not found!`,
          });
        }
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
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
      try {
        const group = await prisma?.groupp.update({
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
        if (!group) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `Group with id ${input.groupId} not found!`,
          });
        }
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message,
        });
      }
    }),
});
