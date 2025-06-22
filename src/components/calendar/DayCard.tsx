
import { format, isSameDay } from "date-fns";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WorkoutEntry } from "@/pages/Index";
import { WorkoutItem } from "./WorkoutItem";

interface DayCardProps {
  day: Date;
  workouts: WorkoutEntry[];
  onAddWorkout: (date: Date) => void;
  onEditWorkout: (workout: WorkoutEntry) => void;
  onDeleteWorkout: (id: string) => void;
}

export function DayCard({ day, workouts, onAddWorkout, onEditWorkout, onDeleteWorkout }: DayCardProps) {
  const isToday = isSameDay(day, new Date());

  return (
    <Card 
      className={`min-h-[300px] ${
        isToday 
          ? 'ring-4 ring-blue-500 bg-blue-50 border-blue-400' 
          : 'bg-white border-gray-300'
      } shadow-lg hover:shadow-xl transition-all duration-300 border-2`}
    >
      <CardContent className="p-6 h-full flex flex-col">
        {/* Date Header */}
        <div className={`text-center font-bold mb-6 ${
          isToday ? 'text-blue-700' : 'text-gray-900'
        }`}>
          <div className="space-y-2">
            <div className="text-lg text-gray-600 uppercase tracking-wide font-semibold">
              {format(day, 'EEEE')}
            </div>
            <div className="text-5xl font-bold">
              {format(day, 'd')}
            </div>
            <div className="text-lg text-gray-700 font-medium">
              {format(day, 'MMMM yyyy')}
            </div>
          </div>
        </div>
        
        {/* Workouts List */}
        <div className="flex-1 space-y-4 overflow-y-auto">
          {workouts.map((workout) => (
            <WorkoutItem
              key={workout.id}
              workout={workout}
              onEdit={onEditWorkout}
              onDelete={onDeleteWorkout}
            />
          ))}
        </div>
        
        {/* Add Button */}
        <div className="flex justify-center pt-6">
          <Button
            size="sm"
            variant="outline"
            className="h-16 w-16 p-0 rounded-full border-3 border-dashed border-gray-500 
              hover:border-gray-700 hover:bg-gray-100 transition-all duration-200 text-lg font-bold"
            onClick={() => onAddWorkout(day)}
          >
            <Plus className="h-8 w-8" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
