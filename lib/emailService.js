import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const SENDER_EMAIL = "notifications@finalstep.site"; 

const getBaseUrl = () => {
  if (process.env.NODE_ENV === "production") return "https://www.finalstep.site";
  return process.env.NEXTAUTH_URL || "http://localhost:3000";
};

/**
 * Helper to send email safely
 */
const sendMail = async ({ to, subject, html }) => {
  if (!resend) {
    console.warn("RESEND_API_KEY is not defined. Email skipped.");
    return;
  }
  if (!to || (Array.isArray(to) && to.length === 0)) return;

  try {
    // If 'to' is an array, Resend allows up to 50 recipients per batch, but we can just use Bcc or send multiple.
    // For simplicity, we can map to individual promises for isolated delivery (so failure of one doesn't affect another).
    const receivers = Array.isArray(to) ? to : [to];
    const validReceivers = receivers.filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

    if (validReceivers.length === 0) return;

    await Promise.allSettled(
      validReceivers.map((receiver) =>
        resend.emails.send({
          from: `FinalStep <${SENDER_EMAIL}>`,
          to: receiver,
          subject,
          html,
        })
      )
    );
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

const getTemplate = (title, content, actionLink, actionText) => `
  <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; text-align: center; color: #333;">
    <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <h2 style="color: #2563eb; margin-bottom: 20px;">${title}</h2>
      <p style="font-size: 16px; line-height: 1.6; color: #4b5563; margin-bottom: 30px;">
        ${content}
      </p>
      ${
        actionLink
          ? `<a href="${actionLink}" style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px;">${actionText}</a>`
          : ""
      }
      <p style="margin-top: 40px; color: #9ca3af; font-size: 13px;">
        © ${new Date().getFullYear()} FinalStep. جميع الحقوق محفوظة.
      </p>
    </div>
  </div>
`;

// 1. Task Assigned to Member
export const sendTaskAssignmentEmail = async ({ emails, taskTitle, projectName, taskId }) => {
  const url = `${getBaseUrl()}/dashboard/task/${taskId}`;
  await sendMail({
    to: emails,
    subject: `مهمة جديدة: ${taskTitle} - ${projectName}`,
    html: getTemplate(
      "لديك مهمة جديدة! 📋",
      `تم تكليفك للتو بمهمة جديدة بعنوان <strong>"${taskTitle}"</strong> في مشروع <strong>${projectName}</strong>. يُرجى مراجعة المهمة والبدء بالعمل عليها.`,
      url,
      "عرض المهمة"
    ),
  });
};

// 2. Task Submitted (to Leaders)
export const sendTaskSubmissionEmail = async ({ leaderEmails, taskTitle, projectName, taskId, memberName }) => {
  const url = `${getBaseUrl()}/dashboard/task/${taskId}`;
  await sendMail({
    to: leaderEmails,
    subject: `تم تسليم مهمة: ${taskTitle} - ${projectName}`,
    html: getTemplate(
      "تسليم مهمة للمراجعة ✅",
      `قام <strong>${memberName}</strong> بتسليم المهمة <strong>"${taskTitle}"</strong> في مشروع <strong>${projectName}</strong> وهي الآن بانتظار مراجعتك.`,
      url,
      "مراجعة التسليم"
    ),
  });
};

// 3. Task Reviewed (to Member)
export const sendTaskReviewEmail = async ({ memberEmail, taskTitle, projectName, taskId, isApproved }) => {
  const url = `${getBaseUrl()}/dashboard/task/${taskId}`;
  const statusHtml = isApproved 
    ? '<span style="color: #16a34a; font-weight: bold;">مقبولة (تم الإنجاز) 🎉</span>'
    : '<span style="color: #dc2626; font-weight: bold;">مرفوضة (بحاجة لتعديل) ⚠️</span>';

  await sendMail({
    to: memberEmail,
    subject: `نتيجة مراجعة المهمة: ${taskTitle}`,
    html: getTemplate(
      "نتيجة مراجعة المهمة 📊",
      `تمت مراجعة تسليمك للمهمة <strong>"${taskTitle}"</strong> في مشروع <strong>${projectName}</strong>. حالة المهمة الآن: ${statusHtml}.`,
      url,
      "عرض التفاصيل والملاحظات"
    ),
  });
};

// 4. Join Request Received (to Leaders)
export const sendJoinRequestEmail = async ({ leaderEmails, projectName, requesterName, projectId }) => {
  const url = `${getBaseUrl()}/dashboard/projects/${projectId}`;
  await sendMail({
    to: leaderEmails,
    subject: `طلب انضمام جديد للمشروع: ${projectName}`,
    html: getTemplate(
      "طلب طلب انضمام جديد 👤",
      `طلب <strong>${requesterName}</strong> الانضمام إلى مشروع <strong>${projectName}</strong>. يُرجى قبول أو رفض الطلب.`,
      url,
      "إدارة المشروع والطلبات"
    ),
  });
};

// 5. Join Request Decision (to User)
export const sendJoinDecisionEmail = async ({ requesterEmail, projectName, isAccepted, projectId }) => {
  const url = isAccepted ? `${getBaseUrl()}/dashboard/projects/${projectId}` : `${getBaseUrl()}/dashboard/projects`;
  const actionTxt = isAccepted ? "الدخول للمشروع" : "العودة للمشاريع";
  const content = isAccepted
    ? `تهانينا! لقد تم <span style="color: #16a34a; font-weight: bold;">قبول</span> طلب انضمامك إلى مشروع <strong>${projectName}</strong>.`
    : `نأسف لإخبارك أنه تم <span style="color: #dc2626; font-weight: bold;">رفض</span> طلب انضمامك إلى مشروع <strong>${projectName}</strong>.`;

  await sendMail({
    to: requesterEmail,
    subject: `رد على طلب الانضمام: ${projectName}`,
    html: getTemplate("رد على طلب الانضمام 📩", content, url, actionTxt),
  });
};
