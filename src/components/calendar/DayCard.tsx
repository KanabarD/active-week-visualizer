
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
      className={`min-h-[120px] w-full flex ${
        isToday 
          ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-400' 
          : 'bg-white border-gray-300'
      } shadow-md hover:shadow-lg transition-all duration-300 border-2 touch-manipulation`}
    >
      <CardContent className="p-4 w-full flex">
        {/* Date Section - Fixed width for Samsung A53 */}
        <div className={`w-20 flex-shrink-0 text-center ${
          isToday ? 'text-blue-700' : 'text-gray-900'
        }`}>
          <div className="space-y-1">
            <div className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
              {format(day, 'EEE')}
            </div>
            <div className="text-xl font-bold">
              {format(day, 'd')}
            </div>
            <div className="text-xs text-gray-700 font-medium">
              {format(day, 'MMM')}
            </div>
          </div>
        </div>
        
        {/* Content Section - Flexible width */}
        <div className="flex-1 flex flex-col ml-4">
          {/* Workouts List */}
          <div className="flex-1 space-y-2 overflow-y-auto max-h-20">
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
          <div className="flex justify-end mt-2">
            <Button
              size="sm"
              variant="outline"
              className="h-10 w-10 p-0 rounded-full border-2 border-dashed border-gray-500 
                hover:border-gray-700 hover:bg-gray-100 transition-all duration-200 touch-manipulation"
              onClick={() => onAddWorkout(day)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
