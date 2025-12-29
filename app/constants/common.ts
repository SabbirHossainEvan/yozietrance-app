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
        status: 'Pending',
        address: '6391 Elgin St. Celina, Delaware 10299',
        rating: '4.8 (1.2k)',
        customerName: 'Alice Freeman',
        items: '4 items • Wireless Headphones 3x...',
        total: '$259.00',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFya2luZyUyMGxvdHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2024',
        status: 'Completed',
        address: '4517 Washington Ave. Manchester, Kentucky 39495',
        rating: '4.7 (1.8k)',
        customerName: 'John Doe',
        items: '2 items • Smart Watch 1x, Charger 1x',
        total: '$450.00',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2026',
        status: 'Delivered',
        address: '3891 Ranchview Dr. Richardson, California 62639',
        rating: '4.5 (2.3k)',
        customerName: 'Emma Wilson',
        items: '1 item • Gaming Console 1x',
        total: '$499.99',
        image: 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nJTIwY29uc29sZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2027',
        status: 'Processing',
        address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
        rating: '4.2 (1.5k)',
        customerName: 'Sarah Johnson',
        items: '3 items • Laptop 1x, Mouse 2x',
        total: '$1,250.50',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVza3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2028',
        status: 'Shipped',
        address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
        rating: '4.9 (2.1k)',
        customerName: 'Michael Brown',
        items: '5 items • Wireless Earbuds 2x, Case 1x...',
        total: '$349.99',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2029',
        status: 'Completed',
        address: '1234 Main St. Austin, Texas 73301',
        rating: '4.6 (1.9k)',
        customerName: 'David Wilson',
        items: '2 items • Smartphone 1x, Case 1x',
        total: '$899.99',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D'
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
