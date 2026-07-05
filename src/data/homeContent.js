import { assets } from '../assets/assets'

// All Home copy and imagery slots live here so swapping in final editorial
// photos or new copy never requires JSX changes.
export const homeContent = {
    hero: {
        headline: 'Elevate Your Everyday Style',
        subcopy: 'Premium menswear crafted for confidence, comfort, and modern living.',
        cta: 'Shop Now',
        secondaryCta: 'View Collection',
        customers: '10K+',
        customersLabel: 'Happy Customers',
        images: {
            center: { src: assets.card4, alt: 'Featured look — tailored menswear' },
            topRight: { src: assets.hero5, alt: 'Casual shirt look' },
            bottomRight: { src: assets.store3, alt: 'Fabric detail' },
        },
        avatars: [assets.card1, assets.card3, assets.card5],
    },
    categories: [
        { label: 'Formal Wear', image: assets.card3, type: 'Formal Wear' },
        { label: 'Casual Shirts', image: assets.card6, type: 'Casual Shirts' },
        { label: 'Trousers', image: assets.hero2, type: 'Trousers' },
        { label: 'Outerwear', image: assets.card5, type: 'Outerwear' },
    ],
    story: {
        eyebrow: 'Our Story',
        title: 'Designed for Confidence',
        paragraphs: [
            'At HeySaz Fashion, we believe style is more than what you wear — it’s how you present yourself to the world.',
            'We use premium materials and timeless design to create pieces that move with you, wherever life goes.',
        ],
        values: [
            { label: 'Premium Materials' },
            { label: 'Modern Fit' },
            { label: 'All-Day Comfort' },
            { label: 'Timeless Design' },
        ],
        cta: 'Explore Our Story',
        image: { src: assets.store2, alt: 'HeySaz — designed for confidence' },
    },
    stats: [
        { value: '10K+', label: 'Happy Customers' },
        { value: '4.8/5', label: 'Average Rating' },
        { value: '99%', label: 'Satisfaction Rate' },
    ],
}
