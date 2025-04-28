// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import AdminStorageUnits from '@/components/adminStorageUnits/adminStorageUnits';
import Nav from "@/components/nav/nav.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import createApiClient from "@/api/api.jsx";
import {signOut} from "aws-amplify/auth";

export default function DashboardPage() {

    const location = useLocation();
    const navigate = useNavigate();

    // Safely extract user and token data from location state
    const { user, token } = location.state || {};
    // eslint-disable-next-line no-unused-vars
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

    return (<>
        <Nav handleLogout={handleSignOut} text={"Admin Dashboard"}/>
        <div className="container mx-auto p-4">
            <AdminStorageUnits apiClient={apiClient} />
        </div>
    </>
    );
}
