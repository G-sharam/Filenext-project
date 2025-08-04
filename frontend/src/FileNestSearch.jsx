import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

function ResultCard({ item }) {
  const getFileIcon = (type) => {
    if (type === "pdf") return "📄";
    if (type === "txt") return "📝";
    if (type === "image") return "🖼️";
    return "📁";
  };

  return (
    <div
      className="bg-white dark:bg-zinc-800 border dark:border-zinc-700 p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={() =>
        window.open(`http://localhost:5000/files/${item.filename}`, "_blank")
      }
    >
      <div className="flex items-center gap-4">
        <div className="text-3xl w-10 text-center">{getFileIcon(item.type)}</div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-black dark:text-white truncate">
            {item.filename}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Score: {item.score.toFixed(2)}
          </p>
        </div>
      </div>

      {item.type === "image" && (
        <img
          src={`http://localhost:5000/files/${item.filename}`}
          alt={item.filename}
          className="mt-3 max-w-xs rounded border border-zinc-300 dark:border-zinc-700"
        />
      )}
    </div>
  );
}

export default function FileNestSearch() {
  const [query, setQuery] = useState("");
  const [filetype, setFiletype] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/search", {
        query,
        filetype: filetype === "all" ? null : filetype,
      });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-zinc-900 dark:text-white px-4 py-8 flex flex-col w-full">
      {/* Toggle Button */}
      <button
        onClick={() =>
          document.documentElement.classList.toggle("dark")
        }
        className="absolute top-4 right-4 z-50 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white px-4 py-2 rounded shadow hover:opacity-80"
      >
        Toggle Dark Mode
      </button>

      {/* Search Centered */}
      <div
        className={`flex flex-col items-center w-full transition-all duration-300 ${
          results.length === 0 ? "flex-1 justify-center" : "pt-8"
        }`}
      >
        <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 text-center">
          FileNest Search
        </h1>

        <div className="flex w-full max-w-2xl mt-6 gap-2">
          <input
            type="text"
            placeholder="Search for poems, peace, nature..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-gray-300 dark:border-zinc-700 rounded px-4 py-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
          />
          <select
            value={filetype}
            onChange={(e) => setFiletype(e.target.value)}
            className="border border-gray-300 dark:border-zinc-700 rounded px-3 py-2 bg-white dark:bg-zinc-800 text-black dark:text-white"
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="txt">Text</option>
            <option value="image">Images</option>
          </select>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="w-full max-w-2xl mx-auto mt-12 space-y-8">
        {results.length === 0 && !loading && (
          <p className="text-center text-gray-400 mt-8">No results yet.</p>
        )}

        {results.length > 0 && (
          <>
            {results.some((r) => r.type === "txt") && (
              <div>
                <h2 className="text-xl font-bold mb-3">📝 Text Files</h2>
                <div className="space-y-3">
                  {results
                    .filter((r) => r.type === "txt")
                    .map((item, idx) => (
                      <ResultCard key={`txt-${idx}`} item={item} />
                    ))}
                </div>
              </div>
            )}

            {results.some((r) => r.type === "pdf") && (
              <div>
                <h2 className="text-xl font-bold mb-3">📄 PDF Files</h2>
                <div className="space-y-3">
                  {results
                    .filter((r) => r.type === "pdf")
                    .map((item, idx) => (
                      <ResultCard key={`pdf-${idx}`} item={item} />
                    ))}
                </div>
              </div>
            )}

            {results.some((r) => r.type === "image") && (
              <div>
                <h2 className="text-xl font-bold mb-3">🖼️ Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {results
                    .filter((r) => r.type === "image")
                    .map((item, idx) => (
                      <ResultCard key={`img-${idx}`} item={item} />
                    ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
