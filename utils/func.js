import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import _ from 'lodash';
import moment from 'moment';
import slugify from 'slugify';
import { ToastEmitter } from "./Toast";
import { APIFileRemoveCDN, APIFormDataCDN } from './instance';
import { socketURLAdminBackend } from './proxy';
export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export function isExpiredValid(iatTimestamp, expTimestamp) {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Convert current date to Unix timestamp in seconds
  return currentTimestamp >= iatTimestamp && currentTimestamp <= expTimestamp;
}
export function validateDates(currentDateStr, expireDateStr) {
  // Convert date strings to Date objects
  const currentDate = new Date(currentDateStr);
  const expireDate = new Date(expireDateStr);

  // Check if the current date is before the expiration date
  if (currentDate < expireDate) {
    return true;  // The item is still within the valid period.
  } else if (currentDate.toDateString() === expireDate.toDateString()) {
    return true;  // The item expires today.
  } else {
    return false;  // The item has expired.
  }
}
export const isValidArray = (array) => {

  if (Array.isArray(array) && array.length > 0) return true;
  return false;
};
export const logOut = () => {
  window.window.localStorage.removeItem('token');
  window.location.replace('/');
};

export function addressConcat(address) {
  if (address && typeof address === 'object') {
    // eslint-disable-next-line vars-on-top
    const formattedAddress = [
      address?.streetNumber? `${address?.streetNumber} `:'',
      address?.streetName || '',
      (address?.streetName && address?.city ? ', ' : ''),
      address?.city || '',
      (address?.city && address?.state ? ', ' : ''),
      address?.state || '',
      (address?.state && address?.zipCode ? ' ' : ''),
      address?.zipCode || ''
    ].filter(Boolean).join('');
    return formattedAddress;
  } else {
    return '';
  }
}

export const downloadTxtAddressFormatter = (address) => {
  // console.log(address,'formattedAddress');
  //   CustomerName
  // streetNumber, streetName
  // aptUnit, city, state, zipcode

  if (address && typeof address === 'object') {
    let text = "";
    if (address?.streetName || address?.streetNumber) {
      text += (([address.streetNumber?.toString().toUpperCase(), address.streetName?.toString().toUpperCase()].filter((e) => e.trim()).join(" ")).trim() + "\n");
    }
    if (address?.city || address?.state || address?.zipCode) {
      const stateAndZip = `${(address.state || "").toString().toUpperCase()} ${(address.zipCode || "").toString().toUpperCase()}`.trim();
      const texts = [(address.city || "").toString().toUpperCase(), stateAndZip].filter((e) => e.trim());
      if (texts.length) {
        text += texts.join(", ") + "\n";
      }
    }
    if (address?.aptUnit) {
      text += `APT/UNIT: ${address?.aptUnit?.toString().toUpperCase()}\n`;
    }
    return text;
  } else {
    return '';
  }
};
export const getFullCountryName = (Cname) => {
  if (!Cname) return "";
  let regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  regionNames.of(Cname);
  return regionNames;
};

export const firstNameGet = obj => {
  const keys = 'receiverName.firstName'.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }

  return value || '';
};

export const lastNameGet = obj => {
  const keys = 'receiverName.lastName'.split('.');
  let value = obj;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return '';
    }
  }

  return value || '';
};

export function ProductImageOutput(images, defaultImageUrl = "https://admin/upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg") {
  if (!(Array.isArray(images) && images?.length > 0)) return defaultImageUrl;
  const inputImageUrl = images.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))[0]?.imgUrl;

  // Regular expression to check if the input is a valid image URL
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

  if (imageUrlRegex.test(inputImageUrl)) {
    // If the input image URL is valid, return it
    return inputImageUrl;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}
export function FeaturedImageOutput(images, defaultImageUrl = "https://admin/upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg") {
  if (!(Array.isArray(images) && images?.length > 0)) return defaultImageUrl;
  const inputImageUrl = images.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))[0]?.imgUrl;

  // Regular expression to check if the input is a valid image URL
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

  if (imageUrlRegex.test(inputImageUrl)) {
    // If the input image URL is valid, return it
    return inputImageUrl;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}

export function nonNegativeOrZero(number) {
  if (number < 0) {
    return 0;
  } else {
    return number;
  }
}

