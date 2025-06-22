import { useState, useEffect } from "react";
import { addMonths, subMonths } from "date-fns";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutEntry } from "@/pages/Index";
import { MonthlyCalendar } from "./calendar/MonthlyCalendar";
import { ListView } from "./calendar/ListView";
import { Calendar, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WorkoutCalendarProps {
  workouts: WorkoutEntry[];
  onAddWorkout: (workout: Omit<WorkoutEntry, 'id'>) => void;
  onDeleteWorkout: (id: string) => void;
  onUpdateWorkout: (id: string, workout: Omit<WorkoutEntry, 'id'>) => void;
}

export function WorkoutCalendar({ workouts, onAddWorkout, onDeleteWorkout, onUpdateWorkout }: WorkoutCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editWorkout, setEditWorkout] = useState<WorkoutEntry | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Listen for jump to today events
  useEffect(() => {
    const handleJumpToToday = () => {
      setCurrentDate(new Date());
    };

    window.addEventListener('jumpToToday', handleJumpToToday);
    return () => window.removeEventListener('jumpToToday', handleJumpToToday);
  }, []);

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
    if (direction === 'prev') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  return (
    <div className="h-full flex flex-col space-y-3 overflow-hidden">
      {/* View Toggle */}
      <div className="flex-shrink-0 bg-white/90 rounded-lg border-2 border-lime-300 p-1">
        <div className="grid grid-cols-2 gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('calendar')}
            className={cn(
              "flex items-center space-x-2 h-10 transition-all duration-200",
              viewMode === 'calendar' 
                ? "bg-gradient-to-r from-lime-400 to-green-500 text-black shadow-sm" 
                : "hover:bg-lime-100"
            )}
          >
            <Calendar className="h-4 w-4" />
            <span className="text-sm font-medium">Calendar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('list')}
            className={cn(
              "flex items-center space-x-2 h-10 transition-all duration-200",
              viewMode === 'list' 
                ? "bg-gradient-to-r from-green-400 to-emerald-500 text-black shadow-sm" 
                : "hover:bg-lime-100"
            )}
          >
            <List className="h-4 w-4" />
            <span className="text-sm font-medium">List</span>
          </Button>
        </div>
      </div>

      {/* Calendar or List View */}
      {viewMode === 'calendar' ? (
        <MonthlyCalendar
          currentDate={currentDate}
          workouts={workouts}
          onNavigate={navigateTime}
          onAddWorkout={handleAddWorkout}
          onEditWorkout={handleEditWorkout}
          onDeleteWorkout={onDeleteWorkout}
        />
      ) : (
        <ListView
          currentDate={currentDate}
          workouts={workouts}
          onNavigate={navigateTime}
          onAddWorkout={handleAddWorkout}
          onEditWorkout={handleEditWorkout}
          onDeleteWorkout={onDeleteWorkout}
        />
      )}

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
