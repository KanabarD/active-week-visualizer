import { useState } from "react";
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { Analytics } from "@/components/Analytics";
import { Reports } from "@/components/Reports";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface WorkoutEntry {
  id: string;
  date: string;
  activity: 'BJJ' | 'Cycling' | 'Hiking' | 'Kickboxing' | 'Other' | 'Resistance' | 'Running' | 'Swimming';
  duration: number; // in minutes
  exerciseType?: 'Push' | 'Pull' | 'Legs'; // Only for Resistance training
  notes?: string;
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

  const deleteWorkout = (id: string) => {
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="calendar" className="text-sm font-medium">
              Workout Calendar
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm font-medium">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-sm font-medium">
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <WorkoutCalendar 
              workouts={workouts} 
              onAddWorkout={addWorkout}
              onDeleteWorkout={deleteWorkout}
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
