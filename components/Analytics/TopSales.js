import { isValidArray } from "@/utils/func";

const  TopSales = ({ products }) => {
    if (!isValidArray(products)) return null;
    
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-16 py-3">
                            <span className="sr-only">Image</span>
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Product
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Sale Count
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Price
                        </th>

                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr
                            key={index}
                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                        >
                           
                            <td className="p-4">
                            {  isValidArray(product?.images)&&  <img
                                    src={product?.images[0]?.imgUrl}
                                    className="w-16 md:w-32 max-w-full max-h-full"
                                    alt={product.name}
                                />}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                {product.title}
                            </td>
                            <td className="px-6 py-4">
                                {product?.stats?.totalSoldCount}
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                ${product.price.regular}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

};

export default TopSales;
