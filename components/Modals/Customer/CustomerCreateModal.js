import Switch from "@/components/Shared/Switch";
import Loader from "@/shared/Loader/Loader";
import PhoneNumberInput from "@/shared/Phone/Phone";
import { ToastEmitter } from "@/utils/Toast";
import { addressConcat, isValidEmail } from "@/utils/func";
import {
  createCustomer,
  getAddressSearchApi,
  getCustomers,
} from "@/utils/instance";
import { Dialog, Transition } from "@headlessui/react";
import _ from "lodash";
import { Fragment, useCallback, useMemo, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { isValidPhoneNumber, parsePhoneNumber } from "react-phone-number-input";
export default function CustomerCreateModal({
  isOpen,
  fetchData,
  setIsOpen,
  data,
  setData,
}) {
  const [isCreateRequest, setIsCreateRequest] = useState(false);
  const handleCreate = async () => {
    if (!data?.email) {
      return ToastEmitter("error", "Please enter a email!");
    }
    if (!isValidEmail(data?.email)) {
      return ToastEmitter("error", "Please enter a valid email!");
    }
    if (data?.fullPhoneNumber) {
      if (!isValidPhoneNumber(data?.fullPhoneNumber)) {
        return ToastEmitter("error", "Please write a valid phone number!");
      }

      const parsePhoneNum = parsePhoneNumber(data?.fullPhoneNumber);
      if (parsePhoneNum) {
        parsePhoneNum["dialingCode"] = parsePhoneNum.countryCallingCode;
        data["phone"] = parsePhoneNum;
      }
      if (!parsePhoneNum.number) {
        return ToastEmitter("error", "Please write a valid phone number!");
      }
    }

    if (!data?.password) {
      ToastEmitter("error", "Please enter a password!");
      return 0;
    }

    if (!data?.site) {
      ToastEmitter("error", "Please select a site!");
      return 0;
    }

    try {
      setIsCreateRequest(true);
      const res = await createCustomer(data);
      setIsCreateRequest(false);

      if (res?.data?.success) {
        ToastEmitter("success", res?.data?.message);
        setIsOpen(false);
        setData({});
        fetchData();
      } else {
        setIsCreateRequest(false);
        ToastEmitter("error", res?.data?.message);
      }
    } catch (error) {
      setIsCreateRequest(false);
      ToastEmitter("error", error.response?.data?.message || error?.message);
    }
  };
  const fetchCustomers = async (val = {}) => {
    try {
      if (!val?.email) {
        return ToastEmitter("error", "Please enter a email!");
      }
      if (!isValidEmail(val?.email)) {
        return ToastEmitter("error", "Please enter a valid email!");
      }
      const res = await getCustomers({ ...val });

      if (res?.data?.success) {
        if (res?.data?.data?.length) {
          return ToastEmitter("error", "Email already exists!");
        }
        // ToastEmitter('');
      }
    } catch (error) {
      console.log(error);
    }
  };
  const changeHandler = (key, val) => {
    if (val == "hb" || val == "auctropin") {
      setData({ ...data, site: val });
    } else {
      setData({ ...data, [key]: val });
    }
  };

  const onChangePhoneNumber = (value) => {
    setData((prev) => {
      return {
        ...prev,
        fullPhoneNumber: value,
      };
    });
  };

  const [sub, setSub] = useState(true);
  const [searchInputValue, setSearchValue] = useState("");
  const [searchAddressArr, setSearchAddressArr] = useState([]);

  useMemo(() => {
    if (typeof document !== "undefined") {
      document.title = "My Shipping Address | Hammer and Bell";
    }
  }, []);

  const formatAddressObject = (addr) => {
    return {
      city: addr.city || "",
      aptUnit: addr.aptUnit || "",
      state: addr.state || "",
      zipCode: addr.zipCode || "",
      streetName: addr.streetName || "",
      streetNumber: addr.streetNumber || "",
    };
  };

  const handleSaveShippingAddress = async () => {
    if (!Object.values(data).filter((e) => e).length) {
      ToastEmitter("error", "Address details can't be empty.");
      return 0;
    }
    setSub(true);
  };

  const fetchPublicShippingAddressApi = async (value) => {
    try {
      const res = await getAddressSearchApi(value);
      if (Array.isArray(res?.data?.results) && res.data.results.length) {
        const mappedData = res.data.results.map((entity) => {
          const {
            freeformAddress,
            address: {
              countrySubdivision,
              countrySubdivisionName,
              municipalitySubdivision,
              countrySecondarySubdivision,
              postalCode,
              zipCode,
              countryCode,
              municipality,
              streetNumber,
              streetName,
            },
          } = entity;

          const city = municipality || municipalitySubdivision || null;
          const state =
            countrySubdivision ||
            countrySubdivisionName ||
            countrySecondarySubdivision ||
            null;
          const zip = postalCode || zipCode || null;
          const country = {
            label: countryCode || null,
            value: countryCode || null,
          };

          return _.omitBy(
            {
              str: freeformAddress,
              streetNumber,
              streetName,
              aptUnit: entity.aptUnit || null,
              city,
              country,
              state,
              zipCode: zip,
            },
            _.isNil
          );
        });

        setSearchAddressArr(mappedData);
      }
    } catch (error) {
      setSearchAddressArr([]);
      // console.log(error)
      // ToastEmitter('error', error.response?.data?.message || error?.message)
    }
  };

  const onChange = (key, value) => {
    setData((prev) => {
      return {
        ...prev,
        ...formatAddressObject({
          ...prev,
          [key]: value,
        }),
      };
    });
  };

  const handleAddressSearch = async (value) => {
    await fetchPublicShippingAddressApi(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceFn = useCallback(_.debounce(handleAddressSearch, 1000), []);

  function handleChange(event) {
    setSearchValue(event.target.value);
    debounceFn(event.target.value);
  }

  const handleEmailSearch = async (value) => {
    await fetchCustomers(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceEmailFn = useCallback(_.debounce(handleEmailSearch, 1000), []);

  function handleEmailChange(event) {
    setData((prev) => {
      return {
        ...prev,
        email: event.target.value,
      };
    });
    debounceEmailFn({ email: event.target.value, site: { value: data?.site } });
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => { }}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-4xl transform overflow-y-auto  pb-4  lg:pb-6 rounded-2xl bg-white  p-4   lg:p-6 text-left align-middle shadow-xl transition-all rounded-md ">
                  <div className="flex item-center justify-between">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900 capitalize"
                    >
                      Customer Create
                    </Dialog.Title>
                    <button>
                      <IoIosCloseCircle
                        size={18}
                        onClick={() => setIsOpen(false)}
                      />
                    </button>
                  </div>
                  <div className="mt-4">
                    <p className="pb-1 font-bold">Select site*</p>
                    <div className=" border py-4 rounded-sm">
                      <div className="flex ml-3">
                        <div className="flex items-center">
                          <input
                            id="hammer-radio"
                            checked={data?.site == "hb"}
                            type="radio"
                            value="hb"
                            name="inline-radio-group"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                            onChange={(e) => {
                              changeHandler("site", e.target.value);
                            }}
                          />
                          <label
                            htmlFor="hammer-radio"
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            Hammer & Bell
                          </label>
                        </div>

                        <div className="flex items-center ml-4">
                          <input
                            checked={data?.site == "auctropin"}
                            id="auctropin-radio"
                            type="radio"
                            value="auctropin"
                            name="inline-radio-group"
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                            onChange={(e) => {
                              changeHandler("site", e.target.value);
                            }}
                          />
                          <label
                            htmlFor="auctropin-radio"
                            className="ms-2 text-sm font-medium text-gray-900"
                          >
                            Auctropin
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-1 pl-1">

<span className="font-bold">isTestCustomer</span>:
    <>
    <Switch
      keys="isTestCustomer"
      name=""
      checked={data?.isTestCustomer}
      onChange={(key, val) => {
        changeHandler(key,val);
      }}
    />
    </>
</div>
                  <div className="mt-4">
                    <p className="pb-1 font-bold">Personal Info</p>
                    <div className="border p-4 rounded-sm  ">
                      <div className="flex items-center   flex-col md:flex-row  gap-4">
                        <div className="w-full md:w-[50%]">
                          <label
                            htmlFor="FirstName"
                            className="block text-sm  dark:text-white capitalize "
                          >
                            First Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              onChange={(e) =>
                                changeHandler("firstName", e.target.value)
                              }
                              value={data?.firstName || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"
                              required
                            />
                          </div>
                        </div>
                        <div className="w-full md:w-[50%]">
                          <label
                            htmlFor="LastName"
                            className="block text-sm  dark:text-white capitalize "
                          >
                            Last Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              onChange={(e) =>
                                changeHandler("lastName", e.target.value)
                              }
                              value={data?.lastName || ""}
                              className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-[100%] mt-3">
                        <label
                          htmlFor="Email"
                          className="block text-sm  dark:text-white capitalize "
                        >
                          Email*
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            onChange={(e) => handleEmailChange(e)}
                            value={data?.email || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-3">
                        <div>
                          <p>Phone Number</p>
                          <p className="text-sm font-[400] text-red-600 my-0 py-0 italic">
                            *Optional, but highly recommended.
                          </p>
                        </div>
                        <PhoneNumberInput
                          phoneNum={data?.fullPhoneNumber || ""}
                          onChanges={onChangePhoneNumber}
                        />
                      </div>
                      <div className="w-full md:w-[100%] mt-3">
                        <label
                          htmlFor="Password"
                          className="block text-sm  dark:text-white capitalize "
                        >
                          Password*
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            onChange={(e) =>
                              changeHandler("password", e.target.value)
                            }
                            value={data?.password || ""}
                            className="py-2 px-3 block w-full border-gray-200 rounded-sm text-sm focus:border-primary focus:ring-primary dark:bg-bgdark dark:border-white/10 dark:text-white/70 placeholder-gray-300"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                
                  <div>
                    <div className="mt-4">
                    <p className="pb-1 font-bold">Shipping Info</p>
                      <div className="text-black bg-white rounded-md   px-4 space-y-2 border">
                    
                        {sub ? (
                          <div className=" my-6">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="md:w-7/12">
                                <label htmlFor="" className="uppercase font-bold text-xs">
                                  Address
                                </label>
                                <p className="text-[12px]">
                                  If your address is not shown in the dropdown
                                  or you need to modify it, just type it
                                  manually.
                                </p>
                                <div className="relative ">
                                  <input
                                    type="text"
                                    value={searchInputValue || ""}
                                    className="text-sm w-full border-black p-2 rounded-md my-2 border bg-[#F2F2F2]"
                                    placeholder="Type address"
                                    onChange={handleChange}
                                  />
                                  {Array.isArray(searchAddressArr) &&
                                    searchAddressArr?.length > 0 && (
                                      <div className="absolute py-2 px-4 bg-white w-full rounded-md border border-gray-400">
                                        {searchAddressArr.map((address, i) => (
                                          <p
                                            key={i}
                                            className="cursor-pointer py-2 border-b"
                                            onClick={() => {
                                              // setMyShippingAddress({
                                              //   ...myShippingAddress,
                                              //   ...address,
                                              // });
                                              console.log(
                                                "address object ",
                                                address
                                              );

                                              setSearchValue(
                                                addressConcat(address)
                                              );
                                              setSearchAddressArr([]);
                                              setData((prev) => {
                                                return {
                                                  ...prev,
                                                  ...formatAddressObject(
                                                    address
                                                  ),
                                                };
                                              });
                                            }}
                                          >
                                            {" "}
                                            {addressConcat(address)}{" "}
                                          </p>
                                        ))}
                                      </div>
                                    )}
                                </div>
                                <p className="text-xs">
                                  Cant find address?{" "}
                                  <button
                                    onClick={() => setSub(false)}
                                    className="font-semibold"
                                  >
                                    {" "}
                                    Click here to type it manually
                                  </button>
                                </p>{" "}
                              </div>

                              <div className="md:w-6/12">
                                <label htmlFor="" className="uppercase font-bold text-xs">
                                  APT OR UNIT NUMBER (Optional)
                                </label>
                                <p className="text-[12px] opacity-0 cursor-none">
                                  If your address is not shown in the dropdown
                                  or you need to modify it, just type it
                                  manually.
                                </p>
                                <input
                                  type="text"
                                  value={data?.aptUnit || ""}
                                  onChange={(e) =>
                                    onChange("aptUnit", e.target.value)
                                  }
                                    className="text-sm w-full border-black p-2 rounded-md my-2 border bg-[#F2F2F2]"
                                  placeholder="Type Apt or Unit Here"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <div className="grid md:grid-cols-2 gap-3 py-3">
                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs">City</p>
                                <input
                                  type="text"
                                  placeholder="City"
                                  defaultValue={data?.city || ""}
                                  className="w-full border  p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("city", e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs">State</p>
                                <input
                                  type="text"
                                  placeholder="State"
                                  defaultValue={data?.state || ""}
                                  className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("state", e.target.value)
                                  }
                                />
                              </div>

                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs">Zip Code</p>
                                <input
                                  type="text"
                                  placeholder="Zip"
                                  defaultValue={data?.zipCode || ""}
                                  className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("zipCode", e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs"> Street Number</p>
                                <input
                                  type="text"
                                  placeholder="Street Number"
                                  defaultValue={data?.streetNumber || ""}
                                  className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("streetNumber", e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs">Street Name</p>
                                <input
                                  type="text"
                                  placeholder="Street Name"
                                  defaultValue={data?.streetName || ""}
                                  className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("streetName", e.target.value)
                                  }
                                />
                              </div>
                              <div className="py-2">
                                <p className="py-1 uppercase font-bold text-xs">
                                  APT OR UNIT NUMBER (Optional)
                                </p>
                                <input
                                  type="text"
                                  placeholder="Type Apt or Unit Here"
                                  defaultValue={data?.aptUnit || ""}
                                  className="w-full border p-2 rounded-md text-sm border-gray-600 "
                                  name=""
                                  id=""
                                  onChange={(e) =>
                                    onChange("aptUnit", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="text-sm flex justify-end gap-3 ">
                              <button onClick={() => setSub(true)}>
                                CLOSE
                              </button>

                              <button
                                className="border px-3 py-2 border-gray-400 rounded-md"
                                onClick={async () => {
                                  await handleSaveShippingAddress();
                                }}
                              >
                                DONE
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                    {isCreateRequest ? (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500  w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize cursor-not-allowed"
                      >
                        <Loader bg="transparent" width={"w-5"} height={"h-5"} />
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-400 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 w-[80px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 capitalize"
                        onClick={async () => {
                          await handleCreate();
                        }}
                      >
                        Create
                      </button>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
