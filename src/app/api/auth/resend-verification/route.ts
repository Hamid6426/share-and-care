// src/app/api/resend-verification/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import sendMail from "@/utils/sendMail";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 });
    }

    // Generate new token and expiry
    const verificationToken = Math.random().toString(36).substring(2, 15);
    const verificationTokenExpire = new Date();
    verificationTokenExpire.setHours(verificationTokenExpire.getHours() + 1);

    user.verificationToken = verificationToken;
    user.verificationTokenExpire = verificationTokenExpire;
    await user.save();

    // Build the verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_API_BASE_URL}/verify-email?verificationToken=${verificationToken}`;
    const emailHtml = `
      <h1>Verify Your Email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">${verificationLink}</a>
      <p>This link will expire in 1 hour.</p>
    `;

    await sendMail(user.email, "Resend: Verify Your Email", emailHtml);

    return NextResponse.json({ message: "Verification email sent successfully." }, { status: 200 });
  } catch (error) {
    console.error("Resend verification email error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
