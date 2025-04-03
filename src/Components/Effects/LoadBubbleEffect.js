import React from "react";


export default function LoadBubbleEffect() {
    return(
        <div className="flex items-center justify-center h-screen bg-white">
        <div className="flex flex-col items-center space-y-4">
          <svg className="w-20 h-6" viewBox="0 0 120 30" fill="#4169E1">
            <circle cx="15" cy="15" r="15">
              <animate
                attributeName="r"
                from="15"
                to="15"
                begin="0s"
                dur="0.8s"
                values="15;9;15"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="60" cy="15" r="9">
              <animate
                attributeName="r"
                from="9"
                to="9"
                begin="0.2s"
                dur="0.8s"
                values="9;15;9"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
            <circle cx="105" cy="15" r="15">
              <animate
                attributeName="r"
                from="15"
                to="15"
                begin="0.4s"
                dur="0.8s"
                values="15;9;15"
                calcMode="linear"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <div className="text-lg text-gray-600 font-medium">Loading, Please wait....</div>
        </div>
      </div> 
    );
}