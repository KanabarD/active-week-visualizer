
import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutCalendarProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
}

const activityColors = {
  BJJ: "bg-purple-500",
  Kickboxing: "bg-red-500",
  Swimming: "bg-blue-500",
  Running: "bg-green-500",
  Resistance: "bg-orange-500",
};

export function WorkoutCalendar({ workouts, onAddWorkout, onDeleteWorkout }: WorkoutCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    );
  };

  const handleAddWorkout = (date: Date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleFormSubmit = (workoutData: Omit<WorkoutEntry, 'id' | 'date'>) => {
    if (selectedDate) {
      onAddWorkout({
        ...workoutData,
        date: selectedDate.toISOString(),
      });
      setShowForm(false);
      setSelectedDate(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const dayWorkouts = getWorkoutsForDate(date);
          const isToday = isSameDay(date, new Date());

          return (
            <Card key={index} className={`transition-all duration-200 hover:shadow-lg ${isToday ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-center text-sm font-medium">
                  <div className={`${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                    {format(date, 'EEE')}
                  </div>
                  <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : 'text-gray-900'}`}>
                    {format(date, 'd')}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {dayWorkouts.map((workout) => (
                  <div key={workout.id} className="group relative">
                    <Badge 
                      className={`w-full justify-between text-white ${activityColors[workout.activity]} hover:opacity-90 transition-opacity`}
                    >
                      <span className="text-xs">{workout.activity}</span>
                      <span className="text-xs">{workout.duration}m</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500"
                        onClick={() => onDeleteWorkout(workout.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  className="w-full h-8 text-xs border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
                  onClick={() => handleAddWorkout(date)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Workout
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {showForm && selectedDate && (
        <WorkoutForm
          date={selectedDate}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}
