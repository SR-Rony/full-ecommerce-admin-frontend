import React from "react";

const ProductSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2   lg:grid-cols-3 gap-x-4 gap-y-8">
      {[...Array(count)].map(() => (
        <div className="p-1 bg-white rounded border shadow border-slate-100 space-y-2">
          <div className="p-8 bg-slate-100 rounded animate-pulse"></div>
          <div className="p-24 bg-slate-100 rounded animate-pulse"></div>
          <div className="flex justify-end gap-4">
            <div className="px-10 py-4 bg-slate-100 rounded"> </div>
            <div className="px-8 py-4 bg-slate-100 rounded"> </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
