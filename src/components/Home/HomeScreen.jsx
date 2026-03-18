import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';


export default function HomeScreen() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    
    return (
        <div className="flex h-screen bg-[#fbfbfb] overflow-hidden font-sans">
            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Header title="Crowd Care" onMenuClick={toggleMobileMenu} />

                <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-8">
                    <div className="max-w-7xl mx-auto">
                        <Dashboard />
                    </div>
                </main>
            </div>
        </div>
    );
}
