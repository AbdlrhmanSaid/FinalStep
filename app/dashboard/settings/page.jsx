import { getFullUserOrRedirect } from "@/lib/getFullUser";
import SettingsPageClient from "./SettingsPageClient";

export const metadata = {
  title: "Settings - FinalStep",
};

export default async function SettingsPage() {
  const user = await getFullUserOrRedirect();

  return <SettingsPageClient serializedUser={JSON.stringify(user)} />;
}
