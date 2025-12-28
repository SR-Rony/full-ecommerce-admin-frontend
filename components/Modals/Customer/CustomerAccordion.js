'use client';
import { ProductImageOutput, isValidArray } from '@/utils/func';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';

export default function CustomerAccordion({ data = {} }) {
  //console.log(data);
  return (
    <div className="w-full px-4 pt-[0px]">
      <div className="mx-auto w-full rounded-2xl bg-white p-2">
        <Disclosure className="border-b">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                <span>Total items {data?.products?.length}</span>
                <ChevronUpIcon
                  className={`${open ? 'rotate-180 transform' : ''
                    } h-5 w-5 text-purple-500`}
                />
              </Disclosure.Button>

              <Disclosure.Panel className="px-4 pb-2 pt-4 text-sm text-gray-500">
                <div className="box-body pt-0">
                  <div className="table-bordered whitespace-nowrap rounded-sm overflow-auto">
                    <table className="ti-custom-table ti-custom-table-head">
                      <thead className="bg-gray-100 dark:bg-black/20">
                        <tr>
                          <th scope="col" className="dark:text-white/70">Item details</th>
                          <th scope="col" className="dark:text-white/70">Price</th>
                          <th scope="col" className="dark:text-white/70">QTY</th>
                          <th scope="col" className="dark:text-white/70">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          isValidArray(data?.products) && data?.products?.length > 0 ? data.products.map((item, i) => (

                            <tr className='border' key={i}>

                              <td>
                                <div className="flex overflow-auto space-x-3 items-center rtl:space-x-reverse w-full">
                                  <img className="avatar avatar-lg rounded-sm bg-gray-100 dark:bg-black/20 p-1"
                                    src={ProductImageOutput(item?.product?.images)} alt="Image Description" />
                                  <div>

                                    <p className="block text-sm font-semibold text-gray-800 dark:text-white truncate">{item?.title}</p>
                                    {/* \an className="block text-sm text-gray-600 dark:text-white/70">Brown Color</span>
<span className="block text-sm text-gray-600 dark:text-white/70">Size : M</span> */}
                                  </div>
                                </div>
                              </td>
                              <td> ${item?.price?.sale} </td>
                              <td>{item?.quantity}</td>
                              <td>${item?.price?.sale * item?.quantity}</td>

                            </tr>

                          )) : ''
                        }

                        <tr className='' >

                          <td className='border-0'>
                           
                          </td>
                          <td className='border-0'>  </td>
                          <td>

                          <p>Total QTY: {isValidArray(data?.products) ? data.products.reduce((prev, b) => prev + b.quantity, 0) : 0}</p>
                          </td>
                          <td>
                          <p>Grand Total: ${data?.orderSummary?.totalAmount}</p>
                          </td>

                        </tr>
                        <tr className='' >

                          <td className='border-0'>
                           
                          </td>
                          <td className='border-0'>  </td>
                          <td>

                          <p>Total Saving: ${data?.orderSummary?.totalSaving}</p>
                          </td>
                          <td>
                          <p>Coupon: {data?.orderSummary?.coupon?.code??"No"}</p>
                          </td>

                        </tr>
                      </tbody>
                      
                    </table>

                  </div>
                </div>

              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

      </div>
    </div>
  );
}

