
import { getWeek, startOfYear, addWeeks } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

interface WeekSliderProps {
  currentDate: Date;
  onWeekChange: (weekNumber: number) => void;
}

export function WeekSlider({ currentDate, onWeekChange }: WeekSliderProps) {
  const currentYear = new Date().getFullYear();
  const currentWeekNumber = getWeek(currentDate, { weekStartsOn: 1 });

  const handleWeekChange = (weekNumbers: number[]) => {
    onWeekChange(weekNumbers[0]);
  };

  return (
    <Card className="bg-white shadow-lg border-0">
      <CardContent className="py-3">
        <div className="space-y-2">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-gray-800 mb-1">Navigate to Any Week</h3>
            <p className="text-xs text-gray-600">Drag the slider to jump to any week of the year</p>
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
            
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Week 1</span>
              <span>Week 26</span>
              <span>Week 53</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
