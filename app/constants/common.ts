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
        id: 'ORD-2023',
        status: 'Processing',
        address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
        rating: '4.2 (1.5k)',
        customerName: 'Sarah Johnson',
        items: '3 items • Laptop 1x, Mouse 2x',
        total: '$1,250.50',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVza3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2022',
        status: 'Shipped',
        address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
        rating: '4.9 (2.1k)',
        customerName: 'Michael Brown',
        items: '5 items • Wireless Earbuds 2x, Case 1x...',
        total: '$349.99',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2023',
        status: 'Processing',
        address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
        rating: '4.2 (1.5k)',
        customerName: 'Sarah Johnson',
        items: '3 items • Laptop 1x, Mouse 2x',
        total: '$1,250.50',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVza3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2022',
        status: 'Shipped',
        address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
        rating: '4.9 (2.1k)',
        customerName: 'Michael Brown',
        items: '5 items • Wireless Earbuds 2x, Case 1x...',
        total: '$349.99',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2023',
        status: 'Processing',
        address: '1901 Thornridge Cir. Shiloh, Hawaii 81063',
        rating: '4.2 (1.5k)',
        customerName: 'Sarah Johnson',
        items: '3 items • Laptop 1x, Mouse 2x',
        total: '$1,250.50',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8b2ZmaWNlJTIwZGVza3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: 'ORD-2022',
        status: 'Shipped',
        address: '2118 Thornridge Cir. Syracuse, Connecticut 35624',
        rating: '4.9 (2.1k)',
        customerName: 'Michael Brown',
        items: '5 items • Wireless Earbuds 2x, Case 1x...',
        total: '$349.99',
        image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29mZmVlJTIwc2hvcHxlbnwwfHwwfHx8MA%3D%3D'
    }
];

// product data
// In common.ts
export const sampleProducts: Product[] = [
    {
        id: '1',
        name: 'Wireless Noise Canceling Headphones',
        sku: 'SKU: EC-100',
        price: '$200.00',
        stock: 52,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8aGVhZHBob25lc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '2',
        name: 'Smartphone X',
        sku: 'SKU: SP-200',
        price: '$899.99',
        stock: 5,
        status: 'low_stock',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c21hcnRwaG9uZXxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '3',
        name: 'Wireless Earbuds Pro',
        sku: 'SKU: EP-300',
        price: '$149.99',
        stock: 0,
        status: 'draft',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '4',
        name: 'Smart Watch Pro',
        sku: 'SKU: SW-400',
        price: '$249.99',
        stock: 12,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2F0Y2h8ZW58MHx8MHx8fDA%3D'
    },
    {
        id: '5',
        name: 'Bluetooth Speaker',
        sku: 'SKU: BS-500',
        price: '$79.99',
        stock: 8,
        status: 'active',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ymx1ZXRvb3RoJTIwc3BlYWtlcnxlbnwwfHwwfHx8MA%3D%3D'
    },
    {
        id: '6',
        name: 'Laptop Stand',
        sku: 'SKU: LS-600',
        price: '$39.99',
        stock: 3,
        status: 'low_stock',
        image: 'https://images.unsplash.com/photo-1581094794329-e8f4acd3d9b7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFwdG9wJTIwc3RhbmR8ZW58MHx8MHx8fDA%3D'
    }
];