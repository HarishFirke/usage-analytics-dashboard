import { BarChart3 } from "lucide-react";

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Usage Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Real-time insights and analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
