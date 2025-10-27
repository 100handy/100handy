import { getUser } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {user.email}!
        </p>
        <div className="mt-8 grid gap-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">User Information</h2>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium text-gray-700">Email:</dt>
                <dd className="text-gray-600">{user.email}</dd>
              </div>
              <div>
                <dt className="font-medium text-gray-700">User ID:</dt>
                <dd className="text-gray-600">{user.id}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
