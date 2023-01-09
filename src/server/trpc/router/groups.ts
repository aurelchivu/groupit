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
          message:
            "An unexpected error occurred while creating the group, please try again later.",
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
        message:
          "An unexpected error occurred while getting the groups, please try again later.",
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
            orderBy: {
              // isLeader: "asc", - this is not working, orderBy needs exactly one argument...
              member: {
                fullName: "asc",
              },
            },
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
        message:
          "An unexpected error occurred while getting the groups, please try again later.",
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
        message:
          "An unexpected error occurred while deleting the group, please try again later.",
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
          message:
            "An unexpected error occurred while updating the group, please try again later.",
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
          message:
            "An unexpected error occurred while adding the member, please try again later.",
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
        input.membersToRemove.map(async (id) => {
          try {
            await prisma?.grouppMembers.delete({
              where: {
                id,
              },
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
              message:
                "An unexpected error occurred while getting the member, please try again later.",
            });
          }
        });
        return group;
      } catch (error: any) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An unexpected error occurred while removing the member, please try again later.",
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
          message:
            "An unexpected error occurred while setting the leader, please try again later.",
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
          message:
            "An unexpected error occurred while changing the leader, please try again later.",
        });
      }
    }),
});