export function ProfileAvatarOutput(image, defaultImageUrl = "https://i.ibb.co/TWWL8dc/6870c19d830dd8dddeb6a4e140e995af.jpg") {
  if (!image) return defaultImageUrl;
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

  if (imageUrlRegex.test(image)) {
    // If the input image URL is valid, return it
    return image;
  } else {
    // If the input image URL is invalid, return the default image URL
    return defaultImageUrl;
  }
}
export function ProfileAvatarDuplicateRemoveOutput(obj, defaultImageUrl = "https://i.ibb.co/TWWL8dc/6870c19d830dd8dddeb6a4e140e995af.jpg") {
  let items = [obj.createdByAdmin, obj.lastActionByAdmin].filter(Boolean);
  if (!(Array.isArray(items) && items?.length > 0)) return [];
  const inputImageUrl = _.uniqBy(items, (item) => item?._id);

  // Regular expression to check if the input is a valid image URL
  const imageUrlRegex = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;

  items = inputImageUrl.map((profile) => {
    if (imageUrlRegex.test(profile?.avatar) && profile) {
      // If the input image URL is valid, return it
      return profile;
    } else {
      // If the input image URL is invalid, return the default image URL
      return {
        ...profile,
        avatar: defaultImageUrl
      };
    }
  });
  return items;
}

export const getProductQuantity = (cartsArr, productId) => {

  if (!(Array.isArray(cartsArr) && cartsArr?.length)) return 1;
  const existingProduct = cartsArr.find(item => (item?.productId || item?._id) === productId);
  if (existingProduct) {
    return existingProduct.quantity;
  } else {
    return 1;
  }
};

export const getProductQuantityToTotalSaving = (myCarts, productCarts) => {
  if (!(Array.isArray(myCarts) && myCarts?.length)) return parseFloat(0).toFixed(2);
  const totalSaving = myCarts.reduce((prev, curr) => {
    const discount = parseFloat(curr?.price?.regular) *
      parseFloat(getProductQuantity(productCarts, curr?._id) || 0) - parseFloat(curr?.price?.sale) *
      parseFloat(getProductQuantity(productCarts, curr?._id) || 0);

    return prev + discount;
  }, 0);
  return parseFloat(totalSaving || 0).toFixed(2);
};
export const getTotalProductQuantityStorage = () => {

  if (typeof window !== 'undefined') {

    let cartItems = [];

    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }
    if (Array.isArray(cartItems) && cartItems?.length > 0) {
      // //console.log(cartItems,'storedCart')
      // eslint-disable-next-line vars-on-top
      var result = cartItems.reduce(function (acc, obj) {
        return acc + obj?.quantity;

      }, 0);
      return result;
    } else return 0;

  } else {
    return 0;
  }

};

export const isAlreadyCartExist = (arr, productId) => {

  if (!arr?.length) return false;
  const existingProduct = arr.find(item => {
    if (item.productId === productId && item.isAddToCartEnabled === true) {
      return true;
    } else {
      return false;
    }
  });
  if (existingProduct) {
    return true;
  } else {
    return false;
  }

};

export const ProductAddToCartProductStorage = (productId, quantity, notify = true) => {
  try {
    if (!productId) {
      if (notify) {
        return ToastEmitter('error', 'Invalid input. Please provide a valid product ID.');
      }
      return;
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const existingProductIndex = cartItems.findIndex(item => item.productId === productId);

    if (existingProductIndex !== -1) {
      // If the product is found in the cart, update its state
      cartItems[existingProductIndex].quantity = quantity;
    } else {
      // If the product is not found in the cart, add a new item
      cartItems.push({ productId, quantity });
    }

    window.localStorage.setItem('cart', JSON.stringify(cartItems));

    if (notify) {
      return ToastEmitter('success', 'Product added to cart successfully.');
    }

  } catch (error) {
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.');
    }

  }

};

export const ProductRemoveFromCartProductStorage = (productId, notify = true) => {
  try {
    if (!productId) {
      if (notify) return ToastEmitter('error', 'Invalid input. Please provide a valid product');
      return;
    }

    let cartItems = [];
    const storedCart = window.localStorage.getItem('cart');

    if (storedCart) {
      try {
        cartItems = JSON.parse(storedCart);
      } catch (error) {
        window.localStorage.removeItem('cart');
      }
    }

    const updatedCart = cartItems.filter(item => item.productId !== productId);

    window.localStorage.setItem('cart', JSON.stringify(updatedCart));
    if (notify) {
      return ToastEmitter('success', 'Product removed from cart successfully.');
    }

  } catch (error) {
    // //console.log(error)
    if (notify) {
      return ToastEmitter('error', 'Failed to update cart. Please try again.');
    }

  }
};

