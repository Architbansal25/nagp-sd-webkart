import React from "react";
import { Link } from "react-router-dom";
export default function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" className="w-36 h-36" />
        <h2 className="text-xl font-semibold">Your Cart is Empty</h2>
        <p className="text-gray-500">Looks like you haven’t added anything yet.</p>
        <Link to="/">
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition">
          Go to Shopping
        </button>
        </Link>
      </div>
    );
    }