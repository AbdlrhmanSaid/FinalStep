"use client";

import { useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { translations } from "@/lib/translations";
import { useGetProject } from "@/hooks/projects/useGetProjects";
import { useCreateTask } from "@/hooks/tasks/useTasks";
import { useGetSections } from "@/hooks/sections/useGetSections";
import { useParams, useRouter } from "next/navigation";
import CheckUserRole from "@/lib/actions/checkUserRole";
import Loading from "@/components/Loading";
import DatePicker from "@/components/ui/DatePicker";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Plus, ListTodo, Trash } from "lucide-react";

export default function CreateTaskPage() {
  const { id: projectId } = useParams();
  const { data: project, isLoading } = useGetProject(projectId);
  const { data: sectionsData, isLoading: isLoadingSections } = useGetSections(projectId);
  const { mutate: createTask, isPending } = useCreateTask();
  const { language, isRTL, userId } = useAppContext();
  const router = useRouter();

  const content = translations[language].dashboard.addTask;

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: "",
    referenceLink: "",
    assignedTo: [],
    submissionMethod: "both",
    submissionDescription: "",
    allowLateSubmission: true,
    sectionAssignments: [{ sectionId: "", members: [] }],
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAssign = (userId, sectionIndex = null) => {
    if (sectionIndex !== null) {
      setForm(prev => {
         const newArr = [...prev.sectionAssignments];
         if (!newArr[sectionIndex].members.includes(userId)) {
            newArr[sectionIndex].members.push(userId);
         }
         return { ...prev, sectionAssignments: newArr };
      });
    } else {
      if (!form.assignedTo.includes(userId)) {
        setForm((prev) => ({
          ...prev,
          assignedTo: [...prev.assignedTo, userId],
        }));
      }
    }
  };

  const handleRemoveAssigned = (userId, sectionIndex = null) => {
    if (sectionIndex !== null) {
      setForm(prev => {
         const newArr = [...prev.sectionAssignments];
         newArr[sectionIndex].members = newArr[sectionIndex].members.filter(id => id !== userId);
         return { ...prev, sectionAssignments: newArr };
      });
    } else {
      setForm((prev) => ({
        ...prev,
        assignedTo: prev.assignedTo.filter((id) => id !== userId),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let finalAssignments = [];
    if (project?.hasSections) {
      finalAssignments = form.sectionAssignments.filter(sa => sa.sectionId);
      if (finalAssignments.length === 0) {
        toast.error(isRTL ? "يرجى اختيار قسم واحد على الأقل" : "Please select at least one section");
        return;
      }
      for (const sa of finalAssignments) {
        if (!sa.members || sa.members.length === 0) {
          toast.error(isRTL ? "يرجى تعيين عضو واحد على الأقل لكل قسم مختار" : "Please assign at least one member for each selected section");
          return;
        }
      }
    } else {
      if (form.assignedTo.length === 0) {
        toast.error(isRTL ? "يرجى تعيين المهمة لعضو واحد على الأقل" : "At least one member must be assigned");
        return;
      }
      // Provide a default fallback to the general section if it exists
      if (availableSections.length > 0) {
        finalAssignments = [{ sectionId: availableSections[0]._id, members: form.assignedTo }];
      }
    }

    createTask(
      {
        ...form,
        sectionAssignments: finalAssignments,
        dueDate: form.dueDate || null,
        projectId,
        createdBy: userId,
      },
      {
        onSuccess: () => {
          toast.success(content.successMessage);
          router.push(`/dashboard/projects/${projectId}`);
        },
        onError: (error) => {
          toast.error(
            error?.response?.data?.message ||
              (isRTL ? "حدث خطأ أثناء إنشاء المهمة." : "An error occurred."),
          );
        },
      },
    );
  };

  if (isLoading || isLoadingSections || !project) return <Loading />;

  let availableSections = sectionsData || [];
  if (availableSections.length > 0) {
    const isLeader = project.leaderId?._id === userId || project.coLeaders?.some(u => u._id === userId);
    if (!isLeader) {
      availableSections = availableSections.filter(s => s.members?.length === 0 || s.members?.some(m => m._id === userId));
    }
  }

  const allUsers = [...project.coLeaders, ...project.members];
  const teamMembers = Array.from(
    new Map(allUsers.map((user) => [user._id, user])).values(),
  );

  return (
    <CheckUserRole>
      <div className="p-4 md:p-8 bg-gray-50/50 dark:bg-gray-900 min-h-screen transition-colors overflow-hidden">
        <Card
          className="max-w-3xl mx-auto border-gray-200 dark:border-gray-800 shadow-md transition-colors dark:bg-gray-800"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <CardHeader className="bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-100 dark:border-gray-800 mb-6 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <ListTodo className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl md:text-2xl font-bold dark:text-white">
                  {content.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-500 mt-1">
                  {isRTL
                    ? "قم بإنشاء وتعيين مهام جديدة لأعضاء الفريق."
                    : "Create and assign new tasks for the team members."}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6 pb-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-[15px] font-semibold">
                  {content.taskTitle}
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder={content.taskTitlePlaceholder}
                  className="h-12 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-[15px] font-semibold"
                >
                  {content.taskDescription}
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder={content.taskDescriptionPlaceholder}
                  className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>



              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="priority"
                    className="text-[15px] font-semibold block"
                  >
                    {content.taskPriority}
                  </Label>
                  <select
                    id="priority"
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option
                      value="low"
                      className="text-blue-600 dark:text-blue-400"
                    >
                      {content.priorityLow}
                    </option>
                    <option
                      value="medium"
                      className="text-yellow-600 dark:text-yellow-400"
                    >
                      {content.priorityMedium}
                    </option>
                    <option
                      value="high"
                      className="text-red-600 dark:text-red-400"
                    >
                      {content.priorityHigh}
                    </option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="submissionMethod"
                    className="text-[15px] font-semibold block"
                  >
                    {content.submissionMethod}
                  </Label>
                  <select
                    id="submissionMethod"
                    name="submissionMethod"
                    value={form.submissionMethod}
                    onChange={handleChange}
                    className="w-full h-12 px-3 rounded-md border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="both">{content.methodBoth}</option>
                    <option value="text">{content.methodText}</option>
                    <option value="link">{content.methodLink}</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="submissionDescription"
                  className="text-[15px] font-semibold"
                >
                  {content.submissionDescriptionLabel}
                </Label>
                <Textarea
                  id="submissionDescription"
                  name="submissionDescription"
                  value={form.submissionDescription}
                  onChange={handleChange}
                  rows={2}
                  placeholder={content.submissionDescriptionPlaceholder}
                  className="resize-none bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <Label className="text-[15px] font-semibold block mb-2">
                    {content.dueDate}
                  </Label>
                  <DatePicker
                    value={form.dueDate}
                    onChange={(val) => setForm({ ...form, dueDate: val })}
                    placeholder={
                      content.dueDatePlaceholder || "Pick a due date..."
                    }
                    disablePast={true}
                    locale={isRTL ? "ar" : "en"}
                  />
                  {form.dueDate && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      {content.dueDateHint}
                    </p>
                  )}
                </div>

                <div className="space-y-2 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <Label
                    htmlFor="referenceLink"
                    className="text-[15px] font-semibold block mb-2"
                  >
                    {isRTL
                      ? "رابط مرجعي (اختياري)"
                      : "Reference Link (Optional)"}
                  </Label>
                  <Input
                    id="referenceLink"
                    name="referenceLink"
                    type="url"
                    value={form.referenceLink}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-11 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 shadow-sm focus-visible:ring-blue-500"
                  />
                </div>
              </div>

              {/* Assign Members */}
              {teamMembers.length > 0 && (
                <div className="space-y-4 pt-2">
                  {project?.hasSections ? (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                        <Label className="text-[16px] font-bold block">{isRTL ? "أقسام المهمة والأعضاء" : "Task Sections & Members"}</Label>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const existingSectionIds = (form.sectionAssignments||[]).map(a => a.sectionId);
                              const sectionsToAdd = availableSections.filter(s => !existingSectionIds.includes(s._id));
                              if (sectionsToAdd.length > 0) {
                                setForm(prev => ({
                                  ...prev, 
                                  sectionAssignments: [
                                    ...(prev.sectionAssignments||[]).filter(a => a.sectionId !== ""), 
                                    ...sectionsToAdd.map(sec => ({ sectionId: sec._id, members: [] }))
                                  ]
                                }));
                              }
                            }}
                            className="rounded-xl font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/50"
                          >
                            <Plus className="w-4 h-4 mr-1 ml-1" />
                            {isRTL ? "إضافة كل الأقسام" : "Add All"}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setForm(prev => ({...prev, sectionAssignments: [...(prev.sectionAssignments||[]), {sectionId: "", members: []}]}))}
                            className="rounded-xl font-bold"
                          >
                            <Plus className="w-4 h-4 mr-1 ml-1" />
                            {isRTL ? "إضافة قسم" : "Add Section"}
                          </Button>
                        </div>
                      </div>

                      {(form.sectionAssignments || []).map((assignment, index) => {
                         const getFilteredOptions = () => {
                           if (!assignment.sectionId) return teamMembers;
                           const sec = availableSections.find(s => s._id === assignment.sectionId);
                           if (!sec || !sec.members || sec.members.length === 0) return [];
                           const allowedIds = sec.members.map(m => String(typeof m === "object" ? m._id : m));
                           return teamMembers.filter(tm => allowedIds.includes(String(tm._id)));
                         };
                         const sectionOptions = getFilteredOptions();

                         return (
                           <div key={index} className="p-4 bg-gray-50/50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 shadow-sm rounded-[24px] space-y-4 transition-all">
                             <div className="flex items-center justify-between">
                               <Label className="font-black text-gray-700 dark:text-gray-300">
                                 {isRTL ? `القسم ${index + 1}` : `Section ${index + 1}`}
                               </Label>
                               {index > 0 && (
                                 <button type="button" onClick={() => {
                                   const newArr = [...form.sectionAssignments];
                                   newArr.splice(index, 1);
                                   setForm(prev => ({...prev, sectionAssignments: newArr}));
                                 }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-2 rounded-xl transition-colors">
                                   <Trash className="w-4 h-4" />
                                 </button>
                               )}
                             </div>

                             <select
                               value={assignment.sectionId}
                               onChange={(e) => {
                                 const newArr = [...form.sectionAssignments];
                                 newArr[index].sectionId = e.target.value;
                                 setForm(prev => ({...prev, sectionAssignments: newArr}));
                               }}
                               className="w-full h-12 px-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                             >
                               <option value="" disabled>{isRTL ? "اختر القسم..." : "Select a section..."}</option>
                               {availableSections.map(sec => <option key={sec._id} value={sec._id}>{sec.title}</option>)}
                             </select>

                             {assignment.sectionId && (
                               <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-800">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-sm font-bold text-gray-600 dark:text-gray-400">{isRTL ? "أعضاء هذا القسم" : "Members for this section"}</Label>
                                    <button type="button" onClick={() => {
                                      if (sectionOptions.length > 0) {
                                        setForm(prev => {
                                          const newArr = [...prev.sectionAssignments];
                                          newArr[index].members = sectionOptions.map(u => u._id);
                                          return {...prev, sectionAssignments: newArr};
                                        });
                                      }
                                    }} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                      {isRTL ? "اختيار الكل" : "Select All"}
                                    </button>
                                  </div>
                                  <Command className="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm dark:bg-gray-800" dir={isRTL ? "rtl" : "ltr"}>
                                    <div className="relative">
                                      <CommandInput placeholder={content.searchMember} className={`h-12 border-none ring-0 focus:ring-0 ${isRTL ? "pr-10" : "pl-10"}`} />
                                    </div>
                                    <CommandList className="max-h-40 overflow-auto">
                                      {sectionOptions.length === 0 && (
                                        <div className="p-4 text-center text-sm text-gray-500 font-medium bg-gray-50/50 dark:bg-gray-800/50">
                                          {isRTL ? "يجب إضافة أعضاء لهذا القسم من خلال خيارات القسم في لوحة المهام أولاً" : "Add members to this section via Section options in Project Tasks first"}
                                        </div>
                                      )}
                                      {sectionOptions.map((user) => (
                                        <CommandItem
                                          key={user._id}
                                          value={user.name !== "null null" && user.name ? user.name : user.email?.split("@")[0].replace(/[0-9]/g, "")}
                                          onSelect={() => handleAssign(user._id, index)}
                                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center justify-between gap-3 min-w-0"
                                        >
                                          <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">
                                              {user?.email?.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                              <p className="font-semibold text-gray-800 dark:text-white truncate">
                                                {user.name !== "null null" && user.name ? user.name : user.email?.split("@")[0].replace(/[0-9]/g, "")}
                                              </p>
                                            </div>
                                          </div>
                                          {assignment.members.includes(user._id) && (
                                            <span className="shrink-0 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-wider flex items-center">
                                              ✓ {isRTL ? "مضاف" : "ADDED"}
                                            </span>
                                          )}
                                        </CommandItem>
                                      ))}
                                    </CommandList>
                                  </Command>

                                  {assignment.members.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                      {assignment.members.map((uid) => {
                                        const user = teamMembers.find((u) => u._id === uid);
                                        return (
                                          <Badge key={uid} onClick={() => handleRemoveAssigned(uid, index)} variant="secondary" className="cursor-pointer px-3 py-1.5 rounded-xl hover:bg-red-50 hover:text-red-600 border border-gray-200">
                                            <span className="font-bold mr-1 ml-1">{user?.name && user.name !== "null null" ? user.name : user?.email?.split("@")[0] || uid}</span>
                                            <span className="text-gray-400 font-bold">×</span>
                                          </Badge>
                                        );
                                      })}
                                    </div>
                                  )}
                               </div>
                             )}
                           </div>
                         );
                      })}
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <Label className="text-[15px] font-semibold">{content.assignTo}</Label>
                        <button type="button" onClick={() => {
                           setForm(prev => ({...prev, assignedTo: teamMembers.map(u => u._id)}));
                        }} className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                          {isRTL ? "اختيار الكل" : "Select All"}
                        </button>
                      </div>
                      <Command className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm dark:bg-gray-900 mt-1" dir={isRTL ? "rtl" : "ltr"}>
                        <div className="relative">
                          <CommandInput
                            placeholder={content.searchMember}
                            className={`h-12 outline-none border-none ring-0 shadow-none focus-visible:ring-0 focus:outline-none ${isRTL ? "pr-10" : "pl-10"}`}
                          />
                        </div>
                        <CommandList className="max-h-48 overflow-auto">
                          {teamMembers.map((user) => (
                            <CommandItem
                              key={user._id}
                              value={user.name !== "null null" && user.name ? user.name : user.email?.split("@")[0]}
                              onSelect={() => handleAssign(user._id)}
                              className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex items-center justify-between gap-3 min-w-0"
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700">
                                  {user?.email?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-semibold text-gray-800 dark:text-white truncate">
                                    {user.name !== "null null" && user.name ? user.name : user.email?.split("@")[0]}
                                  </p>
                                </div>
                              </div>
                              {form.assignedTo.includes(user._id) && (
                                <span className="text-green-600 dark:text-green-400 text-xs font-bold">✓ {isRTL ? "مضاف" : "Added"}</span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </Command>

                      {form.assignedTo.length > 0 && (
                        <div className="space-y-2 mt-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <Label className="text-[14px] text-gray-600 font-medium">{content.selectedMembers}</Label>
                          <div className="flex flex-wrap gap-2">
                            {form.assignedTo.map((uid) => {
                              const user = teamMembers.find((u) => u._id === uid);
                              return (
                                <Badge key={uid} onClick={() => handleRemoveAssigned(uid)} variant="secondary" className="cursor-pointer border border-gray-200 px-3 py-1.5 rounded-xl">
                                  <span className="font-medium mr-1 ml-1">{user?.name && user.name !== "null null" ? user.name : user?.email?.split("@")[0]}</span>
                                  <span className="text-gray-400 font-bold">×</span>
                                </Badge>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Late Submission Toggle */}
              {/* Late Submission Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-semibold text-gray-800 dark:text-white">
                    {isRTL ? "السماح بالتسليم المتأخر" : "Allow Late Submission"}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {form.allowLateSubmission
                      ? isRTL
                        ? "الأعضاء يقدرون يسلموا بعد الـ deadline (يُحتسب متأخر)"
                        : "Members can submit after the deadline (marked as late)"
                      : isRTL
                        ? "لا يُسمح بالتسليم بعد انتهاء الـ deadline"
                        : "Submissions blocked after the deadline"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, allowLateSubmission: !prev.allowLateSubmission }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    form.allowLateSubmission ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.allowLateSubmission ? (isRTL ? "-translate-x-6" : "translate-x-6") : (isRTL ? "-translate-x-1" : "translate-x-1")
                    }`}
                  />
                </button>
              </div>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 mt-8">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 text-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {content.creating}
                    </span>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      {content.create}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </CheckUserRole>
  );
}
