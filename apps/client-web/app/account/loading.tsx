import { Loader2 } from "lucide-react";

export default function AccountLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C1856A] mx-auto mb-4" />
        <p className="text-gray-600">Loading account...</p>
      </div>
    </div>
  );
}

