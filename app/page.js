import { PrismaClient } from '@prisma/client';

import Header from './components/Header';

const prisma = new PrismaClient();

export default async function Home() {


  return (
    <main className="container mx-auto px-4">
      <Header title="Dashboard" />
    </main>
  );
}