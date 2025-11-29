"use client";
import { useAppContext } from "../../contexts/AppContext";
import {
  Home,
  User,
  Briefcase,
  CheckCircle,
  Mail,
  ListChecks,
  XCircle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Target,
  Award,
  Clock 
} from "lucide-react";
import { translations } from "../../lib/translations";
import Link from "next/link";
import { useDashboard } from "../../hooks/useDashboard";
import Loading from "../../components/Loading";
import { Button } from "../../@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../@/components/ui/select";
import { useUpdateTask } from "../../hooks/tasks/useTasks";

// مكون Progress Bar
const ProgressBar = ({ value, max, color = "blue" }) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  const colorClasses = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    teal: "bg-teal-500",
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div
        className={`h-full ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

// مكون Stat Card محسّن
const StatCard = ({ title, value, icon, gradient, percentage, subtext }) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
            {icon}
          </div>
          {percentage !== undefined && (
            <div className="flex items-center gap-1 text-white/90 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              {percentage}%
            </div>
          )}
        </div>
        <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-3xl font-bold mb-2">{value}</p>
        {subtext && (
          <p className="text-white/70 text-xs">{subtext}</p>
        )}
      </div>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
    </div>
  );
};

export default function WelcomePage() {
  const { email, language } = useAppContext();
  const content = translations[language].dashboard;
  const { data, isLoading, isError, refetch, isFetching } = useDashboard();
  const { mutate: updateTask } = useUpdateTask();

  const handleInviteRespond = async (inviteId, action) => {
    try {
      await axios.put(`/api/invite/respond`, { inviteId, action });
      
      if (action === "accepted") {
        toast.success(content.invitations.acceptSuccess);
      } else {
        toast.success(content.invitations.rejectSuccess);
      }
      
      await refetch();
    } catch (err) {
      console.error("Failed to respond:", err);
      toast.error(content.invitations.respondError);
    }
  };

  const handleTaskStatusChange = (taskId, newStatus) => {
    updateTask(
      {
        taskId,
        data: { status: newStatus },
      },
      {
        onSuccess: () => {
          toast.success(content.tasks.statusUpdated);
          refetch();
        },
        onError: () => {
          toast.error("فشل في تحديث الحالة");
        },
      }
    );
  };

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <div className="min-h-screen bgMain flex items-center justify-center">
        <div className="text-red-500">Error loading dashboard data</div>
      </div>
    );

  // حساب النسب المئوية
  const projectsPercentage = data?.projectsCount > 0 
    ? Math.round((data?.finishedProjectsCount / data?.projectsCount) * 100) 
    : 0;
  
  const tasksPercentage = data?.tasksCount > 0 
    ? Math.round((data?.finishedTasksCount / data?.tasksCount) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {content.welcome.title}
              </h1>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <strong className="text-blue-600 dark:text-blue-400">{email || "Guest"}</strong>
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              className="flex items-center gap-2 text-gray-50 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? content.updating : content.update}
            </Button>
            <Link href="/dashboard/how-it-works">
              <Button
                variant="outline"
                className="text-gray-500 dark:text-gray-400 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {content.welcome.subtitle}
              </Button>
            </Link>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={content.stats.projects}
            value={data?.projectsCount || 0}
            icon={<Briefcase className="w-6 h-6 text-white" />}
            gradient="from-blue-500 to-blue-600"
            percentage={projectsPercentage}
            subtext={`${data?.finishedProjectsCount || 0} ${content.completed}`}
          />
          
          <StatCard
            title={content.stats.tasks}
            value={data?.tasksCount || 0}
            icon={<ListChecks className="w-6 h-6 text-white" />}
            gradient="from-purple-500 to-purple-600"
            percentage={tasksPercentage}
            subtext={`${data?.finishedTasksCount || 0}  ${content.completed}  `}
          />
          
          <StatCard
            title={content.stats.pendingInvites}
            value={data?.pendingInvitesCount || 0}
            icon={<Mail className="w-6 h-6 text-white" />}
            gradient="from-amber-500 to-amber-600"
            subtext={data?.pendingInvitesCount > 0 ? "تحتاج للمراجعة" : "لا توجد دعوات"}
          />
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Projects Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {content.ProjectsInProgress}
                </h3>
              </div>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {projectsPercentage}%
              </span>
            </div>
            <ProgressBar 
              value={data?.finishedProjectsCount || 0} 
              max={data?.projectsCount || 0} 
              color="blue" 
            />
            <div className="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span>{data?.finishedProjectsCount || 0} {content.completed}</span>
              <span>{(data?.projectsCount || 0) - (data?.finishedProjectsCount || 0)} {content.inProgress}</span>
            </div>
          </div>

          {/* Tasks Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {content.TasksInProgress}
                </h3>
              </div>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {tasksPercentage}%
              </span>
            </div>
            <ProgressBar 
              value={data?.finishedTasksCount || 0} 
              max={data?.tasksCount || 0} 
              color="purple" 
            />
            <div className="flex justify-between mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span>{data?.finishedTasksCount || 0} {content.completed}</span>
              <span>{(data?.tasksCount || 0) - (data?.finishedTasksCount || 0)} {content.inProgress}</span>
            </div>
          </div>
        </div>

        {/* Main Content - Recent Invitations & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Invitations */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                {content.invitations.recent}
              </h2>
              {data?.recentInvites?.length > 0 && (
                <Link href="/dashboard/invitations">
                  <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-900/20">
                    {content.invitations.viewAll} →
                  </Button>
                </Link>
              )}
            </div>

            {data?.recentInvites?.length > 0 ? (
              <div className="space-y-3">
                {data.recentInvites.map((invite) => (
                  <div
                    key={invite._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700/50 dark:to-gray-700/30 hover:shadow-md transition-all"
                  >
                    <p className="text-sm mb-3 text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <strong>{invite.projectId?.title || content.invitations.invitedTo}</strong>
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleInviteRespond(invite._id, "accepted")}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        {content.invitations.Accept}
                      </Button>
                      <Button
                        onClick={() => handleInviteRespond(invite._id, "rejected")}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        {content.invitations.Reject}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-3">
                  <Mail className="w-8 h-8 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">{content.invitations.empty}</p>
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <ListChecks className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                {content.tasks.recent}
              </h2>
              {data?.recentTasks?.length > 0 && (
                <Link href="/dashboard/tasks">
                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                    {content.tasks.viewAll} →
                  </Button>
                </Link>
              )}
            </div>

            {data?.recentTasks?.length > 0 ? (
              <div className="space-y-3">
                {data.recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-700/50 dark:to-gray-700/30 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-800 dark:text-white flex-1">
                        {task.title}
                      </h3>
                      <Link href={`/dashboard/task/${task._id}`}>
                        <Button variant="ghost" size="sm" className="h-6 px-2 hover:bg-purple-100 dark:hover:bg-purple-900/30">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-1">
                      {task.description}
                    </p>
                    <Select
                      value={task.status}
                      onValueChange={(value) => handleTaskStatusChange(task._id, value)}
                    >
                      <SelectTrigger className="w-full h-8 text-xs bg-white dark:bg-gray-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">{content.taskDetails.status.open}</SelectItem>
                        <SelectItem value="in-progress">{content.taskDetails.status.inProgress}</SelectItem>
                        <SelectItem value="submitted">{content.taskDetails.status.submitted}</SelectItem>
                        <SelectItem value="completed">{content.taskDetails.status.completed}</SelectItem>
                        <SelectItem value="rejected">{content.taskDetails.status.rejected}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3">
                  <ListChecks className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400">{content.tasks.empty}</p>
              </div>
            )}
          </div>
        </div>

        {/* Insights & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Timeline */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              {language === 'ar' ? 'النشاط الأخير' : 'Recent Activity'}
            </h2>
            
            <div className="space-y-4">
              {/* Projects Activity */}
              {data?.projectsCount > 0 && (
                <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                      {language === 'ar' ? 'المشاريع النشطة' : 'Active Projects'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'ar' 
                        ? `لديك ${data.projectsCount} ${data.projectsCount === 1 ? 'مشروع' : 'مشاريع'} نشطة`
                        : `You have ${data.projectsCount} active ${data.projectsCount === 1 ? 'project' : 'projects'}`
                      }
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span>{projectsPercentage}%</span>
                      </div>
                      <ProgressBar value={data?.finishedProjectsCount || 0} max={data?.projectsCount || 0} color="blue" />
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks Activity */}
              {data?.tasksCount > 0 && (
                <div className="flex items-start gap-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <ListChecks className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                      {language === 'ar' ? 'المهام الجارية' : 'Ongoing Tasks'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'ar'
                        ? `${(data.tasksCount || 0) - (data.finishedTasksCount || 0)} ${((data.tasksCount || 0) - (data.finishedTasksCount || 0)) === 1 ? 'مهمة' : 'مهام'} قيد التنفيذ`
                        : `${(data.tasksCount || 0) - (data.finishedTasksCount || 0)} ${((data.tasksCount || 0) - (data.finishedTasksCount || 0)) === 1 ? 'task' : 'tasks'} in progress`
                      }
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                        <span>{language === 'ar' ? 'التقدم' : 'Progress'}</span>
                        <span>{tasksPercentage}%</span>
                      </div>
                      <ProgressBar value={data?.finishedTasksCount || 0} max={data?.tasksCount || 0} color="purple" />
                    </div>
                  </div>
                </div>
              )}

              {/* Invitations Activity */}
              {data?.pendingInvitesCount > 0 && (
                <div className="flex items-start gap-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800">
                  <div className="p-2 bg-amber-500 rounded-lg animate-pulse">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                      {language === 'ar' ? 'دعوات معلقة' : 'Pending Invitations'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'ar'
                        ? `لديك ${data.pendingInvitesCount} ${data.pendingInvitesCount === 1 ? 'دعوة' : 'دعوات'} تحتاج للمراجعة`
                        : `You have ${data.pendingInvitesCount} pending ${data.pendingInvitesCount === 1 ? 'invitation' : 'invitations'}`
                      }
                    </p>
                    <Link href="/dashboard/invitations">
                      <Button size="sm" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white">
                        {language === 'ar' ? 'مراجعة الدعوات' : 'Review Invitations'}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {data?.projectsCount === 0 && data?.tasksCount === 0 && data?.pendingInvitesCount === 0 && (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                    <Clock className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {language === 'ar' ? 'لا يوجد نشاط حديث' : 'No recent activity'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Insights Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              {language === 'ar' ? 'إحصائيات' : 'Insights'}
            </h2>

            <div className="space-y-4">
              {/* Completion Rate */}
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'ar' ? 'معدل الإنجاز' : 'Completion Rate'}
                  </span>
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {Math.round(((data?.finishedProjectsCount || 0) + (data?.finishedTasksCount || 0)) / 
                    Math.max((data?.projectsCount || 0) + (data?.tasksCount || 0), 1) * 100)}%
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {language === 'ar' ? 'من إجمالي المهام والمشاريع' : 'of total tasks & projects'}
                </p>
              </div>

              {/* Active Work */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {language === 'ar' ? 'العمل النشط' : 'Active Work'}
                  </span>
                  <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {((data?.projectsCount || 0) - (data?.finishedProjectsCount || 0)) + 
                   ((data?.tasksCount || 0) - (data?.finishedTasksCount || 0))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {language === 'ar' ? 'مهام ومشاريع قيد العمل' : 'tasks & projects in progress'}
                </p>
              </div>

              {/* Productivity Tip */}
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-2">
                  <div className="p-1 bg-purple-500 rounded">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800 dark:text-white mb-1">
                      {language === 'ar' ? '💡 نصيحة' : '💡 Tip'}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {language === 'ar'
                        ? 'قم بمراجعة المهام المعلقة بانتظام لتحسين الإنتاجية'
                        : 'Review pending tasks regularly to boost productivity'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
