import React from "react";
import emptyDataImage from "../../public/emptyTable.png";
import Image from "next/image";
const EmptyTableSectionTwo = () => {
  return (
    <div className="text-center   flex flex-col items-center  justify-center  gap-5">
      <Image
        src={emptyDataImage}
        width={500}
        height={500}
        alt="empty data "
        className="w-4/12 h-auto  opacity-70 "
      />
      <p className="text-sm text-slate-400 ">No Data Available</p>
    </div>
  );
};

export default EmptyTableSectionTwo;
