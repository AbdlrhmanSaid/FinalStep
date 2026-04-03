import { getFullUserOrRedirect } from "@/lib/getFullUser";
import UserProfilePage from "../user/[id]/UserProfilePage";

// Render the unified profile page (/dashboard/profile) without redirecting to the ID-based URL
const ProfilePage = async () => {
  const user = await getFullUserOrRedirect();
  return <UserProfilePage userId={user._id.toString()} />;
};

export default ProfilePage;
