import { useState, useEffect } from "react";
import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  format, 
  addMonths, 
  subMonths,
  isToday
} from "date-fns";
import { WorkoutEntry } from "@/pages/Index";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MonthlyCalendarProps {
  currentDate: Date;
  workouts: WorkoutEntry[];
  onNavigate: (direction: 'prev' | 'next') => void;
  onAddWorkout: (date: Date) => void;
  onEditWorkout: (workout: WorkoutEntry) => void;
  onDeleteWorkout: (id: string) => void;
}

export function MonthlyCalendar({ 
  currentDate, 
  workouts, 
  onNavigate, 
  onAddWorkout, 
  onEditWorkout, 
  onDeleteWorkout 
}: MonthlyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Listen for jump to today events
  useEffect(() => {
    const handleJumpToToday = () => {
      setSelectedDate(new Date());
    };

    window.addEventListener('jumpToToday', handleJumpToToday);
    return () => window.removeEventListener('jumpToToday', handleJumpToToday);
  }, []);

  const getCalendarDays = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  };

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

  const days = getCalendarDays();
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white/90 rounded-lg border-2 border-lime-300 overflow-hidden">
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-lime-100 border-b border-lime-300">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-sm font-semibold text-gray-700 border-r border-lime-300 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              const dayWorkouts = getWorkoutsForDate(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isCurrentDay = isToday(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);

              return (
                <div
                  key={index}
                  className={cn(
                    "min-h-[80px] p-1 border-r border-b border-lime-200 last:border-r-0 relative cursor-pointer transition-colors group",
                    !isCurrentMonth && "bg-gray-50 text-gray-400",
                    isCurrentDay && "bg-lime-100",
                    isSelected && "bg-lime-200",
                    "hover:bg-lime-50"
                  )}
                  onClick={() => setSelectedDate(day)}
                >
                  {/* Date Number */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isCurrentDay && "bg-lime-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                      )}
                    >
                      {format(day, 'd')}
                    </span>
                    
                    {/* Add Workout Button */}
                    {isCurrentMonth && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-lime-200 rounded-full transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddWorkout(day);
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                  </div>

                  {/* Workout Indicators */}
                  <div className="space-y-1">
                    {dayWorkouts.slice(0, 3).map((workout, workoutIndex) => (
                      <div
                        key={workout.id}
                        className={cn(
                          "h-2 rounded-full text-xs px-1 flex items-center justify-center text-white font-medium truncate",
                          getActivityColor(workout.activity)
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditWorkout(workout);
                        }}
                        title={`${workout.activity} - ${workout.duration}min`}
                      >
                        {workout.activity === 'Other' ? workout.customActivityName?.slice(0, 3) : workout.activity.slice(0, 3)}
                      </div>
                    ))}
                    
                    {dayWorkouts.length > 3 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dayWorkouts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
} 