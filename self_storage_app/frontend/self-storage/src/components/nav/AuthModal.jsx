// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import HandleAuthStateChange from '@/api/handleAuthStateChange.jsx';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

// Import from AWS Amplify v6
import { Amplify } from 'aws-amplify';

import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';

// Import React Router for navigation
// import { useNavigate } from 'react-router-dom';

// Import your AWS configuration
import { awsExports } from '@/aws-exports.js';

// Amplify configuration
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: awsExports.USER_POOL_ID,
            userPoolClientId: awsExports.USER_POOL_APP_CLIENT_ID,
            loginWith: {
                email: true,
                oauth: {
                    domain: awsExports.OAUTH_DOMAIN,
                    scopes: ['email', 'openid', 'profile'],
                    redirectSignIn: ['http://localhost:5173/'],
                    redirectSignOut: ['http://localhost:5173/'],
                }
            }
        }
    }
});

// Optional: Set up token provider
cognitoUserPoolsTokenProvider.setAuthConfig({
    Cognito: {
        userPoolId: awsExports.USER_POOL_ID,
        userPoolClientId: awsExports.USER_POOL_APP_CLIENT_ID,
    }
});



// Separate component to handle authentication
// function AuthHandler() {
//     const { user } = useAuthenticator((context) => [context.user]);
//     const navigate = useNavigate();
//
//     React.useEffect(() => {
//         try {
//             if (user) {
//                 navigate('/client', {
//                     state: { user: { id: user.userId } }
//                 });
//             }
//         } catch (error) {
//             console.error("Navigation error:", error);
//             // Optionally add fallback navigation or error handling
//         }
//     }, [user, navigate]);
//
//     return null;
// }

export default function AuthModal() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-blue-600 text-white hover:bg-blue-700">
                    Login / Sign Up
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] bg-slate-950">
                <DialogHeader>
                    <DialogTitle className="text-center text-3xl mb-4">
                        Welcome to Self Storage
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Authentication dialog for logging in or signing up
                    </DialogDescription>
                </DialogHeader>

                <Authenticator
                    initialState="signIn"
                    components={{
                        SignUp: {
                            FormFields() {
                                return (
                                    <>
                                        <div className="amplify-flex amplify-field amplify-textfield">
                                            <label
                                                htmlFor="name"
                                                className="amplify-label"
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                name="name"
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                className="amplify-input"
                                                required
                                            />
                                        </div>
                                        <Authenticator.SignUp.FormFields />
                                    </>
                                );
                            },
                        },
                    }}
                    services={{
                        async validateCustomSignUp(formData) {
                            if (!formData.name) {
                                return {
                                    name: 'Full Name is required',
                                };
                            }
                        },
                    }}
                >
                    {/*{() => <AuthHandler />}*/}
                    {() =>  <HandleAuthStateChange />}
                </Authenticator>
            </DialogContent>
        </Dialog>
    );
}