import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default function DashboardLayout({ children }) {
  return (
    <div className="px-5">
      <h1 className="text-6xl font-bold tracking-tighter text-blue-600 mb-8">
        Dashboard
      </h1>

      <Suspense
        fallback={
          <BarLoader className="mt-4" width={"100%"} color="#2563eb" />
        }
      >
        {children}
      </Suspense>
    </div>
  );
}
