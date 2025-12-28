import { CiCircleRemove } from "react-icons/ci";

const PopupIncludes = ({ productData, setProductData, EndRef } = {}) => {
 
    const handleProductIncludesRemove = (removeIndex, array) => {
        setProductData((prev) => {
            let copy = array;
            if (Array.isArray(copy) && copy?.length > 0) {
                const filters = copy.filter((_, i) => i !== removeIndex);
                return {
                    ...prev,
                    ['details.includes']: filters
                };
            }
            return prev;
        });
       
    };

    const handleProductIncludesUpdate = (updateIndex, data = {}, array) => {
        let copy = array;

        if (Array.isArray(copy) && copy?.length > 0) {
            const filters = copy.map((_item, i) => {
                if (i == updateIndex) {
                    return {
                        ..._item,
                        ...data,
                    };
                } else {
                    return _item;
                }
            });
            setProductData({
                ...productData,
                ['details.includes']: filters
            });

        }
    };
    const options = productData && productData.hasOwnProperty('details.includes') ? productData['details.includes'] : productData?.details?.includes;

    return (
        <div className=""><div className="w-full shadow-lg">
            {
                Array.isArray(options) && options?.length > 0 && options.map((item, i) => (
                    <div key={i} className="border p-4 my-4 rounded-md" ref={EndRef}>
                        <div className="flex items-center justify-between gap-4">
                            <h2 className="mb-3">Includes {i + 1}</h2>
                            <CiCircleRemove size={18} color="black" className="cursor-pointer" onClick={() => handleProductIncludesRemove(i, options)} />
                        </div>

                        <div className="md:flex items-center gap-2">
                            <div className="mt-2 w-full md:w-[60%]">
                                <label htmlFor="name" className="block text-sm mb-2 dark:text-white capitalize"> Name</label>
                                <div className="relative">
                                    <input type="text" name="name" onChange={(e) => handleProductIncludesUpdate(i, { name: e.target.value }, options)} value={item?.name || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>
                            <div className="mt-2  w-full md:w-[25%]">
                                <label htmlFor="quantity" className="block text-sm mb-2 dark:text-white capitalize"> quantity</label>
                                <div className="relative">
                                    <input type="number" name="quantity" onChange={(e) => handleProductIncludesUpdate(i, { quantity: e.target.value }, options)} value={item?.quantity || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>
                            <div className="mt-2 w-full md:w-[25%]">
                                <label htmlFor="dosage" className="block text-sm mb-2 dark:text-white capitalize"> dosage</label>
                                <div className="relative">
                                    <input type="text" name="dosage" onChange={(e) => handleProductIncludesUpdate(i, { dosage: e.target.value }, options)} value={item?.dosage || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>

                        </div>
                    </div>
                ))

            }
        </div>
        </div>
    );
};

export default PopupIncludes;
