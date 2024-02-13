import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/profile/edit", "/kedai/edit", "/kedai/post"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  if (!token && process.env.NEXT_PUBLIC_NEXTAUTH_URL) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/login`
    );
  }
}
