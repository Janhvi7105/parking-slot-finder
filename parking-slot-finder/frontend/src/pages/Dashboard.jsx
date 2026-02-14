export default function Dashboard() {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    window.location.href = "/user-login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-2xl shadow-2xl w-full max-w-4xl text-white">

        <h1 className="text-3xl font-bold text-green-400 mb-2">
          👋 Welcome
        </h1>

        <p className="text-gray-300 mb-8">
          Logged in as <span className="text-green-300">{user.email}</span>
        </p>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/user-login";
          }}
          className="bg-red-600 px-6 py-3 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
