
import { format, startOfWeek, endOfWeek, getWeek, startOfYear } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, Calendar } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeekNavigationProps {
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function WeekNavigation({ currentDate, onNavigate }: WeekNavigationProps) {
  const currentYear = new Date().getFullYear();
  const currentWeekNumber = getWeek(currentDate, { weekStartsOn: 1 });

  const getDateRangeText = () => {
    const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
  };

  const jumpToToday = () => {
    const today = new Date();
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('jumpToToday'));
    }
  };

  return (
    <Card className="bg-white shadow-md border-0">
      <CardHeader className="pb-2 pt-2">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
            className="h-12 w-12 p-0 border-2 border-gray-400 hover:border-gray-600 text-lg font-bold touch-manipulation"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <div className="flex flex-col items-center space-y-1 flex-1">
            <div className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg font-bold text-gray-900">
                Weekly View
              </CardTitle>
            </div>
            
            <div className="text-sm font-semibold text-gray-700 text-center">
              {getDateRangeText()}
            </div>
            
            <div className="text-xs text-gray-600">
              Week {currentWeekNumber} of {currentYear}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={jumpToToday}
              className="h-8 px-3 border-2 border-blue-400 hover:border-blue-600 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold touch-manipulation"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Today
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            className="h-12 w-12 p-0 border-2 border-gray-400 hover:border-gray-600 text-lg font-bold touch-manipulation"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
