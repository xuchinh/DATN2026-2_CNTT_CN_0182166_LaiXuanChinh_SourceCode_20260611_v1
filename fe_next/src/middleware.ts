export { auth as middleware } from "@/auth"
export const config = {
    matcher: [
        // '/((?!auth).*)(.+)|/verify',
        // "/((?!api|_next/static|_next/image|favicon.ico|/|/auth).*)",
        '/((?!api|_next/static|_next/image|_next/uploads|favicon.ico|images|auth|verify|contact-us|instructions|privacy-policy|refund-policy|usage-policy|blogs|pricing|accommodation|uploads|$).*)',
    ],
}