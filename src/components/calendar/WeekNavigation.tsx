
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
    // We need to trigger a navigation to today's week
    // Since we don't have direct access to setCurrentDate, we'll use the existing onNavigate
    // But we need to modify the parent component to handle this
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('jumpToToday'));
    }
  };

  return (
    <Card className="bg-white shadow-xl border-0">
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('prev')}
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

            <Button
              variant="outline"
              size="sm"
              onClick={jumpToToday}
              className="h-10 px-4 border-2 border-blue-400 hover:border-blue-600 hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-semibold"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Jump to Today
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate('next')}
            className="h-12 w-12 p-0 border-3 border-gray-400 hover:border-gray-600 text-lg font-bold"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
