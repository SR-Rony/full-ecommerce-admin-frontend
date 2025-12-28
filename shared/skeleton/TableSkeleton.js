import React from "react";

function TableSkeleton({ count = 4 }) {
  console.log(count);

  return (
    <div className="space-y-2">
      {[...Array(count)]?.map(() => (
        <div className="w-full  grid grid-cols-6 gap-2">
          <div className=" p-5    bg-slate-100 animate-pulse rounded"></div>
          <div className=" p-5  col-span-2  bg-slate-100 animate-pulse rounded"></div>
          <div className=" p-5    bg-slate-100 animate-pulse rounded"></div>
          <div className="p-5  col-span-2  bg-slate-100 animate-pulse rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default TableSkeleton;
