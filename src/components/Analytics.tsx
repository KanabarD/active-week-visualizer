
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { WorkoutEntry } from "@/pages/Index";

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

  const analyticsData = useMemo(() => {
    // Weekly activity distribution
    const weeklyData = workouts.reduce((acc, workout) => {
      const activityName = workout.activity === 'Other' && workout.customActivityName 
        ? workout.customActivityName 
        : workout.activity;
      acc[activityName] = (acc[activityName] || 0) + workout.duration;
      
      // Add secondary activity if it exists
      if (workout.secondaryActivity) {
        const secondaryName = workout.secondaryActivity === 'Other' && workout.customSecondaryActivityName
          ? workout.customSecondaryActivityName
          : workout.secondaryActivity;
        acc[secondaryName] = (acc[secondaryName] || 0) + (workout.duration * 0.3); // Give secondary activity 30% of the time
      }
      
      return acc;
    }, {} as Record<string, number>);

    const weeklyChartData = Object.entries(weeklyData).map(([activity, duration]) => ({
      activity: activity.length > 12 ? activity.substring(0, 12) + "..." : activity, // Truncate long names
      fullActivity: activity, // Keep full name for tooltip
      duration: Math.round(duration),
      durationFormatted: formatDuration(Math.round(duration)), // Add formatted duration
      fill: activityColors[activity as keyof typeof activityColors] || "#6b7280", // Default to gray for custom activities
    }));

    // Pie chart data
    const totalDuration = Object.values(weeklyData).reduce((sum, duration) => sum + duration, 0);
    const pieData = Object.entries(weeklyData).map(([activity, duration]) => ({
      name: activity,
      value: Math.round(duration),
      valueFormatted: formatDuration(Math.round(duration)), // Add formatted duration
      percentage: ((duration / totalDuration) * 100).toFixed(1),
      fill: activityColors[activity as keyof typeof activityColors] || "#6b7280", // Default to gray for custom activities
    }));

    // Summary stats
    const totalWorkouts = workouts.length;
    const actualTotalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(actualTotalDuration / totalWorkouts) : 0;
    const mostActiveActivity = Object.entries(weeklyData).reduce(
      (max, [activity, duration]) => duration > max.duration ? { activity, duration: Math.round(duration) } : max,
      { activity: 'None', duration: 0 }
    );

    return {
      weeklyChartData,
      pieData,
      totalWorkouts,
      totalDuration: actualTotalDuration,
      averageDuration,
      mostActiveActivity,
    };
  }, [workouts]);

  return (
    <div className="space-y-4 px-1">
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
              <BarChart data={analyticsData.weeklyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
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
                    props.payload?.durationFormatted || formatDuration(Number(value)),
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
              <PieChart>
                <Pie
                  data={analyticsData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage, valueFormatted }) => {
                    // Only show label if percentage is > 8% to avoid overcrowding on small screens
                    if (parseFloat(percentage) > 8) {
                      const shortName = name.length > 6 ? name.substring(0, 6) + "..." : name;
                      return `${shortName} ${percentage}%`;
                    }
                    return "";
                  }}
                  outerRadius={85}
                  fontSize={9}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value, name) => [
                    `${analyticsData.pieData.find(d => d.name === name)?.valueFormatted || formatDuration(Number(value))} (${analyticsData.pieData.find(d => d.name === name)?.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
