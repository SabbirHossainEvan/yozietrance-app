import Product from "../(tabs)/product";
import { images } from "./import_images";

export const commonData = [
    {
        "metric": "Sales",
        "value": "$12,345",
        "change": "+10%",
        "trend": "up"
    },
    {
        "metric": "Active Orders",
        "value": "25",
        "change": "-5%",
        "trend": "down"
    },
    {
        "metric": "Products",
        "value": "150",
        "change": "+2%",
        "trend": "up"
    },
    {
        "metric": "New client",
        "value": "12,345",
        "change": "+10%",
        "trend": "up"
    }
];
// Quick actions data
export const quickActions = [
    { id: 1, name: 'Add Product', icon: images.add_product },
    { id: 2, name: 'Orders', icon: images.order_icon },
    { id: 3, name: 'Invoices', icon: images.invoice_icon },
    { id: 4, name: 'Analytics', icon: images.analytics_icon },
];
export const recentOrders = [
    {
        id: 'ORD-2025',
        orderNumber: '#ORD-2025',

        customer: {
            name: 'Ronald Richards',
            customerId: '#225432',
            avatar: 'https://i.pravatar.cc/150?img=12'
        },

        orderItems: [
            {
                id: '1',
                title: 'Wireless Headphones',
                description: 'Lorem ipsum ultricies in tortor...',
                price: 20,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
            },
            {
                id: '2',
                title: 'Bluetooth Speaker',
                description: 'Lorem ipsum ultricies in tortor...',
                price: 20,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb'
            }
        ],

        payment: {
            subtotal: 80,
            tax: 10,
            shipping: 0.6,
            grandTotal: 90.6,
            status: 'Paid',
            method: 'Visa Credit Card ending 4242'
        },

        orderStatus: {
            status: 'Processing',
            location: 'Mirpur 11, Dhaka',
            date: '22 May 2025'
        }
    },

    {
        id: 'ORD-2024',
        orderNumber: '#ORD-2024',

        customer: {
            name: 'John Doe',
            customerId: '#225433',
            avatar: 'https://i.pravatar.cc/150?img=15'
        },

        orderItems: [
            {
                id: '1',
                title: 'Smart Watch Pro',
                description: 'Fitness tracking smartwatch',
                price: 200,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
            },
            {
                id: '2',
                title: 'Fast Charger',
                description: 'USB-C fast charger',
                price: 50,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0'
            }
        ],

        payment: {
            subtotal: 250,
            tax: 20,
            shipping: 5,
            grandTotal: 275,
            status: 'Paid',
            method: 'MasterCard ending 2211'
        },

        orderStatus: {
            status: 'Completed',
            location: 'Manchester, KY',
            date: '13 May 2025'
        }
    },

    {
        id: 'ORD-2026',
        orderNumber: '#ORD-2026',

        customer: {
            name: 'Emma Wilson',
            customerId: '#225434',
            avatar: 'https://i.pravatar.cc/150?img=32'
        },

        orderItems: [
            {
                id: '1',
                title: 'Gaming Console',
                description: 'Next-gen gaming console',
                price: 499.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e'
            }
        ],

        payment: {
            subtotal: 499.99,
            tax: 30,
            shipping: 0,
            grandTotal: 529.99,
            status: 'Paid',
            method: 'Visa ending 8899'
        },

        orderStatus: {
            status: 'Delivered',
            location: 'California',
            date: '07 May 2025'
        }
    },

    {
        id: 'ORD-2027',
        orderNumber: '#ORD-2027',

        customer: {
            name: 'Sarah Johnson',
            customerId: '#225435',
            avatar: 'https://i.pravatar.cc/150?img=47'
        },

        orderItems: [
            {
                id: '1',
                title: 'Laptop',
                description: 'High performance laptop',
                price: 1000,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'
            },
            {
                id: '2',
                title: 'Wireless Mouse',
                description: 'Ergonomic mouse',
                price: 125.25,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1527814050087-3793815479db'
            }
        ],

        payment: {
            subtotal: 1250.5,
            tax: 80,
            shipping: 10,
            grandTotal: 1340.5,
            status: 'Pending',
            method: 'Cash on Delivery'
        },

        orderStatus: {
            status: 'Processing',
            location: 'Hawaii',
            date: '16 May 2025'
        }
    },

    {
        id: 'ORD-2028',
        orderNumber: '#ORD-2028',

        customer: {
            name: 'Michael Brown',
            customerId: '#225436',
            avatar: 'https://i.pravatar.cc/150?img=18'
        },

        orderItems: [
            {
                id: '1',
                title: 'Wireless Earbuds',
                description: 'Noise canceling earbuds',
                price: 70,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df'
            },
            {
                id: '2',
                title: 'Protective Case',
                description: 'Silicone earbuds case',
                price: 40,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1585386959984-a41552231693'
            }
        ],

        payment: {
            subtotal: 180,
            tax: 15,
            shipping: 5,
            grandTotal: 200,
            status: 'Paid',
            method: 'Visa ending 6622'
        },

        orderStatus: {
            status: 'Shipped',
            location: 'Connecticut',
            date: '14 May 2025'
        }
    },

    {
        id: 'ORD-2029',
        orderNumber: '#ORD-2029',

        customer: {
            name: 'David Wilson',
            customerId: '#225437',
            avatar: 'https://i.pravatar.cc/150?img=22'
        },

        orderItems: [
            {
                id: '1',
                title: 'Smartphone',
                description: 'Latest generation smartphone',
                price: 799.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
            },
            {
                id: '2',
                title: 'Phone Case',
                description: 'Shockproof phone case',
                price: 100,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1580910051074-7e54d57f1c0b'
            }
        ],

        payment: {
            subtotal: 899.99,
            tax: 50,
            shipping: 0,
            grandTotal: 949.99,
            status: 'Paid',
            method: 'Visa ending 3344'
        },

        orderStatus: {
            status: 'Completed',
            location: 'Austin, TX',
            date: '03 May 2025'
        }
    }
];

