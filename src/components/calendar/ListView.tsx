import { useState, useEffect } from "react";
import { 
  format, 
  isSameDay, 
  isToday, 
  isYesterday, 
  isThisWeek, 
  isThisMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addMonths,
  subMonths
} from "date-fns";
import { WorkoutEntry } from "@/pages/Index";
import { ChevronLeft, ChevronRight, Plus, Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ListViewProps {
  currentDate: Date;
  workouts: WorkoutEntry[];
  onNavigate: (direction: 'prev' | 'next') => void;
  onAddWorkout: (date: Date) => void;
  onEditWorkout: (workout: WorkoutEntry) => void;
  onDeleteWorkout: (id: string) => void;
}

export function ListView({ 
  currentDate, 
  workouts, 
  onNavigate, 
  onAddWorkout, 
  onEditWorkout, 
  onDeleteWorkout 
}: ListViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Listen for jump to today events
  useEffect(() => {
    const handleJumpToToday = () => {
      setSelectedDate(new Date());
    };

    window.addEventListener('jumpToToday', handleJumpToToday);
    return () => window.removeEventListener('jumpToToday', handleJumpToToday);
  }, []);

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    );
  };

  const getActivityColor = (activity: string) => {
    const colors: Record<string, string> = {
      'Brazilian Jiu-Jitsu': 'bg-purple-500',
      'Cycling': 'bg-blue-500',
      'Hiking': 'bg-green-500',
      'Kickboxing': 'bg-red-500',
      'Resistance': 'bg-orange-500',
      'Running': 'bg-yellow-500',
      'Swimming': 'bg-cyan-500',
      'Other': 'bg-gray-500'
    };
    return colors[activity] || 'bg-gray-500';
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date)) return format(date, 'EEEE');
    return format(date, 'MMM d, yyyy');
  };

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  };

  const days = getCalendarDays();

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-white/90 rounded-lg p-3 border-2 border-lime-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('prev')}
          className="h-8 w-8 p-0 hover:bg-lime-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('next')}
          className="h-8 w-8 p-0 hover:bg-lime-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* List View */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          {days.map((day) => {
            const dayWorkouts = getWorkoutsForDate(day);
            const isCurrentDay = isToday(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            if (dayWorkouts.length === 0) {
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "bg-white/90 rounded-lg border-2 border-lime-200 p-3 cursor-pointer transition-colors hover:bg-lime-50",
                    isCurrentDay && "border-lime-400 bg-lime-50",
                    isSelected && "border-lime-500 bg-lime-100"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className={cn(
                          "text-sm font-semibold",
                          isCurrentDay && "text-lime-600"
                        )}>
                          {getDateLabel(day)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(day, 'MMM d')}
                        </div>
                      </div>
                      <div className="text-gray-400 text-sm">
                        No workouts
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-lime-200 rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddWorkout(day);
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "bg-white/90 rounded-lg border-2 border-lime-200 p-3 cursor-pointer transition-colors hover:bg-lime-50",
                  isCurrentDay && "border-lime-400 bg-lime-50",
                  isSelected && "border-lime-500 bg-lime-100"
                )}
                onClick={() => setSelectedDate(day)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="text-center">
                      <div className={cn(
                        "text-sm font-semibold",
                        isCurrentDay && "text-lime-600"
                      )}>
                        {getDateLabel(day)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(day, 'MMM d')}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      {dayWorkouts.length} workout{dayWorkouts.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-lime-200 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddWorkout(day);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {dayWorkouts.map((workout) => (
                    <div
                      key={workout.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors hover:bg-lime-100",
                        getActivityColor(workout.activity).replace('bg-', 'bg-opacity-10 ')
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditWorkout(workout);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          getActivityColor(workout.activity)
                        )} />
                        <div>
                          <div className="text-sm font-medium text-gray-800">
                            {workout.activity === 'Other' ? workout.customActivityName : workout.activity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {workout.duration} minutes
                            {workout.secondaryActivity && ` + ${workout.secondaryDuration}min ${workout.secondaryActivity === 'Other' ? workout.customSecondaryActivityName : workout.secondaryActivity}`}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:bg-red-100 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteWorkout(workout.id);
                        }}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 