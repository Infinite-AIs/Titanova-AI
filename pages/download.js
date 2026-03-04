// pages/index.js
export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Top-right button */}
      <div className="absolute top-4 right-4">
        <a
          href="https://github.com/Infinite-AIs/Titanova-AI/releases/latest/download/clamav-installer.exe"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-green-700 transition">
            Download Malware Scanner
          </button>
        </a>
      </div>

      {/* Your page content */}
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to Nexis</h1>
        <p>This is your main content. The download button stays at top-right.</p>
      </div>
    </div>
  );
}
