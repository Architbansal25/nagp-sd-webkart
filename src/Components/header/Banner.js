import React from "react";
import { LuRefreshCw, LuTruck, LuBadgeCheck, LuShieldCheck } from 'react-icons/lu';
export default function Banner() {
    return(
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center">
            <LuTruck size={32} className="mb-2 text-blue-500" />
            <h4 className="font-semibold">Fast Delivery</h4>
            <p className="text-sm text-gray-600">Get your products quickly with our nationwide shipping.</p>
        </div>
        <div className="flex flex-col items-center text-center">
            <LuBadgeCheck size={32} className="mb-2 text-blue-500" />
            <h4 className="font-semibold">Top Quality</h4>
            <p className="text-sm text-gray-600">Only the best products sourced from trusted brands.</p>
        </div>
        <div className="flex flex-col items-center text-center">
            <LuShieldCheck size={32} className="mb-2 text-blue-500" />
            <h4 className="font-semibold">Secure Payment</h4>
            <p className="text-sm text-gray-600">Your transactions are protected with top-notch security.</p>
        </div>
        <div className="flex flex-col items-center text-center">
            <LuRefreshCw size={32} className="mb-2 text-blue-500" />
            <h4 className="font-semibold">Hassle-Free Returns</h4>
            <p className="text-sm text-gray-600">Easy 14-day return policy for a worry-free shopping experience.</p>
        </div>
        </div>
    );
}