import { PrismaClient } from '@prisma/client';
import addPost from './actions/addPosts';
import deletePost from './actions/deletePost';
import Header from './components/Header';

const prisma = new PrismaClient();

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
    <main className="container mx-auto px-4">
      <Header title="Dashboard" />
    </main>
  );
}