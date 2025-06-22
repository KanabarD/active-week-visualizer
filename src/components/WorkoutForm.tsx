
import { useState } from "react";
import { format } from "date-fns";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
  const [duration, setDuration] = useState('');
  const [exerciseType, setExerciseType] = useState<WorkoutEntry['exerciseType'] | ''>('');
  const [notes, setNotes] = useState('');

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
      setDuration(recentWorkout.duration.toString());
      setExerciseType(recentWorkout.exerciseType || '');
      setNotes(recentWorkout.notes || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity && duration) {
      onSubmit({
        activity: activity as WorkoutEntry['activity'],
        duration: parseInt(duration),
        exerciseType: activity === 'Resistance' && exerciseType ? exerciseType as WorkoutEntry['exerciseType'] : undefined,
        notes: notes || undefined,
      });
      // Reset form
      setActivity('');
      setDuration('');
      setExerciseType('');
      setNotes('');
    }
  };

  const handleClose = () => {
    // Reset form on close
    setActivity('');
    setDuration('');
    setExerciseType('');
    setNotes('');
    onClose();
  };

  if (!date) return null;

  const mostRecentWorkout = getMostRecentWorkout();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Add Workout for {format(date, 'EEEE, MMMM d')}
          </DialogTitle>
        </DialogHeader>
        
        {mostRecentWorkout && (
          <div className="mb-4">
            <Button
              type="button"
              variant="outline"
              onClick={copyPreviousWorkout}
              className="w-full"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Previous Workout ({mostRecentWorkout.activity})
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity">Activity</Label>
            <Select value={activity} onValueChange={(value) => {
              setActivity(value as WorkoutEntry['activity']);
              if (value !== 'Resistance') {
                setExerciseType('');
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BJJ">BJJ</SelectItem>
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

          {activity === 'Resistance' && (
            <div>
              <Label htmlFor="exerciseType">Exercise Type</Label>
              <Select value={exerciseType} onValueChange={(value) => setExerciseType(value as WorkoutEntry['exerciseType'])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Push">Push</SelectItem>
                  <SelectItem value="Pull">Pull</SelectItem>
                  <SelectItem value="Legs">Legs</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min="1"
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about your workout..."
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={!activity || !duration || (activity === 'Resistance' && !exerciseType)}>
              Add Workout
            </Button>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
