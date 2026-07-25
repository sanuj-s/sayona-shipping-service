import { verifyRegistrationResponse } from "@simplewebauthn/server";

const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
const origin = process.env.NEXT_PUBLIC_ORIGIN || `http://${rpID}:3000`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // In a real database, fetch the expectedChallenge that was saved during generate-registration-options
    const expectedChallenge = "mock-challenge"; 

    let verification;
    try {
      verification = await verifyRegistrationResponse({
        response: body,
        expectedChallenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
      });
    } catch (error) {
      console.error(error);
      return new Response("Verification failed", { status: 400 });
    }

    if (verification.verified && verification.registrationInfo) {
      // In a real database, save verification.registrationInfo for future authentication
      return Response.json({ verified: true });
    }

    return new Response("Verification failed", { status: 400 });
  } catch (error) {
    console.error("WebAuthn verify registration error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
