import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import React from "react"; // Update the import

// eslint-disable-next-line react/prop-types
export default function Nav({isHome = false, handleLogout = null, text = ""}) {
    const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center p-6 px-24 text-white">
            <div
                className="text-2xl font-bold cursor-pointer"
                onClick={() => navigate('/')} // Navigate to home on click
            >
                Self Storage
            </div>

            {!isHome && <div>
                <h1 className="text-2xl font-bold mb-4 text-white">{text}</h1>
            </div>}


            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/')}
                    className="hover:text-gray-300 border-0 hover:border-0"
                >
                    Home
                </button>
                {isHome && <AuthModal/>}
                {!isHome && <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                >
                    Sign Out
                </button>
                }


                {/* You can remove the separate signup button since it's now in the modal */}
                    </div>
                    </nav>
                    );
                };
