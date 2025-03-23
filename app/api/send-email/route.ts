import { NextRequest, NextResponse } from 'next/server';
import { StatusCodes } from 'http-status-codes';

export async function POST(req:NextRequest) {
    let body;

    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Request body is empty or invalid' },
            { status: StatusCodes.BAD_REQUEST }
        );
    }

    const { email, subject, text } = body;

    if (!email || !subject || !text) {
        return NextResponse.json(
            { success: false, message: 'Email, subject, and text are required' },
            { status: StatusCodes.BAD_REQUEST }
        );
    }

    try {
        const response = await fetch("https://api.mailersend.com/v1/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MAILERSEND_API_KEY}`
            },
            body: JSON.stringify({
                from: { email: process.env.EMAIL_FROM }, // ✅ MailerSend verified email
                to: [{ email: email }], // ✅ Recipient email
                subject: subject,
                text: text
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to send email");
        }

        return NextResponse.json(
            { success: true, message: "Email sent successfully!", data },
            { status: StatusCodes.OK }
        );
    } catch (error:any) {
        console.error("MailerSend Error:", error);

        return NextResponse.json(
            { success: false, message: 'Error sending email', error: error.message },
            { status: StatusCodes.INTERNAL_SERVER_ERROR }
        );
    }
}