export function freeShippingCheck(
  subTotalPrice,
  freeShippingCost,
  shippingCost) {
  if (parseFloat(subTotalPrice) >= parseFloat(freeShippingCost)) {
    return {
      isFreeShipping: true,
      shippingCost: 0,
      message: '"Congratulations! You qualify for free shipping."'
    };
  } else {
    // Calculate total amount by adding shipping cost to subtotal
    return {
      isFreeShipping: false,
      shippingCost: shippingCost,
      message: `Unfortunately, free shipping is not applicable. A shipping cost of $${shippingCost} will be added. Your total amount is ${shippingCost}`,
    };
  }
}
export const SumTotalProductPrice = (myCarts, cartsArr) => {
  // //console.log(myCarts,cartsArr,'local storage')
  if (Array.isArray(myCarts) && myCarts?.length > 0) {
    // eslint-disable-next-line vars-on-top
    var result = myCarts.reduce(function (acc, obj) {
      return parseFloat(acc) + obj?.price?.sale * (getProductQuantity(cartsArr, obj?._id));

    }, 0);
    return parseFloat(result).toFixed(2);
  } else return parseFloat(0).toFixed(2);

};

//copy text
export function copyToClipboard(text) {
  if (!text) return "";
  if (typeof document !== 'undefined') {
    // eslint-disable-next-line vars-on-top
    var textArea = document.createElement("textarea");
    textArea.value = text.trim();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    ToastEmitter('success', 'Copy to clipboard');
    return true;
  } else {
    ToastEmitter('error', 'Copy to clipboard failed! please try again');
    return false;
  }
}

export function numberWithCommas(number) {
  // Check if the input is a valid number
  if (isNaN(number) || number === null || number === undefined) {
    return 0;
  }

  // Convert the number to string and add commas
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function generateTextToWordArray(text) {
  if (!text) return "";
  // Define a regex pattern to match words and special characters (excluding spaces)
  const pattern = /[a-zA-Z0-9]+|[^,\s]/g;

  // Use the pattern to split the text into an array of words and special characters
  const wordArray = text.match(pattern);

  // Return the generated array
  return wordArray;
}

export const getWordArrayToText = (text) => {
  if (!text) return "";
  if (Array.isArray(text) && text) return text.toString();
  return text.toString();
};

export const uploadToCDN = async (files, setProductData) => {
  try {
    const uploadedImages = [];

    // Upload each file to Cloudinary
    for (const file of files) {

      const data = new FormData();
      data.append("file", file);
      const res = await APIFormDataCDN.post(`/upload?access_token=${process.env.NEXT_PUBLIC_FILE_UPLOAD_CDN_ACCESS_TOKEN}`, data);
      if (res?.data?.success) {
        const img = { imgUrl: res?.data?.data?.url, isFeatured: true };
        if (setProductData) {
          setProductData((prev) => {
            return {
              ...prev,
              images: _.uniqBy([Array.isArray(prev?.images) && prev?.images?.length > 0 ? [img, ...prev?.images] : [img]], "imgUrl").flat(Infinity)
            };
          });
        }
      }
      console.log(res?.data?.data?.url, 'res?.data?.data?.url upload cdn');
      uploadedImages.push(res?.data?.data?.url);
    }

    // Return the array of uploaded image URLs
    return uploadedImages;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error.message);

  }
};
export const uploadToCDNsingleFile = async (file) => {
  try {
    const data = new FormData();
    data.append("file", file);
    const res = await APIFormDataCDN.post(`/upload?access_token=${process.env.NEXT_PUBLIC_FILE_UPLOAD_CDN_ACCESS_TOKEN}`, data);
    return res?.data?.data?.url;
  } catch (error) {
    console.error('Error uploading to upload:', error.message);

  }
};
export const uploadFileRemove = async (file) => {
  try {
    // filename
    console.log(file.split('/'));
    const lastItem = file.split('/')[file.split('/').length - 1];
    if (!lastItem) return { success: false, message: "File not founds" };
    const res = await APIFileRemoveCDN.post(`/file/remove?access_token=${process.env.NEXT_PUBLIC_FILE_UPLOAD_CDN_ACCESS_TOKEN}`, { filename: lastItem });
    return res?.data;
  } catch (error) {
    console.log('Error uploading to remove:', error.message);
    // Throw the err throw error;
  }
};

