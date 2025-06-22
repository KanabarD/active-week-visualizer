
import { useState } from "react";
import { format, startOfWeek, endOfWeek, addDays, isSameDay, startOfDay, addWeeks, subWeeks, startOfYear, getWeek } from "date-fns";
import { Plus, Trash2, ChevronLeft, ChevronRight, Edit3, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutCalendarProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
  onUpdateWorkout: (id: string, workout: Omit<WorkoutEntry, 'id'>) => void;
}

const activityColors = {
  "Brazilian Jiu-Jitsu": "bg-purple-500 text-white border-purple-600",
  Cycling: "bg-cyan-500 text-white border-cyan-600",
  Hiking: "bg-green-500 text-white border-green-600",
  Kickboxing: "bg-red-500 text-white border-red-600",
  Other: "bg-gray-500 text-white border-gray-600",
  Resistance: "bg-orange-500 text-white border-orange-600",
  Running: "bg-emerald-500 text-white border-emerald-600",
  Swimming: "bg-blue-500 text-white border-blue-600",
};

export function WorkoutCalendar({ workouts, onAddWorkout, onDeleteWorkout, onUpdateWorkout }: WorkoutCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editWorkout, setEditWorkout] = useState<WorkoutEntry | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Calculate current year and week number
  const currentYear = new Date().getFullYear();
  const yearStart = startOfYear(new Date(currentYear, 0, 1));
  const currentWeekNumber = getWeek(currentDate, { weekStartsOn: 1 });

  const getCalendarDays = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(weekStart, i));
    }
    return days;
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
    if (direction === 'prev') {
      setCurrentDate(subWeeks(newDate, 1));
    } else {
      setCurrentDate(addWeeks(newDate, 1));
    }
  };

  const handleWeekChange = (weekNumbers: number[]) => {
    const weekNumber = weekNumbers[0];
    // Calculate the date for the given week number
    const targetDate = addWeeks(yearStart, weekNumber - 1);
    setCurrentDate(targetDate);
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
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <Card className="bg-white shadow-xl border-0">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('prev')}
              className="h-12 w-12 p-0 border-3 border-gray-400 hover:border-gray-600 text-lg font-bold"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-3">
                <CalendarDays className="h-8 w-8 text-gray-700" />
                <CardTitle className="text-4xl font-bold text-gray-900">
                  Weekly View
                </CardTitle>
              </div>
              
              <div className="text-2xl font-semibold text-gray-700">
                {getDateRangeText()}
              </div>
              
              <div className="text-lg text-gray-600">
                Week {currentWeekNumber} of {currentYear}
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTime('next')}
              className="h-12 w-12 p-0 border-3 border-gray-400 hover:border-gray-600 text-lg font-bold"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Week Navigation Wheel */}
      <Card className="bg-white shadow-lg border-0">
        <CardContent className="py-6">
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Navigate to Any Week</h3>
              <p className="text-sm text-gray-600">Drag the slider to jump to any week of the year</p>
            </div>
            
            <div className="px-4">
              <Slider
                value={[currentWeekNumber]}
                onValueChange={handleWeekChange}
                min={1}
                max={53}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Week 1</span>
                <span>Week 26</span>
                <span>Week 53</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Grid */}
      <div className="space-y-6">
        {/* Calendar Days */}
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day);
          const isToday = isSameDay(day, new Date());

          return (
            <Card 
              key={index} 
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
                  {dayWorkouts.map((workout) => (
                    <div key={workout.id} className="group">
                      <div 
                        className={`p-4 rounded-xl border-3 ${activityColors[workout.activity]} 
                          hover:shadow-lg transition-all duration-200 cursor-pointer`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg leading-tight">
                            {formatWorkoutDisplay(workout)}
                          </span>
                          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 w-10 p-0 hover:bg-white/20 rounded-full"
                              onClick={() => handleEditWorkout(workout)}
                            >
                              <Edit3 className="h-5 w-5" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-10 w-10 p-0 hover:bg-red-500/20 rounded-full"
                              onClick={() => onDeleteWorkout(workout.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-base font-semibold mt-2 opacity-90">
                          {workout.duration} minutes
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Button */}
                <div className="flex justify-center pt-6">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-16 w-16 p-0 rounded-full border-3 border-dashed border-gray-500 
                      hover:border-gray-700 hover:bg-gray-100 transition-all duration-200 text-lg font-bold"
                    onClick={() => handleAddWorkout(day)}
                  >
                    <Plus className="h-8 w-8" />
                  </Button>
                </div>
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
