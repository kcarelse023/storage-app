import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Plus, X } from "lucide-react";
import { DUMMY_UNITS } from "@/components/storageUnits/units.js";
import { StorageUnitAccess } from './StorageUnitAccess';
import {
    CalendarIcon,
    CheckCircleIcon,
    InfoIcon,
    RulerIcon,
    TagIcon,
    WarehouseIcon
} from "lucide-react";

// eslint-disable-next-line no-unused-vars
export function StorageUnits( {apiClient, pictures}) {
    const currentUserId = "user123";
    const [availableUnits, setAvailableUnits] = useState(
        DUMMY_UNITS.filter(unit => !unit.isRented)
    );
    const [rentedUnits, setRentedUnits] = useState(
        DUMMY_UNITS.filter(unit => unit.userId === currentUserId || unit.sharedWith?.includes(currentUserId))
    );
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [expandedUnit, setExpandedUnit] = useState(null);
    const [sharedEmails, setSharedEmails] = useState([]);
    const [currentEmail, setCurrentEmail] = useState('');
    const [sharingType, setSharingType] = useState('permanent');
    const [sharingPeriod, setSharingPeriod] = useState(1);
    const [accessDialogUnit, setAccessDialogUnit] = useState(null);
    const [unlockedUnits, setUnlockedUnits] = useState([]);


    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
        }).format(amount || 0);

    const addSharedEmail = () => {
        if (currentEmail && !sharedEmails.includes(currentEmail)) {
            setSharedEmails([...sharedEmails, currentEmail]);
            setCurrentEmail('');
        }
    };

    const removeSharedEmail = (emailToRemove) => {
        setSharedEmails(sharedEmails.filter(email => email !== emailToRemove));
    };

    const handleRentUnit = (unit) => {
        setSelectedUnit(unit);
        setBookingDialogOpen(true);
    };

    const handleShowMore = (unit) => {
        setSelectedUnit(unit);
        setExpandedUnit(unit);
    };


    const handleAccessUnit = (unit) => {
        setAccessDialogUnit(unit);
    };

    const handleUnitUnlock = (unitId) => {
        // Add the unit to the unlocked units list
        setUnlockedUnits(prev => [...prev, unitId]);
    };

    const handleCloseAccessDialog = () => {
        // Only allow closing if the unit is not unlocked
        const isUnitUnlocked = unlockedUnits.includes(accessDialogUnit?.id);
        if (!isUnitUnlocked) {
            setAccessDialogUnit(null);
        }
    };

    const confirmRental = (billingOption) => {
        if (selectedUnit && selectedPaymentMethod) {
            const updatedAvailableUnits = availableUnits.filter(u => u.id !== selectedUnit.id);

            const discount = billingOption.toLowerCase() === "yearly"
                ? (selectedUnit.discounts.year > 0 ? selectedUnit.discounts.year : 100) / 100
                : (selectedUnit.discounts.month > 0 ? selectedUnit.discounts.month : 100) / 100;

            let price;
            if (selectedPaymentMethod.toLowerCase() === "card" && billingOption.toLowerCase() === "yearly") {
                price = selectedUnit.price.yearly;
            } else if (selectedPaymentMethod.toLowerCase() === "card" && billingOption.toLowerCase() === "monthly") {
                price = selectedUnit.price.monthly;
            } else if (selectedPaymentMethod.toLowerCase() === "eft" && billingOption.toLowerCase() === "monthly") {
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
                },
                sharedAccess: {
                    emails: sharedEmails,
                    type: sharingType,
                    period: sharingType === 'temporary' ? sharingPeriod : null
                }
            };

            setRentedUnits([...rentedUnits, rentedUnit]);
            setAvailableUnits(updatedAvailableUnits);
            setBookingDialogOpen(false);
            setExpandedUnit(null);

            // Reset sharing options
            setSharedEmails([]);
            setSharingType('permanent');
            setSharingPeriod(1);
        }
    };

    function randomUnit() {
        const units = pictures;
        const randIndex = Math.floor(Math.random() * units.length);
        const randUnit = units[randIndex];
        console.log("Units: " + randUnit)
        return randUnit
    }

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
            setBookingDialogOpen(false);
            setExpandedUnit(null);
        }
    };
    return (
        <div className="w-full min-h-screen bg-gradient-to-br  py-8">
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
                                        className=" mb-12 w-full bg-white shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
                                    >
                                        <CardHeader className="relative p-0 pb-6 ">
                                            <img
                                                src={randomUnit()}
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
                                                    Monthly: R{unit.price.monthly}
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
                                        {/* Card Header */}
                                        <CardHeader className="relative p-0 pb-6">
                                            <img
                                                src={randomUnit()}
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

                                        {/* Card Content */}
                                        <CardContent className="pt-2 space-y-3">
                                            <div className="flex justify-between items-center gap-2">
                                                {/* Monthly Fee */}
                                                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                                    Monthly: R{unit.price.monthly}
                                                </Badge>

                                                {/* Discounts Logic */}
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

                                            {/* Features Badges */}
                                            <div className="flex gap-2">
                                                {unit.features.map((feature) => (
                                                    <Badge key={feature} variant="secondary" className="bg-indigo-100 text-indigo-800">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>

                                            {/* Size and Description */}
                                            <p>Size: {unit.size} sq ft</p>
                                            <p className="text-sm text-gray-700">Billing: {unit.rentalDetails?.billingOption}</p>
                                            <p className="text-sm text-gray-600">Expiry Date: {unit.rentalDetails?.expiryDate}</p>
                                            <p className="text-sm text-gray-700">{unit.description}</p>

                                            {/* Expanded Details Section */}
                                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-700">
                                                    <strong>Access Details:</strong> {unit.accessDetails}
                                                </p>
                                                <p className="mt-2 text-sm text-gray-600">
                                                    <strong>Shared Access:</strong> {unit.sharedAccess.join(", ")}
                                                </p>
                                            </div>
                                        </CardContent>

                                        {/* Card Footer */}
                                        <CardFooter className="flex flex-col space-y-2">
                                            <Button
                                                onClick={() => handleAccessUnit(unit)}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                Access Unit
                                            </Button>

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

                {expandedUnit && (
                    <Dialog
                        open={!!expandedUnit}
                        onOpenChange={() => {
                            setExpandedUnit(null);
                        }}
                    >
                        <DialogContent
                            className="bg-white text-black max-w-4xl w-full mx-auto rounded-xl shadow-2xl"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left Column - Image and Basic Info */}
                                <div>
                                    {expandedUnit?.imageUrl && (
                                        <img
                                            src={randomUnit()}
                                            alt={expandedUnit.facility}
                                            className="w-full h-64 object-cover rounded-lg mb-4"
                                        />
                                    )}

                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2">
                                            <WarehouseIcon className="w-5 h-5 text-blue-600" />
                                            <h2 className="text-xl font-bold">
                                                {expandedUnit?.type} at {expandedUnit?.facility}
                                            </h2>
                                        </div>

                                        <p className="text-gray-600">{expandedUnit?.description}</p>

                                        <div className="flex items-center space-x-2">
                                            <InfoIcon className="w-5 h-5 text-green-600" />
                                            <span className="font-semibold">Status: {expandedUnit?.status}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Detailed Information */}
                                <div className="space-y-4">
                                    {/* Location and Size */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <RulerIcon className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-semibold">Space Details</h3>
                                        </div>
                                        <p><strong>City:</strong> {expandedUnit?.city}</p>
                                        <p><strong>Size:</strong> {expandedUnit?.size} sq ft</p>
                                    </div>

                                    {/* Pricing */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <TagIcon className="w-5 h-5 text-green-600" />
                                            <h3 className="font-semibold">Pricing</h3>
                                        </div>
                                        <p><strong>Monthly Rate:</strong> {formatCurrency(expandedUnit?.price?.monthly)}</p>
                                        <p><strong>Yearly Rate:</strong> {formatCurrency(expandedUnit?.price?.yearly)}</p>
                                    </div>

                                    {/* Rental Period */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CalendarIcon className="w-5 h-5 text-red-600" />
                                            <h3 className="font-semibold">Rental Terms</h3>
                                        </div>
                                        <p><strong>Minimum Rental:</strong> {expandedUnit?.minRentalPeriod} month(s)</p>
                                        {expandedUnit?.maxRentalPeriod && (
                                            <p><strong>Maximum Rental:</strong> {expandedUnit?.maxRentalPeriod} month(s)</p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-semibold">Features</h3>
                                        </div>
                                        <ul className="list-disc list-inside">
                                            {expandedUnit?.features?.map((feature) => (
                                                <li key={feature}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Rent Button */}
                                    <Button
                                        onClick={() => handleRentUnit(expandedUnit)}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        Rent This Unit
                                    </Button>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                )}
                {/* Booking Dialog */}
                <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                    <DialogContent className="bg-white rounded-lg text-black max-w-2xl overflow-y-auto max-h-[80vh]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl text-blue-600">Rent Storage Unit</DialogTitle>
                            <DialogDescription>
                                Choose your billing, payment, and sharing options
                                for {selectedUnit?.type} at {selectedUnit?.facility}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                            {/* New Shared Access Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Shared Access</h3>

                                {/* Sharing Type Selection */}
                                <div className="space-y-2">
                                    <Label>Sharing Type</Label>
                                    <RadioGroup
                                        value={sharingType}
                                        onValueChange={setSharingType}
                                        className="flex space-x-4"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="permanent" id="permanent-sharing"/>
                                            <Label htmlFor="permanent-sharing">Permanent Sharing</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="temporary" id="temporary-sharing"/>
                                            <Label htmlFor="temporary-sharing">Temporary Sharing</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                {/* Temporary Sharing Period (shown only when temporary is selected) */}
                                {sharingType === 'temporary' && (
                                    <div className="space-y-2">
                                        <Label>Sharing Period (Months)</Label>
                                        <Input
                                            type="number"
                                            value={sharingPeriod}
                                            onChange={(e) => setSharingPeriod(Number(e.target.value))}
                                            min="1"
                                            max="12"
                                            className="w-full"
                                        />
                                    </div>
                                )}

                                {/* Email Sharing */}
                                <div className="space-y-2">
                                    <Label>Share Unit Access</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            type="email"
                                            placeholder="Enter email to share"
                                            value={currentEmail}
                                            onChange={(e) => setCurrentEmail(e.target.value)}
                                            className="flex-grow"
                                        />
                                        <Button
                                            onClick={addSharedEmail}
                                            variant="outline"
                                            disabled={!currentEmail}
                                        >
                                            <Plus className="h-4 w-4"/>
                                        </Button>
                                    </div>

                                    {/* Shared Emails List */}
                                    {sharedEmails.length > 0 && (
                                        <div className="mt-2 space-y-2">
                                            {sharedEmails.map((email) => (
                                                <div
                                                    key={email}
                                                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                                                >
                                                    <span>{email}</span>
                                                    <Button
                                                        onClick={() => removeSharedEmail(email)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                                <RadioGroup
                                    defaultValue="card"
                                    onValueChange={setSelectedPaymentMethod}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                                        <RadioGroupItem value="card" id="card"/>
                                        <Label htmlFor="card" className="flex items-center">
                                            Credit/Debit Card
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 bg-gray-100 p-3 rounded-lg">
                                        <RadioGroupItem value="eft" id="eft"/>
                                        <Label htmlFor="eft" className="flex items-center">
                                            Electronic Bank Transfer (EFT)
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Billing Options</h3>
                                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">Monthly</h4>
                                        <p className="text-sm text-gray-500">
                                            R{selectedUnit?.price.monthly}/month
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => confirmRental('Monthly')}
                                        className="bg-blue-500 hover:bg-blue-600"
                                    >
                                        Select Monthly
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
                                    <div>
                                        <h4 className="font-semibold">
                                            Yearly
                                            {selectedUnit?.discounts.yearly > 0 && (
                                                <span className="text-green-600 ml-2">
                                    {selectedUnit.discounts.yearly}% OFF
                                </span>
                                            )}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            R{selectedUnit?.price.yearly}/year
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => confirmRental('Yearly')}
                                        className="bg-green-500 hover:bg-green-600"
                                    >
                                        Select Yearly
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
            {accessDialogUnit && (
                <StorageUnitAccess
                    unit={accessDialogUnit}
                    isOpen={!!accessDialogUnit}
                    onClose={handleCloseAccessDialog}
                    onUnlock={handleUnitUnlock}
                />
            )}
        </div>
    )
}