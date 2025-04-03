import React from "react";

export default function HybridShimmerBubbleEffect() {

    return(
        <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-6">

        {/* Shimmer Placeholder */}
        <div className="w-48 h-6 bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 rounded animate-pulse"></div>

        {/* Bouncing Dots */}
        <div className="flex space-x-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-3 h-3 bg-orange-500 rounded-full animate-bounce"></span>
        </div>

        {/* Loading Text with shimmer */}
        <div className="relative">
          <span className="text-gray-600 font-medium text-sm">Loading your content</span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer"></div>
        </div>
      </div>

      {/* Extra shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
    );
}