
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
  "Brazilian Jiu-Jitsu": "bg-purple-100 text-purple-800 border-purple-200",
  Cycling: "bg-cyan-100 text-cyan-800 border-cyan-200",
  Hiking: "bg-green-100 text-green-800 border-green-200",
  Kickboxing: "bg-red-100 text-red-800 border-red-200",
  Other: "bg-gray-100 text-gray-800 border-gray-200",
  Resistance: "bg-orange-100 text-orange-800 border-orange-200",
  Running: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Swimming: "bg-blue-100 text-blue-800 border-blue-200",
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
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('prev')}
              className="h-10 w-10 p-0 border-2 border-gray-300 hover:border-gray-400"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            
            <div className="flex flex-col items-center space-y-3">
              <CardTitle className="text-3xl font-bold text-gray-900">
                {getDateRangeText()}
              </CardTitle>
              
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'monthly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('monthly')}
                  className={`h-9 px-4 font-semibold ${
                    viewMode === 'monthly' 
                      ? 'bg-gray-800 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Monthly
                </Button>
                <Button
                  variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('weekly')}
                  className={`h-9 px-4 font-semibold ${
                    viewMode === 'weekly' 
                      ? 'bg-gray-800 text-white shadow-md' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <CalendarDays className="h-4 w-4 mr-2" />
                  Weekly
                </Button>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('next')}
              className="h-10 w-10 p-0 border-2 border-gray-300 hover:border-gray-400"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Grid */}
      <div className={`${
        viewMode === 'weekly' 
          ? 'space-y-4' 
          : 'grid grid-cols-7 gap-4'
      }`}>
        
        {/* Day Headers for monthly view */}
        {viewMode === 'monthly' && (
          <>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName) => (
              <div key={dayName} className="p-4 text-center">
                <div className="text-lg font-bold text-gray-800 bg-gray-50 py-3 rounded-lg border">
                  {dayName}
                </div>
              </div>
            ))}
          </>
        )}
        
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = viewMode === 'weekly' || isSameMonth(day, currentDate);

          return (
            <Card 
              key={index} 
              className={`${
                viewMode === 'weekly' 
                  ? 'min-h-[250px]' 
                  : 'min-h-[200px]'
              } ${
                isToday 
                  ? 'ring-4 ring-blue-400 bg-blue-50 border-blue-300' 
                  : isCurrentMonth 
                    ? 'bg-white border-gray-200' 
                    : 'bg-gray-50 border-gray-100 opacity-60'
              } shadow-md hover:shadow-lg transition-all duration-200`}
            >
              <CardContent className="p-4 h-full flex flex-col">
                {/* Date Header */}
                <div className={`text-center font-bold mb-4 ${
                  isToday ? 'text-blue-700' : 
                  isCurrentMonth ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {viewMode === 'weekly' ? (
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600 uppercase tracking-wide font-medium">
                        {format(day, 'EEEE')}
                      </div>
                      <div className="text-3xl font-bold">
                        {format(day, 'd')}
                      </div>
                      <div className="text-sm text-gray-600">
                        {format(day, 'MMM yyyy')}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xl font-bold py-2">
                      {format(day, 'd')}
                    </div>
                  )}
                </div>
                
                {/* Workouts List */}
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {dayWorkouts.map((workout) => (
                    <div key={workout.id} className="group">
                      <div 
                        className={`p-3 rounded-lg border-2 ${activityColors[workout.activity]} 
                          hover:shadow-md transition-all duration-200 cursor-pointer`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-base leading-tight">
                            {formatWorkoutDisplay(workout)}
                          </span>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
                              onClick={() => handleEditWorkout(workout)}
                            >
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-red-200 rounded-full"
                              onClick={() => onDeleteWorkout(workout.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-sm font-medium mt-1 opacity-75">
                          {workout.duration} min
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Button */}
                {isCurrentMonth && (
                  <div className="flex justify-center pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-12 w-12 p-0 rounded-full border-2 border-dashed border-gray-400 
                        hover:border-gray-600 hover:bg-gray-50 transition-all duration-200"
                      onClick={() => handleAddWorkout(day)}
                    >
                      <Plus className="h-6 w-6" />
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
