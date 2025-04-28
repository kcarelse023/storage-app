// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'aws-amplify/auth';
import Nav from "@/components/nav/nav.jsx";
import { StorageUnits } from "@/components/storageUnits/storageUnits.jsx";
import imgs from "@/components/storageUnits/imgs.js";
import createApiClient from "@/api/api.jsx";

export default function ClientPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Safely extract user and token data from location state
    const { user, token } = location.state || {};
    const { id, username, signInDetails } = user || {};

    // State to manage API client
    const [apiClient, setApiClient] = useState(null);

    useEffect(() => {
        // If no user or token is found, redirect to home
        if (!user || !token) {
            navigate('/');
            return;
        }

        // Create API client with the token
        const client = createApiClient(token);
        setApiClient(client);
    }, [user, token, navigate]);


    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // If no user or token, return null to prevent rendering
    if (!user || !token) {
        return null;
    }



    const message = `Hello, ${user.signInDetails.loginId.split("@")[0]}, you are a client.`
    return (
        <div className="min-h-dvh w-dvw text-black bg-gray-100 absolute top-0 left-0">
            <Nav handleLogout={handleSignOut} text={message}/>
            <div className="w-4/5 mx-auto bg-transparent p-2 mt-2">
                {/* Pass the API client to StorageUnits component */}
                <StorageUnits apiClient={apiClient} pictures = {imgs} />
            </div>
        </div>
    );
}