// Sample products data
export const sampleProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Noise Canceling Headphones',
        sku: 'EC-100',
        price: "500",
        stock: 123,
        status: 'active',

        images: [
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
            'https://images.unsplash.com/photo-1585386959984-a41552231693'
        ],

        rating: 4.8,
        reviewsCount: 1200,

        stats: {
            onStock: 123,
            processing: 123,
            totalSold: 123
        },

        description:
            'Industry-leading noise cancelling with Dual Noise Sensor technology. Next-level music with Edge-A, co-developed with Sony Music Studios Tokyo. Up to 30-hour battery life with quick charging.',

        specification: {
            brand: 'JBL',
            model: 'Tune 720BT',
            connectivity: 'Bluetooth / Charging cable',
            bluetooth: '5.3',
            colors: ['Black', 'White'],
            weight: '220g',
            size: '40mm',
            chargingTime: '2 hours',
            playtime: 'Up to 76 hours'
        }
    },

    {
        id: '2',
        name: 'Smartphone X',
        sku: 'SP-200',
        price: "899.99",
        stock: 5,
        status: 'low_stock',

        images: [
            'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'
        ],

        rating: 4.6,
        reviewsCount: 980,

        stats: {
            onStock: 5,
            processing: 2,
            totalSold: 540
        },

        description:
            'High-performance smartphone with OLED display, ultra-fast processor, professional camera system and long-lasting battery.',

        specification: {
            brand: 'TechX',
            model: 'X-Pro',
            connectivity: '5G / USB-C',
            bluetooth: '5.2',
            colors: ['Black', 'Blue'],
            weight: '190g',
            size: '6.5 inch',
            chargingTime: '1.5 hours',
            playtime: 'Up to 24 hours'
        }
    },

    {
        id: '3',
        name: 'Wireless Earbuds Pro',
        sku: 'EP-300',
        price: "149.99",
        stock: 0,
        status: 'draft',

        images: [
            'https://images.unsplash.com/photo-1590658268037-6bf12165a8df'
        ],

        rating: 4.4,
        reviewsCount: 760,

        stats: {
            onStock: 0,
            processing: 0,
            totalSold: 890
        },

        description:
            'Premium wireless earbuds with immersive sound, active noise cancellation, and compact charging case.',

        specification: {
            brand: 'SoundMax',
            model: 'Pro Buds',
            connectivity: 'Bluetooth / Type-C',
            bluetooth: '5.3',
            colors: ['Black', 'White'],
            weight: '60g',
            size: 'In-ear',
            chargingTime: '1 hour',
            playtime: 'Up to 28 hours'
        }
    },

    {
        id: '4',
        name: 'Smart Watch Pro',
        sku: 'SW-400',
        price: "249.99",
        stock: 12,
        status: 'active',

        images: [
            'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
        ],

        rating: 4.7,
        reviewsCount: 1500,

        stats: {
            onStock: 12,
            processing: 4,
            totalSold: 1020
        },

        description:
            'Advanced smartwatch with fitness tracking, heart-rate monitoring, AMOLED display, and water resistance.',

        specification: {
            brand: 'FitTime',
            model: 'Pro X',
            connectivity: 'Bluetooth / Magnetic charger',
            bluetooth: '5.1',
            colors: ['Black', 'Silver'],
            weight: '55g',
            size: '1.9 inch',
            chargingTime: '2 hours',
            playtime: 'Up to 14 days'
        }
    },

    {
        id: '5',
        name: 'Bluetooth Speaker',
        sku: 'BS-500',
        price: "79.99",
        stock: 8,
        status: 'active',

        images: [
            'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb'
        ],

        rating: 4.5,
        reviewsCount: 640,

        stats: {
            onStock: 8,
            processing: 3,
            totalSold: 780
        },

        description:
            'Portable Bluetooth speaker with deep bass, waterproof design, and long battery life.',

        specification: {
            brand: 'BoomSound',
            model: 'BS-500',
            connectivity: 'Bluetooth / USB',
            bluetooth: '5.0',
            colors: ['Red', 'Black'],
            weight: '480g',
            size: 'Medium',
            chargingTime: '3 hours',
            playtime: 'Up to 20 hours'
        }
    },

    {
        id: '6',
        name: 'Laptop Stand',
        sku: 'LS-600',
        price: "39.99",
        stock: 3,
        status: 'low_stock',

        images: [
            'https://images.unsplash.com/photo-1581094794329-e8f4acd3d9b7'
        ],

        rating: 4.3,
        reviewsCount: 320,

        stats: {
            onStock: 3,
            processing: 1,
            totalSold: 410
        },

        description:
            'Ergonomic aluminum laptop stand with adjustable height for better posture and airflow.',

        specification: {
            brand: 'DeskPro',
            model: 'LiftStand',
            connectivity: 'N/A',
            bluetooth: 'N/A',
            colors: ['Silver'],
            weight: '900g',
            size: 'Adjustable',
            chargingTime: 'N/A',
            playtime: 'N/A'
        }
    }
];
