
import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkoutEntry } from "@/pages/Index";

interface WorkoutItemProps {
  workout: WorkoutEntry;
  onEdit: (workout: WorkoutEntry) => void;
  onDelete: (id: string) => void;
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

export function WorkoutItem({ workout, onEdit, onDelete }: WorkoutItemProps) {
  const formatActivityDisplay = (activity: string, customName?: string, exerciseType?: string, pplSplit?: string) => {
    let displayText = activity === 'Other' && customName ? customName : activity;
    
    if (exerciseType) {
      displayText += ` - ${exerciseType}`;
    } else if (pplSplit) {
      displayText += ` - ${pplSplit}`;
    }
    
    return displayText;
  };

  const formatDurationDisplay = (duration: number, secondaryDuration?: number) => {
    if (secondaryDuration) {
      return `${duration}+${secondaryDuration}min`;
    }
    return `${duration}min`;
  };

  const primaryActivity = formatActivityDisplay(workout.activity, workout.customActivityName, workout.exerciseType);
  const secondaryActivity = workout.secondaryActivity 
    ? formatActivityDisplay(workout.secondaryActivity, workout.customSecondaryActivityName, undefined, workout.pplSplit)
    : null;

  return (
    <div className="group">
      <div 
        className={`p-2 rounded-lg border-2 ${activityColors[workout.activity]} 
          hover:shadow-md transition-all duration-200 cursor-pointer`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-tight truncate">
              {primaryActivity}
            </div>
            {secondaryActivity && (
              <div className="text-xs font-medium leading-tight mt-1 opacity-90 truncate">
                + {secondaryActivity}
              </div>
            )}
            <div className="text-xs font-semibold mt-1 opacity-90">
              {formatDurationDisplay(workout.duration, workout.secondaryDuration)}
            </div>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20 rounded-full"
              onClick={() => onEdit(workout)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-red-500/20 rounded-full"
              onClick={() => onDelete(workout.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
