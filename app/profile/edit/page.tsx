import Link from "next/link";
import { GetUser, UpdateUser } from "@/utils/userData";
import { createClientSsr } from "@/utils/supabase/client";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await GetUser();
  const supabase = createClientSsr();
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .match({ user_id: user.id })
    .single();
  if (error) {
    console.error(`edit profile`, error);
    return redirect("/");
  }

  const saveProfile = async (formData: FormData) => {
    "use server";
    const displayName =
      (formData.get("displayName") as string) || data?.display_name;
    const lwUsername =
      (formData.get("lwUsername") as string) || data?.lw_username;
    const bio = (formData.get("bio") as string) || data?.bio;

    // check formData.lw_username validity
    if (lwUsername !== null && lwUsername !== data?.lw_username) {
      // add lessWrong check
    }
    await UpdateUser({ user_id: user.id, displayName, lwUsername, bio })
      .then(redirect("/profile"))
      .catch((error) => {
        console.error(`update profile error`, error);
      });
    return;
  };
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <Link
        href="/profile"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        Back
      </Link>

      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground profile-form"
        action={saveProfile}
      >
        <label className="text-md" htmlFor="displayName">
          Display Name
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="displayName"
          placeholder="Display Name"
          defaultValue={data?.display_name}
        />
        <label className="text-md" htmlFor="lwUsername">
          LessWrong Username
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="lwUsername"
          placeholder="LessWrong Username"
          defaultValue={data?.lw_username}
        />

        <label className="text-md" htmlFor="bio">
          Bio
        </label>
        <textarea
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="bio"
        >
          {data?.bio}
        </textarea>
        <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
          Save
        </button>
      </form>
    </div>
  );
}
