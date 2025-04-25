import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import EmotionBadge from "../components/EmotionBadge";
import { Save, X } from "lucide-react";
import { motion } from "framer-motion";

const NewEntry: React.FC = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [userEmotion, setUserEmotion] = useState("");
  const navigate = useNavigate();

  const emotions = ["happy", "sad", "angry", "neutral", "fear", "surprise"];

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setContent(text);

    // Update word count
    const words = text.trim() ? text.trim().split(/\s+/) : [];
    setWordCount(words.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Journal entry cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axios.post("http://localhost:3000/api/journal", {
        content,
        userEmotion: userEmotion || undefined,
      });

      navigate("/entries");
    } catch (err) {
      console.error("Error creating journal entry:", err);
      setError("Failed to save journal entry. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                New Journal Entry
              </h1>
              <button
                onClick={() => navigate("/entries")}
                className="inline-flex items-center text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  What's on your mind today?
                </label>
                <textarea
                  id="content"
                  rows={10}
                  value={content}
                  onChange={handleContentChange}
                  className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 p-4"
                  placeholder="Start writing here..."
                  disabled={loading}
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-500">
                    {wordCount} words
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How are you feeling? (Optional)
                </label>
                <div className="flex flex-wrap gap-3">
                  {emotions.map((emotion) => (
                    <motion.button
                      key={emotion}
                      type="button"
                      onClick={() =>
                        setUserEmotion(userEmotion === emotion ? "" : emotion)
                      }
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-4 py-2 rounded-full transition-all
                        ${
                          userEmotion === emotion
                            ? "ring-2 ring-offset-1 ring-primary-500"
                            : "opacity-80 hover:opacity-100"
                        }`}
                    >
                      <EmotionBadge emotion={emotion} />
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate("/entries")}
                  className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black dark:text-white-900 bg-primary-500 hover:bg-primary-600 focus:outline-none transition-colors"
                  disabled={loading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NewEntry;
