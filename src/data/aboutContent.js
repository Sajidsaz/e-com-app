import { assets } from '../assets/assets'

export const aboutContent = {
    hero: {
        eyebrow: 'About HeySaz',
        title: 'Designed for Confidence',
        subcopy: 'At HeySaz Fashion, we believe style is more than what you wear. It is how you present yourself to the world.',
        images: [
            { src: assets.about1, alt: 'HeySaz editorial look', arch: true },
            { src: assets.about2, alt: 'HeySaz team', arch: true },
            { src: assets.about3, alt: 'HeySaz workspace', arch: false },
        ],
    },
    story: {
        eyebrow: 'Our Story',
        title: 'Modern Essentials. Made to Last.',
        paragraphs: [
            'HeySaz Fashion was founded with a simple vision — to create modern menswear that blends timeless style with everyday ease.',
            'Every piece is thoughtfully designed using premium materials and refined construction, ensuring you look sharp and feel comfortable, wherever the day takes you.',
            'We don’t chase trends. We design essentials that stay with you — season after season.',
        ],
        image: { src: assets.store2, alt: 'Modern essentials' },
    },
    values: [
        { title: 'Premium Materials', text: 'Carefully selected fabrics for a superior look and feel.' },
        { title: 'Modern Fit', text: 'Contemporary silhouettes that move with you.' },
        { title: 'All-Day Comfort', text: 'Designed for long days, built for real life.' },
        { title: 'Timeless Design', text: 'Clean, versatile pieces that never go out of style.' },
    ],
    qualityPromise: {
        eyebrow: 'Our Quality Promise',
        title: 'Crafted With Intention',
        subcopy: 'We obsess over the details so you don’t have to. Every stitch, every fabric, every finish — made to meet our standards.',
        images: [assets.card3, assets.hero2],
        points: [
            { title: 'Quality Checked', text: 'Every piece inspected before it reaches you.' },
            { title: 'Refined Stitching', text: 'Precision craftsmanship in every detail.' },
            { title: 'Durable Fabrics', text: 'Made to look good and last longer.' },
            { title: 'Made for Daily Wear', text: 'Comfortable, practical, and easy to style.' },
        ],
    },
    stats: [
        { value: '10K+', label: 'Happy Customers' },
        { value: '4.8/5', label: 'Average Rating' },
        { value: '50+', label: 'Cities Delivered' },
        { value: '99%', label: 'Satisfaction Rate' },
    ],
    founderQuote: {
        quote: 'Confidence comes from wearing pieces that feel right and reflect who you are. At HeySaz, we are committed to honest quality, timeless design, and helping you show up as your best self — every day.',
        attribution: '— Founder, HeySaz Fashion',
        image: { src: assets.card4, alt: 'HeySaz founder note' },
    },
}
