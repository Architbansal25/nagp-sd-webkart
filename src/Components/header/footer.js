import React from "react";
import NotificationSubscription from "../Subscription/NotificationSubscription";

const Footer = () => {
  

  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-900 py-8 shadow-md">
        <div className="container mx-auto flex flex-wrap justify-between items-center px-6">
          {/* Left - Copyright */}
          <p className="text-sm text-gray-300">
            &copy; 2025 WebCart E-Commerce. All rights reserved.
          </p>

          {/* Right - Subscription Box */}
          <NotificationSubscription />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
