import { Link } from 'react-router-dom';

export default function ServiceUnavailable() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6 text-center space-y-6">
      <img
        src="https://cdn-icons-png.flaticon.com/512/616/616408.png"
        alt="Sad Dog"
        className="w-48 h-48"
      />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">UH-OH</h1>
        <p className="text-lg text-gray-600 mt-2">Something went wrong on our end.</p>
      </div>
      <div className="flex gap-4">
        <Link to="/">
          <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition">
            Back to Home
          </button>
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-gray-300 text-black px-6 py-2 rounded-xl hover:bg-gray-400 transition"
        >
          Retry
        </button>
      </div>
    </div>
  );
}
