import { getFullUserOrRedirect } from "@/lib/getFullUser";
import { redirect } from "next/navigation";

// Redirect to the unified profile page (/dashboard/user/[id])
// The owner sees their profile with a Settings tab available there
const ProfilePage = async () => {
  const user = await getFullUserOrRedirect();
  redirect(`/dashboard/user/${user._id}`);
};

export default ProfilePage;
