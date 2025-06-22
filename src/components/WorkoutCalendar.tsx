import { useState } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, startOfDay, addWeeks, subWeeks } from "date-fns";
import { Plus, Trash2, ChevronLeft, ChevronRight, Edit3, Calendar, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutCalendarProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
  onUpdateWorkout: (id: string, workout: Omit<WorkoutEntry, 'id'>) => void;
}

const activityColors = {
  "Brazilian Jiu-Jitsu": "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg",
  Cycling: "bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-lg",
  Hiking: "bg-gradient-to-r from-lime-500 to-lime-600 text-white shadow-lg",
  Kickboxing: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
  Other: "bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg",
  Resistance: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg",
  Running: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg",
  Swimming: "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg",
};

export function WorkoutCalendar({ workouts, onAddWorkout, onDeleteWorkout, onUpdateWorkout }: WorkoutCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editWorkout, setEditWorkout] = useState<WorkoutEntry | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  const getCalendarDays = () => {
    if (viewMode === 'weekly') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const days = [];
      for (let i = 0; i < 7; i++) {
        days.push(addDays(weekStart, i));
      }
      return days;
    } else {
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
      return days;
    }
  };

  const days = getCalendarDays();

  const getWorkoutsForDate = (date: Date) => {
    return workouts.filter(workout => 
      isSameDay(new Date(workout.date), date)
    );
  };

  const handleAddWorkout = (date: Date) => {
    setSelectedDate(date);
    setEditWorkout(null);
    setShowForm(true);
  };

  const handleEditWorkout = (workout: WorkoutEntry) => {
    setEditWorkout(workout);
    setSelectedDate(new Date(workout.date));
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

  const handleFormUpdate = (id: string, workoutData: Omit<WorkoutEntry, 'id' | 'date'>) => {
    if (selectedDate) {
      onUpdateWorkout(id, {
        ...workoutData,
        date: selectedDate.toISOString(),
      });
      setShowForm(false);
      setSelectedDate(null);
      setEditWorkout(null);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedDate(null);
    setEditWorkout(null);
  };

  const navigateTime = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'weekly') {
      if (direction === 'prev') {
        setCurrentDate(subWeeks(newDate, 1));
      } else {
        setCurrentDate(addWeeks(newDate, 1));
      }
    } else {
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      setCurrentDate(newDate);
    }
  };

  const formatWorkoutDisplay = (workout: WorkoutEntry) => {
    let displayText = workout.activity === 'Other' && workout.customActivityName 
      ? workout.customActivityName 
      : workout.activity;
    
    // Add exercise type for resistance training
    if (workout.exerciseType) {
      displayText += ` - ${workout.exerciseType}`;
    }
    
    return displayText;
  };

  const getDateRangeText = () => {
    if (viewMode === 'weekly') {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* View Mode Toggle and Navigation */}
      <Card className="bg-gradient-to-r from-lime-50 to-green-50 border-2 border-lime-200">
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('prev')}
              className="bg-white/80 border-lime-300 hover:bg-lime-50 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex flex-col items-center space-y-1 sm:space-y-2">
              <CardTitle className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-lime-500 to-green-600 bg-clip-text text-transparent text-center">
                {getDateRangeText()}
              </CardTitle>
              <div className="flex items-center space-x-1 sm:space-x-2 bg-white/80 rounded-lg p-1">
                <Button
                  variant={viewMode === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('monthly')}
                  className={`h-7 text-xs sm:h-8 px-2 sm:px-3 ${viewMode === 'monthly' ? 'bg-gradient-to-r from-lime-500 to-green-600 text-white' : ''}`}
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Monthly
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className={`h-7 text-xs sm:h-8 px-2 sm:px-3 ${viewMode === 'weekly' ? 'bg-gradient-to-r from-lime-500 to-green-600 text-white' : ''}`}
                >
                  <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Weekly
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('next')}
              className="bg-white/80 border-lime-300 hover:bg-lime-50 h-8 w-8 p-0 sm:h-auto sm:w-auto sm:p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className={`grid gap-1 sm:gap-3 ${viewMode === 'weekly' ? 'grid-cols-1' : 'grid-cols-7'}`}>
        {/* Day Headers for monthly view */}
        {viewMode === 'monthly' && ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
          <div key={dayName} className="p-1 sm:p-3 text-center text-xs sm:text-sm font-bold text-gray-700 bg-gradient-to-r from-lime-100 to-green-100 rounded-lg border border-lime-200">
            {dayName}
          </div>
        ))}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = viewMode === 'weekly' || isSameMonth(day, currentDate);

          return (
            <Card 
              key={index} 
              className={`${viewMode === 'weekly' ? 'min-h-[120px] sm:min-h-[140px]' : 'min-h-[80px] sm:min-h-[100px]'} transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                isToday ? 'ring-2 sm:ring-3 ring-lime-400 bg-gradient-to-br from-lime-50 to-green-50' : 
                isCurrentMonth ? 'bg-gradient-to-br from-white to-lime-50' : 'bg-gray-100'
              } ${!isCurrentMonth ? 'opacity-60' : ''} border-1 sm:border-2 ${isToday ? 'border-lime-300' : 'border-lime-200'}`}
            >
              <CardContent className={`${viewMode === 'weekly' ? 'p-4 sm:p-6' : 'p-1 sm:p-3'} space-y-1 sm:space-y-2`}>
                <div className={`text-center font-bold ${
                  isToday ? 'text-green-700' : 
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-500'
                } ${viewMode === 'weekly' ? 'text-lg sm:text-xl mb-3 sm:mb-4' : 'text-xs sm:text-sm'}`}>
                  {viewMode === 'weekly' ? (
                    <div>
                      <div className="text-sm text-gray-600 uppercase tracking-wide font-semibold">
                        {format(day, 'EEEE')}
                      </div>
                      <div className={`${isToday ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'} mt-1`}>
                        {format(day, 'd')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(day, 'MMM yyyy')}
                      </div>
                    </div>
                  ) : (
                    format(day, 'd')
                  )}
                </div>
                
                {dayWorkouts.map((workout) => (
                  <div key={workout.id} className="group relative">
                    <div 
                      className={`w-full flex justify-between font-semibold rounded-full px-2 sm:px-3 py-2 ${activityColors[workout.activity]} hover:scale-105 transition-transform cursor-pointer ${viewMode === 'weekly' ? 'text-sm sm:text-base min-h-[32px] sm:min-h-[36px]' : 'text-[10px] sm:text-xs min-h-[20px] sm:min-h-[24px]'}`}
                      title={formatWorkoutDisplay(workout)}
                    >
                      <span className="flex-1 text-left text-wrap break-words leading-tight">
                        {formatWorkoutDisplay(workout)}
                      </span>
                      <div className="flex items-center gap-1 sm:gap-2 ml-2 sm:ml-3 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-lime-500 rounded-full ${viewMode === 'weekly' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'}`}
                          onClick={() => handleEditWorkout(workout)}
                        >
                          <Edit3 className={viewMode === 'weekly' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-2 w-2 sm:h-3 sm:w-3'} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-red-500 rounded-full ${viewMode === 'weekly' ? 'h-5 w-5 sm:h-6 sm:w-6' : 'h-3 w-3 sm:h-4 sm:w-4'}`}
                          onClick={() => onDeleteWorkout(workout.id)}
                        >
                          <Trash2 className={viewMode === 'weekly' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-2 w-2 sm:h-3 sm:w-3'} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isCurrentMonth && (
                  <div className="flex justify-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-green-600 hover:text-green-700 hover:bg-lime-100 transition-all duration-200 rounded-full border-2 border-dashed border-lime-300 bg-lime-50/30 ${viewMode === 'weekly' ? 'h-10 w-10 sm:h-12 sm:w-12 p-0' : 'h-6 w-6 sm:h-8 sm:w-8 p-0'}`}
                      onClick={() => handleAddWorkout(day)}
                    >
                      <Plus className={viewMode === 'weekly' ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-3 w-3 sm:h-4 sm:w-4'} />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <WorkoutForm
        date={selectedDate}
        isOpen={showForm}
        workouts={workouts}
        editWorkout={editWorkout}
        onSubmit={handleFormSubmit}
        onUpdate={handleFormUpdate}
        onClose={handleFormClose}
      />
    </div>
  );
}
