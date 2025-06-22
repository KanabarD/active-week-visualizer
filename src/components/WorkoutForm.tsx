import { useState } from "react";
import { format } from "date-fns";
import { Copy } from "lucide-react";
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
  onSubmit: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  onClose: () => void;
}

export function WorkoutForm({ date, isOpen, workouts, onSubmit, onClose }: WorkoutFormProps) {
  const [activity, setActivity] = useState<WorkoutEntry['activity'] | ''>('');
  const [secondaryActivity, setSecondaryActivity] = useState<WorkoutEntry['secondaryActivity'] | ''>('');
  const [duration, setDuration] = useState('');
  const [secondaryDuration, setSecondaryDuration] = useState('');
  const [exerciseType, setExerciseType] = useState<WorkoutEntry['exerciseType'] | ''>('');
  const [pplSplit, setPplSplit] = useState<WorkoutEntry['pplSplit'] | ''>('');

  const getMostRecentWorkout = () => {
    if (workouts.length === 0) return null;
    
    const sortedWorkouts = [...workouts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return sortedWorkouts[0];
  };

  const copyPreviousWorkout = () => {
    const recentWorkout = getMostRecentWorkout();
    if (recentWorkout) {
      setActivity(recentWorkout.activity);
      setSecondaryActivity(recentWorkout.secondaryActivity || '');
      setDuration(recentWorkout.duration.toString());
      setSecondaryDuration(recentWorkout.secondaryDuration ? recentWorkout.secondaryDuration.toString() : '');
      setExerciseType(recentWorkout.exerciseType || '');
      setPplSplit(recentWorkout.pplSplit || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity && duration) {
      onSubmit({
        activity: activity as WorkoutEntry['activity'],
        secondaryActivity: secondaryActivity ? secondaryActivity as WorkoutEntry['secondaryActivity'] : undefined,
        duration: parseInt(duration),
        secondaryDuration: secondaryActivity && secondaryDuration ? parseInt(secondaryDuration) : undefined,
        exerciseType: activity === 'Resistance' && exerciseType ? exerciseType as WorkoutEntry['exerciseType'] : undefined,
        pplSplit: secondaryActivity === 'Resistance' && pplSplit ? pplSplit as WorkoutEntry['pplSplit'] : undefined,
      });
      // Reset form
      setActivity('');
      setSecondaryActivity('');
      setDuration('');
      setSecondaryDuration('');
      setExerciseType('');
      setPplSplit('');
    }
  };

  const handleClose = () => {
    // Reset form on close
    setActivity('');
    setSecondaryActivity('');
    setDuration('');
    setSecondaryDuration('');
    setExerciseType('');
    setPplSplit('');
    onClose();
  };

  if (!date) return null;

  const mostRecentWorkout = getMostRecentWorkout();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Add Workout for {format(date, 'EEEE, MMMM d')}
          </DialogTitle>
        </DialogHeader>
        
        {mostRecentWorkout && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={copyPreviousWorkout}
              className="w-full bg-gradient-to-r from-green-50 to-blue-50 border-green-200 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Previous Workout ({mostRecentWorkout.activity})
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
            <Label htmlFor="activity" className="text-sm font-semibold text-blue-800">Primary Activity</Label>
            <Select value={activity} onValueChange={(value) => {
              setActivity(value as WorkoutEntry['activity']);
              if (value !== 'Resistance') {
                setExerciseType('');
              }
            }}>
              <SelectTrigger className="mt-1 border-blue-200 focus:border-blue-400">
                <SelectValue placeholder="Select primary activity" />
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
          </div>

          <div className="bg-white/70 p-4 rounded-lg border border-blue-100">
            <Label htmlFor="duration" className="text-sm font-semibold text-blue-800">Primary Duration (minutes)</Label>
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
              <Label htmlFor="exerciseType" className="text-sm font-semibold text-orange-800">Primary Exercise Type</Label>
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

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <Label htmlFor="secondaryActivity" className="text-sm font-semibold text-green-800">Secondary Activity (optional)</Label>
            <Select value={secondaryActivity} onValueChange={(value) => {
              setSecondaryActivity(value as WorkoutEntry['secondaryActivity']);
              if (value !== 'Resistance') {
                setPplSplit('');
              }
            }}>
              <SelectTrigger className="mt-1 border-green-200 focus:border-green-400">
                <SelectValue placeholder="Select secondary activity (optional)" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-green-200">
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
            {secondaryActivity && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSecondaryActivity('');
                  setSecondaryDuration('');
                  setPplSplit('');
                }}
                className="mt-2 text-xs text-green-600 hover:text-green-800 hover:bg-green-100"
              >
                Clear secondary activity
              </Button>
            )}
          </div>

          {secondaryActivity && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <Label htmlFor="secondaryDuration" className="text-sm font-semibold text-green-800">Secondary Duration (minutes)</Label>
              <Input
                id="secondaryDuration"
                type="number"
                value={secondaryDuration}
                onChange={(e) => setSecondaryDuration(e.target.value)}
                placeholder="30"
                min="1"
                className="mt-1 border-green-200 focus:border-green-400"
              />
            </div>
          )}

          {secondaryActivity === 'Resistance' && (
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <Label htmlFor="pplSplit" className="text-sm font-semibold text-purple-800">PPL Split</Label>
              <Select value={pplSplit} onValueChange={(value) => setPplSplit(value as WorkoutEntry['pplSplit'])}>
                <SelectTrigger className="mt-1 border-purple-200 focus:border-purple-400">
                  <SelectValue placeholder="Select PPL split" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-purple-200">
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
              disabled={!activity || !duration || (activity === 'Resistance' && !exerciseType) || (secondaryActivity && !secondaryDuration) || (secondaryActivity === 'Resistance' && !pplSplit)}
            >
              Add Workout
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