export const genSlug = (text) => {
  if (!text) return "";
  return slugify(text.toString(), {
    replacement: '-',  // replace spaces with replacement character, defaults to `-`
    remove: undefined, // remove characters that match regex, defaults to `undefined`
    lower: true,      // convert to lower case, defaults to `false`
    strict: false,     // strip special characters except replacement, defaults to `false`
    locale: 'vi',      // language code of the locale to use
    trim: true         // trim leading and trailing replacement chars, defaults to `true`
  });
};

export function removeDuplicateEmptyValues(url) {
  // Split the URL into base and query string
  const [baseUrl, queryString] = url.split('?');

  // Split the query string into individual key-value pairs
  const queryParams = queryString.split('&');

  // Create an object to store unique values for each key
  const uniqueParams = {};

  // Iterate through each key-value pair
  for (const param of queryParams) {
    // Split the key and value
    const [key, value] = param.split('=');
    uniqueParams[key] = value;

  }

  // Construct the new query string
  const newQueryString = Object.keys(uniqueParams)
    .map(key => key + (uniqueParams[key] ? '=' + uniqueParams[key] : ''))
    .join('&');

  // Reconstruct the final URL
  const newUrl = baseUrl + (newQueryString ? '?' + newQueryString : '');

  return newUrl;
}

export const lastCommaAdd = (arr, i) => {
  if (!isValidArray(arr)) return "";
  return i < arr.length - 1 ? ", " : "";
};

export const CDNupload = async (files) => {
  try {
    const data = new FormData();
    data.append("file", files[0]);

    const res = await APIFormDataCDN.post(`/upload?access_token=${process.env.NEXT_PUBLIC_FILE_UPLOAD_CDN_ACCESS_TOKEN}`, data);
    if (res?.data?.success) {
      return res?.data?.data?.url;
    }
  } catch (error) {
    return "";
  }
};

export function getTimeRemaining(coupon) {
  if (coupon && coupon.expiry) {
    const expiryDate = moment(coupon.expiry);
    const now = moment();

    if (expiryDate.isAfter(now)) {
      return expiryDate.endOf('day').fromNow();
    } else {
      return 'Coupon has expired';
    }
  } else {
    return 'No expiry';
  }
}
export function getTimeRemainingIsExpired(coupon) {
  if (coupon?.isActive === false) {
    return true;
  }
  if (coupon && coupon.expiry) {
    const expiryDate = moment(coupon.expiry);
    const now = moment();
    if (expiryDate.isAfter(now) && (!coupon?.quantity || coupon?.quantity > coupon?.totalUses)) {
      return false;
    } else {
      return true;
    }
  } else if (!coupon?.quantity || coupon?.quantity > coupon?.totalUses) {
    return false;
  } else {
    return true;
  }
}

