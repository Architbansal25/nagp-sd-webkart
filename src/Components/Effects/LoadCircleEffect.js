import React from "react";
export default function LoadCircleEffect() {
    return(
        <div className="flex items-center justify-center h-screen bg-white">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-gray-800 border-dashed rounded-full animate-spin"></div>
        <div className="text-lg text-gray-600 font-medium">Loading, please wait...</div>
      </div>
    </div>
    );
}