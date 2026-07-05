// Static size tables per subCategory (measurements in inches).
export const sizeGuide = {
    'Formal Wear': {
        columns: ['Size', 'Chest', 'Shoulder', 'Length'],
        rows: [
            ['S', '38"', '17"', '27"'],
            ['M', '40"', '17.5"', '28"'],
            ['L', '42"', '18"', '29"'],
            ['XL', '44"', '18.5"', '30"'],
            ['XXL', '46"', '19"', '31"'],
        ],
    },
    'Casual Shirts': {
        columns: ['Size', 'Chest', 'Shoulder', 'Length'],
        rows: [
            ['S', '38"', '17"', '27"'],
            ['M', '40"', '17.5"', '28"'],
            ['L', '42"', '18"', '29"'],
            ['XL', '44"', '18.5"', '30"'],
            ['XXL', '46"', '19"', '31"'],
        ],
    },
    'Trousers': {
        columns: ['Size', 'Waist', 'Hip', 'Length'],
        rows: [
            ['28', '28"', '36"', '40"'],
            ['30', '30"', '38"', '40.5"'],
            ['32', '32"', '40"', '41"'],
            ['34', '34"', '42"', '41.5"'],
            ['36', '36"', '44"', '42"'],
            ['38', '38"', '46"', '42"'],
        ],
    },
    'Outerwear': {
        columns: ['Size', 'Chest', 'Shoulder', 'Length'],
        rows: [
            ['S', '40"', '17.5"', '28"'],
            ['M', '42"', '18"', '29"'],
            ['L', '44"', '18.5"', '30"'],
            ['XL', '46"', '19"', '31"'],
            ['XXL', '48"', '19.5"', '32"'],
        ],
    },
    'Accessories': {
        columns: ['Size', 'Fit'],
        rows: [['One Size', 'Fits most']],
    },
}

export const measurementTips = [
    'Chest: measure around the fullest part, keeping the tape level.',
    'Shoulder: measure across the back, seam to seam.',
    'Waist: measure around your natural waistline.',
    'Between sizes? We recommend sizing up for a relaxed fit.',
]
