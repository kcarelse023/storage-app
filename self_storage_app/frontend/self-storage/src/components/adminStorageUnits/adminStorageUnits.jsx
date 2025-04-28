import { useState, useMemo } from 'react';
import {
    Users2,
    MapPin,
    Calendar,
    DollarSign,
    Key,
    Expand,
    Tag,
    Shield,
    UserPlus,
    Info
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Importing dummy units for initial data
import { DUMMY_UNITS } from '@/components/storageUnits/units.js';

const StatusBadge = ({ status }) => {
    const statusColors = {
        'Available': 'bg-green-100 text-green-800',
        'Reserved': 'bg-blue-100 text-blue-800',
        'Cancelling': 'bg-yellow-100 text-yellow-800',
        'Problem': 'bg-red-100 text-red-800',
        'Unavailable': 'bg-gray-100 text-gray-800',
        'Occupied': 'bg-purple-100 text-purple-800'
    };

    return (
        <Badge
            className={`${statusColors[status]} font-medium px-2 py-1`}
        >
            {status}
        </Badge>
    );
};

const UnitDetailModal = ({ unit }) => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="hover:bg-blue-50 transition-colors">
                    View Details
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl bg-white rounded-xl shadow-2xl border-none max-h-[90vh]">
                <DialogHeader className="bg-blue-600 text-white p-6 rounded-t-xl sticky top-0 z-10">
                    <DialogTitle className="text-2xl font-bold flex items-center">
                        <Shield className="mr-3" size={24} />
                        Unit {unit.id} Details
                    </DialogTitle>
                </DialogHeader>

                <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-150px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Unit Information Section */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                                <Tag className="inline-block mr-2 text-blue-600" size={20} />
                                Unit Information
                            </h3>
                            <div className="space-y-3 text-black">
                                <div className="flex items-center">
                                    <Expand className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">Type:</span>
                                    <span className="ml-2 text-gray-700">{unit.type}</span>
                                </div>
                                <div className="flex items-center">
                                    <Expand className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">Size:</span>
                                    <span className="ml-2 text-gray-700">{unit.size} sq ft</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">Facility:</span>
                                    <span className="ml-2 text-gray-700">{unit.facility}</span>
                                </div>
                                <div className="flex items-start">
                                    <Shield className="mr-3 text-blue-600 mt-1" size={20} />
                                    <div>
                                        <span className="font-medium">Features:</span>
                                        <ul className="ml-2 text-gray-700 list-disc list-inside">
                                            {unit.features.map((feature, index) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                                <DollarSign className="inline-block mr-2 text-blue-600" size={20} />
                                Pricing Details
                            </h3>
                            <div className="space-y-3 text-black">
                                <div className="flex items-center">
                                    <DollarSign className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">Monthly Rate:</span>
                                    <span className="ml-2 text-gray-700">R{unit.price.monthly}</span>
                                </div>
                                {unit.price.yearly && (
                                    <div className="flex items-center">
                                        <DollarSign className="mr-3 text-blue-600" size={20} />
                                        <span className="font-medium">Yearly Rate:</span>
                                        <span className="ml-2 text-gray-700">R{unit.price.yearly}</span>
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Calendar className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">Minimum Rental:</span>
                                    <span className="ml-2 text-gray-700">{unit.minRentalPeriod} month(s)</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rental Details Section */}
                    {unit.userId && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                                <Users2 className="inline-block mr-2 text-blue-600" size={20} />
                                Rental Information
                            </h3>
                            <div className="space-y-3 text-black">
                                <div className="flex items-center">
                                    <Users2 className="mr-3 text-blue-600" size={20} />
                                    <span className="font-medium">User ID:</span>
                                    <span className="ml-2 text-gray-700">{unit.userId}</span>
                                </div>
                                {unit.rentalDetails && (
                                    <>
                                        <div className="flex items-center ">
                                            <Calendar className="mr-3 text-blue-600" size={20} />
                                            <span className="font-medium">Start Date:</span>
                                            <span className="ml-2 text-gray-700">{unit.rentalDetails.startDate}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="mr-3 text-blue-600" size={20} />
                                            <span className="font-medium">Expiry Date:</span>
                                            <span className="ml-2 text-gray-700">{unit.rentalDetails.expiryDate}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shared Access Section */}
                    {unit.sharedAccess && unit.sharedAccess.length > 0 && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                                <UserPlus className="inline-block mr-2 text-blue-600" size={20} />
                                Shared Access
                            </h3>
                            <div className="space-y-2">
                                {unit.sharedAccess.map((email, index) => (
                                    <div key={index} className="flex items-center">
                                        <UserPlus className="mr-3 text-blue-600" size={20} />
                                        <span className="text-gray-700">{email}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Optional Additional Information Section */}
                    {unit.additionalNotes && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-4 text-blue-800 border-b pb-2">
                                <Info className="inline-block mr-2 text-blue-600" size={20} />
                                Additional Notes
                            </h3>
                            <p className="text-gray-700">{unit.additionalNotes}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

const AdminStorageUnits = ({ apiClient }) => {
    const [units, setUnits] = useState(DUMMY_UNITS);
    const [filter, setFilter] = useState('All');

    const filteredUnits = useMemo(() => {
        if (filter === 'All') return units;
        return units.filter(unit => unit.status === filter);
    }, [units, filter]);

    const toggleUnitStatus = (unitId) => {
        setUnits(prevUnits =>
            prevUnits.map(unit =>
                unit.id === unitId
                    ? { ...unit, status: unit.status === 'Available' ? 'Unavailable' : 'Available' }
                    : unit
            )
        );
    };

    return (
        <Card className="w-full bg-gradient-to-br text-blue-950 from-indigo-50 to-blue-100 h-screen flex flex-col overflow-hidden">
            <CardHeader className="bg-white/70 backdrop-blur-sm shadow-sm">
                <CardTitle>Storage Units Management</CardTitle>
                <CardDescription>Comprehensive view of all storage units</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow overflow-auto p-4">
                <Tabs defaultValue="All" className="w-full h-full flex flex-col">
                    <TabsList className="grid w-full grid-cols-6 mb-4 sticky top-0 z-10 bg-blue-100 backdrop-blur-sm">
                        {['All', 'Available', 'Reserved', 'Cancelling', 'Problem', 'Unavailable'].map(status => (
                            <TabsTrigger
                                key={status}
                                value={status}
                                onClick={() => setFilter(status)}
                                className="hover:bg-blue-100 transition-colors"
                            >
                                {status}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2">
                        {filteredUnits.map((unit) => (
                            <Card
                                key={unit.id}
                                className="hover:shadow-lg transition-shadow bg-white/80 text-black backdrop-blur-sm border-gray-200"
                            >
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Unit {unit.id}
                                    </CardTitle>
                                    <StatusBadge status={unit.status} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-sm mb-2">
                                        <p className="flex items-center">
                                            <MapPin className="mr-2 text-gray-500" size={16} />
                                            {unit.facility}, {unit.city}
                                        </p>
                                        <p className="flex items-center">
                                            <Expand className="mr-2 text-gray-500" size={16} />
                                            {unit.size} sq ft {unit.type}
                                        </p>
                                        <p className="flex items-center">
                                            <DollarSign className="mr-2 text-gray-500" size={16} />
                                            Monthly: R{unit.price.monthly}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <UnitDetailModal unit={unit} />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleUnitStatus(unit.id)}
                                            disabled={
                                                unit.status !== 'Available' &&
                                                unit.status !== 'Unavailable'
                                            }
                                            className="hover:bg-blue-100"
                                        >
                                            {unit.status === 'Available' ? 'Mark Unavailable' : 'Mark Available'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default AdminStorageUnits;