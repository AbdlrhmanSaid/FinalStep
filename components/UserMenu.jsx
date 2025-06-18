import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

export default function UserMenu({ t }) {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  if (!isLoaded) return null;

  return (
    <>
      {!isSignedIn ? (
        <Link href="/login">
          <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
            {t.getStarted}
          </Button>
        </Link>
      ) : (
        <div>
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>
              <UserButton.Action
                label={t.dashboard || "Dashboard"} // قيمة افتراضية
                onClick={() => router.push("/dashboard")}
              />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      )}
    </>
  );
}
