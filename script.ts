import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query"] });

async function main() {
  const users = await getUsersWithPostCounts();

  console.info("Users:");
  for (const user of users) {
    console.info(
      `  ${user.email} (${user.postsCount} posts, ${user.postsWithCommentsCount} with comments)`
    );
  }
}

/**
 * This function makes 2 total SQL queries:
 *
 * 1. Get all users, including the number of posts for each user
 * 2. Get the number of posts with comments for each user
 *
 * The second query takes advantage of the fact that Prisma Client has
 * a built-in dataloader that automatically batches calls to `findUnique`:
 *
 * https://www.prisma.io/docs/guides/performance-and-optimization/query-optimization-performance#solving-the-n1-problem
 */

async function getUsersWithPostCounts() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return Promise.all(
    users.map(async (user) => {
      const postsWithCommentsCount = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          _count: {
            select: {
              posts: {
                where: { comments: { some: {} } },
              },
            },
          },
        },
      });

      return {
        id: user.id,
        email: user.email,
        postsCount: user._count.posts,
        postsWithCommentsCount: postsWithCommentsCount?._count.posts,
      };
    })
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
