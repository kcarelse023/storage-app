// eslint-disable-next-line no-unused-vars
import React from 'react';

import { Button } from "@/components/ui/button";
import Nav from '@/components/nav/nav';

export default function Home() {
    return (
        <div className="min-h-screen  text-white">
            <Nav isHome={true}/>
            <main className="container mx-auto px-4 py-16 text-center">
                <h1 className="text-5xl font-bold mb-6">
                    Secure Your Belongings,
                    <br />
                    Simplify Your Life
                </h1>

                <p className="text-xl mb-10 max-w-2xl mx-auto text-gray-300">
                    Find the perfect storage solution for your needs.
                    From personal items to business inventory, we&#39;ve got you covered.
                </p>

                <div className="space-x-4">
                    <Button
                        size="lg"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        View Available Units
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        className="border-white text-white hover:bg-white hover:text-gray-900"
                    >
                        Learn More
                    </Button>
                </div>

                <div className="mt-16 grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">24/7 Access</h3>
                        <p className="text-gray-400">
                            Access your storage unit anytime, day or night, with our secure entry system.
                        </p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">Multiple Sizes</h3>
                        <p className="text-gray-400">
                            Choose from a variety of unit sizes to perfectly match your storage needs.
                        </p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-2xl font-semibold mb-4">Climate Controlled</h3>
                        <p className="text-gray-400">
                            Keep your valuables safe with our state-of-the-art climate-controlled units.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};