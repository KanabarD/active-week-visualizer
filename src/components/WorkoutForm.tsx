
import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutFormProps {
  date: Date;
  onSubmit: (workout: Omit<WorkoutEntry, 'id' | 'date'>) => void;
  onCancel: () => void;
}

export function WorkoutForm({ date, onSubmit, onCancel }: WorkoutFormProps) {
  const [activity, setActivity] = useState<WorkoutEntry['activity'] | ''>('');
  const [duration, setDuration] = useState('');
  const [exerciseType, setExerciseType] = useState<WorkoutEntry['exerciseType'] | ''>('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity && duration) {
      onSubmit({
        activity: activity as WorkoutEntry['activity'],
        duration: parseInt(duration),
        exerciseType: activity === 'Resistance' && exerciseType ? exerciseType as WorkoutEntry['exerciseType'] : undefined,
        notes: notes || undefined,
      });
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Add Workout for {format(date, 'EEEE, MMMM d')}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
                <SelectItem value="Kickboxing">Kickboxing</SelectItem>
                <SelectItem value="Swimming">Swimming</SelectItem>
                <SelectItem value="Running">Running</SelectItem>
                <SelectItem value="Resistance">Resistance Training</SelectItem>
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
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
