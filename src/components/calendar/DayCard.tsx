
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
      className={`h-full flex flex-col ${
        isToday 
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-400' 
          : 'bg-white border-gray-300'
      } shadow-lg hover:shadow-xl transition-all duration-300 border-2`}
    >
      <CardContent className="p-3 h-full flex flex-col">
        {/* Compact Date Header */}
        <div className={`text-center font-bold mb-3 ${
          isToday ? 'text-blue-700' : 'text-gray-900'
        }`}>
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              {format(day, 'EEE')}
            </div>
            <div className="text-2xl font-bold">
              {format(day, 'd')}
            </div>
            <div className="text-xs text-gray-700 font-medium md:hidden">
              {format(day, 'MMM')}
            </div>
          </div>
        </div>
        
        {/* Workouts List - Scrollable */}
        <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
          {workouts.map((workout) => (
            <WorkoutItem
              key={workout.id}
              workout={workout}
              onEdit={onEditWorkout}
              onDelete={onDeleteWorkout}
            />
          ))}
        </div>
        
        {/* Compact Add Button */}
        <div className="flex justify-center pt-2 mt-auto">
          <Button
            size="sm"
            variant="outline"
            className="h-8 w-8 p-0 rounded-full border-2 border-dashed border-gray-500 
              hover:border-gray-700 hover:bg-gray-100 transition-all duration-200"
            onClick={() => onAddWorkout(day)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