// Function to group data by month
export function DailySalesGroupDataToByMonth(startDate, endDate, data) {
  try {

    if (!(data?.groupProducts?.length > 0)) {
      return [];
    }

    let monthlyGroup = _.groupBy(data?.groupProducts, item => {
      const date = new Date(item?._id); // Assuming _id contains the daily date
      return `${date.getFullYear()}-${(date.getMonth() + 1)}`; // Group by year-month
    });

    if (!Object.keys(monthlyGroup).length) return [];

    const monthlyGroupArr = Object.entries(monthlyGroup).map(([date, dailyData]) => {
      const monthlyData = dailyData.reduce((acc, curr) => {
        // Flatten the array of arrays and ensure unique products
        curr.topSalesProducts.forEach(product => {
          const existingProductIndex = acc.topSalesProducts.findIndex(p => p.product._id === product.product._id);
          if (existingProductIndex === -1) {
            acc.topSalesProducts.push(product);
          } else {
            // If the product already exists, update its quantity and sales amount
            acc.topSalesProducts[existingProductIndex].productQuantity += product.productQuantity;
            acc.topSalesProducts[existingProductIndex].productSalesAmount += product.productSalesAmount;

            if (product?.bundleSales?.bundleSalesQuantity) {
              acc.topSalesProducts[existingProductIndex].bundleSales = {
                bundleSalesQuantity: (acc?.topSalesProducts[existingProductIndex]?.bundleSales?.bundleSalesQuantity || 0) + (product.bundleSales.bundleSalesQuantity || 0),
                bundleSalesAmount: (acc?.topSalesProducts[existingProductIndex]?.bundleSales?.bundleSalesAmount || 0) + (product.bundleSales.bundleSalesAmount || 0),
              };
            }

          }
        });
        acc.totalQuantity += curr.totalQuantity;
        acc.totalSalesAmount += curr.totalSalesAmount;

        return acc;
      }, { topSalesProducts: [], totalQuantity: 0, totalSalesAmount: 0 });

      return {
        _id: date, // Monthly date
        topSalesProducts: monthlyData.topSalesProducts.flat(Infinity), // Flatten the array of arrays
        totalQuantity: monthlyData.totalQuantity,
        totalSalesAmount: monthlyData.totalSalesAmount,

      };
    });

    const charts = generateChartDataSales(monthlyGroupArr, startDate, endDate);
    return {
      charts: charts.charts,
      monthlyGroup: monthlyGroupArr
    };
  } catch (error) {
    console.log(error);
    return {
      data: []
    };
  }

}
export function DailyViewedGroupDataToByMonth(startDate, endDate, data) {
  try {

    if (!(data?.groupProducts?.length > 0)) {
      return [];
    }

    let monthlyGroup = _.groupBy(data?.groupProducts, item => {
      const date = new Date(item?._id); // Assuming _id contains the daily date
      return `${date.getFullYear()}-${(date.getMonth() + 1)}`; // Group by year-month
    });

    if (!Object.keys(monthlyGroup).length) return [];

    const monthlyGroupArr = Object.entries(monthlyGroup).map(([date, dailyData]) => {
      const monthlyData = dailyData.reduce((acc, curr) => {
        // Flatten the array of arrays and ensure unique products
        curr.topViewedProducts.forEach(product => {
          const existingProductIndex = acc.topViewedProducts.findIndex(p => p.product?._id === product.product?._id);
          if (existingProductIndex === -1) {
            acc.topViewedProducts.push(product);
          } else {
            acc.topViewedProducts[existingProductIndex].productView += product.productView;
          }
        });
        acc.totalView += curr.totalView;
        return acc;
      }, { topViewedProducts: [], totalView: 0 });

      return {
        _id: date, // Monthly date
        topViewedProducts: monthlyData.topViewedProducts.flat(Infinity), // Flatten the array of arrays
        totalView: monthlyData.totalView,

      };
    });
    ;

    const charts = generateChartDataViewed(monthlyGroupArr, startDate, endDate);
    return {
      charts: charts?.charts,
      monthlyGroup: monthlyGroupArr
    };
  } catch (error) {
    console.log(error);
    return {
      data: []
    };
  }
}

function generateChartDataSales(data, startDate, endDate) {
  // Initialize arrays for labels and data
  const labels = [];
  const salesData = [];

  // Iterate over each month within the range
  for (let currentDate = moment(startDate); currentDate.isSameOrBefore(endDate, 'month'); currentDate.add(1, 'month')) {
    const currentMonth = currentDate.format('MMMM'); // Get full month name
    const currentMonthData = data.find(item => moment(item._id).isSame(currentDate, 'month'));

    // Add current month to labels array
    labels.push(currentMonth);

    // If data exists for the current month, add it to the sales data; otherwise, set it to 0
    if (currentMonthData) {
      salesData.push(currentMonthData.totalSalesAmount.toFixed(2)); // Assuming totalSalesAmount is a float
    } else {
      salesData.push("0.00");
    }
  }

  // Return formatted chart data
  return {
    charts: {
      labels: labels,
      datasets: [{
        name: "Monthly Sales",
        data: salesData
      }]
    }
  };
}
function generateChartDataViewed(data, startDate, endDate) {
  // Initialize arrays for labels and data
  const labels = [];
  const salesData = [];

  // Iterate over each month within the range
  for (let currentDate = moment(startDate); currentDate.isSameOrBefore(endDate, 'month'); currentDate.add(1, 'month')) {
    const currentMonth = currentDate.format('MMMM'); // Get full month name
    const currentMonthData = data.find(item => moment(item._id).isSame(currentDate, 'month'));

    // Add current month to labels array
    labels.push(currentMonth);

    // If data exists for the current month, add it to the sales data; otherwise, set it to 0
    if (currentMonthData) {
      salesData.push(currentMonthData.totalView.toFixed(2)); // Assuming totalSalesAmount is a float
    } else {
      salesData.push("0.00");
    }
  }

  // Return formatted chart data
  return {
    charts: {
      labels: labels,
      datasets: [{
        name: "Monthly Viewed",
        data: salesData
      }]
    }
  };
}

