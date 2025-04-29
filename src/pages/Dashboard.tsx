import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import JournalCard from "../components/JournalCard";
import EmotionPieChart from "../components/EmotionPieChart";
import { Edit, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Dashboard: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [recentEntries, setRecentEntries] = useState([]);
  const [emotionData, setEmotionData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch recent entries
        const entriesRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/journal?limit=3` ||
            "http://localhost:3000/api/journal?limit=3"
        );
        setRecentEntries(entriesRes.data.slice(0, 3));

        // Fetch emotion analytics
        const analyticsRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/analytics/emotions` ||
            "http://localhost:3000/api/analytics/emotions"
        );
        setEmotionData(analyticsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {greeting()}, {user?.name}
          </h1>
          <p className="mt-2 text-gray-600">
            Track your moods and journal your thoughts.
          </p>
        </div>

        {/* New Entry Button */}
        <div className="mb-8">
          <Link
            to="/entries/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-black-300 dark:text-white-400 bg-primary-600 "
          >
            <Edit className="mr-2 h-5 w-5" />
            Write in your journal
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Entries Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Entries
                </h2>
                <Link
                  to="/entries"
                  className="text-primary-600 hover:text-primary-700 text-sm flex items-center"
                >
                  View all
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {recentEntries.length > 0 ? (
                <div className="space-y-4">
                  {recentEntries.map((entry) => (
                    // @ts-ignore
                    <JournalCard key={entry._id} entry={entry} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No journal entries yet.</p>
                  <Link
                    to="/entries/new"
                    className="mt-2 inline-block text-black-600 dark:text-primary-600 hover:text-primary-700"
                  >
                    Create your first entry
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mood Insights Section */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Emotion Insights
              </h2>

              {Object.keys(emotionData).length > 0 ? (
                <div>
                  <div className="h-64 mb-4">
                    <EmotionPieChart data={emotionData} />
                  </div>
                  <Link
                    to="/analytics"
                    className="text-primary-600 hover:text-primary-700 text-sm flex items-center justify-end"
                  >
                    View detailed analytics
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No emotion data yet.</p>
                  <p className="text-gray-500 text-sm">
                    Start journaling to see your emotional patterns.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
