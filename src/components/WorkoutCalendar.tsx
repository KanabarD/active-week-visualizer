import { useState, useEffect } from "react";
import { startOfWeek, addDays, isSameDay, startOfYear, addWeeks, subWeeks, getWeek } from "date-fns";
import { WorkoutForm } from "./WorkoutForm";
import { WorkoutEntry } from "@/pages/Index";
import { WeekNavigation } from "./calendar/WeekNavigation";
import { WeekSlider } from "./calendar/WeekSlider";
import { DayCard } from "./calendar/DayCard";

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

  // Listen for jump to today events
  useEffect(() => {
    const handleJumpToToday = () => {
      setCurrentDate(new Date());
    };

    window.addEventListener('jumpToToday', handleJumpToToday);
    return () => window.removeEventListener('jumpToToday', handleJumpToToday);
  }, []);

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

  const handleWeekChange = (weekNumber: number) => {
    const currentYear = new Date().getFullYear();
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const targetDate = addWeeks(yearStart, weekNumber - 1);
    setCurrentDate(targetDate);
  };

  return (
    <div className="space-y-4">
      <WeekNavigation currentDate={currentDate} onNavigate={navigateTime} />
      
      <WeekSlider currentDate={currentDate} onWeekChange={handleWeekChange} />

      {/* Calendar Grid - 7 columns for all days */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-2 h-[calc(100vh-400px)] min-h-[500px]">
        {days.map((day, index) => {
          const dayWorkouts = getWorkoutsForDate(day);

          return (
            <DayCard
              key={index}
              day={day}
              workouts={dayWorkouts}
              onAddWorkout={handleAddWorkout}
              onEditWorkout={handleEditWorkout}
              onDeleteWorkout={onDeleteWorkout}
            />
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
