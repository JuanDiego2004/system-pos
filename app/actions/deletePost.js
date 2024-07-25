"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function deletePost(formData){
    const id = parseInt(formData.get("id"));
    try {
        await prisma.post.delete({
            where: {id},
        });
        revalidatePath('/');
    } catch (e) {
        console.error(e);
    }
}