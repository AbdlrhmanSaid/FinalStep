import ai, { getGeminiClient, rotateKey } from "@/lib/gemini";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getUserProjects } from "@/lib/server/projects";
import { getUserTasks } from "@/lib/server/tasks";
import Project from "@/models/Project";
import Section from "@/models/Section";
import Task from "@/models/Task";

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
    const DAILY_LIMIT = 20;

    if (userId) {
      await dbConnect();
      const user = await User.findById(userId);

      if (user) {
        // Initialize aiUsage if it doesn't exist
        if (!user.aiUsage) {
          user.aiUsage = { count: 0, lastReset: new Date() };
        }

        // Reset limit if it's a new day
        const today = new Date();
        const lastReset = new Date(user.aiUsage.lastReset);
        if (today.toDateString() !== lastReset.toDateString()) {
          user.aiUsage.count = 0;
          user.aiUsage.lastReset = today;
          await user.save();
        }

        // Check if user exceeded their limit
        if (user.aiUsage.count >= DAILY_LIMIT) {
          return NextResponse.json({
            reply: `عذراً، لقد استهلكت الحد الأقصى لرسائلك اليومية (${DAILY_LIMIT} رسالة). يرجى المحاولة غداً! ⏳`,
            isRateLimited: true,
          });
        }
      }

      try {
        const projects = await getUserProjects(userId);
        const tasks = await getUserTasks(userId);

        userContext += `\nالمشاريع التي ينتمي إليها أو يديرها (عددها ${projects.length}):\n`;
        projects.forEach((p) => {
          userContext += `- مشروع "${p.title}" (رابط المشروع: /dashboard/projects/${p._id}, حالته: ${p.status}).\n`;
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
            const projectName = t.projectId?.title
              ? ` (مشروع: ${t.projectId.title})`
              : "";
            userContext += `- مهمة "${t.title}"${projectName} (رابط المهمة: /dashboard/task/${t._id}, حالتها: ${t.status}, الأولوية: ${t.priority || "عادية"}).\n`;
          });
        }

        if (createdTasks.length > 0) {
          userContext += `\nالمهام التي يقوم هو بالإشراف عليها وإدارتها (وتم توكيلها لآخرين) (عددها: ${createdTasks.length}):\n`;
          createdTasks.forEach((t) => {
            const projectName = t.projectId?.title
              ? ` (مشروع: ${t.projectId.title})`
              : "";
            userContext += `- مهمة "${t.title}"${projectName} (رابط المهمة: /dashboard/task/${t._id}, حالتها: ${t.status}, الأولوية: ${t.priority || "عادية"}).\n`;
          });
        }
      } catch (e) {
        console.error("Failed to fetch user context for AI", e);
      }
    }

    // Define Steppi's persona and context
    const systemPrompt = `أنت 'Steppi' (ستيبي)، المساعد الذكي الخاص بمنصة 'FinalStep'.
منصة FinalStep هي منصة متطورة لإدارة المشاريع وفرق العمل باللغتين العربية والإنجليزية.
مهمتك هي مساعدة مستخدمي المنصة، الإجابة على استفساراتهم حول كيفية عمل الموقع، إعطاء نصائح لزيادة الإنتاجية، وتقديم تحليلات دقيقة بناءً على بيانات مشاريعهم ومهامهم.

مميزات وطريقة عمل FinalStep:
1. الأدوار: يوجد (قائد Leader) يملك كل الصلاحيات، (مساعد قائد Co-Leader)، و(عضو Member) يقوم بتنفيذ المهام.
2. الأقسام (Sections): يتم تقسيم المشروع إلى مجموعات عمل (أقسام) ينضم إليها الأعضاء.
3. المهام والتسليمات: القائد يعين المهام، والعضو يسلم العمل (روابط أو نصوص). القائد يمكنه قبول (Completed) أو رفض (Rejected) التسليم.
4. التسليم المتأخر: يمكن للعضو التسليم بعد انتهاء الموعد الموحد، ولكن ذلك يقلل من نقاط التقييم.
5. التقييم الذكي (Smart Evaluate): يتم تقييم الأعضاء آلياً بناءً على: التسليم في الوقت (OnTime)، نسبة الإنجاز، الجودة (قلة الرفض)، وأولوية المهام المنجزة.
6. التقارير: توفر المنصة تقارير ذكية جاهزة للطباعة توضح أداء الفريق بالكامل.

قواعدك:
- أجب بلغة ودودة ولكن عملية واحترافية ومباشرة.
- لا تستخدم مصطلحات مثل "كـ قائد Leader" أو "كعضو Member" بصيغة جافة. بدلاً من ذلك، استخدم صياغات طبيعية مثل "أنت تشرف على هذه المهام وتديرها" أو "هذه المهام موكلة إليك لتنفيذها".
- إذا سألك المستخدم عن اسمك، قل له أنك 'Steppi ' المساعد الذكي لـ FinalStep.
- **هام جداً للتنسيق**: تجنب استخدام النجوم والخط العريض (**) بكثرة لكي لا يكون النص مزدحماً. استخدم القوائم النقطية البسيطة والفقرات الواضحة. قلل جداً من استخدام الـ Emojis واستخدمها في أضيق الحدود فقط عند الضرورة (مثل الترحيب)، لكي يبدو الرد عملياً واحترافياً.
- عند تحليل بيانات المستخدم (المشاريع والمهام)، كن دقيقاً جداً واعتمد فقط على البيانات الموجودة في السياق ولا تخمن معلومات غير موجودة.
- التوجيه والمساعدة في المهام: عندما يطلب المستخدم مساعدة في تنفيذ مهمة، لا تقم بإعطائه الحل النهائي الكامل بل تصرف كموجه (Mentor)، واشرح له كيفية حل المهمة عن طريق إعطائه خطوات عملية.
- الذكاء في التعامل مع تعدد المهام: إذا سأل المستخدم عن مهامه، اقرأ قائمة المهام (في سياقك) واسأله عن المهمة المقصودة أو استنتجها من كلامه، واربط المهام بمشاريعها.

هيكلة الصفحات والتوجيه في المنصة (Routing):
لتوجيه المستخدم بسهولة، استخدم الروابط التالية داخل ردودك بصيغة Markdown، مثال: [صفحة المشاريع](/dashboard/projects)
- الصفحة الرئيسية (Overview/Home): \`/dashboard\`
- صفحة المشاريع (Projects): \`/dashboard/projects\`
- صفحة المهام (Tasks): \`/dashboard/tasks\`
- صفحة تقارير الفريق (Team Report): \`/dashboard/team-report\`
- صفحة التقرير الشخصي (Personal Report): \`/dashboard/report\`
- صفحة الدعوات (Invitations): \`/dashboard/invitations\`
- صفحة الملف الشخصي (Profile): \`/dashboard/profile\`
- صفحة الإعدادات (Settings): \`/dashboard/settings\`
- صفحة شرح كيفية عمل المنصة (How it works): \`/dashboard/how-it-works\`
- صفحة البحث الشامل (Search): \`/dashboard/search\`

**توجيه هام جداً للمشاريع والمهام المحددة**: 
لا تقم أبداً بكتابة اسم المشروع أو المهمة في رابط الـ URL (مثل /dashboard/projects/اسم_المشروع). بدلاً من ذلك، استخدم **الرابط الدقيق** (الذي يحتوي على معرف ID) المرفق بجانب كل مشروع وكل مهمة في قسم (معلومات المستخدم الحالي) أدناه. مثال صحيح: [مشروع التسويق](/dashboard/projects/60d5ecb8b392).

**إنشاء المشاريع آلياً (ميزة هامة جداً):**
- أنت تملك الصلاحية لإنشاء مشاريع كاملة بالنيابة عن المستخدم مباشرة!
- إذا طلب المستخدم مساعدتك في إنشاء مشروع، تفاعل معه أولاً واسأله أسئلة لفهم المشروع (مثال: "ما هو اسم المشروع؟ وما هي فكرته العامة؟ هل تحب أن نقسم المشروع إلى أقسام محددة مثل (تطوير، تسويق، تصميم)؟").
- بعد أن يجيبك المستخدم وتفهم مشروعه بالكامل، قم ببناء خطة عمل (Roadmap) تحتوي على المهام والأقسام.
- **لكي تقوم بتنفيذ المشروع فعلياً في قاعدة البيانات**، يجب أن تُرفق في نهاية ردك (بعد أن تخبره بأنك قمت بالإنشاء) كود JSON يحمل هذا التنسيق بالضبط:
\`\`\`json
{
  "action": "CREATE_PROJECT",
  "payload": {
    "title": "اسم المشروع",
    "description": "وصف المشروع",
    "sections": ["اسم القسم الأول", "اسم القسم الثاني"],
    "tasks": [
      {
        "title": "اسم المهمة",
        "description": "وصف المهمة",
        "sectionIndex": 0
      }
    ]
  }
}
\`\`\`
ملاحظة: \`sectionIndex\` هو ترتيب القسم في مصفوفة \`sections\` (يبدأ من 0). إذا لم يكن هناك أقسام، اترك المصفوفة فارغة ولا ترسل \`sectionIndex\` للمهام.
إذا قمت بإرسال هذا الـ JSON، سيقوم النظام تلقائياً بإنشاء المشروع وإخفاء هذا الـ JSON عن المستخدم وعرض رابط المشروع له مكانه.

معلومات المستخدم الحالي الذي يتحدث معك الآن:
${userContext}`;

    let response;
    let success = false;
    let lastError = null;
    const maxAttempts = 3; // Retry up to 3 times for 3 API keys

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const aiClient = getGeminiClient();
        response = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: message,
          config: {
            systemInstruction: systemPrompt,
          },
        });
        success = true;
        break; // Stop loop on success
      } catch (error) {
        lastError = error;
        const errorMessage = error.message || "";
        console.error(
          `Gemini Chat Error (Attempt ${attempt + 1}):`,
          errorMessage,
        );

        // Handle rate limit/quota by switching keys
        if (
          errorMessage.includes("429") ||
          errorMessage.includes("RESOURCE_EXHAUSTED")
        ) {
          console.log("Rate limit exceeded, rotating to next API key...");
          rotateKey();
          // Continue to next attempt
        } else {
          // If it's a different error, try fallback model with the SAME key
          try {
            console.log("Attempting fallback to gemini-2.0-flash...");
            const aiClientFallback = getGeminiClient();
            response = await aiClientFallback.models.generateContent({
              model: "gemini-2.0-flash",
              contents: message,
              config: {
                systemInstruction: systemPrompt,
              },
            });
            success = true;
            break; // Stop loop on success
          } catch (fallbackError) {
            lastError = fallbackError;
            console.error("Fallback Error:", fallbackError.message);
            // If fallback also hits rate limit, rotate key
            if (
              fallbackError.message?.includes("429") ||
              fallbackError.message?.includes("RESOURCE_EXHAUSTED")
            ) {
              console.log(
                "Fallback rate limit exceeded, rotating to next API key...",
              );
              rotateKey();
            } else {
              break; // Unknown error, stop trying
            }
          }
        }
      }
    }

    if (!success) {
      // If all attempts failed
      const errorMessage = lastError?.message || "";
      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED")
      ) {
        return NextResponse.json({
          reply:
            "عذراً، لقد تم بلوغ الحد الأقصى للاستهلاك اليومي المخصص للخدمة في الوقت الحالي. يرجى معاودة المحاولة لاحقاً! ⏳",
          isRateLimited: true,
        });
      }

      return NextResponse.json(
        { error: "Failed to communicate with AI" },
        { status: 500 },
      );
    }

    // Increment user's message count upon success
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        if (!user.aiUsage) {
          user.aiUsage = { count: 0, lastReset: new Date() };
        }
        user.aiUsage.count = (user.aiUsage.count || 0) + 1;
        await user.save();
      }
    }

    let replyText = response.text;

    // Check if the AI wants to create a project
    const jsonMatch = replyText.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && userId) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        if (parsed.action === "CREATE_PROJECT" && parsed.payload) {
          const {
            title,
            description,
            sections = [],
            tasks = [],
          } = parsed.payload;

          // Create the Project
          const newProject = await Project.create({
            title,
            description,
            leaderId: userId,
            status: "active",
          });

          // Create Sections
          const createdSections = [];
          if (sections && sections.length > 0) {
            for (const secTitle of sections) {
              const newSec = await Section.create({
                title: secTitle,
                projectId: newProject._id,
              });
              createdSections.push(newSec);
            }
          }

          // Create Tasks
          const taskIds = [];
          for (const t of tasks) {
            const taskData = {
              title: t.title,
              description: t.description || "",
              projectId: newProject._id,
              createdBy: userId,
              status: "open",
              assignedTo: [],
            };

            // Assign to section if specified
            if (
              t.sectionIndex !== undefined &&
              createdSections[t.sectionIndex]
            ) {
              const secId = createdSections[t.sectionIndex]._id;
              taskData.sectionId = secId;
              taskData.sectionAssignments = [
                {
                  sectionId: secId,
                  members: [],
                },
              ];
            }

            const newTask = await Task.create(taskData);
            taskIds.push(newTask._id);
          }

          // Update Project with tasks
          newProject.tasks = taskIds;
          await newProject.save();

          // Replace the JSON block with the actual project link
          const projectLink = `\n\n🎉 **تم إنشاء المشروع بنجاح!**\nيمكنك البدء في إدارته من هنا: [${title}](/dashboard/projects/${newProject._id})`;
          replyText = replyText.replace(jsonMatch[0], projectLink);
        }
      } catch (parseError) {
        console.error(
          "Failed to parse or create project from AI JSON",
          parseError,
        );
        // If it fails, just remove the json block so the user doesn't see raw JSON
        replyText = replyText.replace(
          jsonMatch[0],
          "\n*(حدث خطأ أثناء محاولة إنشاء المشروع تلقائياً)*\n",
        );
      }
    }

    return NextResponse.json({ reply: replyText });
  } catch (globalError) {
    console.error("Global API Error:", globalError);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
