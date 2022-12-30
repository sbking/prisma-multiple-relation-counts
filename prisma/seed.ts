import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Cleanup existing data
  await prisma.user.deleteMany();

  // Create 100 to 200 users
  const userCount = faker.datatype.number({ min: 100, max: 200 });
  const users = Array.from({ length: userCount }, () => {
    // Create 0 to 10 posts per user
    const postCount = faker.datatype.number({ min: 0, max: 10 });
    const posts = Array.from({ length: postCount }, () => {
      // Create 0 to 2 comments per post
      const commentCount = faker.datatype.number({ min: 0, max: 2 });
      const comments = Array.from({ length: commentCount }, () => ({
        body: faker.lorem.paragraph(),
      })) satisfies Prisma.CommentCreateWithoutPostInput[];

      return {
        title: faker.lorem.sentence(),
        comments: { create: comments },
      };
    }) satisfies Prisma.PostCreateWithoutAuthorInput[];

    return {
      email: faker.internet.email(),
      posts: { create: posts },
    };
  }) satisfies Prisma.UserCreateInput[];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }

  console.log(`Database has been seeded. 🌱`);
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
