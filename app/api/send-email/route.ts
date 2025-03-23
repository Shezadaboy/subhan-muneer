// import { NextRequest, NextResponse } from 'next/server';
// import { StatusCodes } from 'http-status-codes';

// export async function POST(req: NextRequest) {
//     let body;

//     try {
//         body = await req.json();
//     } catch (error) {
//         return NextResponse.json(
//             { success: false, message: 'Invalid request body' },
//             { status: StatusCodes.BAD_REQUEST }
//         );
//     }

//     const { email, subject, text } = body;

//     if (!email || !subject || !text) {
//         return NextResponse.json(
//             { success: false, message: 'Email, subject, and text are required' },
//             { status: StatusCodes.BAD_REQUEST }
//         );
//     }

//     console.log(process.env.NEXT_PUBLIC_MAIL_API_KEY);
//     console.log(process.env.NEXT_PUBLIC_EMAIL); 
    
//     try {
//         const response = await fetch("https://api.mailersend.com/v1/email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": `Bearer ${process.env.NEXT_PUBLIC_MAIL_API_KEY}`
//             },
//             body: JSON.stringify({
//                 from: {email: email},
//                 to: [{ email: process.env.NEXT_PUBLIC_EMAIL }],
//                 subject: subject,
//                 text: text,
//                 html: `
//                     <!DOCTYPE html>
//                     <html lang="en">
//                     <head>
//                         <meta charset="UTF-8">
//                         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//                         <title>Email Template</title>
//                         <style>
//                             body { font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0; }
//                             .container { max-width: 600px; margin: 20px auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//                             .header { background: linear-gradient(to right, #8b5cf6, #9333ea); padding: 20px; text-align: center; color: white; font-size: 24px; font-weight: bold; }
//                             .content { padding: 20px; text-align: center; }
//                             .content h1 { color: #333; font-size: 22px; }
//                             .content p { color: #666; font-size: 14px; }
//                             .button { display: inline-block; background: #9333ea; color: white; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; margin-top: 10px; }
//                             .footer { background: #333; color: white; text-align: center; padding: 20px; font-size: 12px; }
//                             .footer a { color: #8b5cf6; text-decoration: none; }
//                         </style>
//                     </head>
//                     <body>
//                         <div class="container">
//                             <div class="header">Notification</div>
//                             <div class="content">
//                                 <h1>${subject}</h1>
//                                 <p>${text}</p>
//                             </div>
//                             <div class="footer">
//                                 <p>© 2025 ACME Inc. All rights reserved.</p>
//                                 <p><a href="#">Unsubscribe</a></p>
//                             </div>
//                         </div>
//                     </body>
//                     </html>
//                 `
//             })
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             throw new Error(data.message || "Failed to send email");
//         }

//         return NextResponse.json(
//             { success: true, message: "Email sent successfully!", data },
//             { status: StatusCodes.OK }
//         );
//     } catch (error: any) {
//         console.error("MailerSend Error:", error);

//         return NextResponse.json(
//             { success: false, message: 'Error sending email', error: error.message },
//             { status: StatusCodes.INTERNAL_SERVER_ERROR }
//         );
//     }
// }


import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email, subject, message } = await req.json();

    // Create a transporter (Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL,
        pass: process.env.NEXT_PUBLIC_PASSWORD,
      },
    });

    // Mail options
    const mailOptions = {
      from: email, 
      to: process.env.NEXT_PUBLIC_EMAIL, 
      subject: `New Message from ${name}: ${subject}`,
      text: message,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, message: "Failed to send message" }, { status: 500 });
  }
}
