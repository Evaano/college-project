import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { safeRedirect } from "~/utils";

export const meta: MetaFunction = () => [{ title: "User" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { searchParams } = new URL(request.url);
  const redirectTo = safeRedirect(searchParams.get("redirectTo"), "/");
  const userId = await requireUserId(request, redirectTo);

  if (!userId) {
    return redirect(redirectTo);
  }

  return { userId };
};

export default function Events() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
