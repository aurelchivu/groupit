import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { userRouter } from "./users";

export const appRouter = router({
  auth: authRouter,
  users: userRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
