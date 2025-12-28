import { isValidArray } from '@/utils/func';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/20/solid';
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { RiEditLine } from 'react-icons/ri';

export default function Faq({ faqs, setUpdateData, setEditorData, updateData, setDeleteModalOpen, setEditModalOpen }) {
    const HandleClick = (type, faq) => {
        setEditorData(faq);
        setUpdateData(faq);
        if (type == 'edit') {
            setEditModalOpen(true);
        }
        if (type == 'delete') {
            setDeleteModalOpen(true);
        }
    };
    return (
        <div className="w-full px-4 pt-16">
            <div className="mx-auto w-full rounded-2xl bg-white p-4">

                {/* {isValidArray(faqs?.data) ?
                    faqs.data.map((faq, i) => (
                        <div key={i} className='my-4 '>

                            <Disclosure>
                                {({ open }) => (
                                    <>
                                        <Disclosure.Button className="flex w-full justify-between rounded-lg bg-purple-100 px-4 py-2 text-left text-sm font-medium text-purple-900 hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500/75">
                                            <span>{faq?.question}</span>
                                            <div>
                                                <div className="flex items-center gap-2 justify-end pt-3">

                                                    <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                                       HandleClick('edit',faq);
                                                    }}><RiEditLine size={18} />
                                                        Edit</button> |
                                                    <button className="flex items-center gap-1 cursor-pointer" onClick={() => {
                                                          HandleClick('delete',faq);
                                                    }}><MdOutlineDeleteOutline size={18} /> Delete</button>
                                                       <div>
                                            <ChevronUpIcon
                                                    className={`${open ? 'rotate-180 transform' : ''
                                                        } h-5 w-5 text-purple-500`}
                                                />
                                            </div>
                                                </div>
                                         
                                            </div>

                                        </Disclosure.Button>
                                        <Disclosure.Panel className="px-4  text-sm text-gray-500 py-2">

                                            <div dangerouslySetInnerHTML={{ __html: faq?.answer || "<p> </p>" }} />

                                        </Disclosure.Panel>

                                    </>
                                )}
                            </Disclosure> </div>
                    )):<>
                    <div>
                        <p className='py-8 px-4 text-center text-xl'>Faq Not founds</p>
                    </div>
                    
                    </>} */}

                <p className='text-center text-xl'>Under Development</p>
            </div>
        </div>
    );
}
