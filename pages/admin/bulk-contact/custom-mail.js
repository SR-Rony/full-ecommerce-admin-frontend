import { MailBulkContact } from "@/classes/BulkContact/bulk.contact.class";
import BulkContactEmailListsSelect from "@/components/BulkContact/BulkContactEmailListsSelect";
import BulkContactOptionSelect from "@/components/BulkContact/BulkContactOptionSelect";
import BulkContactMailSendModal from "@/components/Modals/BulkContact/BulkContactMailSendModal";
import MessageInputBulkContact from "@/components/Shared/MessageInputBulkContact";
import Loader from "@/shared/Loader/Loader";
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import { isValidArray } from "@/utils/func";
import { bulkContactsEmailSend } from "@/utils/instance";
import { useState } from "react";
import Swal from "sweetalert2";

const contact = () => {
    const [editorData, setEditorData] = useState({site:'hb'});
    const [bulkMailSendModalOpen, setBulkMailSendModalOpen] = useState(false);
    const [isRequest, setIsRequest] = useState(false);

    const mailBulkContactState = new MailBulkContact().getData();
    const matchCommaInput = { label: "Enter email list (Comma Separated)", value: "enter_email_list_(comma_separated)" };
    const onClickVariableMessage = async (msg) => {
        setEditorData((prev) => {
            var prevMessage = prev?.message || "";
            return {
                ...prev,
                message: prevMessage + " " + msg
            };
        });
    };

    const onChangeSubject = async (value) => {
        setEditorData((prev) => {
            return {
                ...prev,
                subject: value
            };
        });
    };
    const onChangeInputMessage = async (value) => {
        setEditorData((prev) => {
            return {
                ...prev,
                message: value
            };
        });
    };

    const onChangeBulkContactOptionSelect = (value) => {
        setEditorData((prev) => {
            return {
                ...prev,
                option: value
            };
        });
    };

    const isValidInputField = () => {
        if (!editorData?.subject) {
            Swal.fire({
                title: "Error!",
                text: 'Subject is required!',
                icon: "error"
            });
            return false;
        }
        if (!editorData?.option?.value) {
            Swal.fire({
                title: "Error!",
                text: 'Please select a option!',
                icon: "error"
            });
            return false;
        }
        if (editorData?.option?.value == matchCommaInput?.value) {
            if (!(isValidArray(editorData?.emailLists))) {
                Swal.fire({
                    title: "Error!",
                    text: matchCommaInput.label + " " + 'is required!',
                    icon: "error"
                });

                return false;
            }
        }
        if (!editorData?.message) {
            Swal.fire({
                title: "Error!",
                text: 'Message is required!',
                icon: "error"
            });
            return false;
        }

        return true;
    };
    const HandlerMailSend = async () => {
        try {
            const isValid = isValidInputField();
            if (isValid) {
                // Swal.fire({
                //     title: "Success",
                //     text: "Emails have been sent to the queue.",
                //     icon: "success"
                //   });
                const res = await bulkContactsEmailSend(editorData);
                if (res?.data?.success) {
                    Swal.fire({
                        title: "Success",
                        text: res.data.data?.total || 0 > 1 ? `Bulk Emails have been sent to the queue (${res.data.data?.total}).` : `Sending ${res.data.data?.total} email.`,
                        icon: "success"
                    });
                    setBulkMailSendModalOpen(false);
                } else {
                    Swal.fire({
                        title: "Success",
                        text: res.data.data?.total || 0 > 1 ? `Bulk Emails have been sent to the queue (${res.data.data?.total}).` : `Sending ${res.data.data?.total} email.`,
                        icon: "success"
                    });
                }

            } else {
                Swal.fire({
                    title: "Error!",
                    text: 'Please select valid field!',
                    icon: "error"
                });

            }

        } catch (error) {
            console.log(error);
            Swal.fire({
                title: "Error!",
                text: error?.response?.data?.message,
                icon: "error"
            });

        }

    };

    const onChangeSiteType = async (site) => {
        setEditorData({ ...editorData, site: site });
    };
    return (
        <Contentlayout>
            <div>
                <div>

                    <div className="my-4">
                        <p className="py-1 font-bold text-2xl pb-2">Bulk Custom Mail</p>
                        <div className="md:flex items-center gap-2">
                            <div className="w-full md:w-[100%]">
                                <label htmlFor="title" className="block text-sm mb-2 dark:text-white capitalize">  <p className="py-2 font-bold text-lg">Subject</p></label>
                                <div className="relative">
                                    <input type="text" name="subject" placeholder="Write subject" onChange={(e) => onChangeSubject(e.target.value)} value={editorData?.subject || ""}
                                        className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70"
                                        required />
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="my-4 w-full">
                        <p className="py-2 font-bold text-lg">Select Option</p>
                        <BulkContactOptionSelect selectedOption={editorData?.option} onChange={onChangeBulkContactOptionSelect} />
                    </div>

                    {matchCommaInput?.value == editorData?.option?.value && <div className="my-4 w-full">
                        <BulkContactEmailListsSelect value={editorData?.emailLists} setEditorData={setEditorData} placeholder={editorData?.option?.label} />
                    </div>}

                    <div>
                        <div>
                            <div className="mt-6">
                                <h2 className="text-[16px] capitalize font-bold">Site</h2>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className="flex ml-3">
                                {/* <div className="flex items-center me-4">
                                    <input id="all-radio" checked={editorData?.site == 'all'} type="radio" value="all" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                                        onChangeSiteType(e.target.value);
                                    }} />
                                    <label htmlFor="all-radio" className="ms-2 text-sm font-medium text-gray-900">All Sites</label>
                                </div> */}
                                <div className="flex items-center me-4">
                                    <input id="hammer-radio" checked={editorData?.site == 'hb'} type="radio" value="hb" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                                        onChangeSiteType(e.target.value);
                                    }} />
                                    <label htmlFor="hammer-radio" className="ms-2 text-sm font-medium text-gray-900">Hammer & Bell</label>
                                </div>

                                <div className="flex items-center me-4">
                                    <input checked={editorData?.site == 'auctropin'} id="auctropin-radio" type="radio" value="auctropin" name="inline-radio-group" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2" onChange={(e) => {
                                        onChangeSiteType(e.target.value);
                                    }} />
                                    <label htmlFor="auctropin-radio" className="ms-2 text-sm font-medium text-gray-900">Auctropin</label>
                                </div>
                            </div>

                        </div>

                    </div>
                    {editorData?.option?.value !== 'potential_customers_those_contacted' && <div className="my-4">
                        <p className="py-2 font-bold text-lg">Variables</p>
                        <div className="bg-white px-4 py-4">
                            {Object.keys(mailBulkContactState).map((contact) =>
                                Object.keys(mailBulkContactState[contact]).map((varKey, i) => {
                                    const contactData = mailBulkContactState[contact][varKey];

                                    if (contactData && contactData.varName) {
                                        const { varName, value } = contactData;

                                        return (
                                            <button
                                                key={`${contact}-${varKey}-${i}`}
                                                className="px-2 m-2 py-1 bg-gray-400 text-white rounded-md "
                                                onClick={() => onClickVariableMessage(varName)}
                                            >
                                                {varName}
                                            </button>
                                        );
                                    } else {
                                        // Handle the case where varName is null or undefined
                                        return null;
                                    }
                                })
                            )}
                        </div>
                    </div>}
                    <div className="my-4">
                        <p className="py-2 font-bold text-lg">Message</p>
                        {/* <textarea name="" onChange={(e) => onChangeInputMessage(e.target.value)} value={editorData?.message || ""} id="" className="w-full min-h-[300px]" cols="30" rows="3"></textarea> */}
                        <MessageInputBulkContact value={editorData?.message || ""} onChange={onChangeInputMessage} />
                    </div>

                    <div className="flex justify-end mt-10 mb-32 pr-8">
                        {isRequest ? <button
                            type="button"
                            className="inline-flex gap-1 justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"

                        >
                            <Loader bg="transparent" width={'w-5'} height={'h-5'} />
                        </button> : <button
                            type="button"
                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[100px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                            onClick={async () => {
                                if (isValidInputField()) {
                                    setBulkMailSendModalOpen(true);
                                }
                            }}
                        >
                            Mail Send
                        </button>}
                    </div>

                </div>
            </div>
            <BulkContactMailSendModal isOpen={bulkMailSendModalOpen} setIsOpen={setBulkMailSendModalOpen} Handler={HandlerMailSend} />
        </Contentlayout>
    );
};

export default contact;
