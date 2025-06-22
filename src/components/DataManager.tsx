
import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { WorkoutEntry } from "@/pages/Index";

interface DataManagerProps {
  workouts: WorkoutEntry[];
  onImportData: (workouts: WorkoutEntry[]) => void;
}

export function DataManager({ workouts }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="min-h-[56px] px-6 border-lime-300 hover:bg-lime-50 touch-manipulation text-base font-medium"
        >
          <Upload className="h-5 w-5 mr-2" />
          Data
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
            Data Overview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-white/80 p-4 rounded-xl border border-lime-100 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Current Data</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Your workout data is automatically saved to your device.
            </p>
            <p className="text-lg font-bold text-green-700 text-center">
              {workouts.length} workouts stored
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
