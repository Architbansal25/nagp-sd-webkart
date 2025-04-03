import React from "react";

export default function ShimmerEffect() {

    return(
        <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-48 h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse"></div>
        <div className="w-32 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded animate-pulse"></div>
      </div>
    </div>
    );
}