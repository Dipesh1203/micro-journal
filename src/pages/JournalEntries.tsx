import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import JournalCard from "../components/JournalCard";
import EmotionBadge from "../components/EmotionBadge";
import { Edit, Calendar, Filter } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { motion } from "framer-motion";

const JournalEntries: React.FC = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterEmotion, setFilterEmotion] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const emotions = ["happy", "sad", "angry", "neutral", "fear", "surprise"];

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/journal` ||
            "http://localhost:3000/api/journal"
        );
        setEntries(res.data);
        console.log(res.data);
        setFilteredEntries(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching entries:", err);
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  useEffect(() => {
    const filtered = entries.filter((entry) => {
      // Filter by emotion if selected
      const emotionMatch = filterEmotion
        ? //@ts-ignore
          entry.detectedEmotion === filterEmotion
        : true;

      // Filter by search term if provided
      const searchMatch = searchTerm
        ? //@ts-ignore
          entry.content.toLowerCase().includes(searchTerm.toLowerCase())
        : true;

      return emotionMatch && searchMatch;
    });

    setFilteredEntries(filtered);
  }, [filterEmotion, searchTerm, entries]);

  const resetFilters = () => {
    setFilterEmotion("");
    setSearchTerm("");
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Journal Entries
            </h1>
            <p className="mt-1 text-gray-600">
              View and manage your journal entries
            </p>
          </div>
          <Link
            to="/entries/new"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-black text-black dark:text-white bg-primary-500 hover:bg-primary-600 focus:outline-none transition-colors"
          >
            <Edit className="mr-2 h-4 w-4" />
            New Entry
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search entries
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Search journal entries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-500">Filter:</span>
              <div className="flex flex-wrap gap-2">
                {emotions.map((emotion) => (
                  <button
                    key={emotion}
                    onClick={() =>
                      setFilterEmotion(filterEmotion === emotion ? "" : emotion)
                    }
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize transition-colors
                      ${
                        filterEmotion === emotion
                          ? "ring-2 ring-offset-1 ring-primary-500"
                          : "opacity-70 hover:opacity-100"
                      }`}
                  >
                    <EmotionBadge emotion={emotion} size="sm" />
                  </button>
                ))}

                {(filterEmotion || searchTerm) && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 ml-2"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Journal Entries List */}
        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry, index) => (
              <motion.div
                //@ts-ignore
                key={entry?._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <JournalCard entry={entry} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500 mb-4">No journal entries found.</p>
            {entries.length > 0 ? (
              <button
                onClick={resetFilters}
                className="text-primary-600 hover:text-primary-700"
              >
                Clear filters to show all entries
              </button>
            ) : (
              <Link
                to="/entries/new"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black dark:text-white bg-primary-500 hover:bg-primary-600"
              >
                Create your first entry
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default JournalEntries;
