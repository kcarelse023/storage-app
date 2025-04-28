import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StorageUnitDialog } from "@/components/storageUnitDialog"; // Import the new dialog component
import {DUMMY_UNITS} from "@/components/storageUnits/units.js";
import { WarehouseIcon, InfoIcon, RulerIcon, TagIcon, CalendarIcon, CheckCircleIcon } from 'lucide-react';

export function StorageUnits() {
    const currentUserId = "user123";
    const [availableUnits, setAvailableUnits] = useState(
        DUMMY_UNITS.filter(unit => !unit.isRented)
    );
    const [rentedUnits, setRentedUnits] = useState(
        DUMMY_UNITS.filter(unit => unit.userId === currentUserId || unit.sharedWith?.includes(currentUserId))
    );
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [dialogMode, setDialogMode] = useState('view');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [expandedUnit, setExpandedUnit] = useState(null);

    const handleRentUnit = (unit) => {
        setSelectedUnit(unit);
        setDialogMode('booking');
    };

    const handleShowMore = (unit) => {
        setSelectedUnit(unit);
        setDialogMode('view');
    };

    const confirmRental = (billingOption) => {
        if (selectedUnit && selectedPaymentMethod) {
            const updatedAvailableUnits = availableUnits.filter(u => u.id !== selectedUnit.id);

            const rentedUnit = {
                ...selectedUnit,
                status: 'Reserved',
                rentalDetails: {
                    startDate: new Date().toISOString().split('T')[0],
                    expiryDate: billingOption === 'Yearly'
                        ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    billingOption,
                    paymentMethod: selectedPaymentMethod
                }
            };

            const discount = billingOption.toLowerCase() === "yearly"
                ? (selectedUnit.discounts.year > 0 ? selectedUnit.discounts.year : 100) / 100
                : (selectedUnit.discounts.month > 0 ? selectedUnit.discounts.month : 100) / 100;

            let price;
            if (selectedPaymentMethod.toLowerCase() === "card" && billingOption.toLowerCase() === "yearly") {
                price = selectedUnit.price.yearly;
            }
            else if (selectedPaymentMethod.toLowerCase() === "card" && billingOption.toLowerCase() === "monthly") {
                price = selectedUnit.price.monthly;
            }
            else if (selectedPaymentMethod.toLowerCase() === "eft" && billingOption.toLowerCase() === "monthly") {
                price = selectedUnit.price.monthly;
            } else {
                price = selectedUnit.price.yearly;
            }
            const discountedPrice = price * discount;

            if (selectedPaymentMethod.toLowerCase() === "eft") {
                alert(
                    `You chose to pay by EFT:\n\nHere are the banking details:\n\nAccount Number: 1234567\nName: Team2\nAmount Due: ${discountedPrice.toFixed(2)}`
                );
            }
            setRentedUnits([...rentedUnits, rentedUnit]);
            setAvailableUnits(updatedAvailableUnits);
            setSelectedUnit(null);
            setDialogMode('view');
        }
    };

    const handleCancelRental = (unitId) => {
        const unitToCancel = rentedUnits.find(unit => unit.id === unitId);

        if (unitToCancel) {
            const updatedRentedUnits = rentedUnits.filter(unit => unit.id !== unitId);

            setAvailableUnits([
                ...availableUnits,
                {
                    ...unitToCancel,
                    status: 'Available'
                }
            ]);
            setRentedUnits(updatedRentedUnits);
        }
    };

    // Helper function to format currency
    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount || 0);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br py-8">
            <div className="container mx-auto px-4">
                <Tabs defaultValue="available" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-blue-500 shadow-md p-0 h-auto">
                        <TabsTrigger value="available" className="bg-gray-100 text-black hover:bg-blue-600">Available Units</TabsTrigger>
                        <TabsTrigger value="my-units" className="bg-gray-100 text-black hover:bg-green-600">My Rented Units</TabsTrigger>
                    </TabsList>

                    <TabsContent value="available">
                        <div className="grid md:grid-cols-3 gap-6 justify-center">
                            {availableUnits.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500">
                                    No available units at the moment
                                </p>
                            ) : (
                                availableUnits.map(unit => (
                                    <Card
                                        key={unit.id}
                                        className="mb-12 w-full bg-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
                                    >
                                        <CardHeader className="relative p-0 pb-6 ">
                                            <img
                                                src={unit.imageUrl}
                                                alt={`${unit.type} storage unit`}
                                                className="top-0 left-0 w-full aspect-video object-cover opacity-90 rounded-t-lg bg-black"
                                            />
                                            <div className="relative z-10">
                                                <CardTitle className="text-white bg-blue-600 p-2 rounded inline-block">
                                                    {unit.type} - {unit.facility}
                                                </CardTitle>
                                                <CardDescription className="text-white bg-gray-800 p-1 rounded inline-block mt-2">
                                                    {unit.city}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-2 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                    Monthly: {formatCurrency(unit.price.monthly)}
                                                </Badge>

                                                {unit.discounts.yearly > 0  && (
                                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                                        Yearly {unit.discounts.yearly}% OFF
                                                    </Badge>
                                                )}
                                                {unit.discounts.seasonal > 0 && unit.discounts.yearly == 0 && (
                                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                                        Seasonal {unit.discounts.seasonal}% OFF
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {unit.features.map(feature => (
                                                    <Badge key={feature} variant="secondary" className="bg-indigo-100 text-indigo-800">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <p>Size: {unit.size} sq ft</p>
                                        </CardContent>
                                        <CardFooter className="flex flex-col space-y-2">
                                            <Button
                                                onClick={() => handleShowMore(unit)}
                                                variant="outline"
                                                className="w-full bg-gray-100 hover:bg-gray-200"
                                            >
                                                Show More
                                            </Button>
                                            <Button
                                                onClick={() => handleRentUnit(unit)}
                                                className="w-full bg-blue-600 hover:bg-blue-700"
                                            >
                                                Rent Unit
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="my-units">
                        <div className="grid md:grid-cols-3 gap-6 justify-center">
                            {rentedUnits.length === 0 ? (
                                <p className="col-span-full text-center text-gray-500">
                                    You have no rented units
                                </p>
                            ) : (
                                rentedUnits.map(unit => (
                                    <Card
                                        key={unit.id}
                                        className="mb-12 w-full bg-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
                                    >
                                        <CardHeader className="relative p-0 pb-6">
                                            <img
                                                src={unit.imageUrl}
                                                alt={`${unit.type} storage unit`}
                                                className="top-0 left-0 w-full aspect-video object-cover opacity-90 rounded-t-lg bg-black"
                                            />
                                            <div className="relative z-10">
                                                <CardTitle className="text-white bg-blue-600 p-2 rounded inline-block">
                                                    {unit.type} - {unit.facility}
                                                </CardTitle>
                                                <CardDescription className="text-white bg-gray-800 p-1 rounded inline-block mt-2">
                                                    {unit.city}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>

                                        <CardContent className="pt-2 space-y-3">
                                            <div className="flex justify-between items-center gap-2">
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                    Monthly: {formatCurrency(unit.price.monthly)}
                                                </Badge>

                                                {unit.discounts?.yearly > 0 && (
                                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                                        Yearly {unit.discounts.yearly}% OFF
                                                    </Badge>
                                                )}
                                                {unit.discounts?.seasonal > 0 && unit.discounts?.yearly === 0 && (
                                                    <Badge variant="destructive" className="bg-green-500 text-white">
                                                        Seasonal {unit.discounts.seasonal}% OFF
                                                    </Badge>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                {unit.features.map((feature) => (
                                                    <Badge key={feature} variant="secondary" className="bg-indigo-100 text-indigo-800">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>

                                            <p>Size: {unit.size} sq ft</p>
                                            <p className="text-sm text-gray-700">Billing: {unit.rentalDetails?.billingOption}</p>
                                            <p className="text-sm text-gray-600">Expiry Date: {unit.rentalDetails?.expiryDate}</p>
                                            <p className="text-sm text-gray-700">{unit.description}</p>

                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    <strong>Access Details:</strong> {unit.accessDetails}
                                                </p>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    <strong>Shared Access:</strong> {unit.sharedAccess.join(", ")}
                                                </p>
                                            </div>
                                        </CardContent>

                                        <CardFooter className="flex flex-col space-y-2">
                                            <Button
                                                onClick={() => handleShowMore(unit)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Read More
                                            </Button>
                                            <Button
                                                onClick={() => handleCancelRental(unit.id)}
                                                variant="destructive"
                                                className="w-full bg-red-500 hover:bg-red-700 text-white"
                                            >
                                                Cancel Rental
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            )}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Storage Unit Dialog for Both View and Booking */}
                <StorageUnitDialog
                    unit={selectedUnit}
                    isOpen={!!selectedUnit}
                    onClose={() => {
                        setSelectedUnit(null);
                        setDialogMode('view');
                    }}
                    onRent={() => setDialogMode('booking')}
                    mode={dialogMode}
                    selectedPaymentMethod={selectedPaymentMethod}
                    onPaymentMethodChange={setSelectedPaymentMethod}
                    onConfirmRental={confirmRental}
                />
            </div>
        </div>
    )
}