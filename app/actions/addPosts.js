"use server";

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export default async function addPost(formData){
    const title = formData.get("title")
    try{
        await prisma.post.create({
            data: {
                title,
            }
        });
        revalidatePath('/');
    } catch (e) {
        console.error(e);
    }
}