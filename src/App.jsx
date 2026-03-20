import React, { useState, useEffect } from "react";
import AppRoutes from "./routes";
import SignOutPopup from "./components/setting/SignOutPopup";
import DeleteAccountPopup from "./components/setting/DeleteAccountPopup";
import { Toaster } from "react-hot-toast";

function App() {
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    const handleSignOut = () => setIsSignOutOpen(true);
    const handleDelete = () => setIsDeleteOpen(true);

    window.addEventListener('toggleSignOut', handleSignOut);
    window.addEventListener('toggleDeleteAccount', handleDelete);

    return () => {
      window.removeEventListener('toggleSignOut', handleSignOut);
      window.removeEventListener('toggleDeleteAccount', handleDelete);
    };
  }, []);

  return (
    <>
      <Toaster />
      <AppRoutes />

      {/* Global Modals - Rendered outside the Sidebar for full-screen width */}
      <SignOutPopup isOpen={isSignOutOpen} onClose={() => setIsSignOutOpen(false)} />
      <DeleteAccountPopup isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} />
    </>
  );
}

export default App;