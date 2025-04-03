import React, {useState} from "react";

export default function NotificationSubscription() {
    const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log(`Subscribed with email: ${email}`);
      setEmail("");
    }
  };
    return (
        <div className="flex items-center space-x-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 rounded-l-md text-black placeholder-gray-500 border border-gray-400 focus:outline-none"
            />
            <button
              onClick={handleSubscribe}
              className="rounded-r-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 transition"
            >
              Subscribe
            </button>
        </div>
    )
}