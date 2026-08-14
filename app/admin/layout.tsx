import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin, error } =
    await supabase
      .from("admins")
      .select("id, auth_id, email")
      .eq("auth_id", user.id)
      .maybeSingle();

  if (error || !admin) {
    redirect("/admin/login");
  }

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}