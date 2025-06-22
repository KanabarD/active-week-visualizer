import { useState, useEffect } from "react";
import { Preferences } from '@capacitor/preferences';
import { WorkoutCalendar } from "@/components/WorkoutCalendar";
import { Analytics } from "@/components/Analytics";
import { Reports } from "@/components/Reports";
import { Header } from "@/components/Header";
import { DataManager } from "@/components/DataManager";
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

const STORAGE_KEY = 'workout-tracker-data';

const Index = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load workouts from Capacitor native storage on app start
  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        console.log('Loading workouts from native storage...');
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          const parsedWorkouts = JSON.parse(value);
          setWorkouts(parsedWorkouts);
          console.log('Successfully loaded workouts from native storage:', parsedWorkouts.length);
        } else {
          console.log('No existing workout data found in storage');
        }
      } catch (error) {
        console.error('Error loading workouts from native storage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkouts();
  }, []);

  // Save workouts to Capacitor native storage whenever workouts change
  useEffect(() => {
    const saveWorkouts = async () => {
      if (isLoading) {
        console.log('Skipping save during initial load');
        return;
      }

      try {
        console.log('Saving workouts to native storage:', workouts.length);
        await Preferences.set({
          key: STORAGE_KEY,
          value: JSON.stringify(workouts),
        });
        console.log('Successfully saved workouts to native storage');
        
        // Verify the save by reading it back
        const { value } = await Preferences.get({ key: STORAGE_KEY });
        if (value) {
          const savedWorkouts = JSON.parse(value);
          console.log('Verification: Storage contains', savedWorkouts.length, 'workouts');
        }
      } catch (error) {
        console.error('Error saving workouts to native storage:', error);
      }
    };

    saveWorkouts();
  }, [workouts, isLoading]);

  const addWorkout = async (workout: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: Date.now().toString(),
    };
    console.log('Adding new workout:', newWorkout);
    setWorkouts(prev => {
      const updated = [...prev, newWorkout];
      console.log('Updated workouts count:', updated.length);
      return updated;
    });
  };

  const updateWorkout = async (id: string, workoutData: Omit<WorkoutEntry, 'id' | 'date'>) => {
    console.log('Updating workout:', id);
    setWorkouts(prev => prev.map(workout => 
      workout.id === id 
        ? { ...workout, ...workoutData }
        : workout
    ));
  };

  const deleteWorkout = async (id: string) => {
    console.log('Deleting workout:', id);
    setWorkouts(prev => {
      const updated = prev.filter(w => w.id !== id);
      console.log('Updated workouts count after deletion:', updated.length);
      return updated;
    });
  };

  const handleImportData = async (importedWorkouts: WorkoutEntry[]) => {
    console.log('Importing workouts:', importedWorkouts.length);
    setWorkouts(importedWorkouts);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-700">Loading your workouts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 flex flex-col safe-area-inset">
      <Header />
      
      <main className="flex-1 container mx-auto px-3 py-3 flex flex-col">
        <div className="flex justify-end mb-3">
          <DataManager workouts={workouts} onImportData={handleImportData} />
        </div>
        
        <Tabs defaultValue="calendar" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mb-3 bg-white/90 border-2 border-lime-300 p-1.5 rounded-lg h-14 flex-shrink-0">
            <TabsTrigger 
              value="calendar" 
              className="text-base font-semibold rounded-md mx-0.5 min-h-[48px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-lime-400 data-[state=active]:to-green-500 data-[state=active]:text-black transition-all duration-200 touch-manipulation"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="text-base font-semibold rounded-md mx-0.5 min-h-[48px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-black transition-all duration-200 touch-manipulation"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="text-base font-semibold rounded-md mx-0.5 min-h-[48px] data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-400 data-[state=active]:to-lime-500 data-[state=active]:text-black transition-all duration-200 touch-manipulation"
            >
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="flex-1 overflow-hidden">
            <WorkoutCalendar 
              workouts={workouts} 
              onAddWorkout={addWorkout}
              onDeleteWorkout={deleteWorkout}
              onUpdateWorkout={updateWorkout}
            />
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 overflow-y-auto">
            <Analytics workouts={workouts} />
          </TabsContent>

          <TabsContent value="reports" className="flex-1 overflow-y-auto">
            <Reports workouts={workouts} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
