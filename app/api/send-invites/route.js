import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { sender, receivers, projectName } = await req.json();

    if (!receivers || !Array.isArray(receivers)) {
      return Response.json(
        { error: "Receivers must be an array" },
        { status: 400 }
      );
    }

    // Filter valid emails
    const validReceivers = receivers.filter((email) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (validReceivers.length === 0) {
      return Response.json(
        { error: "No valid email addresses provided" },
        { status: 400 }
      );
    }

    const results = await Promise.allSettled(
      validReceivers.map((receiver) =>
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: receiver,
          subject: `Invitation to join project: ${projectName}`,
          html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
                <img src="https://final-step.vercel.app/assets/images/logo.png" alt="FinalStep Logo" style="width: 120px; margin-bottom: 20px;" />
                <h2 style="color: #222;">You're Invited to Join <span style="color: #3b82f6;">${projectName}</span></h2>
                <p style="color: #555; font-size: 16px; line-height: 1.5;">
                  Hello,<br />
                  You’ve been invited to join the project <strong>${projectName}</strong> on <strong>FinalStep</strong>.
                </p>
                <a href="https://final-step.vercel.app/dashboard/invitations"
                  style="
                    display: inline-block;
                    margin-top: 30px;
                    padding: 15px 30px;
                    font-size: 16px;
                    color: white;
                    background-color: #3b82f6;
                    border-radius: 8px;
                    text-decoration: none;
                  ">
                  View Your Invitation
                </a>
                <p style="margin-top: 40px; color: #888; font-size: 12px;">
                  © ${new Date().getFullYear()} FinalStep. All rights reserved.
                </p>
              </div>
            </div>
          `,
        })
      )
    );

    const successes = results
      .map((r, i) => (r.status === "fulfilled" ? validReceivers[i] : null))
      .filter(Boolean);

    const failures = results
      .map((r, i) =>
        r.status === "rejected"
          ? {
              email: validReceivers[i],
              error: r.reason?.message || "Unknown error",
            }
          : null
      )
      .filter(Boolean);

    return Response.json({
      success: true,
      sent: successes,
      failed: failures,
    });
  } catch (err) {
    console.error("Resend API Error:", err);
    return Response.json(
      {
        error: "Failed to send invites",
        details: err.message,
      },
      { status: 500 }
    );
  }
}

