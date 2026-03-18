import React, { useState } from 'react';
import { Home, PlusSquare, Clock, Search, Settings, X } from 'lucide-react';
import logoImage from '../../assets/Logo.png';
import { Colors } from '@/colors';
import { useNavigate, useLocation } from 'react-router-dom';
import SignOutPopup from '../setting/SignOutPopup';
import DeleteAccountPopup from '../setting/DeleteAccountPopup';

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSignOutOpen, setIsSignOutOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const menuItems = [
        { name: 'Home', icon: <Home size={20} />, path: '/home' },
        { name: 'Create Campaign', icon: <PlusSquare size={20} />, path: '/start-compaign' },
        { name: 'Donation History', icon: <Clock size={20} />, path: '/donation-history' },
        { name: 'Search', icon: <Search size={20} />, path: '/search' },
        { name: 'My Campaigns', icon: <PlusSquare size={20} />, path: '/my-campaigns' },
        { name: 'Setting', icon: <Settings size={20} /> },
    ];

    const subMenuItems = [
        { name: 'My Profile', path: '/profile' },
        { name: 'Language', path: '/language' },
        { name: 'FAQ', path: '/faqs' },
        { name: 'Change Password', path: '/change-password' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms & Condition', path: '/terms-and-conditions' },
        { name: 'Log out' },
        { name: 'Delete Account', isDestructive: true },
    ];

    const handleSubMenuClick = (name, path) => {
        if (name === 'Log out') {
            window.dispatchEvent(new CustomEvent('toggleSignOut', { detail: true }));
        } else if (name === 'Delete Account') {
            window.dispatchEvent(new CustomEvent('toggleDeleteAccount', { detail: true }));
        } else if (path) {
            navigate(path);
            if (onClose) onClose();
        }
    };

    const handleMenuClick = (item) => {
        if (item.path) {
            navigate(item.path);
            if (onClose) onClose();
        } else if (item.name === 'Setting') {
            navigate('/profile');
            // Don't close sidebar if it's the settings menu as it has submenus
        }
    };

    return (
        <div
            className={`fixed lg:static inset-y-0 left-0 z-30 w-[280px] min-h-screen text-white flex flex-col pt-8 pb-8 transition-transform duration-300 transform 
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            style={{ backgroundColor: Colors.primary }}
        >
            {/* Close button for mobile */}
            <button 
                onClick={onClose}
                className="lg:hidden absolute top-4 right-4 text-white hover:bg-white/10 p-2 rounded-lg"
            >
                <X size={24} />
            </button>

            {/* Logo Container */}
            <div className="px-6 mb-10">
                <div className="bg-white rounded-lg py-3 px-4 flex justify-center items-center h-[56px]">
                    <img
                        src={logoImage}
                        alt="CrowdCareAid"
                        className="h-full w-auto object-contain"
                    />
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 flex flex-col px-4 gap-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path || 
                        (item.name === 'Create Campaign' && ['/compaign-details', '/compaign-review'].includes(location.pathname)) ||
                        (item.name === 'Setting' && ['/profile', '/edit-profile', '/faqs', '/change-password', '/privacy', '/terms-and-conditions'].includes(location.pathname));
                        
                    return (
                        <div key={item.name} className="flex flex-col">
                            <button
                                onClick={() => handleMenuClick(item)}
                                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-colors font-medium text-[15px]
                                    ${isActive
                                        ? 'bg-white text-black shadow-sm'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <div className={`${isActive ? 'text-black' : 'text-white'}`}>
                                    {item.icon}
                                </div>
                                {item.name}
                            </button>

                            {/* Render Submenu if it's the Setting tab and it's active */}
                            {item.name === 'Setting' && isActive && (
                                <div className="flex flex-col mt-2 mb-4 py-2">
                                    {subMenuItems.map((subItem) => {
                                        const isSubActive = location.pathname === subItem.path ||
                                            (subItem.path === '/profile' && location.pathname === '/edit-profile');
                                        return (
                                            <button
                                                key={subItem.name}
                                                onClick={() => handleSubMenuClick(subItem.name, subItem.path)}
                                                className={`text-left text-[14px] px-14 py-2.5 transition-colors font-medium
                                                    ${subItem.isDestructive
                                                        ? 'text-red-500 hover:text-red-400'
                                                        : isSubActive
                                                            ? 'text-white font-semibold'
                                                            : 'text-gray-300 hover:text-white'
                                                    }`}
                                            >
                                                {subItem.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
