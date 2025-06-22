
import { useState } from "react";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { Analytics } from "@/components/Analytics";
import { Reports } from "@/components/Reports";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface WorkoutEntry {
  id: string;
  date: string;
  activity: 'Brazilian Jiu-Jitsu' | 'Cycling' | 'Hiking' | 'Kickboxing' | 'Other' | 'Resistance' | 'Running' | 'Swimming';
  secondaryActivity?: 'Brazilian Jiu-Jitsu' | 'Cycling' | 'Hiking' | 'Kickboxing' | 'Other' | 'Resistance' | 'Running' | 'Swimming';
  duration: number; // in minutes
  secondaryDuration?: number; // in minutes for secondary activity
  exerciseType?: 'Push' | 'Pull' | 'Legs'; // Only for Resistance training
  pplSplit?: 'Push' | 'Pull' | 'Legs'; // Only for secondary Resistance training
  customActivityName?: string; // For when activity is "Other"
  customSecondaryActivityName?: string; // For when secondaryActivity is "Other"
}

const Index = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);

  const addWorkout = (workout: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: Date.now().toString(),
    };
    setWorkouts(prev => [...prev, newWorkout]);
  };

  const updateWorkout = (id: string, workoutData: Omit<WorkoutEntry, 'id' | 'date'>) => {
    setWorkouts(prev => prev.map(workout => 
      workout.id === id 
        ? { ...workout, ...workoutData }
        : workout
    ));
  };

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 border-2 border-blue-200 p-1">
            <TabsTrigger 
              value="calendar" 
              className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
            >
              Workout Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="text-sm font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <WorkoutCalendar 
              workouts={workouts} 
              onAddWorkout={addWorkout}
              onDeleteWorkout={deleteWorkout}
              onUpdateWorkout={updateWorkout}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Analytics workouts={workouts} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Reports workouts={workouts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
