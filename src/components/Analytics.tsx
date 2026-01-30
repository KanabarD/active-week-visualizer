import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { WorkoutEntry } from "@/pages/Index";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfYear, endOfYear, isWithinInterval } from "date-fns";

interface AnalyticsProps {
  workouts: WorkoutEntry[];
}

const activityColors = {
  "Brazilian Jiu-Jitsu": "#8b5cf6",
  Cycling: "#06b6d4",
  Hiking: "#84cc16",
  Kickboxing: "#ef4444",
  Resistance: "#f97316",
  Running: "#22c55e",
  Swimming: "#3b82f6",
  Other: "#6b7280",
};

export function Analytics({ workouts }: AnalyticsProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

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

  const filteredWorkouts = useMemo(() => {
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));
    
    return workouts.filter(workout => {
      const workoutDate = new Date(workout.date);
      return isWithinInterval(workoutDate, { start: yearStart, end: yearEnd });
    });
  }, [workouts, currentYear]);

  const analyticsData = useMemo(() => {
    // Activity distribution for the selected year
    const yearlyData = filteredWorkouts.reduce((acc, workout) => {
      const activityName = workout.activity === 'Other' && workout.customActivityName 
        ? workout.customActivityName 
        : workout.activity;
      acc[activityName] = (acc[activityName] || 0) + workout.duration;
      
      // Add secondary activity if it exists
      if (workout.secondaryActivity) {
        const secondaryName = workout.secondaryActivity === 'Other' && workout.customSecondaryActivityName
          ? workout.customSecondaryActivityName
          : workout.secondaryActivity;
        acc[secondaryName] = (acc[secondaryName] || 0) + (workout.duration * 0.3);
      }
      
      return acc;
    }, {} as Record<string, number>);

    const yearlyChartData = Object.entries(yearlyData).map(([activity, duration]) => ({
      activity: activity.length > 12 ? activity.substring(0, 12) + "..." : activity,
      fullActivity: activity,
      duration: Math.round(duration),
      durationFormatted: formatDuration(Math.round(duration)),
      fill: activityColors[activity as keyof typeof activityColors] || "#6b7280",
    }));

    // Pie chart data
    const totalDuration = Object.values(yearlyData).reduce((sum, duration) => sum + duration, 0);
    const pieData = Object.entries(yearlyData).map(([activity, duration]) => ({
      name: activity,
      value: Math.round(duration),
      valueFormatted: formatDuration(Math.round(duration)),
      percentage: totalDuration > 0 ? ((duration / totalDuration) * 100).toFixed(1) : "0",
      fill: activityColors[activity as keyof typeof activityColors] || "#6b7280",
    }));

    // Summary stats
    const totalWorkouts = filteredWorkouts.length;
    const actualTotalDuration = filteredWorkouts.reduce((sum, workout) => sum + workout.duration, 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(actualTotalDuration / totalWorkouts) : 0;
    const mostActiveActivity = Object.entries(yearlyData).reduce(
      (max, [activity, duration]) => duration > max.duration ? { activity, duration: Math.round(duration) } : max,
      { activity: 'None', duration: 0 }
    );

    return {
      yearlyChartData,
      pieData,
      totalWorkouts,
      totalDuration: actualTotalDuration,
      averageDuration,
      mostActiveActivity,
    };
  }, [filteredWorkouts]);

  return (
    <div className="space-y-4 px-1">
      {/* Year Navigation */}
      <div className="flex items-center justify-between bg-white/90 rounded-lg p-3 border-2 border-lime-300">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('prev')}
          className="h-8 w-8 p-0 hover:bg-lime-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800">{currentYear}</h2>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigateYear('next')}
          className="h-8 w-8 p-0 hover:bg-lime-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3">
          <CardHeader className="pb-1 px-0 pt-0">
            <CardTitle className="text-xs font-medium text-gray-600">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl font-bold text-blue-600">{analyticsData.totalWorkouts}</div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="pb-1 px-0 pt-0">
            <CardTitle className="text-xs font-medium text-gray-600">Total Duration</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl font-bold text-green-600">{formatDuration(analyticsData.totalDuration)}</div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="pb-1 px-0 pt-0">
            <CardTitle className="text-xs font-medium text-gray-600">Average Duration</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-xl font-bold text-purple-600">{formatDuration(analyticsData.averageDuration)}</div>
          </CardContent>
        </Card>

        <Card className="p-3">
          <CardHeader className="pb-1 px-0 pt-0">
            <CardTitle className="text-xs font-medium text-gray-600">Most Active</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="text-sm font-bold text-orange-600 leading-tight">{analyticsData.mostActiveActivity.activity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Duration</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData.yearlyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="activity" 
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  fontSize={10}
                  interval={0}
                />
                <YAxis fontSize={10} width={40} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name, props) => [
                    formatDuration(Number(value)),
                    props.payload?.fullActivity || name
                  ]}
                />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart 
                data={analyticsData.pieData} 
                layout="vertical"
                margin={{ top: 10, right: 20, left: 80, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 60).toFixed(1)}h`}
                  label={{ value: 'Hours', position: 'bottom', offset: 10, fontSize: 11 }}
                />
                <YAxis 
                  type="category"
                  dataKey="name"
                  fontSize={10}
                  width={75}
                  tickFormatter={(value) => value.length > 10 ? value.substring(0, 10) + "..." : value}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name, props) => [
                    `${formatDuration(Number(value))} (${props.payload?.percentage}%)`,
                    props.payload?.name
                  ]}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {analyticsData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
