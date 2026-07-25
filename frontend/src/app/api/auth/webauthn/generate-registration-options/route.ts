import { generateRegistrationOptions } from "@simplewebauthn/server";

const rpName = "Sayona Shipping Admin";
const rpID = process.env.NEXT_PUBLIC_RP_ID || "localhost";
const origin = process.env.NEXT_PUBLIC_ORIGIN || `http://${rpID}:3000`;

export async function GET(req: Request) {
  try {
    // In a real database, you'd fetch the user's existing credentials here
    const user = {
      id: "admin-user-id",
      username: "admin@sayonashipping.com",
    };

    const options = await generateRegistrationOptions({
      rpName,
      rpID,
      userID: new TextEncoder().encode(user.id),
      userName: user.username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    });

    // In a real database, store options.challenge associated with the user session here

    return Response.json(options);
  } catch (error) {
    console.error("WebAuthn generate options error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
