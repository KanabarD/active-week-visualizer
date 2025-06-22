
import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth } from "date-fns";
import { Plus, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

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

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Headers */}
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
          <div key={dayName} className="p-2 text-center text-sm font-medium text-gray-600">
            {dayName}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <Card 
              key={index} 
              className={`min-h-[120px] transition-all duration-200 hover:shadow-lg ${
                isToday ? 'ring-2 ring-blue-500' : ''
              } ${!isCurrentMonth ? 'opacity-50' : ''}`}
            >
              <CardContent className="p-2 space-y-1">
                <div className={`text-center text-sm font-medium ${
                  isToday ? 'text-blue-600 font-bold' : 
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {dayWorkouts.map((workout) => (
                  <div key={workout.id} className="group relative">
                    <Badge 
                      className={`w-full justify-between text-white text-xs ${activityColors[workout.activity]} hover:opacity-90 transition-opacity`}
                    >
                      <span className="truncate">
                        {workout.activity}
                        {workout.exerciseType && ` - ${workout.exerciseType}`}
                      </span>
                      <div className="flex items-center gap-1">
                        <span>{workout.duration}m</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-3 w-3 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500"
                          onClick={() => onDeleteWorkout(workout.id)}
                        >
                          <Trash2 className="h-2 w-2" />
                        </Button>
                      </div>
                    </Badge>
                  </div>
                ))}
                
                {isCurrentMonth && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full h-6 text-xs border-dashed border-gray-300 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    onClick={() => handleAddWorkout(day)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                )}
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
