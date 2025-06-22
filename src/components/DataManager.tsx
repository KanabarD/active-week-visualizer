import { useState } from "react";
import { Download, Upload, Share2 } from "lucide-react";
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

  const shareData = async () => {
    const dataStr = JSON.stringify(workouts, null, 2);
    
    if (navigator.share) {
      try {
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const file = new File([dataBlob], `workout-data-${new Date().toISOString().split('T')[0]}.json`, { type: 'application/json' });
        
        await navigator.share({
          title: 'My Workout Data',
          text: 'Here is my workout tracking data',
          files: [file]
        });
        
        toast({
          title: "Data Shared",
          description: "Your workout data has been shared successfully.",
        });
      } catch (error) {
        // If sharing files fails, fall back to sharing text
        if (navigator.canShare && navigator.canShare({ text: dataStr })) {
          try {
            await navigator.share({
              title: 'My Workout Data',
              text: dataStr
            });
            
            toast({
              title: "Data Shared",
              description: "Your workout data has been shared as text.",
            });
          } catch (textError) {
            copyToClipboard(dataStr);
          }
        } else {
          copyToClipboard(dataStr);
        }
      }
    } else {
      copyToClipboard(dataStr);
    }
  };

  const copyToClipboard = async (data: string) => {
    try {
      await navigator.clipboard.writeText(data);
      toast({
        title: "Data Copied",
        description: "Your workout data has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share data. Please try the download option instead.",
        variant: "destructive",
      });
    }
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
        
        <div className="space-y-3">
          <div className="bg-white/70 p-3 rounded-lg border border-lime-100">
            <h3 className="font-semibold text-green-800 mb-1 text-sm">Export Data</h3>
            <p className="text-xs text-gray-600 mb-2">
              Download or share your workout data for backup or sharing.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={exportData}
                className="flex-1 min-h-[40px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold touch-manipulation text-xs"
                disabled={workouts.length === 0}
              >
                <Download className="h-3 w-3 mr-1" />
                Backup Locally
              </Button>
              <Button 
                onClick={shareData}
                variant="outline"
                className="flex-1 min-h-[40px] border-green-300 hover:bg-green-50 touch-manipulation text-xs"
                disabled={workouts.length === 0}
              >
                <Share2 className="h-3 w-3 mr-1" />
                Share
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {workouts.length} workouts available
            </p>
          </div>
          
          <div className="bg-white/70 p-3 rounded-lg border border-lime-100">
            <h3 className="font-semibold text-green-800 mb-1 text-sm">Import Data</h3>
            <p className="text-xs text-gray-600 mb-2">
              Import workout data from a previously exported JSON file.
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="min-h-[40px] border-lime-200 focus:border-lime-400 touch-manipulation"
              />
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
