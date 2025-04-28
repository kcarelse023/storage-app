import { useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';
import {checkAdminStatus} from './api.jsx'; // Import your admin-checking function

export default function HandleAuthStateChange() {
    const { user } = useAuthenticator((context) => [context.user]); // Get the authenticated user
    const navigate = useNavigate();

    useEffect(() => {
        async function checkAndNavigate() {
            if (user) {
                try {
                    // Fetch the authentication session to get tokens
                    const { tokens } = await fetchAuthSession();

                    // Get the JWT token
                    const idToken = tokens?.idToken?.toString();

                    if (!idToken) {
                        console.error('No authentication token found');
                        navigate('/');
                        return;
                    }

                    // Check admin status using the token
                    const isAdmin = await checkAdminStatus(user.userId, idToken);

                    if (isAdmin) {
                        navigate('/dashboard', {
                            state: {
                                user: {
                                    id: user.userId,
                                    username: user.username,
                                    signInDetails: user.signInDetails
                                },
                                token: idToken
                            }
                        });
                    } else {
                        navigate('/client', {
                            state: {
                                user: {
                                    id: user.userId,
                                    username: user.username,
                                    signInDetails: user.signInDetails
                                },
                                token: idToken
                            }
                        });
                    }
                } catch (error) {
                    console.error('Error checking user role:', error);
                    navigate('/'); // Navigate to home or error page
                }
            }
        }

        checkAndNavigate();
    }, [user, navigate]); // Dependencies ensure this runs when `user` or `navigate` changes

    return null; // This component is only for logic, no UI
}