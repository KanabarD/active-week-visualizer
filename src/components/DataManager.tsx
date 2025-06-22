import { useState } from "react";
import { WorkoutEntry } from "@/pages/Index";
import { Button } from "@/components/ui/button";
import { Download, Upload, FileText, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface DataManagerProps {
  workouts: WorkoutEntry[];
  onImportData: (workouts: WorkoutEntry[]) => void;
}

export function DataManager({ workouts, onImportData }: DataManagerProps) {
  const [isImporting, setIsImporting] = useState(false);

  const exportToCSV = () => {
    try {
      // Create CSV header
      const headers = [
        'Date',
        'Activity',
        'Duration (minutes)',
        'Secondary Activity',
        'Secondary Duration (minutes)',
        'Exercise Type',
        'PPL Split',
        'Custom Activity Name',
        'Custom Secondary Activity Name',
        'ID'
      ];

      // Create CSV rows
      const csvRows = [headers.join(',')];
      
      workouts.forEach(workout => {
        const row = [
          format(new Date(workout.date), 'yyyy-MM-dd'),
          workout.activity,
          workout.duration,
          workout.secondaryActivity || '',
          workout.secondaryDuration || '',
          workout.exerciseType || '',
          workout.pplSplit || '',
          workout.customActivityName || '',
          workout.customSecondaryActivityName || '',
          workout.id
        ].map(field => `"${field}"`).join(',');
        
        csvRows.push(row);
      });

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `workout-data-${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success(`Exported ${workouts.length} workouts to CSV`);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export CSV file');
    }
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const lines = csvContent.split('\n');
        
        if (lines.length < 2) {
          toast.error('CSV file is empty or invalid');
          setIsImporting(false);
          return;
        }

        // Parse headers
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        // Expected headers
        const expectedHeaders = [
          'Date',
          'Activity',
          'Duration (minutes)',
          'Secondary Activity',
          'Secondary Duration (minutes)',
          'Exercise Type',
          'PPL Split',
          'Custom Activity Name',
          'Custom Secondary Activity Name',
          'ID'
        ];

        // Validate headers
        if (!expectedHeaders.every(header => headers.includes(header))) {
          toast.error('CSV file format is invalid. Please use the exported format.');
          setIsImporting(false);
          return;
        }

        const importedWorkouts: WorkoutEntry[] = [];
        let errorCount = 0;

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          try {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            
            if (values.length < headers.length) {
              errorCount++;
              continue;
            }

            // Validate activity type first
            const validActivities: WorkoutEntry['activity'][] = [
              'Brazilian Jiu-Jitsu', 'Cycling', 'Hiking', 'Kickboxing', 
              'Other', 'Resistance', 'Running', 'Swimming'
            ];
            
            const activity = values[1] as WorkoutEntry['activity'];
            if (!validActivities.includes(activity)) {
              errorCount++;
              continue;
            }

            const workout: WorkoutEntry = {
              id: values[9] || Date.now().toString() + i,
              date: new Date(values[0]).toISOString(),
              activity: activity,
              duration: parseInt(values[2]) || 0,
              secondaryActivity: values[3] && validActivities.includes(values[3] as WorkoutEntry['activity']) ? values[3] as WorkoutEntry['activity'] : undefined,
              secondaryDuration: values[4] ? parseInt(values[4]) : undefined,
              exerciseType: values[5] as WorkoutEntry['exerciseType'] || undefined,
              pplSplit: values[6] as WorkoutEntry['pplSplit'] || undefined,
              customActivityName: values[7] || undefined,
              customSecondaryActivityName: values[8] || undefined
            };

            // Validate required fields
            if (!workout.duration || isNaN(workout.duration)) {
              errorCount++;
              continue;
            }

            // Validate exercise type if present
            const validExerciseTypes: WorkoutEntry['exerciseType'][] = ['Push', 'Pull', 'Legs'];
            if (workout.exerciseType && !validExerciseTypes.includes(workout.exerciseType)) {
              workout.exerciseType = undefined;
            }

            // Validate PPL split if present
            const validPplSplits: WorkoutEntry['pplSplit'][] = ['Push', 'Pull', 'Legs'];
            if (workout.pplSplit && !validPplSplits.includes(workout.pplSplit)) {
              workout.pplSplit = undefined;
            }

            importedWorkouts.push(workout);
          } catch (error) {
            errorCount++;
            console.error(`Error parsing row ${i + 1}:`, error);
          }
        }

        if (importedWorkouts.length === 0) {
          toast.error('No valid workout data found in CSV file');
          setIsImporting(false);
          return;
        }

        // Confirm import
        const message = `Import ${importedWorkouts.length} workouts?${errorCount > 0 ? ` (${errorCount} rows skipped due to errors)` : ''}`;
        
        if (confirm(message)) {
          onImportData(importedWorkouts);
          toast.success(`Successfully imported ${importedWorkouts.length} workouts`);
        }

      } catch (error) {
        console.error('Error importing CSV:', error);
        toast.error('Failed to import CSV file');
      } finally {
        setIsImporting(false);
        // Reset file input
        event.target.value = '';
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read CSV file');
      setIsImporting(false);
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all workout data? This action cannot be undone.')) {
      onImportData([]);
      toast.success('All workout data cleared');
    }
  };

  return (
    <div className="bg-white/90 rounded-lg border-2 border-lime-300 p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="h-5 w-5 text-lime-600" />
        <h3 className="text-lg font-semibold text-gray-800">Data Management</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Export Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Download className="h-4 w-4 text-green-600" />
            <span className="font-medium text-gray-700">Export Data</span>
          </div>
          <p className="text-sm text-gray-600">
            Download all your workout data as a CSV file for backup or analysis.
          </p>
          <Button
            onClick={exportToCSV}
            disabled={workouts.length === 0}
            className="w-full bg-green-500 hover:bg-green-600 text-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV ({workouts.length} workouts)
          </Button>
        </div>

        {/* Import Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Upload className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-700">Import Data</span>
          </div>
          <p className="text-sm text-gray-600">
            Import workout data from a CSV file. Use the exported format for best compatibility.
          </p>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={importFromCSV}
              disabled={isImporting}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button
              disabled={isImporting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isImporting ? 'Importing...' : 'Import CSV'}
            </Button>
          </div>
        </div>
      </div>

      {/* Clear Data Section */}
      <div className="border-t border-lime-200 pt-4">
        <div className="flex items-center space-x-2 mb-2">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="font-medium text-gray-700">Danger Zone</span>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Permanently delete all workout data. This action cannot be undone.
        </p>
        <Button
          onClick={clearAllData}
          disabled={workouts.length === 0}
          variant="destructive"
          className="w-full"
        >
          Clear All Data
        </Button>
      </div>

      {/* Data Summary */}
      <div className="bg-lime-50 rounded-lg p-3">
        <div className="text-sm text-gray-700">
          <div className="font-medium mb-1">Data Summary:</div>
          <div>• Total workouts: {workouts.length}</div>
          <div>• Data stored in: Browser localStorage</div>
          <div>• Last updated: {workouts.length > 0 ? format(new Date(workouts[workouts.length - 1].date), 'MMM d, yyyy') : 'Never'}</div>
        </div>
      </div>
    </div>
  );
}
