import { useState } from "react";
import { Download, Upload, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WorkoutEntry } from "@/pages/Index";
import { useToast } from "@/hooks/use-toast";
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

interface DataManagerProps {
  workouts: WorkoutEntry[];
  onImportData: (workouts: WorkoutEntry[]) => void;
}

export function DataManager({ workouts, onImportData }: DataManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const exportData = async () => {
    const dataStr = JSON.stringify(workouts, null, 2);
    const fileName = `workout-data-${new Date().toISOString().split('T')[0]}.json`;
    
    // Try to use File System Access API first (modern browsers)
    if ('showSaveFilePicker' in window) {
      try {
        console.log('💾 Using File System Access API to save with directory picker...');
        
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'JSON files',
            accept: { 'application/json': ['.json'] },
          }],
        });
        
        const writable = await fileHandle.createWritable();
        await writable.write(dataStr);
        await writable.close();
        
        console.log('✅ Successfully saved backup using directory picker');
        
        toast({
          title: "Backup Saved",
          description: `Your workout data has been saved to your selected location`,
        });
        return;
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('❌ Failed to save with File System Access API:', error);
        } else {
          console.log('📝 User cancelled file save dialog');
          return;
        }
      }
    }
    
    // Try to use native filesystem for mobile/native apps
    if (Capacitor.isNativePlatform()) {
      try {
        console.log('📱 Using native filesystem to save to Files folder...');
        
        await Filesystem.writeFile({
          path: fileName,
          data: dataStr,
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });
        
        console.log('✅ Successfully saved backup to Files folder');
        
        toast({
          title: "Backup Saved",
          description: `Your workout data has been saved to Files/${fileName}`,
        });
        return;
      } catch (error) {
        console.error('❌ Failed to save with native filesystem:', error);
        // Fall back to web download method
      }
    }
    
    // Fallback to web download method
    console.log('🌐 Using web download method...');
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
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
          className="min-h-[56px] px-6 border-lime-300 hover:bg-lime-50 touch-manipulation text-base font-medium"
        >
          <Upload className="h-5 w-5 mr-2" />
          Data
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto bg-gradient-to-br from-lime-50 to-green-50 border-2 border-lime-200 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent">
            Manage Data
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-white/80 p-4 rounded-xl border border-lime-100 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Export Data</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Choose where to save your workout data backup file.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={exportData}
                className="w-full min-h-[52px] bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold touch-manipulation text-base shadow-md"
                disabled={workouts.length === 0}
              >
                <Download className="h-5 w-5 mr-2" />
                Backup Locally
              </Button>
              <Button 
                onClick={shareData}
                variant="outline"
                className="w-full min-h-[52px] border-2 border-green-300 hover:bg-green-50 touch-manipulation text-base font-medium"
                disabled={workouts.length === 0}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share Data
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-3 text-center">
              {workouts.length} workouts available
            </p>
          </div>
          
          <div className="bg-white/80 p-4 rounded-xl border border-lime-100 shadow-sm">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Import Data</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Import workout data from a previously exported JSON file.
            </p>
            <Label htmlFor="file-upload" className="cursor-pointer">
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="min-h-[52px] border-2 border-lime-200 focus:border-lime-400 touch-manipulation text-base file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-lime-50 file:text-lime-700 hover:file:bg-lime-100"
              />
            </Label>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
