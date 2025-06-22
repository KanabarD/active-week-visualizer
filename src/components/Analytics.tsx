
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { WorkoutEntry } from "@/pages/Index";

interface AnalyticsProps {
  workouts: WorkoutEntry[];
}

const activityColors = {
  BJJ: "#8b5cf6",
  Cycling: "#06b6d4",
  Hiking: "#84cc16",
  Kickboxing: "#ef4444",
  Resistance: "#f97316",
  Running: "#22c55e",
  Swimming: "#3b82f6",
};

export function Analytics({ workouts }: AnalyticsProps) {
  const analyticsData = useMemo(() => {
    // Weekly activity distribution
    const weeklyData = workouts.reduce((acc, workout) => {
      const activity = workout.activity;
      acc[activity] = (acc[activity] || 0) + workout.duration;
      return acc;
    }, {} as Record<string, number>);

    const weeklyChartData = Object.entries(weeklyData).map(([activity, duration]) => ({
      activity,
      duration,
      fill: activityColors[activity as keyof typeof activityColors],
    }));

    // Pie chart data
    const totalDuration = Object.values(weeklyData).reduce((sum, duration) => sum + duration, 0);
    const pieData = Object.entries(weeklyData).map(([activity, duration]) => ({
      name: activity,
      value: duration,
      percentage: ((duration / totalDuration) * 100).toFixed(1),
      fill: activityColors[activity as keyof typeof activityColors],
    }));

    // Summary stats
    const totalWorkouts = workouts.length;
    const averageDuration = totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts) : 0;
    const mostActiveActivity = Object.entries(weeklyData).reduce(
      (max, [activity, duration]) => duration > max.duration ? { activity, duration } : max,
      { activity: 'None', duration: 0 }
    );

    return {
      weeklyChartData,
      pieData,
      totalWorkouts,
      totalDuration,
      averageDuration,
      mostActiveActivity,
    };
  }, [workouts]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analyticsData.totalWorkouts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analyticsData.totalDuration}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analyticsData.averageDuration}m</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Most Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-orange-600">{analyticsData.mostActiveActivity.activity}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Duration (Minutes)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.weeklyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="duration" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analyticsData.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
