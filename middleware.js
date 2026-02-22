import { NextResponse } from "next/server";

export function middleware(req) {
  const ip = req.headers.get("x-forwarded-for");
  console.log("Visitor IP:", ip);
  return NextResponse.next();
}
