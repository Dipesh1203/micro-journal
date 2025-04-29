import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import EmotionBadge from "../components/EmotionBadge";
import EmotionPieChart from "../components/EmotionPieChart";
import EmotionLineChart from "../components/EmotionLineChart";
import { Calendar } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Analytics: React.FC = () => {
  const [emotionCounts, setEmotionCounts] = useState({});
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // Fetch emotion counts
        const emotionsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics/emotions` ||
            "http://localhost:3000/api/analytics/emotions"
        );
        setEmotionCounts(emotionsRes.data);
        console.log(emotionsRes);

        // Fetch weekly emotion data
        const weeklyRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics/weekly` ||
            "http://localhost:3000/api/analytics/weekly"
        );
        console.log(weeklyRes);
        setWeeklyData(weeklyRes.data);

        // Fetch monthly emotion data
        const monthlyRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics/monthly` ||
            "http://localhost:3000/api/analytics/monthly"
        );
        console.log(monthlyRes);
        setMonthlyData(monthlyRes.data);
        console.log(
          emotionsRes.data,
          " ",
          monthlyRes.data,
          " ",
          weeklyRes.data
        );
        // Set default selected month to current month
        const currentDate = new Date();
        const currentMonth = `${currentDate.getFullYear()}-${String(
          currentDate.getMonth() + 1
        ).padStart(2, "0")}`;
        setSelectedMonth(
          Object.keys(monthlyRes.data).includes(currentMonth)
            ? currentMonth
            : Object.keys(monthlyRes.data)[
                Object.keys(monthlyRes.data).length - 1
              ] || ""
        );

        setLoading(false);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const getTotalEntries = () => {
    return Object.values(emotionCounts).reduce(
      // @ts-ignore
      (sum: number, count: number) => sum + (count as number),

      0
    );
  };

  const getDominantEmotion = () => {
    if (Object.keys(emotionCounts).length === 0) return null;

    let maxCount = 0;
    let dominant = "";

    (Object.entries(emotionCounts) as [string, number][]).forEach(
      ([emotion, count]: [string, number]) => {
        if (count > maxCount) {
          maxCount = count;
          dominant = emotion;
        }
      }
    );

    return dominant;
  };

  const formatMonthName = (yearMonth: string) => {
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Emotion Analytics
        </h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Total Entries
            </h3>
            <p className="text-4xl font-bold text-primary-500">
              {getTotalEntries() as number}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Journal entries recorded
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Dominant Emotion
            </h3>
            {getDominantEmotion() ? (
              <>
                <div className="mb-2">
                  <EmotionBadge
                    emotion={getDominantEmotion() ?? ""}
                    size="lg"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {/* @ts-ignore */}
                  {emotionCounts[getDominantEmotion()]} entries (
                  {Math.round(
                    // @ts-ignore
                    (emotionCounts[getDominantEmotion()] / getTotalEntries()) *
                      100
                  )}
                  %)
                </p>
              </>
            ) : (
              <p className="text-gray-500">No data available</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Recent Trend
            </h3>
            <div className="flex space-x-2">
              {Object.keys(weeklyData).length > 0 ? (
                Object.keys(weeklyData)
                  .slice(-3)
                  .map((date) => {
                    // @ts-ignore
                    const dayData = weeklyData[date] ?? "";
                    const dominantEmotion = Object.entries(dayData).reduce(
                      (max, [emotion, count]:[string,number]) =>
                        count > max[1] ? [emotion, count] : max,
                      ["", 0]
                    )[0];

                    return dominantEmotion ? (
                      <div key={date} className="text-center">
                        <EmotionBadge emotion={dominantEmotion} size="sm" />
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(date).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </p>
                      </div>
                    ) : null;
                  })
              ) : (
                <p className="text-gray-500">No recent data</p>
              )}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Emotion Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Emotion Distribution
            </h2>

            {Object.keys(emotionCounts).length > 0 ? (
              <div className="h-80">
                <EmotionPieChart data={emotionCounts} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-gray-500">No emotion data available</p>
              </div>
            )}
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                Monthly Trends
              </h2>

              {Object.keys(monthlyData).length > 0 && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="pl-10 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    {Object.keys(monthlyData).map((month) => (
                      <option key={month} value={month}>
                        {formatMonthName(month)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {Object.keys(monthlyData).length > 0 && selectedMonth ? (
              <div className="h-80">
                <EmotionLineChart data={weeklyData} month={selectedMonth} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-80">
                <p className="text-gray-500">No monthly trend data available</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
