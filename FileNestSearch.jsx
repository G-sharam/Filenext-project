import React, { useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";
function ResultCard({ item }) {
  return (
    <div
      className="bg-zinc-800 border border-zinc-700 p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
      onClick={() =>
        window.open(`http://localhost:5000/files/${item.filename}`, "_blank")
      }
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {item.type === "pdf"
            ? "📄"
            : item.type === "txt"
            ? "📝"
            : item.type === "image"
            ? "🖼️"
            : "📁"}
        </span>
        <div>
          <p className="text-lg font-semibold text-white">{item.filename}</p>
          <p className="text-sm text-gray-400">
            Score: {item.score.toFixed(2)}
          </p>
        </div>
      </div>

      {item.type === "image" && (
        <img
          src={`http://localhost:5000/files/${item.filename}`}
          alt={item.filename}
          className="mt-3 max-w-full rounded border border-zinc-700"
        />
      )}
    </div>
  );
}

export default function FileNestSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/search", { query });
      setResults(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const getFileIcon = (type) => {
  if (type === "pdf") return "📄";
  if (type === "txt") return "📝";
  if (type === "image") return "🖼️";
  return "📁";
};


  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 flex flex-col items-center px-4">


      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold text-center text-blue-800">
          FileNest Search
        </h1>
        <div className="w-full max-w-2xl mt-16 flex gap-2">

          <input
            type="text"
            placeholder="Search for poems, peace, nature..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 rounded px-4 py-2"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            <Search className="mr-2 h-4 w-4" />
            Search
          </button>
        </div>

        <div className="space-y-4">
  {results.map((item, idx) => (
    <div
  key={idx}
  className="bg-zinc-800 border border-zinc-700 p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
  onClick={() =>
    window.open(`http://localhost:5000/files/${item.filename}`, "_blank")
  }
>
  <div className="flex items-center gap-3">
    <span className="text-2xl">{getFileIcon(item.type)}</span>
    <div>
      <p className="text-lg font-semibold text-white">{item.filename}</p>
      <p className="text-sm text-gray-400">Score: {item.score.toFixed(2)}</p>
    </div>
  </div>

  {item.type === "image" && (
    <img
      src={`http://localhost:5000/files/${item.filename}`}
      alt={item.filename}
      className="mt-3 max-w-xs rounded border border-zinc-700"
    />
  )}
</div>

  ))}
  {results.length === 0 && !loading && (
  <p className="text-center text-gray-400 mt-8">No results yet.</p>
)}

{results.length > 0 && (
  <div className="w-full max-w-2xl mt-12 space-y-8">
    {/* Text Files */}
    {results.some(r => r.type === "txt") && (
      <div>
        <h2 className="text-xl font-bold mb-3">📝 Text Files</h2>
        <div className="space-y-3">
          {results.filter(r => r.type === "txt").map((item, idx) => (
            <ResultCard key={`txt-${idx}`} item={item} />
          ))}
        </div>
      </div>
    )}

    {/* PDF Files */}
    {results.some(r => r.type === "pdf") && (
      <div>
        <h2 className="text-xl font-bold mb-3">📄 PDF Files</h2>
        <div className="space-y-3">
          {results.filter(r => r.type === "pdf").map((item, idx) => (
            <ResultCard key={`pdf-${idx}`} item={item} />
          ))}
        </div>
      </div>
    )}

    {/* Image Files */}
    {results.some(r => r.type === "image") && (
      <div>
        <h2 className="text-xl font-bold mb-3">🖼️ Images</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.filter(r => r.type === "image").map((item, idx) => (
            <ResultCard key={`img-${idx}`} item={item} />
          ))}
        </div>
      </div>
    )}
  </div>
)}

</div>

      </div>
    </div>
  );
}
