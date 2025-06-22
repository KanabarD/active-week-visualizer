
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Copy, Edit3, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutFormProps {
  date: Date | null;
  isOpen: boolean;
  workouts: WorkoutEntry[];
  editWorkout?: WorkoutEntry | null;
  onSubmit: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  onUpdate: (id: string, workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

export function WorkoutForm({ date, isOpen, workouts, editWorkout, onSubmit, onUpdate, onClose }: WorkoutFormProps) {
  const [activity, setActivity] = useState<WorkoutEntry['activity'] | ''>('');
  const [duration, setDuration] = useState('');
  const [exerciseType, setExerciseType] = useState<WorkoutEntry['exerciseType'] | ''>('');
  const [customActivityName, setCustomActivityName] = useState('');
  const [selectedWorkoutIndex, setSelectedWorkoutIndex] = useState(0);

  // Load edit workout data when editWorkout changes
  useEffect(() => {
    if (editWorkout) {
      setActivity(editWorkout.activity);
      setDuration(editWorkout.duration.toString());
      setExerciseType(editWorkout.exerciseType || '');
      setCustomActivityName(editWorkout.customActivityName || '');
    }
  }, [editWorkout]);

  const getSortedWorkouts = () => {
    if (workouts.length === 0) return [];
    
    return [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const sortedWorkouts = getSortedWorkouts();
  const selectedWorkout = sortedWorkouts[selectedWorkoutIndex];

  const copySelectedWorkout = () => {
    if (selectedWorkout) {
      setActivity(selectedWorkout.activity);
      setDuration(selectedWorkout.duration.toString());
      setExerciseType(selectedWorkout.exerciseType || '');
      setCustomActivityName(selectedWorkout.customActivityName || '');
    }
  };

  const formatWorkoutDisplay = (workout: WorkoutEntry) => {
    let displayText = workout.activity === 'Other' && workout.customActivityName 
      ? workout.customActivityName 
      : workout.activity;
    
    // Add exercise type for resistance training
    if (workout.exerciseType) {
      displayText += ` - ${workout.exerciseType}`;
    }
    
    return displayText;
  };

  const navigateWorkout = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedWorkoutIndex < sortedWorkouts.length - 1) {
      setSelectedWorkoutIndex(selectedWorkoutIndex + 1);
    } else if (direction === 'next' && selectedWorkoutIndex > 0) {
      setSelectedWorkoutIndex(selectedWorkoutIndex - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity && duration) {
      const workoutData = {
        activity: activity as WorkoutEntry['activity'],
        duration: parseInt(duration),
        exerciseType: activity === 'Resistance' && exerciseType ? exerciseType as WorkoutEntry['exerciseType'] : undefined,
        customActivityName: activity === 'Other' && customActivityName ? customActivityName : undefined,
      };

      if (editWorkout) {
        onUpdate(editWorkout.id, workoutData);
      } else {
        onSubmit(workoutData);
      }

      // Reset form
      resetForm();
    }
  };

  const resetForm = () => {
    setActivity('');
    setDuration('');
    setExerciseType('');
    setCustomActivityName('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!date && !editWorkout) return null;

  const isEditing = !!editWorkout;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-2">
            {isEditing ? (
              <>
                <Edit3 className="h-5 w-5 text-blue-600" />
                Edit Workout
              </>
            ) : (
              <>Add Workout for {date && format(date, 'EEEE, MMMM d')}</>
            )}
          </DialogTitle>
        </DialogHeader>
        
        {!isEditing && sortedWorkouts.length > 0 && (
          <div className="mb-4 space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigateWorkout('prev')}
                disabled={selectedWorkoutIndex >= sortedWorkouts.length - 1}
                className="px-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex-1 text-center text-sm text-gray-600">
                {selectedWorkout ? formatWorkoutDisplay(selectedWorkout) : 'No workouts'}
                <div className="text-xs text-gray-400">
                  {selectedWorkout && format(new Date(selectedWorkout.date), 'MMM d')} 
                  {sortedWorkouts.length > 1 && ` (${selectedWorkoutIndex + 1} of ${sortedWorkouts.length})`}
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigateWorkout('next')}
                disabled={selectedWorkoutIndex <= 0}
                className="px-2"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={copySelectedWorkout}
              className="w-full bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100"
              disabled={!selectedWorkout}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy This Workout
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
            <Label htmlFor="activity" className="text-sm font-semibold text-blue-800">Activity</Label>
            <Select value={activity} onValueChange={(value) => {
              setActivity(value as WorkoutEntry['activity']);
              if (value !== 'Resistance') {
                setExerciseType('');
              }
              if (value !== 'Other') {
                setCustomActivityName('');
              }
            }}>
              <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-blue-200">
                <SelectItem value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu</SelectItem>
                <SelectItem value="Cycling">Cycling</SelectItem>
                <SelectItem value="Hiking">Hiking</SelectItem>
                <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
                <SelectItem value="Resistance">Resistance Training</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
              </SelectContent>
            </Select>
            
            {activity === 'Other' && (
              <div className="mt-2">
                <Label htmlFor="customActivityName" className="text-sm font-semibold text-blue-800">Specify Activity</Label>
                <Input
                  id="customActivityName"
                  value={customActivityName}
                  onChange={(e) => setCustomActivityName(e.target.value)}
                  placeholder="Enter activity name"
                  className="mt-1 border-blue-200 focus:border-blue-400"
                />
              </div>
            )}
          </div>

          <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
            <Label htmlFor="duration" className="text-sm font-semibold text-blue-800">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min="1"
              className="mt-1 border-blue-200 focus:border-blue-400"
            />
          </div>

          {activity === 'Resistance' && (
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <Label htmlFor="exerciseType" className="text-sm font-semibold text-orange-800">Exercise Type</Label>
              <Select value={exerciseType} onValueChange={(value) => setExerciseType(value as WorkoutEntry['exerciseType'])}>
                <SelectTrigger className="mt-1 border-orange-200 focus:border-orange-400">
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-orange-200">
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="Pull">Pull</SelectItem>
                  <SelectItem value="Legs">Legs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold" 
              disabled={
                !activity || !duration || 
                (activity === 'Resistance' && !exerciseType) || 
                (activity === 'Other' && !customActivityName)
              }
            >
              {isEditing ? 'Update Workout' : 'Add Workout'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="border-gray-300 hover:bg-gray-50">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
