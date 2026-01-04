import { getFullUserOrRedirect } from "../../../lib/getFullUser";
import UserForm from "./EditNameForm";

const ProfilePage = async () => {
  const user = await getFullUserOrRedirect();

  return <UserForm name={user.name} userId={user._id} email={user.email} />;
};

export default ProfilePage;

