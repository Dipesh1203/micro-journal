import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import EmotionBadge from "../components/EmotionBadge";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const ViewEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/journal/${id}` ||
            `http://localhost:3000/api/journal/${id}`
        );
        setEntry(res.data);
        console.log(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching entry:", err);
        setError("Entry not found or unable to load");
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/journal/${id}` ||
          `http://localhost:3000/api/journal/${id}`
      );
      navigate("/entries");
    } catch (err) {
      console.error("Error deleting entry:", err);
      setError("Failed to delete entry");
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !entry) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error || "Entry not found"}</p>
              <button
                onClick={() => navigate("/entries")}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black dark:text-white bg-primary-500 hover:bg-primary-600"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Entries
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <button
                onClick={() => navigate("/entries")}
                className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-4 sm:mb-0"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to entries
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/entries/edit/${id}`)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit className="mr-1.5 h-4 w-4" />
                  Edit
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="mr-1.5 h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <EmotionBadge emotion={entry.detectedEmotion} size="lg" />
                <time className="text-sm text-gray-500">
                  {formatDate(entry.date)}
                </time>
              </div>

              {entry.userEmotion &&
                entry.userEmotion !== entry.detectedEmotion && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">
                      You felt: <EmotionBadge emotion={entry.userEmotion} />
                    </p>
                  </div>
                )}

              <div className="prose max-w-none mt-6">
                {entry.content
                  .split("\n")
                  .map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="mb-4 text-gray-800 leading-relaxed"
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Delete Journal Entry
              </h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to delete this entry? This action cannot
                be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black dark:text-white bg-red-600 hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ViewEntry;
