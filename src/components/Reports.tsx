import { useMemo } from "react";
import { format, startOfWeek, startOfMonth, startOfYear, endOfWeek, endOfMonth, endOfYear, isWithinInterval } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WorkoutEntry } from "@/pages/Index";

interface ReportsProps {
  workouts: WorkoutEntry[];
}

export function Reports({ workouts }: ReportsProps) {
  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "0m";
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes}m`;
    } else if (remainingMinutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  const reports = useMemo(() => {
    const now = new Date();
    
    // Weekly report
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const weeklyWorkouts = workouts.filter(workout => 
      isWithinInterval(new Date(workout.date), { start: weekStart, end: weekEnd })
    );

    // Monthly report
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const monthlyWorkouts = workouts.filter(workout => 
      isWithinInterval(new Date(workout.date), { start: monthStart, end: monthEnd })
    );

    // Yearly report
    const yearStart = startOfYear(now);
    const yearEnd = endOfYear(now);
    const yearlyWorkouts = workouts.filter(workout => 
      isWithinInterval(new Date(workout.date), { start: yearStart, end: yearEnd })
    );

    const calculateStats = (workoutList: WorkoutEntry[]) => {
      const activityStats = workoutList.reduce((acc, workout) => {
        const activity = workout.activity;
        if (!acc[activity]) {
          acc[activity] = { count: 0, duration: 0 };
        }
        acc[activity].count += 1;
        acc[activity].duration += workout.duration;
        return acc;
      }, {} as Record<string, { count: number; duration: number }>);

      const totalDuration = workoutList.reduce((sum, workout) => sum + workout.duration, 0);
      const totalWorkouts = workoutList.length;

      return {
        activityStats,
        totalDuration,
        totalWorkouts,
        averageDuration: totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0,
      };
    };

    return {
      weekly: {
        period: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`,
        ...calculateStats(weeklyWorkouts),
      },
      monthly: {
        period: format(monthStart, 'MMMM yyyy'),
        ...calculateStats(monthlyWorkouts),
      },
      yearly: {
        period: format(yearStart, 'yyyy'),
        ...calculateStats(yearlyWorkouts),
      },
    };
  }, [workouts]);

  const ReportCard = ({ title, report }: { title: string; report: any }) => (
    <Card className="bg-white border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="text-gray-800">{title}</span>
          <Badge variant="outline" className="border-gray-300 text-gray-600 bg-gray-50">{report.period}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{report.totalWorkouts}</div>
            <div className="text-sm text-gray-600">Workouts</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{formatDuration(report.totalDuration)}</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-700">{formatDuration(report.averageDuration)}</div>
            <div className="text-sm text-gray-600">Avg Duration</div>
          </div>
        </div>

        {Object.keys(report.activityStats).length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-semibold mb-2 text-gray-700">Activity Breakdown</h4>
            <div className="space-y-2">
              {Object.entries(report.activityStats).map(([activity, stats]: [string, any]) => (
                <div key={activity} className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
                  <span className="font-medium text-gray-700">{activity}</span>
                  <div className="text-sm text-gray-600">
                    {stats.count} sessions • {formatDuration(stats.duration)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <ReportCard title="Weekly Report" report={reports.weekly} />
      <ReportCard title="Monthly Report" report={reports.monthly} />
      <ReportCard title="Yearly Report" report={reports.yearly} />
    </div>
  );
}
