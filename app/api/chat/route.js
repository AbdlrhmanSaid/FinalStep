import ai from "@/lib/gemini";
import { NextResponse } from "next/server";
import { getUserProjects } from "@/lib/server/projects";
import { getUserTasks } from "@/lib/server/tasks";

export async function POST(req) {
  try {
    const { message, userId, userName } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    let userContext = `اسم المستخدم الحالي هو: ${userName || "غير معروف"}.`;

    if (userId) {
      try {
        const projects = await getUserProjects(userId);
        const tasks = await getUserTasks(userId);

        userContext += `\nالمشاريع التي ينتمي إليها أو يديرها (عددها ${projects.length}):\n`;
        projects.forEach((p) => {
          userContext += `- مشروع "${p.title}" (حالته: ${p.status}).\n`;
        });

        const activeTasks = tasks.filter(
          (t) =>
            t.status !== "completed" &&
            t.status !== "finished" &&
            t.status !== "ended",
        );

        const assignedTasks = activeTasks.filter(
          (t) =>
            t.assignedTo &&
            t.assignedTo.some(
              (u) => (u._id || u).toString() === userId.toString(),
            ),
        );

        const createdTasks = activeTasks.filter(
          (t) =>
            t.createdBy &&
            (t.createdBy._id || t.createdBy).toString() === userId.toString() &&
            !(
              t.assignedTo &&
              t.assignedTo.some(
                (u) => (u._id || u).toString() === userId.toString(),
              )
            ),
        );

        if (assignedTasks.length > 0) {
          userContext += `\nالمهام التي هو مكلف شخصياً بتنفيذها (عددها: ${assignedTasks.length}):\n`;
          assignedTasks.forEach((t) => {
            userContext += `- مهمة "${t.title}" (حالتها: ${t.status}, الأولوية: ${t.priority || "عادية"}).\n`;
          });
        }

        if (createdTasks.length > 0) {
          userContext += `\nالمهام التي يقوم هو بالإشراف عليها وإدارتها (وتم توكيلها لآخرين) (عددها: ${createdTasks.length}):\n`;
          createdTasks.forEach((t) => {
            userContext += `- مهمة "${t.title}" (حالتها: ${t.status}, الأولوية: ${t.priority || "عادية"}).\n`;
          });
        }
      } catch (e) {
        console.error("Failed to fetch user context for AI", e);
      }
    }

    // Define Steppi's persona and context
    const systemPrompt = `أنت 'Steppi' (ستيبي)، المساعد الذكي الخاص بمنصة 'FinalStep'.
منصة FinalStep هي منصة متطورة لإدارة المشاريع وفرق العمل باللغتين العربية والإنجليزية.
مهمتك هي مساعدة مستخدمي المنصة، الإجابة على استفساراتهم حول كيفية عمل الموقع، وإعطاء نصائح لزيادة الإنتاجية.

مميزات وطريقة عمل FinalStep:
1. الأدوار: يوجد (قائد Leader) يملك كل الصلاحيات، (مساعد قائد Co-Leader)، و(عضو Member) يقوم بتنفيذ المهام.
2. الأقسام (Sections): يتم تقسيم المشروع إلى مجموعات عمل (أقسام) ينضم إليها الأعضاء.
3. المهام والتسليمات: القائد يعين المهام، والعضو يسلم العمل (روابط أو نصوص). القائد يمكنه قبول (Completed) أو رفض (Rejected) التسليم.
4. التسليم المتأخر: يمكن للعضو التسليم بعد انتهاء الموعد الموحد، ولكن ذلك يقلل من نقاط التقييم.
5. التقييم الذكي (Smart Evaluate): يتم تقييم الأعضاء آلياً بناءً على: التسليم في الوقت (OnTime)، نسبة الإنجاز، الجودة (قلة الرفض)، وأولوية المهام المنجزة.
6. التقارير: توفر المنصة تقارير ذكية جاهزة للطباعة توضح أداء الفريق بالكامل.

قواعدك:
- أجب بلغة ودودة، احترافية، وطبيعية جداً، وابتعد عن الترجمة الحرفية والمصطلحات الآلية.
- لا تستخدم مصطلحات مثل "كـ قائد Leader" أو "كعضو Member" بصيغة جافة. بدلاً من ذلك، استخدم صياغات طبيعية مثل "أنت تشرف على هذه المهام وتديرها" أو "هذه المهام موكلة إليك لتنفيذها".
- إذا سألك المستخدم عن اسمك، قل له أنك 'Steppi ' المساعد الذكي لـ FinalStep.
- استخدم الـ Emojis في ردودك لتكون جذابة.
- اجعل إجاباتك تتمحور حول مساعدة المستخدم في إدارة مشاريعه وتوضيح ميزات المنصة.
- التوجيه والمساعدة في المهام (هام جداً): عندما يطلب المستخدم مساعدة في تنفيذ مهمة، لا تقم بإعطائه الحل النهائي الكامل أو إنجاز العمل نيابة عنه! بل تصرف كموجه (Mentor)، واشرح له كيفية حل المهمة عن طريق إعطائه خطوات عملية ومرتبة يمشي عليها، مع بعض التلميحات الذكية ليتمكن من إنجازها بنفسه.
- الذكاء في التعامل مع تعدد المهام: إذا كان لدى المستخدم عدة مهام وسأل عن مساعدتك في مهمة بشكل عام دون تحديدها، قم بمراجعة قائمة مهامه (في سياقك) واسأله بلطف أي مهمة يقصد أو استنتجها من سياق حديثه. بمجرد تحديد المهمة، ركز إجابتك وخطواتك على متطلبات هذه المهمة المحددة بدقة.

معلومات المستخدم الحالي الذي يتحدث معك الآن:
${userContext}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemPrompt,
      },
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error("Gemini Chat Error:", error);

    // If gemini-2.5-flash fails (e.g., 503 High Demand or not found), fallback to gemini-1.5-flash
    try {
      console.log("Attempting fallback to gemini-1.5-flash...");
      const fallbackResponse = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: message,
        config: {
          systemInstruction: systemPrompt,
        },
      });
      return NextResponse.json({ reply: fallbackResponse.text });
    } catch (fallbackError) {
      console.error("Fallback Error:", fallbackError);
      return NextResponse.json(
        { error: fallbackError.message || "Failed to communicate with AI" },
        { status: 500 },
      );
    }
  }
}
