
import { useState } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutEntry } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";

interface DataManagerProps {
  workouts: WorkoutEntry[];
  onImportData: (workouts: WorkoutEntry[]) => void;
}

export function DataManager({ workouts, onImportData }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const exportData = () => {
    const dataStr = JSON.stringify(workouts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported",
      description: "Your workout data has been downloaded successfully.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        // Validate the data structure
        if (!Array.isArray(jsonData)) {
          throw new Error('Invalid data format');
        }
        
        // Basic validation of workout entries
        const validWorkouts = jsonData.filter((workout: any) => 
          workout.id && 
          workout.date && 
          workout.activity && 
          workout.duration
        );
        
        if (validWorkouts.length === 0) {
          throw new Error('No valid workout entries found');
        }
        
        onImportData(validWorkouts);
        setIsOpen(false);
        
        toast({
          title: "Data Imported",
          description: `Successfully imported ${validWorkouts.length} workouts.`,
        });
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid file format or corrupted data.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="min-h-[48px] border-lime-300 hover:bg-lime-50 touch-manipulation"
        >
          <Upload className="h-4 w-4 mr-2" />
          Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm mx-4 bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
            Manage Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg border border-lime-100">
            <h3 className="font-semibold text-green-800 mb-2">Export Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Download your workout data as a JSON file for backup.
            </p>
            <Button 
              onClick={exportData}
              className="w-full min-h-[48px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold touch-manipulation"
              disabled={workouts.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data ({workouts.length} workouts)
            </Button>
          </div>
          
          <div className="bg-white/70 p-4 rounded-lg border border-lime-100">
            <h3 className="font-semibold text-green-800 mb-2">Import Data</h3>
            <p className="text-sm text-gray-600 mb-3">
              Import workout data from a previously exported JSON file.
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="min-h-[48px] border-lime-200 focus:border-lime-400 touch-manipulation"
              />
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
