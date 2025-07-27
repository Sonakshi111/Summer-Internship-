import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Welcome to Internship Portal</h1>
        <p className="text-gray-700 mb-6">
          Check if you're selected before logging in.
        </p>

        <div className="space-y-4">
          <Link
            to="/selected"
            className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
          >
            🔍 View Selected Students
          </Link>

          <Link
            to="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            🔐 Login
          </Link>
          <Link
            to="/dashboard"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
           Student Dashboard
          </Link>
          <Link
            to="/batch-form"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
           Batch Allotment form
          </Link>
          <Link
            to="/challan"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
           ChallanPage
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Home;