export function formatCurrency(cents) {
  cents = parseFloat(cents); // Convert to number if it's a string
  if (isNaN(cents)) return "$0.00"; // Handle cases where cents is not a number

  return "$" + cents.toFixed(2);
}

export function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

export const convertSlugToTitle = (slug) => {
  // Check if the slug is empty or undefined
  if (!slug) return 'Home'; // Default title

  // Split the slug into words separated by hyphens
  const words = slug.split('-');

  // Capitalize the first letter of each word
  const capitalizedWords = words.map(word => {
    // Check if the word is empty or consists of only hyphens
    if (!word.replace(/-/g, '')) return ''; // Skip empty word
    return word.charAt(0).toUpperCase() + word.slice(1);
  });

  // Join the words back together with spaces
  return capitalizedWords.join(' ');
};

export const downloadZip = async (files) => {
  if (!isValidArray(files)) return '';

  const zip = new JSZip();
  const promises = files.map(async file => {
    try {
      console.log(viewFileSrc(file.url));
      const response = await fetch(viewFileSrc(file.url));
      const blob = await response.blob();
      zip.file(file.name, blob);
    } catch (error) {

    }
  });

  // Wait for all promises to resolve
  await Promise.all(promises);

  // Generate the ZIP file and trigger download
  zip.generateAsync({ type: 'blob' }).then(content => {
    saveAs(content, 'files.zip');
  });
};

export function downloadFile(url, filename) {
  if (!url) return;
  // Fetch the file
  fetch(viewFileSrc(url))
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch file');
      }
      return response.blob();
    })
    .then(blob => {
      // Save the file using file-saver
      saveAs(blob, filename);
    })
    .catch(error => {
      console.log(viewFileSrc(url));
      console.error('Error downloading file:', error);
    });
}

export const viewFileSrc = (file) => {
  if (!file) return "";
  return file.startsWith('uploads/') ? `${socketURLAdminBackend}/${file}` : file;

};

const getScreenWidth = () => {
  if (typeof window !== 'undefined') {

    return window.innerWidth;
  }
};
export function sliceTextForTitle(text) {

  const maxLength = getScreenWidth() <= 768 ? 15 : 40;
  // console.log(maxLength);
  // Check if the text length exceeds the maximum length
  if (text.length <= maxLength) {
    // If not, return the original text
    return text;
  } else {
    // If it does, slice the text to the maximum length
    let slicedText = text.slice(0, maxLength);

    // Find the last space in the sliced text
    let lastSpaceIndex = slicedText.lastIndexOf(" ");

    // Slice the text again to ensure it ends on a word boundary
    slicedText = slicedText.slice(0, lastSpaceIndex);

    // Add ellipsis to indicate truncation
    return slicedText + "...";
  }
}

export const getProductIncludeData = (arr, site) => {

  // console.log(arr,'ar')
  return isValidArray(arr) ? arr.filter(item => item?.product?.site == site) : [];
};

export const productDataBySumRegular = (productData, site) => {
  if (!isValidArray(productData)) return 0;

  return productData
    .filter(item => item.selectIncludeProduct.site && item.selectIncludeProduct.site === site&&item?.selectIncludeProduct?.value) // Ensure product exists and site matches
    .reduce((acc, curr) => acc + ((parseFloat(curr.selectIncludeProduct?.price?.regular) || 0) * parseInt(curr.quantity) || 1), 0);
};

export const productDataBySumSale = (productData, site) => {
  if (!isValidArray(productData)) return 0;
  return productData
    .filter(item => item.selectIncludeProduct.site && item.selectIncludeProduct.site === site&&item?.selectIncludeProduct?.value) // Ensure product exists and site matches
    .reduce((acc, curr) => acc + ((parseFloat(curr.selectIncludeProduct?.price?.sale) || 0) * parseInt(curr.quantity) || 1), 0);
};
