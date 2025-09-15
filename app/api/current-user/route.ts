import { NextResponse } from "next/server";
import { getCurrentUser } from "@/hooks/getUser";

export async function GET(){
    const user = await getCurrentUser();

    if (user===null) return NextResponse.json(null);

    return NextResponse.json(user);
}
