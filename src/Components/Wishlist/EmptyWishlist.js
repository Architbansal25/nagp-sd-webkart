import React from "react";

export default function EmptyWishlist() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="Empty Wishlist" className="w-36 h-36" />
        <h2 className="text-xl font-semibold">Your Wishlist is Empty</h2>
        <p className="text-gray-500">Add items to view them here.</p>
        <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl hover:bg-orange-600 transition">
          Continue Shopping
        </button>
      </div>
    );
    }