import prismaDB from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req:Request){
  try {
    const body = await req.json()
    const {name} = body
    const {userId} = auth()
    if(!userId)return new NextResponse('unauthorized', {status:401})
    if(!name)return new NextResponse('name is required', {status:400})
    
    const store = await prismaDB.store.create({data:{name, userID:userId}})
    return NextResponse.json(store)
    
  } catch (error) {
    console.log("[STORES_POST]:ERROR \n", error);
    return new NextResponse('internal server error', {status:500})
  }
}