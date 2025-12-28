import React from 'react';

const TopViewedProductsComponent = ({ products }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105">
          <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded-md" />
          <p className="font-bold text-sm">{product.name}</p>
          {/* Additional details or actions */}
        </div>
      ))}
    </div>
  );
};

export default TopViewedProductsComponent;
