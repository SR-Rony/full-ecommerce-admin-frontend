import axios from 'axios';
import { isValidArray } from './func.js';
import { BaseV1, FileUploadCdnBaseV1 } from './proxy.js';
// console.log(BaseV1,'baseUrl');
// Create an Axios instance with default configuration
export const API = axios.create({
  baseURL: BaseV1,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to automatically attach the authorization token to requests
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Create a new Axios instance for multipart form data
export const APIFormDataCDN = axios.create({
  baseURL:FileUploadCdnBaseV1,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Add an interceptor to automatically attach the authorization token to requests
APIFormDataCDN.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Content-Type'] = 'multipart/form-data';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// Create a new Axios instance for multipart form data
export const APIFileRemoveCDN = axios.create({
  baseURL: FileUploadCdnBaseV1,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add an interceptor to automatically attach the authorization token to requests
APIFileRemoveCDN.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Content-Type'] = 'application/json';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Create a new Axios instance for multipart form data
export const APIFormDataChatUpload = axios.create({
  baseURL: BaseV1,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Add an interceptor to automatically attach the authorization token to requests
APIFormDataChatUpload.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Content-Type'] = 'multipart/form-data';
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export const handleLogoutLocalStorage = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      handleLogoutLocalStorage();
    }
    return Promise.reject(error);
  }
);

//forget password api
export const LoginApi = async _data => {
  const data = await API.post(`/admin/auth/login`, _data);
  return data;
};

//log out api
export const LogOutApi = async (userId) => {
  const data = await API.post(`/admin/auth/logout/${userId}`);
  return data;
};
//forget password api
export const ForgotPasswordApi = async _data => {
  const data = await API.post(`/admin/profile/forgot-password/send`, _data);
  return data;
};

//change password api
export const ChangePassword = async _data => {
  const data = await API.patch(`/admin/profile/change-password`, _data);
  return data;
};

//reset-password api
export const ResetPasswordVerifyApi = async _data => {
  const data = await API.patch(`/admin/profile/reset-password/verify`, _data);
  return data;
};
//otp-verify api
export const otpEmailVerifyApi = async _data => {
  const data = await API.patch(`/admin/profile/email-verify`, _data);
  return data;
};

//otp email update request send
export const otpEmailUpdateReqSendApi = async _data => {
  const data = await API.post(`/admin/profile/email-change-request/send`, _data);
  return data;
};

//update admin profile 
export const AdminProfileUpdate = async _data => {
  const data = await API.put(
    `/admin/profile`,
    _data
  );
  return data;
};
//get admin profile 
export const getAdminProfile = async () => {
  const data = await API.get(
    `/admin/profile`
  );
  return data;
};
//resend otp api
export const ResendEmailOtpApi = async _data => {
  const data = await API.post(
    `/admin/profile/resend-otp-request/send`,
    _data
  );
  return data;
};

//create app setting
export const createAppInfoSetting = async (_data) => {
  const data = await API.post(`/admin/setting/app-info`, _data);
  return data;
};
//get app setting
export const getAdminTicketStats = async () => {
  const data = await API.get(`/admin/tickets/stats`);
  return data;
};
//update app setting
export const updateAppInfoSetting = async (id, _data) => {
  const data = await API.put(`/admin/setting/app-info/${id}`, _data);
  return data;
};

//create shipping setting
export const createShippingSetting = async (_data) => {
  const data = await API.post(`admin/setting/shipping`, _data);
  return data;
};

//get shipping setting
export const getShippingSettings = async ({ site, q, sort, isActive, isFreeShipping, page, limit } = {}) => {
  const data = await API.get(`admin/setting/shipping?site=${site?.value || "all"}&q=${q ?? ""}&sort=${sort?.value || sort || 'latest'}&isActive=${isActive ?? ""}&isFreeShipping=${isFreeShipping ?? ""}&page=${page ?? 1}&limit=${limit ?? 10}`);
  return data;
};

//get search api
export const getShippingCountriesApi = async ({ isActive } = {}) => {
  const data = await API.get(`admin/setting/shipping/countries?isActive=${isActive ?? ""}`);
  return data;
};

//get search api
export const updateShippingCountriesApi = async (id, _data) => {
  const data = await API.put(`admin/setting/shipping/countries/${id}`, _data);
  return data;
};

//create search api
export const createShippingCountriesApi = async (_data) => {
  const data = await API.post(`admin/setting/shipping/countries`, _data);
  return data;
};

//update shipping setting
export const updateShippingSetting = async (id, _data) => {
  const data = await API.put(`/admin/setting/shipping/${id}`, _data);
  return data;
};
//delete shipping setting
export const deleteShippingSetting = async (id) => {
  const data = await API.delete(`admin/setting/shipping/${id}`);
  return data;
};

//get products
export const createProduct = async (_data) => {
  const url = `/admin/products`;
  const data = await API.post(url, _data);
  return data;
};
//get products
const undefinedAndZeroCheck = (value) => {
  if (!value) return "";
  return parseFloat(value) || "";
};
export const getProducts = async (_data = {}) => {
  const { page,type,featured,active,onlySearchGeneral, limit, products, isExcludeBundle, q,demand, site, sort, categories, isBundle,isProductIncludeSearch, isFeatured, isActive, startDate, endDate, minPrice, maxPrice, minRate, maxRate, isSoldOut } = _data;
  const url = `/admin/products?onlySearchGeneral=${onlySearchGeneral ?? ""}&type=${type||"All"}&active=${active||"All"}&featured=${featured||"All"}&isExcludeBundle=${isExcludeBundle ?? ""}&hasWarningFlag=${demand?.value??"all"}&site=${site?.value??"all"}&q=${q ? q : ""}&isSoldOut=${isSoldOut ?? ""}&isProductIncludeSearch=${isProductIncludeSearch??""}&isBundle=${isBundle ?? ""}&isFeatured=${isFeatured ?? ""}&isActive=${isActive ?? ""}&products=${products ? products : ""}&categories=${categories || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&minPrice=${undefinedAndZeroCheck(minPrice)}&maxPrice=${undefinedAndZeroCheck(maxPrice)}&minRate=${undefinedAndZeroCheck(minRate)}&maxRate=${undefinedAndZeroCheck(maxRate)}&sort=${sort?.value ?? "latest"}&page=${page ?? 1}&limit=${limit ?? 30}`;
  const data = await API.get(url);
  return data;
};

//get slug check
export const getProductsSlugCheck = async (slug) => {
  const url = `/admin/products/slug-check?slug=${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//get products
export const updateProduct = async ({ data, slug } = {}) => {
  const url = `/admin/products/${slug}`;
  const res = await API.put(url, data);
  return res;
};
//get products
export const deleteProduct = async (slug) => {
  const url = `/admin/products/${slug}`;
  const res = await API.delete(url);
  return res;
};

export const getSingleProductDetails = async (slug) => {
  const data = await API.get(`/admin/products/details/${slug}`);
  return data;
};

//get product Categories
export const getProductCategories = async () => {
  const url = `/admin/categories?limit=1000`;
  const data = await API.get(url);
  return data;
};

//get popup slug check
export const getPopupsSlugCheck = async (slug) => {
  const url = `/admin/modal-popups/slug-check?slug=${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//get popup Categories
export const getPopupCategories = async () => {
  const url = `/admin/categories?limit=1000`;
  const data = await API.get(url);
  return data;
};
//get popups
export const getPopups = async (_data = {}) => {
  const { page, limit, q, sort, categories, isActive, startDate, endDate } = _data;
  const url = `/admin/modal-popups?page=${page ?? 1}&limit=${limit ?? 30}&q=${q ?? ""}&isActive=${isActive ?? ""}&categories=${categories || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&sort=${sort?.value ?? "latest"}`;
  const data = await API.get(url);
  return data;
};

//create popup
export const createPopup = async (data) => {
  const url = `/admin/modal-popups`;
  const res = await API.post(url, data);
  return res;
};
//create popup
export const getPopupDetails = async () => {
  const url = `/admin/modal-popups/details`;
  const res = await API.get(url);
  return res;
};
export const popupDetailsUpdate = async (data) => {
  const url = `/admin/modal-popups`;
  const res = await API.post(url, data);
  return res;
};

//update popup
export const updatePopup = async ({ data, slug } = {}) => {
  const url = `/admin/modal-popups/${slug}`;
  const res = await API.put(url, data);
  return res;
};

//delete popup
export const deletePopup = async (slug) => {
  const url = `/admin/modal-popups/${slug}`;
  const res = await API.delete(url);
  return res;
};

export const getSinglePopupDetails = async (slug) => {
  const data = await API.get(`/admin/modal-popups/details/${slug}`);
  return data;
};

//orders apis
export const getOrders = async (_data) => {
  const source = { ..._data };
  source[_data?.selectedSearchInput?.value] = source?.q || "";
  if (source?.selectedSearchInput?.value) {
    source['q'] = "";
  }
  if (isValidArray(source?.trackingStatus)) {
    source['trackingStatus'] = source?.trackingStatus.map(item => (item?.value || item).replace("#", "")).filter(Boolean).toString();
  }
  if (typeof source?.orderIds == 'string' && source?.orderIds) {
    source.orderIds = source?.orderIds.toString().replace(/#/g, "");
  }

  const url = `/admin/orders?sort=${source?.sort ?? "updatedAt.desc"}&isTestOrder=${source?.isTestOrder??""}&site=${source?.site?.value || "all"}&customerId=${source?.customerId ?? ""}&q=${source?.q ?? ""}&trackingStatus=${source?.trackingStatus ?? ""}&trackingNumbers=${source?.trackingNumbers ?? ""}&orderIds=${source?.orderIds ? source?.orderIds : ""}&paymentStatus=${source?.paymentStatus ?? ""}&customerName=${source?.customerName ?? ""}&email=${source?.email ?? ""}&startDate=${source?.startDate ?? ""}&isPaymentCompleted=${source?.isPaymentCompleted ?? ""}&endDate=${source?.endDate ?? ""}&minPrice=${undefinedAndZeroCheck(source?.minPrice)}&maxPrice=${undefinedAndZeroCheck(source?.maxPrice)}&page=${source?.page || 1}&limit=${source?.limit || 20} `;

  const data = await API.get(url);
  return data;
};

export const getOrderCounts = async ({customerId,isTestOrder}={}) => {

  const url = `/admin/orders/counts?customerId=${customerId ?? ""}&isTestOrder=${isTestOrder??""}`;
  const data = await API.get(url);
  return data;
};
export const createOrderApi = async (order) => {
  const url = `/admin/orders/create-order`;
  const data = await API.post(url,order);
  return data;
};
export const editOrderApi = async (order) => {
  const url = `/admin/orders/edit-order`;
  const data = await API.put(url,order);
  return data;
};

export const changeCustomerPasswordApi = async (customerId,payload) => {
  const url = `/admin/customers/change-password/${customerId}`;
  const data = await API.post(url,payload);
  return data;
};

//get Order Status
export const orderStatusUpdate = async (_data) => {
  const url = `/admin/orders/bulk-update-status`;
  const data = await API.patch(url, _data);
  return data;
};
export const orderStatusSingleUpdate = async (_data) => {
  const url = `/admin/orders/update-status`;
  const data = await API.patch(url, _data);
  return data;
};
export const orderTestOrderUpdate = async (_data) => {
  const url = `/admin/orders/mark-as-test-order`;
  const data = await API.patch(url, _data);
  return data;
};
export const RemoveTestOrderOrder = async (orderId) => {
  const url = `/admin/orders/remove-test-order/${orderId}`;
  const data = await API.delete(url);
  return data;
};

export const BulkRemoveTestOrder = async (orderIds) => {
  const url = `/admin/orders/bulk-remove-test-order`;
  const data = await API.patch(url, {orderIds});
  return data;
};

export const EntireRemoveAllTestOrder = async () => {
  const url = `/admin/orders/entire-remove-test-order`;
  const data = await API.patch(url);
  return data;
};

export const orderCancelled = async (_data) => {
  const url = `/admin/orders/cancelled`;
  const data = await API.patch(url, _data);
  return data;
};
export const orderTrackNumberUpdate = async (_data) => {
  const url = `/admin/orders/tracking/update-number`;
  const data = await API.patch(url, _data);
  return data;
};
export const orderTrackNumberRemove = async (_data) => {
  const url = `/admin/orders/tracking/remove-number`;
  const data = await API.patch(url, _data);
  return data;
};

export const orderBulkTrackingUpdate = async (_data) => {
  const url = `/admin/orders/tracking/bulk-update-numbers`;
  const data = await API.patch(url, _data);
  return data;
};

export const orderCommentCreate = async (_data) => {
  const url = `/admin/orders/comments/add`;
  const data = await API.post(url, _data);
  return data;
};
export const getOrderDetails = async (orderId) => {
  const url = `/admin/orders/details/${orderId}`;
  const data = await API.get(url);
  return data;
};

export const orderResendMail = async (_data) => {
  const url = `/admin/orders/resend-mail`;
  const data = await API.patch(url, _data);
  return data;
};

//customers apis
export const getCustomersSearch = async (_data) => {
  const source = { ..._data };
  source[_data?.selectedSearchInput?.value] = source?.q || "";
  if (source?.selectedSearchInput?.value) {
    source['q'] = "";
  }
  
  const url = `/admin/customers?sort=${source?.sort ?? "latest"}&isAccountApproved=${source?.siteUserOption?.keys==="isAccountApproved" ? source?.siteUserOption?.value : ""}&site=${source?.site?.value || "all"}&customerIds=${source?.customerIds ?? ""}&isTestCustomer=${source?.isTestCustomer ?? false}&isBlocked=${source?.siteUserOption?.keys==="isBlocked" ? source?.siteUserOption?.value : ""}&isEmailVerified=${source?.siteUserOption?.keys==="isEmailVerified" ? source?.siteUserOption?.value : ""}&customerName=${source?.customerName ?? ""}&email=${source?.email ?? ""}&startDate=${source?.startDate ?? ""}&endDate=${source?.endDate ?? ""}&page=${source?.page || 1}&limit=${source?.limit || 20} `;

  const data = await API.get(url);
  return data;
};

export const getSearchCustomersSelect = async (_data) => {
  const source ={..._data};
  // console.log(JSON.stringify(source?.customerIds),"source?.customerIds");
  const url = `/admin/customers?customerName=${_data?.q||""}&sort=${"latest"}&customerIds=${source?.customerIds ?? ""}&isTestCustomer=${ false}&isBlocked=${false}&isEmailVerified=${true}&email=${source?.email ?? ""}&startDate=${source?.startDate ?? ""}&endDate=${source?.endDate ?? ""}&page=${source?.page || 1}&limit=${source?.limit || 20} `;

  const data = await API.get(url);
  return data;
};
export const getCustomers = async (_data) => {
  const source = { ..._data };
  source[_data?.selectedSearchInput?.value] = source?.q || "";
  if (source?.selectedSearchInput?.value) {
    source['q'] = "";
  }
  // console.log(source,'source');
  const url = `/admin/customers?sort=${source?.sort ?? "latest"}&isAccountApproved=${source?.siteUserOption?.keys==="isAccountApproved" ? source?.siteUserOption?.value : ""}&site=${source?.site?.value || "all"}&customerIds=${source?.customerIds ?? ""}&isTestCustomer=${source?.isTestCustomer ?? false}&isBlocked=${source?.siteUserOption?.keys==="isBlocked" ? source?.siteUserOption?.value : ""}&isEmailVerified=${source?.siteUserOption?.keys==="isEmailVerified" ? source?.siteUserOption?.value : ""}&customerName=${source?.customerName ?? ""}&email=${source?.email ?? ""}&startDate=${source?.startDate ?? ""}&endDate=${source?.endDate ?? ""}&page=${source?.page || 1}&limit=${source?.limit || 20} `;

  const data = await API.get(url);
  return data;
};
export const customerTestCustomerUpdate = async (_data) => {
  const url = `/admin/customers/mark-as-test-customer`;
  const data = await API.patch(url, _data);
  return data;
};
export const RemoveTestCustomerOrder = async (customerId) => {
  const url = `/admin/customers/remove-test-customer/${customerId}`;
  const data = await API.delete(url);
  return data;
};

export const BulkRemoveTestCustomer = async (customerIds) => {
  const url = `/admin/customers/bulk-remove-test-customer`;
  const data = await API.patch(url, {customerIds: customerIds});
  return data;
};

export const EntireRemoveAllTestCustomer = async () => {
  const url = `/admin/customers/entire-remove-test-customer`;
  const data = await API.patch(url);
  return data;
};

//customers  apis
export const getCustomersDashboard = async (_data) => {
  const url = `/admin/customers?sort=${_data?.sort ?? ""}&startDate=${_data?.startDate ?? ""}&endDate=${_data?.endDate ?? ""}&page=${_data.page ?? 1}&limit=${_data?.limit ?? 10} `;

  const data = await API.get(url);
  return data;
};

export const customersBulkBlocked = async (_data) => {
  const url = `/admin/customers/bulk-blocked-and-unblocked`;
  const data = await API.patch(url, _data);
  return data;
};
export const customersBulkActivated = async (_data) => {
  const url = `/admin/customers/bulk-account-approved-by-admin`;
  const data = await API.patch(url, _data);
  return data;
};
export const customersBulkEmailVerified = async (_data) => {
  const url = `/admin/customers/bulk-email-verified`;
  const data = await API.patch(url, _data);
  return data;
};
export const customersBlocked = async (_data) => {
  const url = `/admin/customers/blocked`;
  const data = await API.patch(url, _data);
  return data;
};
export const customersEmailVerified = async (_data) => {
  const url = `/admin/customers/email-verified`;
  const data = await API.patch(url, _data);
  return data;
};
export const customersActivated = async (_data) => {
  const url = `/admin/customers/account-approved-by-admin`;
  const data = await API.patch(url, _data);
  return data;
};

export const getCustomerProfile = async (customerId) => {
  const url = `/admin/customers/profile/${customerId}`;
  const data = await API.get(url);
  return data;
};

export const customerProfileUpdate = async (_data) => {
  const url = `/admin/customers/profile/update`;
  const data = await API.put(url, _data);
  return data;

};
export const customerShippingInfoUpdate = async (_data) => {
  const url = `/admin/customers/shipping-info/update`;
  const data = await API.put(url, _data);
  return data;

};

export const orderCustomMailSend = async (_data) => {
  const url = `/admin/orders/custom-mail`;
  const data = await API.post(url, _data);
  return data;
};

export const orderInvoiceGen = async (_data) => {
  const url = `/admin/orders/invoice-gen`;
  const data = await API.post(url, _data, { responseType: 'arraybuffer' });
  return data;
};

//faq get
export const getFaqs = async () => {
  const url = `/admin/faqs`;
  const data = await API.get(url);
  return data;
};
//faq create
export const createFaq = async (_data) => {
  const url = `/admin/faqs`;
  const data = await API.post(url, _data);
  return data;
};
//faq create
export const updateFaq = async (_id, _data) => {
  const url = `/admin/faqs/${_id}`;
  const data = await API.put(url, _data);
  return data;
};
export const deleteFaq = async (_id) => {
  const url = `/admin/faqs/${_id}`;
  const data = await API.delete(url);
  return data;
};
//faq slug check
export const getFaqSlugCheck = async (slug) => {
  const url = `/admin/faqs/slug-check?slug=${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//create page 
export const createPage = async (_data) => {
  const url = `/admin/pages`;
  const data = await API.post(url, _data);
  return data;
};

//update page 
export const updatePage = async (slug, _data) => {
  const url = `/admin/pages/${slug ?? ""}`;
  const data = await API.put(url, _data);
  return data;
};

//get page details page 
export const getPageDetailsPage = async (slug) => {
  const url = `/admin/pages/details/${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//get pages slug checker
export const getPageSlugCheck = async (slug) => {
  const url = `/admin/pages/slug-check?slug=${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//categories get
export const getCategories = async (query = {}) => {
  const { q, limit, page } = query;
  const url = `/admin/categories?q=${q ?? ""}&page=${page ?? 1}&limit=${limit ?? 30}&sort=latest`;
  const data = await API.get(url);
  return data;
};
export const transferToCategories = async (_data) => {
  const url = `/admin/categories/transfer`;
  const data = await API.post(url, _data);
  return data;
};
//categories create
export const createCategory = async (_data) => {
  const url = `/admin/categories`;
  const data = await API.post(url, _data);
  return data;
};
//categories create
export const updateCategory = async (slug, _data) => {
  const url = `/admin/categories/${slug}`;
  const data = await API.put(url, _data);
  return data;
};

//delete categories
export const deleteCategories = async (slug) => {
  const url = `/admin/categories/${slug}`;
  const data = await API.delete(url);
  return data;
};

//categories slug check
export const getCategoriesSlugCheck = async (slug) => {
  const url = `/admin/categories/slug-check?slug=${slug ?? ""}`;
  const data = await API.get(url);
  return data;
};

//get coupons
export const getCoupons = async (query = {}) => {
  const { q, filter, site, limit, sort, page } = query;
  const url = `/admin/coupons?site=${site?.value || "all"}&q=${q ?? ""}&filter=${filter ?? ""}&page=${page ?? 1}&limit=${limit ?? 20}&sort=${sort ? sort : "latest"}`;
  const data = await API.get(url);
  return data;
};

export const setDisplayCouponAPI = async (productId,couponCode) => {
  const url = `/admin/products/set-display-coupon`;
  const data = await API.post(url,{productId,couponCode});
  return data;
};

export const listOfCouponProducts = async (payload) => {
  const url = `/admin/coupons/list-of-products-has-multiple-coupons`;
  const data = await API.post(url,payload);
  return data;
};
// export const updateListOfCouponProducts = async (payload) => {
//   const url = `/admin/coupons/update-list-of-products-has-multiple-coupons`;
//   const data = await API.patch(url,payload);
//   return data;
// };
export const getCouponByCode = async (payload,force=false) => {
  const url = `/admin/coupons/get-coupon`;
  const data = await API.post(url,{...payload,force: force});
  return data;
};
//Coupons create
export const createCoupon = async (_data) => {
  const url = `/admin/coupons`;
  const data = await API.post(url, _data);
  return data;
};
//Coupons create
export const updateCoupon = async (id, _data) => {
  const url = `/admin/coupons/${id}`;
  const data = await API.put(url, _data);
  return data;
};

//delete Coupons
export const deleteCoupon = async (id) => {
  const url = `/admin/coupons/${id}`;
  const data = await API.delete(url);
  return data;
};

//bulk email send 
export const bulkContactsEmailSend = async (_data) => {
  const url = `/admin/bulk-contacts/mail-send`;
  const data = await API.post(url, _data);
  return data;
};

//get search api
export const getAddressSearchApi = async (value) => {
  const res = await axios({
    method: 'get',
    url: `https://api.tomtom.com/search/2/geocode/${value || ""}.json`,
    params: {
      key: process.env.NEXT_PUBLIC_ADDRESS_SEARCH_API_KEY,
      query: value || "",
      language: 'en-US',
      limit: 5,
    },
  });
  return res;
};

//create contact categories
export const getContactCategories = async (_data = {}) => {
  const { q, sort, page, limit } = _data;
  const url = `/admin/contact-categories?q=${q ?? ""}&sort=${sort || "latest"}&page=${page || 1}&limit=${limit || 10}`;
  const data = await API.get(url);
  return data;
};
//create contact categories
export const createContactCategories = async (_data) => {
  const url = `/admin/contact-categories`;
  const data = await API.post(url, _data);
  return data;
};

// update contact categories
export const updateContactCategories = async (id, _data) => {
  const url = `/admin/contact-categories/${id}`;
  const data = await API.put(url, _data);
  return data;
};

//delete contact categories
export const deleteContactCategories = async (id) => {
  const url = `/admin/contact-categories/${id}`;
  const data = await API.delete(url);
  return data;
};

//get notifications
export const getNotifications = async () => {
  const url = `/admin/notifications?limit=10`;
  const data = await API.get(url);
  return data;
};

export const markAsAllReadNotifications = async () => {
  const url = `/admin/notifications/mark-as-all-read`;
  const data = await API.post(url);
  return data;
};

//remove notifications
export const removeNotifications = async (id) => {
  const url = `/admin/notifications/${id}`;
  const data = await API.delete(url);
  return data;
};
//mark as single read notifications
export const markAsSingleReadNotifications = async (id) => {
  const url = `/admin/notifications/${id}`;
  const data = await API.patch(url);
  return data;
};

//Admins apis
export const getAdmins = async (_data) => {
  const source = { ..._data };
  source[_data?.selectedSearchInput?.value] = source?.q || "";
  if (source?.selectedSearchInput?.value) {
    source['q'] = "";
  }
  if (isValidArray(source?.isBlocked)) {
    source['isBlocked'] = source?.isBlocked.map(item => (item?.value || item));
  }

  const url = `/admin/users?sort=${source?.sort ?? "latest"}&adminIds=${source?.adminIds ?? ""}&isBlocked=${source?.isBlocked ?? ""}&isEmailVerified=${source?.isEmailVerified ?? ""}&adminName=${source?.adminName ?? ""}&email=${source?.email ?? ""}&startDate=${source?.startDate ?? ""}&endDate=${source?.endDate ?? ""}&isSuperAdmin=${source?.isSuperAdmin ?? ""}&page=${source?.page || 1}&limit=${source?.limit || 20} `;

  const data = await API.get(url);
  return data;
};

export const adminsBulkBlocked = async (_data) => {
  const url = `/admin/users/bulk-blocked`;
  const data = await API.patch(url, _data);
  return data;
};
export const adminsBulkActivated = async (_data) => {
  const url = `/admin/users/bulk-activated`;
  const data = await API.patch(url, _data);
  return data;
};
export const adminsBulkSuperAdminActivated = async (_data) => {
  const url = `/admin/users/super-admin/bulk-activated`;
  const data = await API.patch(url, _data);
  return data;
};
export const adminsBulkSuperAdminDeactivated = async (_data) => {
  const url = `/admin/users/super-admin/bulk-deactivated`;
  const data = await API.patch(url, _data);
  return data;
};
export const adminsBlocked = async (_data) => {
  const url = `/admin/users/blocked`;
  const data = await API.patch(url, _data);
  return data;
};
export const adminsActivated = async (_data) => {
  const url = `/admin/users/activated`;
  const data = await API.patch(url, _data);
  return data;
};

export const getAdminUserProfile = async (adminId) => {
  const url = `/admin/users/profile/${adminId}`;
  const data = await API.get(url);
  return data;
};

export const AdminProfileUserUpdate = async (_data) => {
  const url = `/admin/users/profile/update`;
  const data = await API.put(url, _.omit(_data, ['_id',"selectedRoles","selectedVendorSites"]));
  return data;

};
export const AdminProfileUserCreate = async (_data) => {
  const url = `/admin/users/create`;
  const data = await API.post(url, _.omit(_data, ['_id',"selectedRoles","selectedVendorSites"]));
  return data;

};

export const getAnalyticsGroupProducts = async ({ site, days = 6, startDate,productId, endDate } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `/admin/analytics/group-products?productId=${productId||""}&days=${days || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&timeZone=${timeZone}&site=${site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};

export const getAnalyticsVisitors = async ({ days = 6, startDate, endDate } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `/admin/analytics/visitors?days=${days || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&timeZone=${timeZone}`;
  const data = await API.get(url);
  // console.log(data,'visitors');
  return data;

};
export const getAnalyticsMostCategories = async ({ days = 6, startDate, endDate } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `/admin/analytics/most-categories?days=${days || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&timeZone=${timeZone}`;
  const data = await API.get(url);
  return data;

};
export const getAnalyticsMostKeywords = async ({ days = 6, startDate, endDate } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `/admin/analytics/most-keywords?days=${days || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&timeZone=${timeZone}`;
  const data = await API.get(url);
  return data;

};
export const getAnalyticsMostReferrals = async ({ days = 6, startDate, endDate } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const url = `/admin/analytics/most-referrals?days=${days || ""}&startDate=${startDate || ""}&endDate=${endDate || ""}&timeZone=${timeZone}`;
  const data = await API.get(url);
  return data;

};
export const getAnalyticDashboardGroupProducts = async ({ site, days, year, month,productId } = {}) => {
  const url = `/admin/analytics/dashboard/group-products?productId=${productId||""}&days=${days || ""}&year=${year || ""}&month=${month || ""}&site=${site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};

export const getAnalyticDashboardTopProductsStats = async (_data) => {
  const url = `/admin/analytics/dashboard/charts/top-stats?site=${_data?.site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};

export const customEmailBulkSend = async (_data) => {

  const url = `/admin/orders/bulk-mail-sender`;
  const data = await API.post(url, _data);
  return data;

};

// export const getFreeBuy = async (id) => {

//   const url = `/admin/claim-free-buy/details/${id}`;
//   const data = await API.get(url);
//   return data;

// };

export const getAllFreebies = async (query = {}) => {
  const url = `admin/claim-free-buy/all?site=${query?.site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};

export const createFreeBuy = async (_data) => {
  const url = `admin/claim-free-buy`;
  const data = await API.post(url, _data);
  return data;

};

export const updateFreeBuy = async (_data) => {

  const url = `admin/claim-free-buy/${_data._id}`;
  const data = await API.put(url, _data);
  return data;

};

//get stats 
export const getOrderState = async (_data) => {
  const url = `/admin/analytics/dashboard/stats?startDate=${_data?.startDate ?? ""}&endDate=${_data?.endDate ?? ""}&site=${_data?.site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};
export const getTop20Sales = async (_data) => {
  const url = `/admin/analytics/dashboard/top-20-sales?startDate=${_data?.startDate ?? ""}&endDate=${_data?.endDate ?? ""}&site=${_data?.site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};
export const getGroupProducts = async (_data) => {
  const url = `admin/analytics/dashboard/group-products?year=${_data?.year ?? ""}&month=${_data?.month ?? ""}&startDate=${_data?.startDate ?? ""}&endDate=${_data?.endDate ?? ""}&site=${_data?.site?.value || "all"}`;
  const data = await API.get(url);
  return data;

};

export const getMostUsedCoupons = async (_data) => {
  const url = `/admin/coupons/most-used-coupons?startDate=${_data?.startDate ?? ""}&endDate=${_data?.endDate ?? ""}&site=${_data?.site?.value||""}`;
  const data = await API.get(url);
  return data;
};

export const getOrderReviews = async (_data) => {
  console.log(_data);
  const url = `/admin/orders/reviews/${_data?.productId ?? ''}?rating=${_data?.rating ?? ""}&sort=${_data?.sort ?? "latest"}`;
  const data = await API.get(url);
  return data;
};
export const getOrderIdToReviews = async (_data) => {
  // console.log(_data);
  const url = `/admin/orders/reviews/${_data?.orderId ?? ''}?rating=${_data?.rating ?? ""}&sort=${_data?.sort ?? "latest"}`;
  const data = await API.post(url);
  return data;
};

//get live chat options
export const getLiveChatOptions = async (_data = {}) => {
  const { q, sort } = _data;
  const url = `/admin/live-chat-options?q=${q ?? ""}&sort=${sort || ""}`;
  const data = await API.get(url);
  return data;
};
//create live chat options
export const createLiveChatOptions = async (_data) => {
  const url = `/admin/live-chat-options`;
  const data = await API.post(url, _data);
  return data;
};

// update live chat options
export const updateLiveChatOptions = async (id, _data) => {
  const url = `/admin/live-chat-options/${id}`;
  const data = await API.put(url, _data);
  return data;
};

//delete live chat options
export const deleteLiveChatOptions = async (id) => {
  const url = `/admin/live-chat-options/${id}`;
  const data = await API.delete(url);
  return data;
};

//live chat route
export const createLiveChat = async (_data) => {
  const data = await API.post(`/admin/live-chats`, _data);
  return data;
};

//get notifications
export const getPresences = async () => {
  const url = `/admin/live-chats/presences`;
  const data = await API.get(url);
  return data;
};

// get live chat

export const getLiveChat = async ({ q = "", page = 1,site, issueType, limit = 10 }) => {
  const data = await API.get(`/admin/live-chats?q=${q || ""}&site=${site?.value || "all"}&issueType=${issueType || ""}&page=${page}&limit=${limit}`);
  return data;
};

//live chat message route
export const createLiveChatMessage = async (_data) => {
  const data = await API.post(`/admin/live-chats/messages`, _data);
  return data;
};

export const getConversationLiveChat = async ({ chatId, page = 1, limit = 10 }) => {
  if (!chatId) return "";
  const data = await API.get(`/admin/live-chats/messages/${chatId}?page=${page}&limit=${limit}`);
  return data;
};
export const messageConversationLiveChatUpdate = async (messageId, _data) => {
  const data = await API.put(`/admin/live-chats/messages/${messageId}`, _data);
  return data;
};
export const fileUpload = async (formData, isChat) => {
  const data = await APIFormDataChatUpload.post(isChat ? `/admin/upload/chat-files` : `/admin/upload/any-files`, formData);
  return data;
};

export const avgSalesProduct = async ({ site, type,productId, startDate, endDate } = {}) => {
  if (!(type && startDate && endDate)) {
    return;
  }
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const data = await API.get(`/admin/analytics/avg/sales/charts?timeZone=${timeZone}&productId=${productId||""}&site=${site?.value || "all"}&type=${type ?? ""}&startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`);
  return data;
};

export const getContactCustomers = async ({ q, startDate, contactCategoryId, site, endDate, page, limit } = {}) => {
  const data = await API.get(`/admin/contacts?q=${q || ""}&site=${site?.value || "all"}&contactCategoryId=${contactCategoryId ?? ""}&page=${page || 1}&limit=${limit || 20}&startDate=${startDate ?? ""}&endDate=${endDate ?? ""}`);
  return data;
};

export const getAnalyticsBundleMostClicksChart = async ({ type, site,productId, startDate, endDate }) => {
  if (!(type && startDate && endDate)) {
    return;
  }
  const data = await API.get(`/admin/analytics/most-clicks-products?productId=${productId??""}&type=${type ?? ""}&startDate=${startDate ?? ""}&endDate=${endDate ?? ""}&site=${site?.value||""}`);
  return data;
};

export const createLabTestedProduct = async (_data) => {
  const url = `/admin/lab-tested-products`;
  const data = await API.post(url, _data);
  return data;
};
export const getLabTestedProducts = async (_data = {}) => {
  const { q = "",sort, site = "", isActive, page = 1, limit = 20 } = _data;
  const url = `/admin/lab-tested-products?q=${q ?? ""}&sort=${typeof sort=='object'?sort?.value||"":sort||""}&site=${typeof site == 'object' ? site?.value || 'hb' : site || "hb"}&isActive=${isActive ?? ""}&page=${page ?? 1}&limit=${limit ?? 20}`;
  const data = await API.get(url);
  return data;
};
export const updateLabTestedProduct = async (id, _data) => {
  const url = `/admin/lab-tested-products/${id}`;
  const data = await API.put(url, _data);
  return data;
};
export const deleteLabTestedProduct = async (id) => {
  const url = `/admin/lab-tested-products/${id}`;
  const data = await API.delete(url);
  return data;
};

export const createCustomer = async (_data) => {
  const url = `admin/customers/profile/create`;
  const data = await API.post(url,_data);
  return data;
};
export const editCustomer = async (_data) => {
  const url = `admin/customers/profile/update`;
  const data = await API.put(url,_data);
  return data;
};

export const updateCustomer = async (_data) => {
  const url = `admin/customers/profile/update`;
  const data = await API.put(url,_data);
  return data;
};

export const getTotalSales = async ({ } = {}) => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  const data = await API.get(`/admin/analytics/total-sales/hb-vs-auctropin?timeZone=${timeZone||"UTC"}`);
  return data;
};

// Admin Ticket Management APIs
export const getAdminTickets = async (_data = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    search = "", // Changed from 'q' to 'search' to match backend expectation
    status = "", 
    priority = "", 
    sortBy = "createdAt", // Changed from 'sort' to 'sortBy' 
    sortOrder = "desc", // Added sortOrder parameter
    startDate = "",
    endDate = "",
    customerId = ""
  } = _data;
  
  const url = `/admin/tickets?page=${page}&limit=${limit}&search=${search}&status=${status}&priority=${priority}&sortBy=${sortBy}&sortOrder=${sortOrder}&startDate=${startDate}&endDate=${endDate}&customerId=${customerId}`;
  const data = await API.get(url);
  return data;
};

export const getAdminTicketDetails = async (ticketId, params = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    search = "", 
    fromDate = "", 
    toDate = "", 
    sender = "" 
  } = params;
  
  const url = `/admin/tickets/details/${ticketId}?page=${page}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}&sender=${sender}`;
  const data = await API.get(url);
  return data;
};

export const addAdminTicketMessage = async (ticketId, _data) => {
  const url = `/admin/tickets/${ticketId}/message`;
  const data = await API.post(url, _data);
  return data;
};

export const updateAdminTicketStatus = async (ticketId, _data) => {
  const url = `/admin/tickets/${ticketId}/update-status`;
  const data = await API.patch(url, _data);
  return data;
};

export const getAdminTicketByOrderAndTicketId = async (orderId, ticketId, params = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    search = "", 
    fromDate = "", 
    toDate = "", 
    sender = "" 
  } = params;
  
  const url = `/admin/tickets/by-order-ticket?orderId=${orderId}&ticketId=${ticketId}&page=${page}&limit=${limit}&search=${search}&fromDate=${fromDate}&toDate=${toDate}&sender=${sender}`;
  const data = await API.get(url);
  return data;
};

// Large Discount Products API
export const fetchLargeDiscountProducts = async (query = {}) => {
  const { site } = query;
  const url = `/admin/large-discount-products?site=${site?.value || 'all'}`;
  const data = await API.get(url);
  return data;
};

export const createLargeDiscountProduct = async (productData) => {
  const url = `/admin/large-discount-products`;
  const data = await API.post(url, productData);
  return data;
};

export const updateLargeDiscountProduct = async (productData) => {
  const url = `/admin/large-discount-products`;
  const data = await API.put(url, productData);
  return data;
};

export const removeLargeDiscountProducts = async (productIds) => {
  const url = `/admin/large-discount-products/remove-products`;
  const data = await API.put(url, { productIds });
  return data;
};

//get app setting
export const getAppInfoSetting = async () => {
  const data = await API.get(`/admin/setting/app-info/details`);
  return data;
};
