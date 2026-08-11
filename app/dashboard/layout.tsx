export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-100">

      {children}

    </main>

  );

}