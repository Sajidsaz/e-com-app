// Single source of truth for the storefront taxonomy. Matches the admin
// panel subCategory options and the migrated DB values.
export const SUB_CATEGORIES = [
    'Formal Wear',
    'Casual Shirts',
    'Trousers',
    'Outerwear',
    'Accessories',
]

export const CATEGORIES = ['Men', 'Women', 'Kids']

// Collection page tabs: All + New In + taxonomy
export const COLLECTION_TABS = ['All', 'New In', ...SUB_CATEGORIES]

const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000

export const isNewIn = (product) =>
    Boolean(product.date && Date.now() - product.date < THIRTY_DAYS)
