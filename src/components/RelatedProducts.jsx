import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import ProductCard from './ProductCard';

// "You May Also Like" — products from the same category + subCategory.
const RelatedProducts = ({ category, subCategory, excludeId }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const matches = products.filter((item) =>
        item._id !== excludeId &&
        category === item.category &&
        subCategory === item.subCategory
      );
      setRelated(matches.slice(0, 4));
    }
  }, [products, category, subCategory, excludeId]);

  if (related.length === 0) return null;

  return (
    <section className='py-12'>
      <h2 className='text-center font-display text-2xl font-medium tracking-tight text-ink sm:text-3xl'>You May Also Like</h2>
      <div className='mt-8 grid grid-cols-2 gap-4 gap-y-8 sm:gap-6 lg:grid-cols-4'>
        {related.map((item) => (
          <ProductCard key={item._id} product={item} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
