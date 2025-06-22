
import { Activity } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-lime-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-lime-400 rounded-full">
            <Activity className="h-6 w-6 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
              Workout Tracker
            </h1>
            <p className="text-sm text-gray-700">Track your fitness journey</p>
          </div>
        </div>
      </div>
    </header>
  );
}
