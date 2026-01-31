import { useState, useEffect } from "react";
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

const STORAGE_KEY = 'workout-tracker-data';

const Index = () => {
  const [workouts, setWorkouts] = useState<WorkoutEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Load workouts from localStorage on app start
  useEffect(() => {
    const loadWorkouts = () => {
      try {
        console.log('🔄 Loading workouts from localStorage...');
        
        const storedValue = localStorage.getItem(STORAGE_KEY);
        console.log('📁 Raw storage value:', storedValue);
        
        if (storedValue && storedValue !== 'null' && storedValue !== 'undefined') {
          try {
            const parsedWorkouts = JSON.parse(storedValue);
            console.log('✅ Parsed workouts:', parsedWorkouts);
            
            if (Array.isArray(parsedWorkouts) && parsedWorkouts.length > 0) {
              setWorkouts(parsedWorkouts);
              console.log(`✅ Successfully loaded ${parsedWorkouts.length} workouts from localStorage`);
            } else {
              console.log('📭 Storage contains empty or invalid workout array');
              setWorkouts([]);
            }
          } catch (parseError) {
            console.error('❌ Error parsing stored data:', parseError);
            console.log('🗑️ Clearing corrupted storage data');
            localStorage.removeItem(STORAGE_KEY);
            setWorkouts([]);
          }
        } else {
          console.log('📭 No existing workout data found in storage');
          setWorkouts([]);
        }
      } catch (error) {
        console.error('❌ Error loading workouts from localStorage:', error);
        setWorkouts([]);
      } finally {
        setIsLoading(false);
        console.log('✅ Finished loading process');
      }
    };

    loadWorkouts();
  }, []);

  // Save workouts to localStorage whenever workouts change
  useEffect(() => {
    const saveWorkouts = () => {
      if (isLoading) {
        console.log('⏳ Skipping save during initial load');
        return;
      }

      try {
        console.log(`💾 Saving ${workouts.length} workouts to localStorage...`);
        console.log('📊 Workout data being saved:', workouts);
        
        const dataToSave = JSON.stringify(workouts);
        console.log('📝 Serialized data length:', dataToSave.length);
        
        localStorage.setItem(STORAGE_KEY, dataToSave);
        console.log('✅ Successfully saved workouts to localStorage');
        
        // Immediate verification
        const verifyValue = localStorage.getItem(STORAGE_KEY);
        if (verifyValue) {
          const savedWorkouts = JSON.parse(verifyValue);
          console.log(`✅ Verification: Storage contains ${savedWorkouts.length} workouts`);
          
          if (savedWorkouts.length !== workouts.length) {
            console.warn('⚠️ Mismatch between saved and current workout count!');
          }
        } else {
          console.error('❌ Verification failed: No data found after save!');
        }
        
      } catch (error) {
        console.error('❌ Error saving workouts to localStorage:', error);
        
        // Try to save again with a backup key
        try {
          console.log('🔄 Attempting backup save...');
          localStorage.setItem(`${STORAGE_KEY}-backup`, JSON.stringify(workouts));
          console.log('✅ Backup save successful');
        } catch (backupError) {
          console.error('❌ Backup save also failed:', backupError);
        }
      }
    };

    // Add a small delay to ensure state updates are complete
    const timeoutId = setTimeout(saveWorkouts, 100);
    return () => clearTimeout(timeoutId);
  }, [workouts, isLoading]);

  const addWorkout = (workout: Omit<WorkoutEntry, 'id'>) => {
    const newWorkout: WorkoutEntry = {
      ...workout,
      id: Date.now().toString(),
    };
    console.log('➕ Adding new workout:', newWorkout);
    
    setWorkouts(prev => {
      const updated = [...prev, newWorkout];
      console.log(`📈 Updated workouts count: ${prev.length} → ${updated.length}`);
      return updated;
    });
  };

  const updateWorkout = (id: string, workoutData: Omit<WorkoutEntry, 'id' | 'date'>) => {
    console.log('✏️ Updating workout:', id, workoutData);
    setWorkouts(prev => {
      const updated = prev.map(workout => 
        workout.id === id 
          ? { ...workout, ...workoutData }
          : workout
      );
      console.log('📝 Workout updated in state');
      return updated;
    });
  };

  const deleteWorkout = (id: string) => {
    console.log('🗑️ Deleting workout:', id);
    setWorkouts(prev => {
      const updated = prev.filter(w => w.id !== id);
      console.log(`📉 Updated workouts count after deletion: ${prev.length} → ${updated.length}`);
      return updated;
    });
  };

  const handleImportData = (importedWorkouts: WorkoutEntry[]) => {
    console.log('📥 Importing workouts:', importedWorkouts.length);
    setWorkouts(importedWorkouts);
  };

  // Debug function to check storage state
  const checkStorageState = () => {
    try {
      const storedValue = localStorage.getItem(STORAGE_KEY);
      console.log('🔍 Current storage state check:');
      console.log('📁 Main data:', storedValue);
      
      if (storedValue) {
        const parsed = JSON.parse(storedValue);
        console.log(`📈 Parsed workout count: ${parsed.length}`);
      }
    } catch (error) {
      console.error('❌ Error checking storage:', error);
    }
  };

  // Check storage every 10 seconds for debugging
  useEffect(() => {
    const interval = setInterval(checkStorageState, 10000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-green-700">Loading your workouts...</div>
          <div className="text-sm text-gray-600 mt-2">Checking local storage...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 flex flex-col safe-area-inset">
      <Header />
      
      <main className="flex-1 container mx-auto px-3 py-3 flex flex-col">
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
            <Analytics workouts={workouts} selectedYear={selectedYear} onYearChange={setSelectedYear} />
          </TabsContent>

          <TabsContent value="reports" className="flex-1 overflow-y-auto">
            <Reports workouts={workouts} onImportData={handleImportData} selectedYear={selectedYear} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
