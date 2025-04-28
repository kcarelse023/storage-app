const DUMMY_UNITS = [
    {
        id: 'av1',
        type: 'Garage',
        facility: 'Downtown Storage Center',
        city: 'Johannesburg',
        size: 200,
        price: {
            monthly: 1500,
            yearly: 15000
        },
        discounts: {
            yearly: 10,
            seasonal: 0
        },
        status: 'Available',
        features: ['Climate Controlled', '24/7 Access'],
        description: 'Spacious garage-style storage unit perfect for vehicles, large equipment, or multiple items. Ideal for long-term storage with climate control.',
        accessDetails: 'Spacious entry, wide doors, suitable for vehicles and large items',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: null,
        sharedAccess: []
    },
    {
        id: 'av2',
        type: 'Locker',
        facility: 'Westside Storage Complex',
        city: 'Cape Town',
        size: 50,
        price: {
            monthly: 500,
            yearly: 5000
        },
        discounts: {
            yearly: 0,
            seasonal: 10
        },
        status: 'Available',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: null,
        sharedAccess: []
    },
    {
        id: 'rt1',
        type: 'Locker',
        facility: 'Downtown Storage Center',
        city: 'Johannesburg',
        size: 75,
        price: {
            monthly: 750
        },
        discounts: {
            yearly: 10,
            seasonal: 5
        },
        rentalDetails: {
            startDate: '2024-01-15',
            expiryDate: '2024-12-31',
            billingOption: 'Monthly'
        },
        status: 'Reserved',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: 'user123',
        sharedAccess: ['shared1@example.com', 'shared2@example.com']
    },
    {
        id: 'rt2',
        type: 'Garage',
        facility: 'Westside Storage Complex',
        city: 'Cape Town',
        size: 200,
        price: {
            monthly: 1600
        },
        discounts: {
            yearly: 0,
            seasonal: 0
        },
        rentalDetails: {
            startDate: '2024-02-01',
            expiryDate: '2024-12-01',
            billingOption: 'Monthly'
        },
        status: 'Occupied',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: 'user456',
        sharedAccess: ['shared3@example.com']
    },
    {
        id: 'rt3',
        type: 'Locker',
        facility: 'Downtown Storage Center',
        city: 'Johannesburg',
        size: 50,
        price: {
            monthly: 500
        },
        discounts: {
            yearly: 0,
            seasonal: 0
        },
        rentalDetails: {
            startDate: '2024-03-01',
            expiryDate: '2024-09-01',
            billingOption: 'Monthly'
        },
        status: 'Occupied',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: 'user789',
        sharedAccess: []
    },
    {
        id: 'rt4',
        type: 'Garage',
        facility: 'East End Storage',
        city: 'Pretoria',
        size: 250,
        price: {
            monthly: 1700
        },
        discounts: {
            yearly: 0,
            seasonal: 0
        },
        rentalDetails: {
            startDate: '2023-12-01',
            expiryDate: '2024-11-30',
            billingOption: 'Yearly'
        },
        status: 'Reserved',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: 'user234',
        sharedAccess: []
    },
    {
        id: 'rt5',
        type: 'Locker',
        facility: 'Central Storage Depot',
        city: 'Durban',
        size: 100,
        price: {
            monthly: 800
        },
        discounts: {
            yearly: 0,
            seasonal: 0
        },
        rentalDetails: {
            startDate: '2024-01-10',
            expiryDate: '2024-06-10',
            billingOption: 'Monthly'
        },
        status: 'Occupied',
        features: ['Secure Access', 'Indoor Storage'],
        description: 'Compact and secure locker-style unit perfect for personal belongings, documents, or small item storage.',
        accessDetails: 'Secure indoor location with individual lock system',
        minRentalPeriod: 1,
        maxRentalPeriod: null,
        imageUrl: '/api/placeholder/600/400',
        userId: 'user567',
        sharedAccess: ['shared4@example.com']
    }
];

export { DUMMY_UNITS };
