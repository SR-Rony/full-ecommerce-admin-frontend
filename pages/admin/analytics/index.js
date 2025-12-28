import Contentlayout from "@/shared/layout-components/layout/content-layout";

import Seo from "@/shared/layout-components/seo/seo";

import CountriesVisitingComponent from "@/components/Analytics/CountriesVisitingComponent";

import AnalyticsGroupProducts from "@/components/Analytics/AnalyticsGroupProducts";
import AnalyticsTopSaleProducts from "@/components/Analytics/AnalyticsTopSaleProducts";
import AnalyticsTopViewProducts from "@/components/Analytics/AnalyticsTopViewProducts";
import AnalyticViewGroupProducts from "@/components/Analytics/AnalyticsViewGroupProducts";
import BundleAnalytics from "@/components/Analytics/BundleAnalytics";
import BundleTwoBarChart from "@/components/Analytics/BundleTwoBarChart";
import DailySalesChart from "@/components/Analytics/DailySalesChart";
import DailyViewedChart from "@/components/Analytics/DailyViewedChart";
import DevoiceVisitingChart from "@/components/Analytics/DevoiceVisitingChart";
import EmptyTableSection from "@/components/EmptyDataSection/EmptyTableSection";
import EmptyTableSectionTwo from "@/components/EmptyDataSection/EmptyTableSectionTwo";
import ProductSearchDropdown from "@/components/Products/ProductSearchDropdown";
import OrderSiteStatus from "@/components/Shared/OrderSiteStatus";
import SavingBundlePieChart from "@/components/advancedAnalythics/TopProductsChart";
import useIntersectionObserver from "@/hooks/useInspectionObserver";
import CountryFlag from "@/shared/Country/CountryFlag";
import Loader from "@/shared/Loader/Loader";
import { ToastEmitter } from "@/utils/Toast";
import {
  DailySalesGroupDataToByMonth,
  DailyViewedGroupDataToByMonth,
  getTimeRemaining,
  getTimeRemainingIsExpired,
  isValidArray,
} from "@/utils/func";
import {
  avgSalesProduct,
  getAnalyticsBundleMostClicksChart,
  getAnalyticsGroupProducts,
  getAnalyticsMostCategories,
  getAnalyticsMostKeywords,
  getAnalyticsMostReferrals,
  getAnalyticsVisitors,
  getMostUsedCoupons
} from "@/utils/instance";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { FaRegFlag } from "react-icons/fa";
import { GrBundle, GrView } from "react-icons/gr";
import { ImEye } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuView } from "react-icons/lu";
import { MdOutlineOpenInNew } from "react-icons/md";
import { PiShareFill } from "react-icons/pi";
import {
  RiCoupon4Line,
  RiLineChartLine,
  RiOpenSourceLine,
  RiProductHuntLine,
} from "react-icons/ri";

const Analytics = () => {
  const [updateData, setUpdateData] = useState({});
  const [frequency,setFrequency]=useState("weekly");
  const [query, setQuery] = useState({
    site: { label: "All Sites", value: "" },
    startDate: moment().subtract(6, "days").startOf("day").format("YYYY-MM-DD"),
    endDate: moment().endOf("day").format("YYYY-MM-DD"),
    isDailySales: true,
    isDailyViewed: true,
  });
  const [activeRange, setActiveRange] = useState("Last 7 Days");
  const [mostCoupon, setMostCoupon] = useState({});

  const [viewGroupMenuOpen, setViewGroupMenuOpen] = useState(true);
  const [topViewMenuOpen, setTopViewMenuOpen] = useState(true);
  const [topSalesMenuOpen, setTopSalesMenuOpen] = useState(true);
  const [salesGroupMenuOpen, setSalesGroupMenuOpen] = useState(true);
  const [groupSaleTabOpen, setGroupSaleTabOpen] = useState({
    index: 0,
    isOpen: true,
  });
  const [groupViewTabOpen, setGroupViewTabOpen] = useState({
    index: 0,
    isOpen: true,
  });
  const [avgType, setAvgType] = useState("day");
  const [avgSales, setAvgSales] = useState({});
  const [avgSaleReq, setAvgSaleReq] = useState(false);
  const [open, setOpen] = useState(true);
  const CountriesVisiting = useRef(null);
  const TrafficSources = useRef(null);
  const RefererSources = useRef(null);
  const MostUsedCoupons = useRef(null);
  const SalesViewRef = useRef(null);
  const AverageOrdersChart = useRef(null);
  const TopPurchasedProducts = useRef(null);
  const TopViewedProducts = useRef(null);
  const MostSearchedKeywords = useRef(null);
  const MostClickedOnCategories = useRef(null);
  const BundleProductsSavingsAnalytics = useRef(null);
  const [topProductsDateType, setTopProductsDateType] = useState("day");
  const [savingsAnalytics, setSavingsAnalytics] = useState({});
  const [savingBundleChartReq, setSavingBundleChartReq] = useState(false);
  const [isMostUsedCouponReq, setIsMostUsedCouponReq] = useState(false);

  const [groupProducts, setGroupProducts] = useState({});
  const [isGroupProductsReq, setIsGroupProductsReq] = useState(false);

  const [visitors, setVisitors] = useState({});
  const [isVisitorsReq, setIsVisitorsReq] = useState(false);

  const [isMostCategoriesReq, setIsMostCategoriesReq] = useState(false);
  const [mostCategories, setMostCategories] = useState({});

  const [isMostKeywordsReq, setMostKeywordsReq] = useState(false);
  const [mostKeywords, setMostKeywords] = useState({});

  const [isMostReferralsReq, setMostReferralsReq] = useState(false);
  const [mostReferrals, setMostReferrals] = useState({});

  const boxRefsArray = [
    CountriesVisiting,
    RefererSources,
    MostUsedCoupons,
    BundleProductsSavingsAnalytics,
    AverageOrdersChart,
    SalesViewRef,
    MostSearchedKeywords,
    MostClickedOnCategories,
  ];

  const [CountriesVisitingIncept, setCountriesVisitingIncept] = useState(false);
  const [RefererSourcesIncept, setRefererSourcesIncept] = useState(false);
  const [MostUsedCouponsIncept, setMostUsedCouponsIncept] = useState(false);
  const [
    BundleProductsSavingsAnalyticsIncept,
    setBundleProductsSavingsAnalyticsIncept,
  ] = useState(false);
  const [AverageOrdersChartIncept, setAverageOrdersChartIncept] =
    useState(false);
  const [SalesViewRefIncept, setSalesViewRefIncept] = useState(false);
  const [MostSearchedKeywordsIncept, setMostSearchedKeywordsIncept] =
    useState(false);
  const [MostClickedOnCategoriesIncept, setMostClickedOnCategoriesIncept] =
    useState(false);

  const boxRefs = useRef(boxRefsArray);

  const boxIntersection = useIntersectionObserver(boxRefs);

  useEffect(() => {

    switch (boxIntersection.target) {
      case CountriesVisiting.current:
        if (!CountriesVisitingIncept) {
          fetchAnalyticsVisitors();
          console.log('fetchAnalyticsVisitors');
        }
        setCountriesVisitingIncept(true);
        break;

      case RefererSources.current:
        if (!RefererSourcesIncept) {
          console.log('fetchAnalyticsMostReferrals');
          fetchAnalyticsMostReferrals();
        }
        setRefererSourcesIncept(true);
        break;

      case MostUsedCoupons.current:
        if (!MostUsedCouponsIncept) {
          console.log('fetchUsedCoupons');
          fetchUsedCoupons();
        }
        setMostUsedCouponsIncept(true);
        break;

      case BundleProductsSavingsAnalytics.current:
        if (!BundleProductsSavingsAnalyticsIncept) {
          console.log('fetchAnalyticsBundleMostClicksChart');
          fetchAnalyticsBundleMostClicksChart();
        }
        setBundleProductsSavingsAnalyticsIncept(true);

        break;

      case AverageOrdersChart.current:
        if (!AverageOrdersChartIncept) {
          console.log('fetchAvgSales');
          fetchAvgSales();
        }
        setAverageOrdersChartIncept(true);
        break;
      case SalesViewRef.current:
        if (!SalesViewRefIncept) {
          console.log('fetchAnalyticsGroupProducts');
          fetchAnalyticsGroupProducts();
        }
        setSalesViewRefIncept(true);
        break;

      case MostSearchedKeywords.current:
        if (!MostSearchedKeywordsIncept) {
          console.log('fetchAnalyticsMostKeywords');
          fetchAnalyticsMostKeywords();
        }

        setMostSearchedKeywordsIncept(true);
        break;

      case MostClickedOnCategories.current:
        if (!MostClickedOnCategoriesIncept) {
          console.log('fetchAnalyticsMostCategories');
          fetchAnalyticsMostCategories();
        }
        setMostClickedOnCategoriesIncept(true);
        break;
      default:
        break;
    }

    // console.log(boxIntersection.target);

  }, [boxIntersection.target]);

  const handleReCalculate = () => { };
  const router = useRouter();
  const fetchAnalyticsBundleMostClicksChart = async (val = {}) => {
    try {
      setSavingBundleChartReq(true);
      const response = await getAnalyticsBundleMostClicksChart({
        type: topProductsDateType,
        ...query,
        ...val
      });
      const { data } = response?.data || {};
      setSavingBundleChartReq(false);
      setSavingsAnalytics(data);
    } catch (error) {
      setSavingBundleChartReq(false);
      console.error("Error fetching data:", error);
    }
  };

  const fetchAnalyticsVisitors = async (filter) => {
    try {
      setIsVisitorsReq(true);
      const res = await getAnalyticsVisitors({ days: 6, ...query, ...filter });
      setIsVisitorsReq(false);
      if (res.data.success) {
        setVisitors(res.data.data);
      }
    } catch (error) {
      ToastEmitter("error", error?.response?.data?.message);
      setIsVisitorsReq(false);
      /* empty */
    }
  };
  const fetchAnalyticsMostCategories = async (filter) => {
    try {
      setIsMostCategoriesReq(true);
      const res = await getAnalyticsMostCategories({
        days: 6,
        ...query,
        ...filter,
      });
      setIsMostCategoriesReq(false);
      if (res.data.success) {
        setMostCategories(res.data.data);
      }
    } catch (error) {
      ToastEmitter("error", error?.response?.data?.message);
      setIsMostCategoriesReq(false);
      /* empty */
    }
  };
  const fetchAnalyticsMostKeywords = async (filter) => {
    try {
      setMostKeywordsReq(true);
      const res = await getAnalyticsMostKeywords({
        days: 6,
        ...query,
        ...filter,
      });
      setMostKeywordsReq(false);
      if (res.data.success) {
        setMostKeywords(res.data.data);
      }
    } catch (error) {
      ToastEmitter("error", error?.response?.data?.message);
      setMostKeywordsReq(false);
      /* empty */
    }
  };

  const fetchAnalyticsMostReferrals = async (filter) => {
    try {
      setMostReferralsReq(true);
      const res = await getAnalyticsMostReferrals({
        days: 6,
        ...query,
        ...filter,
      });
      setMostReferralsReq(false);
      if (res.data.success) {
        setMostReferrals(res.data.data);
      }
    } catch (error) {
      ToastEmitter("error", error?.response?.data?.message);
      setMostReferralsReq(false);
      /* empty */
    }
  };

  const fetchAnalyticsGroupProducts = async (filter) => {
    try {
      setIsGroupProductsReq(true);

      const res = await getAnalyticsGroupProducts({
        days: 6,
        ...query,
        ...filter,
      });
      setIsGroupProductsReq(false);
      if (res.data.success) {
        res.data.data.topSales["groupMonthlySalesProducts"] =
          DailySalesGroupDataToByMonth(
            query?.startDate,
            query?.endDate,
            res?.data?.data?.topSales
          );
        res.data.data.topViewed["groupMonthlyViewedProducts"] =
          DailyViewedGroupDataToByMonth(
            query?.startDate,
            query?.endDate,
            res?.data?.data?.topViewed
          );
        setGroupProducts(res.data.data);
      }
    } catch (error) {
      ToastEmitter("error", error?.response?.data?.message);
      setIsGroupProductsReq(false);
      /* empty */
    }
  };

  const fetchUsedCoupons = async (data = {}) => {
    try {
      setIsMostUsedCouponReq(true);
      const res = await getMostUsedCoupons({ ...query, ...data });
      if (res.data.success) {
        setMostCoupon(res?.data?.data);
      }
      setIsMostUsedCouponReq(false);
    } catch (error) {
      setIsMostUsedCouponReq(false);
      console.log(error);
    }
  };

  const handleFetchDateRangeAnalytics = () => {
    if (query.startDate && query.endDate) {
      fetchAnalyticsGroupProducts();
    } else {
      return ToastEmitter("error", "Please select valid date range!");
    }
  };

  const handleFetchAvgChart = (type) => {
    setAvgType(type);
    fetchAvgSales({ type: type });
  };
  const handleAnalytics = () => {
    router.push(process.env.ANALYTICS_Redirect_URL || "");
  };

  const buttonOptions = [
    "Today",
    "Last 7 Days",
    "Current Month",
    "Current Week",
    "Last Month",
    "Last Week",
    "Last 2 Months",
    "Last 3 Months",
  ];

  const inceptResetAll = () => {
    setCountriesVisitingIncept(false);
    setRefererSourcesIncept(false);
    setRefererSourcesIncept(false);
    setMostUsedCouponsIncept(false);
    setBundleProductsSavingsAnalyticsIncept(false);
    setAverageOrdersChartIncept(false);
    setSalesViewRefIncept(false);
    setMostSearchedKeywordsIncept(false);
    setMostClickedOnCategoriesIncept(false);
  };
  const handleDateRangeChange = async (startDate, endDate, query = {}) => {
    fetchAnalyticsVisitors({ startDate, endDate, ...query });
    switch (boxIntersection.target) {

      case RefererSources.current:
      
        fetchAnalyticsMostReferrals({ startDate, endDate, ...query });
        inceptResetAll();
        setRefererSourcesIncept(true);
        break;

      case MostUsedCoupons.current:
        fetchUsedCoupons({ startDate, endDate, ...query });
        inceptResetAll();
        setMostUsedCouponsIncept(true);
        break;

      case BundleProductsSavingsAnalytics.current:
        fetchAnalyticsBundleMostClicksChart({ startDate, endDate, ...query });
        inceptResetAll();
        setBundleProductsSavingsAnalyticsIncept(true);

        break;

      case AverageOrdersChart.current:
        fetchAvgSales({ startDate, endDate, ...query });
        inceptResetAll();
        setAverageOrdersChartIncept(true);
        break;
      case SalesViewRef.current:
        fetchAnalyticsGroupProducts({ startDate, endDate, ...query });
        inceptResetAll();
        setSalesViewRefIncept(true);
        break;

      case MostSearchedKeywords.current:
        fetchAnalyticsMostKeywords({ startDate, endDate, ...query });
        inceptResetAll();
        setMostSearchedKeywordsIncept(true);
        break;

      case MostClickedOnCategories.current:
        fetchAnalyticsMostCategories({ startDate, endDate, ...query });
        inceptResetAll();
        setMostClickedOnCategoriesIncept(true);
        break;
      default:
        break;
    }
  };
  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      switch (boxIntersection.target) {
        case CountriesVisiting.current:
        
          fetchAnalyticsVisitors({ site });
          inceptResetAll();
          setCountriesVisitingIncept({ site });
          break;

        case RefererSources.current:
          fetchAnalyticsMostReferrals({ site });
          inceptResetAll();
          setRefererSourcesIncept(true);
          break;

        case MostUsedCoupons.current:
          fetchUsedCoupons({ site });
          inceptResetAll();
          setMostUsedCouponsIncept(true);
          break;

        case BundleProductsSavingsAnalytics.current:
          fetchAnalyticsBundleMostClicksChart({ site });
          inceptResetAll();
          setBundleProductsSavingsAnalyticsIncept(true);

          break;

        case AverageOrdersChart.current:
          fetchAvgSales({ site });
          inceptResetAll();
          setAverageOrdersChartIncept(true);
          break;
        case SalesViewRef.current:
          fetchAnalyticsGroupProducts({ site });
          inceptResetAll();
          setSalesViewRefIncept(true);
          break;

        case MostSearchedKeywords.current:
          fetchAnalyticsMostKeywords({ site });
          inceptResetAll();
          setMostSearchedKeywordsIncept(true);
          break;

        case MostClickedOnCategories.current:
          fetchAnalyticsMostCategories({ site });
          inceptResetAll();
          setMostClickedOnCategoriesIncept(true);
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };
  const calculateDateRange = async (option) => {
    setActiveRange(option);
    let startDate = "";
    let endDate = "";
    let frequency = ""; // Variable to hold frequency
  
    switch (option) {
      case "Today":
        startDate = moment().startOf("day").format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        frequency = "daily"; // Set frequency to daily
        break;
      case "Last 7 Days":
        startDate = moment()
          .subtract(6, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        frequency = "weekly"; // Set frequency to weekly
        break;
      case "Last Month":
        startDate = moment()
          .subtract(1, "month")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        frequency = "monthly"; // Set frequency to monthly
        break;
      case "Last 2 Months":
        startDate = moment()
          .subtract(2, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        frequency = "monthly"; // Set frequency to monthly
        break;
      case "Last 3 Months":
        startDate = moment()
          .subtract(3, "months")
          .startOf("month")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "month")
          .endOf("month")
          .format("YYYY-MM-DD");
        frequency = "monthly"; // Set frequency to monthly
        break;
      case "Last Week":
        startDate = moment()
          .subtract(1, "week")
          .startOf("isoWeek")
          .format("YYYY-MM-DD");
        endDate = moment()
          .subtract(1, "week")
          .endOf("isoWeek")
          .format("YYYY-MM-DD");
        frequency = "weekly"; // Set frequency to weekly
        break;
      case "Current Week":
        startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
        endDate = moment().endOf("isoWeek").format("YYYY-MM-DD");
        frequency = "weekly"; // Set frequency to weekly
        break;
      case "Current Month":
        startDate = moment().startOf("month").format("YYYY-MM-DD");
        endDate = moment().endOf("month").format("YYYY-MM-DD");
        frequency = "monthly"; // Set frequency to monthly
        break;
      case "Weekly":
        startDate = moment().startOf("week").format("YYYY-MM-DD");
        endDate = moment().endOf("week").format("YYYY-MM-DD");
        frequency = "weekly"; // Set frequency to weekly
        break;
      case "Monthly":
        startDate = moment().startOf("month").format("YYYY-MM-DD");
        endDate = moment().endOf("month").format("YYYY-MM-DD");
        frequency = "monthly"; // Set frequency to monthly
        break;
      case "Yearly":
        startDate = moment().startOf("year").format("YYYY-MM-DD");
        endDate = moment().endOf("year").format("YYYY-MM-DD");
        frequency = "yearly"; // Set frequency to yearly
        break;
      default:
        startDate = moment()
          .subtract(6, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        frequency = "weekly"; // Default to weekly
    }
  
    // Now set the frequency in the state (assuming `setFrequency` is a function to set it)
    setFrequency(frequency);
  
    console.log(`Start Date: ${startDate}, End Date: ${endDate}, Frequency: ${frequency}`);
    return { startDate, endDate, frequency };
  };

  const handleReset = async () => {
    setActiveRange("Last 7 Days");
    const startDate = moment()
      .subtract(6, "days")
      .startOf("day")
      .format("YYYY-MM-DD");
    const endDate = moment().endOf("day").format("YYYY-MM-DD");
    setQuery({ startDate, endDate, site: { label: "All Sites", value: "" },productSearchDropdown:[],productId:'' });
    await handleDateRangeChange(startDate, endDate,{productId:""});
  };

  const fetchAvgSales = async (param = {}) => {
    try {
      setAvgSaleReq(true);
      const res = await avgSalesProduct({ type: avgType, ...query, ...param });
      setAvgSaleReq(false);
      if (res.data.success) {
        setAvgSales(res?.data?.data);
      }
    } catch (error) {
      setAvgSaleReq(false);
      console.log(error);
    }
  };

  const handleScrollRef = (scroll) => {
    if (!scroll?.current) return;
    const element = scroll.current;

    // Get the current top position of the element relative to the document
    const rect = element.getBoundingClientRect();
    const elementTop = rect.top + window.pageYOffset;

    // Calculate the desired scroll position
    const desiredScrollPosition = elementTop - 100;

    // Smoothly scroll to the calculated position
    window.scrollTo({
      top: desiredScrollPosition,
      behavior: "smooth",
    });
  };

  const onChangeProductSearch = (value) => {

    setQuery((prev) => {
      return {
        ...prev,
        productSearchDropdown: value,
        productId: value?.value
      };
    });
    handleDateRangeChange(query?.startDate,query?.endDate,{ productId: value?.value || "" });
    // fetchAnalyticsGroupProducts({productId:value?.value||""});
    // fetchAvgSales({productId:value?.value||""});
    // fetchAnalyticsBundleMostClicksChart({productId:value?.value||""});
  };
  
  return (
    <div>
      <Contentlayout>
        <div className="relative">
          <div>
            <Seo title={"Analytics | H&B"} />
            {/* <PageHeader currentpage="Analytics Dashboard" activepage="Home" mainpage="Analytics Dashboard" /> */}
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-850 rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                      📊 Analytics Dashboard
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights and performance metrics</p>
                  </div>
                  <button 
                    onClick={() => handleAnalytics()}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <RiLineChartLine size={20} />
                    <span>View Full Analytics</span>
                  </button>
                </div>
              </div>

              {/* Product Search */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <label className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold mb-3">
                  <span className="text-lg">🔍</span>
                  Search Products
                </label>
                <ProductSearchDropdown onChange={onChangeProductSearch} productSearchDropdown={query?.productSearchDropdown} />
              </div>

              {/* Filters Section */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Date Range Filters */}
                <div className="lg:col-span-3">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                    <h2 className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg mb-4">
                      <span className="text-xl">📅</span>
                      Filter Analytics
                    </h2>
                    <div className="flex items-center gap-3 flex-wrap">
                      {buttonOptions.map((option, index) => (
                        <div
                          key={index}
                          className="flex"
                          onClick={() => {
                            calculateDateRange(option);
                          }}
                        >
                          <input
                            type="radio"
                            id={`buttonOption_${index}`}
                            name="date-range"
                            value={option}
                            className="mr-2 hidden"
                          />
                          <label
                            htmlFor={`buttonOption_${index}`}
                            className={`cursor-pointer px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-300 border-2 ${
                              option == activeRange
                                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent shadow-lg scale-105"
                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                            }`}
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Range & Actions */}
                <div className="lg:col-span-2">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 h-full">
                    <h2 className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-lg mb-4">
                      <span className="text-xl">⏰</span>
                      Custom Range
                    </h2>
                    
                    {/* Date Inputs */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">From Date</label>
                        <input
                          className="w-full bg-transparent border-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none"
                          min={moment()
                            .subtract(6, "months")
                            .format("YYYY-MM-DD")}
                          value={query?.startDate || ""}
                          type="Date"
                          onChange={(e) => {
                            setQuery((prev) => {
                              return {
                                ...prev,
                                startDate: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 block mb-1">To Date</label>
                        <input
                          className="w-full bg-transparent border-none text-sm font-medium text-gray-900 dark:text-white focus:outline-none"
                          max={moment().format("YYYY-MM-DD")}
                          value={query?.endDate}
                          type="Date"
                          onChange={(e) => {
                            setQuery((prev) => {
                              return {
                                ...prev,
                                endDate: e.target.value,
                              };
                            });
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="flex-shrink-0">
                        <OrderSiteStatus
                          align={"left"}
                          data={updateData}
                          setData={setUpdateData}
                          query={query}
                          onChanges={onChangeSiteType}
                        />
                      </div>
                      <button
                        onClick={async () => {
                          handleReset();
                        }}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg transition-colors duration-200"
                      >
                        Reset
                      </button>
                      <button
                        onClick={async () => {
                          handleFetchDateRangeAnalytics();
                        }}
                        disabled={isGroupProductsReq}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isGroupProductsReq ? (
                          <>
                            <Loader bg="transparent" width={"w-4 h-4"} />
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>✓</span>
                            <span>Apply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
            <div className="grid grid-cols-12 gap-x-6 mt-8" ref={CountriesVisiting}>
              {!query?.productId && <div className="col-span-12">
                <div className="grid grid-cols-12 gap-x-6">
                  <div className="col-span-12 lg:col-span-8">
                    <div className="box">
                      <div className="box-body bg-white h-full xxl:h-[426px]">
                        <h2 className="box-title">
                          Countries Visiting Most Frequently
                        </h2>
                        {!isVisitorsReq && (
                          <>
                            {isValidArray(visitors?.country?.labels) ? (
                              <CountriesVisitingComponent
                                data={visitors?.country}
                              />
                            ) : (
                              !isVisitorsReq && (
                                <div className="lg:w-9/12 mx-auto">
                                  <EmptyTableSection />
                                </div>
                              )
                            )}
                          </>
                        )}
                        {isVisitorsReq && (
                          <p className="text-center h-[340px] pt-[30px] flex justify-center">
                            <Loader bg="transparent" />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-12 lg:col-span-4">
                    <div className="box">
                      <div className="box-header">
                        <div className="flex justify-between">
                          <h5 className="box-title my-auto">
                            Visitors By Countries
                          </h5>
                        </div>
                      </div>
                      <div className="box-body h-full xxl:h-[378px] overflow-auto">
                        {!isVisitorsReq && (
                          <ul className="flex flex-col vistors-list">
                            {isValidArray(visitors?.country?.countries) ? (
                              visitors?.country?.countries.map((country, i) => (
                                <li
                                  className="p-0 my-0 ti-list-group border-0 text-gray-800"
                                  key={i}
                                >
                                  <div className="w-full">
                                    <div className="flex items-center">
                                      <div className="avatar avatar-xs rounded-sm flex-none text-black">
                                        <CountryFlag
                                          country={{
                                            ...country,
                                            label: country,
                                          }}
                                        />
                                      </div>
                                      <div className="ltr:ml-3 rtl:mr-3 flex-auto">
                                        <span className="text-sm">
                                          {country.country}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="badge rounded-sm bg-gray-100 text-gray-500 dark:bg-black/20 dark:text-white">
                                          {country.view}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))
                            ) : (
                              <EmptyTableSection />
                            )}
                          </ul>
                        )}

                        {isVisitorsReq && (
                          <p className="text-center h-[340px] pt-[30px] flex justify-center">
                            <Loader bg="transparent" />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>}
            </div>
            <div ref={TrafficSources}></div>
            {!query?.productId && <div className="grid grid-cols-12 gap-x-6 my-4">
              <div className="col-span-12 xxl:col-span-8  overflow-auto bg-white">
                <div className="h-full xxl:h-[350px]">
                  <div className="box-header">
                    <div className="flex">
                      <h5 className="box-title my-auto">Traffic Sources</h5>
                    </div>
                  </div>
                  <div className="box-body p-0">
                    <div className="overflow-auto">
                      <table className="ti-custom-table ti-custom-table-head">
                        <thead>
                          <tr>
                            <th scope="col">Browser</th>
                            <th scope="col">Sessions</th>
                            <th scope="col">Traffic</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!isVisitorsReq &&
                            isValidArray(visitors?.country?.browsers) &&
                            visitors?.country?.browsers.map((browser, i) => (
                              <tr key={i}>
                                <td className="">
                                  <div className="flex items-center gap-2">
                                    <div className="">
                                      <img
                                        src={
                                          "/browsers/" +
                                          browser?.browserCode +
                                          ".png"
                                        }
                                        className="avatar avatar-xs rounded-sm bg-primary/20 text-primary flex justify-center items-center"
                                      ></img>
                                    </div>
                                    <p className="my-0">{browser?.browser}</p>
                                  </div>
                                </td>
                                <td className="flex items-center">
                                  {browser?.session}
                                  <i className="ri-arrow-up-s-fill ltr:ml-2 rtl:mr-2 text-base text-success my-auto"></i>
                                </td>
                                <td className="">
                                  <div className="ti-main-progress h-2 bg-gray-200 dark:bg-black/20">
                                    <div
                                      className="ti-main-progress-bar bg-primary text-xs text-white text-center"
                                      role="progressbar"
                                      style={{ width: browser?.traffic + "%" }}
                                      aria-valuenow="80"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    {!isVisitorsReq &&
                      !isValidArray(visitors?.country?.browsers) && (
                        <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                          <EmptyTableSectionTwo />
                        </div>
                      )}

                    {isVisitorsReq && (
                      <p className="text-center h-[340px] pt-[30px] flex justify-center">
                        <Loader bg="transparent" />
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-12 xxl:col-span-4">
                <div className="box">
                  <div className="box-header">
                    <div className="flex justify-between">
                      <h5 className="box-title my-auto">Device views</h5>
                    </div>
                  </div>
                  <div className="py-4">
                    {!isVisitorsReq &&
                      isValidArray(visitors?.devoice?.labels) ? (
                      <DevoiceVisitingChart data={visitors?.devoice} />
                    ) : (
                      !isVisitorsReq && <EmptyTableSectionTwo />
                    )}
                    {isVisitorsReq && (
                      <p className="text-center h-[340px] pt-[30px] flex justify-center">
                        <Loader bg="transparent" />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>}

            <div
              className="grid grid-cols-12 gap-x-6 my-4"
              ref={RefererSources}
            >
              {!query?.productId && <>
                <div className="col-span-12 xxl:col-span-8  overflow-auto bg-white">
                  <div className="h-full xxl:h-[350px]">
                    <div className="box-header">
                      <div className="flex">
                        <h5 className="box-title my-auto">Referer Sources</h5>
                      </div>
                    </div>
                    <div className="box-body p-0">
                      <div className="overflow-auto">
                        <table className="ti-custom-table ti-custom-table-head">
                          <thead>
                            <tr>
                              <th scope="col">Referer</th>
                              <th scope="col">Volume</th>
                              <th scope="col">Traffic</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!isMostReferralsReq &&
                              isValidArray(mostReferrals?.referer?.refererData) &&
                              mostReferrals?.referer?.refererData.map(
                                (referer, i) => (
                                  <tr key={i}>
                                    <td className="">
                                      <div className="flex items-center gap-2">
                                        {/* <div className="">
																		<img src={"/browsers/" + referer?.browserCode + ".png"} className="avatar avatar-xs rounded-sm bg-primary/20 text-primary flex justify-center items-center"></img>
																	</div> */}
                                        <p className="my-0">{referer?.referer}</p>
                                      </div>
                                    </td>
                                    <td className="flex items-center">
                                      {referer?.volume}
                                      <i className="ri-arrow-up-s-fill ltr:ml-2 rtl:mr-2 text-base text-success my-auto"></i>
                                    </td>
                                    <td className="">
                                      <div className="ti-main-progress h-2 bg-gray-200 dark:bg-black/20">
                                        <div
                                          className="ti-main-progress-bar bg-primary text-xs text-white text-center"
                                          role="progressbar"
                                          style={{
                                            width: referer?.percent + "%",
                                          }}
                                          aria-valuenow="80"
                                          aria-valuemin="0"
                                          aria-valuemax="100"
                                        ></div>
                                      </div>
                                    </td>
                                  </tr>
                                )
                              )}
                          </tbody>
                        </table>
                      </div>
                      {!isMostReferralsReq &&
                        !isValidArray(mostReferrals?.referer?.refererData) && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )}

                      {isMostReferralsReq && (
                        <p className="text-center h-[340px] pt-[30px] flex justify-center">
                          <Loader bg="transparent" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-span-12 xxl:col-span-4">
                  <div className="box">
                    <div className="box-header">
                      <div className="flex justify-between">
                        <h5 className="box-title my-auto">Referer Graph</h5>
                      </div>
                    </div>
                    <div className="py-4">
                      {!isMostReferralsReq &&
                        isValidArray(mostReferrals?.referer?.charts?.labels) ? (
                        <DevoiceVisitingChart
                          data={mostReferrals?.referer?.charts}
                        />
                      ) : (
                        !isMostReferralsReq && <EmptyTableSectionTwo />
                      )}

                      {isMostReferralsReq && (
                        <p className="text-center h-[340px] pt-[30px] flex justify-center">
                          <Loader bg="transparent" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>}
            </div>

            <div className=" bg-white my-8" ref={MostUsedCoupons}>
              <div className="box-header">
                <div className="flex justify-between">
                  <h5 className="box-title my-auto">Most Used (10) Coupons</h5>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-x-4 px-4 pt-3">
                <div className="col-span-12 xxl:col-span-12  overflow-auto bg-white">
                  <div className="h-full xxl:h-[400px]">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
                      {!isMostUsedCouponReq &&
                        isValidArray(mostCoupon?.mostUsedCoupons) &&
                        mostCoupon?.mostUsedCoupons?.map((coupon, i) => (
                          <div key={i}>
                            <h2
                              className={`text-xl font-semibold px-4 py-2 border-t-0  ${coupon?.isActive === false ? "bg-red-500 text-white"
                                : getTimeRemainingIsExpired(coupon) ? "bg-yellow-500 text-white"
                                  : "bg-green-500 text-white"
                                }`}
                            >
                              {coupon?.code}
                            </h2>
                            <div
                              className="max-w-md mx-auto bg-white rounded-t-none rounded-md overflow-hidden shadow-md  p-4 pt-1"
                              key={i}
                            >
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">Amount:</span>{" "}
                                {coupon?.value}%
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">
                                  Total Uses:
                                </span>{" "}
                                {coupon?.totalUses}
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">
                                  Total Customers:
                                </span>{" "}
                                {coupon?.totalCustomers}
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">Quantity:</span>{" "}
                                {coupon?.quantity || "Unlimited"}
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">
                                  Enable All Products:
                                </span>{" "}
                                {coupon?.enableAllProducts ? "Yes" : "No"}
                              </p>
                              {coupon?.enableAllProducts === false ? (
                                <div className="py-1">
                                  <span className="font-semibold">
                                    Enable Products:{" "}
                                  </span>{" "}
                                  {coupon?.products?.length || 0}
                                </div>
                              ) : (
                                <div className="py-1">
                                  <span className="font-semibold">
                                    Exclude Products:{" "}
                                  </span>{" "}
                                  {coupon?.excludeProducts?.length || 0}
                                </div>
                              )}
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">Expiry:</span>{" "}
                                {coupon?.expiry &&
                                  moment(coupon?.expiry).format(
                                    "YYYY-MM-DD"
                                  )}{" "}
                                ({getTimeRemaining(coupon)})
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">status:</span>{" "}
                                {coupon.isActive ? "active" : "inactive"}
                              </p>
                              <p className="text-gray-600 py-1">
                                <span className="font-semibold">Site:</span>{" "}
                                {coupon.site ?? "N/A"}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>

                    {!isMostUsedCouponReq &&
                      !isValidArray(mostCoupon?.mostUsedCoupons) && (
                        <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                          <EmptyTableSectionTwo />
                        </div>
                      )}
                    {isMostUsedCouponReq && (
                      <p className="text-center h-[340px] pt-[30px] flex justify-center">
                        <Loader bg="transparent" />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div ref={BundleProductsSavingsAnalytics}>
              <div className="">
                <div className="bg-white p-4 flex justify-between items-center">
                  <h2 className="lg:text-lg font-bold">
                    Bundle Products (Savings) Analytics
                  </h2>
                </div>
                <div className="lg:grid lg:grid-cols-2 gap-4 bg-white ">
                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        Most clicked on original products
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.mostClickedOriginalProducts?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.mostClickedOriginalProducts}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        Most accepted savings offered products
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.mostAcceptedOfferProducts?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.mostAcceptedOfferProducts}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        Most not accepted savings offered products
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.mostNotAcceptedOfferProducts?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.mostNotAcceptedOfferProducts}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        {" "}
                        Most 10 pack accepted
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.most10PackAccepted?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.most10PackAccepted}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        {" "}
                        Most 10 pack not accepted
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.most10PackNotAccepted?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.most10PackNotAccepted}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        {" "}
                        Most 3 pack accepted
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.most3PackAccepted?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.most3PackAccepted}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="box bg-white !m-0">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        {" "}
                        Most 3 pack not accepted
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(
                          savingsAnalytics?.most3PackNotAccepted?.labels
                        ) ? (
                        <SavingBundlePieChart
                          data={savingsAnalytics?.most3PackNotAccepted}
                        />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="box bg-white !m-0 ">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        Percentage of "savings available offered" acceptance
                      </h2>
                      {!savingBundleChartReq &&
                        isValidArray(savingsAnalytics?.acceptance?.labels) ? (
                        <BundleAnalytics data={savingsAnalytics?.acceptance} />
                      ) : (
                        !savingBundleChartReq && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="box bg-white !m-0 ">
                    <div className="box-body bg-white  h-full">
                      <h2 className="font-bold capitalize">
                        3 pack vs 10 pack saving available acceptance{" "}
                      </h2>
                      {!savingBundleChartReq && (
                        <BundleAnalytics
                          data={savingsAnalytics?.packAcceptance}
                        />
                      )}

                      {savingBundleChartReq && (
                        <div className="flex items-center justify-center h-[300px]">
                          <Loader bg="transparent" width={"w-5 h-5"} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="box bg-white !m-0 ">
                <div className="box-body bg-white">
                  <h2 className="font-bold capitalize">
                    {" "}
                    accepted vs not accepted{" "}
                  </h2>
                  {!savingBundleChartReq &&
                    isValidArray(savingsAnalytics?.dailyAcceptance?.series) ? (
                    <>
                      <BundleTwoBarChart
                        options={savingsAnalytics?.dailyAcceptance}
                      />
                    </>
                  ) : (
                    !savingBundleChartReq && (
                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                        <EmptyTableSectionTwo />
                      </div>
                    )
                  )}

                  {savingBundleChartReq && (
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader bg="transparent" width={"w-5 h-5"} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div ref={AverageOrdersChart}>
              <div className="mt-8">
                <div className="w-full md:w-[100%] bg-white">
                  <div className="flex items-center justify-between gap-4 flex-wrap pb-2">
                    <h2 className="box-title p-3">Average Orders Chart</h2>
                    <div className="pt-4 mr-2">
                      <div className="mb-1">
                        <input
                          type="radio"
                          id="group_by_sales-1"
                          checked={avgType == "day" ? "checked" : ""}
                          name="group_by_sales-1"
                          value="group_by_sales-1"
                          className="focus:outline-none focus:ring-0 px-1 outline-none"
                          onChange={() => {
                            handleFetchAvgChart("day");
                          }}
                        />
                        <label className="px-1" for="group_by_sales-1">
                          Day
                        </label>
                        <br />
                      </div>

                      <div className="mb-1">
                        <input
                          className="focus:outline-none focus:ring-0 px-1 outline-none"
                          checked={avgType == "month" ? "checked" : ""}
                          type="radio"
                          id="group_by_sales-2"
                          name="group_by_sales-2"
                          value="group_by_sales-2"
                          onChange={() => {
                            handleFetchAvgChart("month");
                          }}
                        />
                        <label className="px-1" for="css">
                          Month
                        </label>
                        <br />
                      </div>
                      {/* <div>
												<input className="focus:outline-none focus:ring-0 px-1 outline-none" checked={avgType == 'year' ? "checked" : ""} type="radio" id="group_by_sales-3" name="group_by_sales-3" value="group_by_sales-3" onChange={() => {
													setAvgType('year');
												}
												} />
												<label className="px-1" for="css">Year</label><br />
											</div> */}
                    </div>
                  </div>

                  {avgSaleReq ? (
                    <div className="flex items-center justify-center h-[350px]">
                      <Loader bg="transparent" />
                    </div>
                  ) : (
                    !avgSaleReq && <DailySalesChart data={avgSales} />
                  )}
                </div>
              </div>
            </div>
            <div ref={SalesViewRef}>
              <div className="top-sales">
                <div
                  className="mt-8  bg-white p-3  rounded"
                  ref={TopPurchasedProducts}
                >
                  <div className="">
                    <div className="flex justify-between flex-wrap">
                      <h2 className="box-title ">Top Purchased Products </h2>
                      {topSalesMenuOpen ? (
                        <IoIosArrowDown
                          className="cursor-pointer  text-lg lg:text-2xl"
                          onClick={() => setTopSalesMenuOpen(false)}
                        />
                      ) : (
                        <IoIosArrowUp
                          className="cursor-pointer  text-lg lg:text-2xl"
                          onClick={() => setTopSalesMenuOpen(true)}
                        />
                      )}
                    </div>
                  </div>

                  {topSalesMenuOpen &&
                    isValidArray(groupProducts?.topSales?.topSalesProducts) && (
                      <div className="w-full max-h-[500px] overflow-auto">
                        <AnalyticsTopSaleProducts
                          className=""
                          isRequestProduct={isGroupProductsReq}
                          products={groupProducts?.topSales?.topSalesProducts}
                          dateRange={query?.isDailySales ? "daily" : "monthly"}
                        />
                      </div>
                    )}
                  {!isGroupProductsReq &&
                    !isValidArray(
                      groupProducts?.topSales?.topSalesProducts
                    ) && (
                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                        <EmptyTableSectionTwo />
                      </div>
                    )}
                </div>

                <div
                  className="mt-8  bg-white  rounded"
                  ref={TopPurchasedProducts}
                >
                  <div>
                    <div className="mt-0 p-3 bg-white  rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="box-title">
                          {query?.isDailySales ? "Daily" : "Monthly"} Sales
                        </h2>
                        {salesGroupMenuOpen ? (
                          <IoIosArrowDown
                            className="cursor-pointer  text-lg lg:text-2xl"
                            onClick={() => setSalesGroupMenuOpen(false)}
                          />
                        ) : (
                          <IoIosArrowUp
                            className="cursor-pointer  text-lg lg:text-2xl"
                            onClick={() => setSalesGroupMenuOpen(true)}
                          />
                        )}
                      </div>

                      {salesGroupMenuOpen &&
                        isValidArray(
                          groupProducts?.topSales?.groupProducts
                        ) && (
                          <>
                            <div className="lg:flex justify-between items-center">
                              <div className="py-1">
                                {query.isDailySales === true &&
                                  query.startDate &&
                                  query.endDate && (
                                    <div className="font-[500]">
                                      <p>
                                        {" "}
                                        Total sold amount $
                                        {isValidArray(
                                          groupProducts?.topSales?.groupProducts
                                        )
                                          ? parseFloat(
                                            groupProducts?.topSales.groupProducts.reduce(
                                              (acc, curr) => {
                                                return (
                                                  acc + curr?.totalSalesAmount
                                                );
                                              },
                                              0
                                            )
                                          ).toFixed(2)
                                          : "0.00"}{" "}
                                        (
                                        <span>
                                          {moment(query.startDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </span>{" "}
                                        <b>To</b>{" "}
                                        <span>
                                          {moment(query.endDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </span>
                                        )
                                      </p>
                                    </div>
                                  )}
                                {query.isDailySales === false &&
                                  query.startDate &&
                                  query.endDate && (
                                    <div className="font-[500]">
                                      <p>
                                        {" "}
                                        Total sold amount $
                                        {isValidArray(
                                          groupProducts?.topSales
                                            ?.groupMonthlySalesProducts
                                            ?.monthlyGroup
                                        )
                                          ? parseFloat(
                                            groupProducts?.topSales?.groupMonthlySalesProducts.monthlyGroup.reduce(
                                              (acc, curr) => {
                                                return (
                                                  acc + curr?.totalSalesAmount
                                                );
                                              },
                                              0
                                            )
                                          ).toFixed(2)
                                          : "0.00"}{" "}
                                        (
                                        <span>
                                          {moment(query.startDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </span>{" "}
                                        <b>To</b>{" "}
                                        <span>
                                          {moment(query.endDate).format(
                                            "MMMM Do, YYYY"
                                          )}
                                        </span>
                                        )
                                      </p>
                                    </div>
                                  )}
                              </div>

                              <div className="flex items-center gap-4 py-1">
                                <div className="">
                                  <input
                                    type="radio"
                                    id="group_by_sales"
                                    checked={
                                      query.isDailySales ? "checked" : ""
                                    }
                                    name="group_by_sales"
                                    value="group_by_sales"
                                    className="focus:outline-none focus:ring-0  px-1 outline-none"
                                    onChange={() => {
                                      handleReCalculate();
                                      setQuery((prev) => {
                                        return {
                                          ...prev,
                                          isDailySales: true,
                                        };
                                      });
                                    }}
                                  />
                                  <label className="px-1" for="group_by_sales">
                                    Group By Daily
                                  </label>
                                  <br />
                                </div>

                                <div>
                                  <input
                                    className="focus:outline-none focus:ring-0  px-1 outline-none"
                                    checked={
                                      query?.isDailySales ? "" : "checked"
                                    }
                                    type="radio"
                                    id="group_by_sales"
                                    name="group_by_sales"
                                    value="group_by_sales"
                                    onChange={() => {
                                      handleReCalculate();
                                      setQuery((prev) => {
                                        return {
                                          ...prev,
                                          isDailySales: false,
                                        };
                                      });
                                    }}
                                  />
                                  <label className="px-1" for="css">
                                    Group By Month
                                  </label>
                                  <br />
                                </div>
                              </div>
                            </div>

                            <div className="overflow-auto max-h-[500px] mt-4">
                              {query?.isDailySales == true && (
                                <>
                                  {isValidArray(
                                    groupProducts?.topSales?.groupProducts
                                  ) &&
                                    groupProducts.topSales.groupProducts.map(
                                      (item, gTIdx) => (
                                        <div
                                          key={gTIdx}
                                          className="mb-2 cursor-pointer"
                                        >
                                          <div className="flex justify-between p-1 border rounded-sm px-2 items-center">
                                            <p
                                              className="w-[95%] text-md font-bold text-gray-900 dark:text-white"
                                              onClick={() =>
                                                setGroupSaleTabOpen({
                                                  index: gTIdx,
                                                  isOpen: true,
                                                })
                                              }
                                            >
                                              {moment(item?._id).format(
                                                "MMMM Do, YYYY"
                                              )}
                                            </p>

                                            {groupSaleTabOpen?.index ===
                                              gTIdx &&
                                              groupSaleTabOpen?.isOpen ? (
                                              <IoIosArrowDown
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupSaleTabOpen({
                                                    index: gTIdx,
                                                    isOpen: false,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <IoIosArrowUp
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupSaleTabOpen({
                                                    index: gTIdx,
                                                    isOpen: true,
                                                  })
                                                }
                                              />
                                            )}
                                          </div>

                                          {groupSaleTabOpen?.index === gTIdx &&
                                            groupSaleTabOpen?.isOpen && (
                                              <AnalyticsGroupProducts
                                                type={
                                                  query?.isDailySales
                                                    ? "Daily Sales"
                                                    : "Monthly Sales"
                                                }
                                                dateRange={
                                                  query?.isDailySales
                                                    ? "daily"
                                                    : "monthly"
                                                }
                                                className=""
                                                isRequestProduct={
                                                  isGroupProductsReq
                                                }
                                                products={
                                                  item?.topSalesProducts
                                                }
                                              />
                                            )}
                                        </div>
                                      )
                                    )}

                                  {!isGroupProductsReq &&
                                    !isValidArray(
                                      groupProducts?.topSales?.groupProducts
                                    ) && (
                                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                                        <EmptyTableSectionTwo />
                                      </div>
                                    )}
                                </>
                              )}

                              {query?.isDailySales == false && (
                                <>
                                  {isValidArray(
                                    groupProducts?.topSales
                                      ?.groupMonthlySalesProducts?.monthlyGroup
                                  ) &&
                                    groupProducts?.topSales?.groupMonthlySalesProducts?.monthlyGroup.map(
                                      (item, gTIdx) => (
                                        <div
                                          key={gTIdx}
                                          className="mb-2 cursor-pointer"
                                        >
                                          <div className="flex justify-between p-1 border rounded-sm px-2 items-center">
                                            <p
                                              className="text-md font-bold text-gray-900 dark:text-white w-[95%]"
                                              onClick={() =>
                                                setGroupSaleTabOpen({
                                                  index: gTIdx,
                                                  isOpen: true,
                                                })
                                              }
                                            >
                                              {  query?.isDailySales?moment(item?._id).format(
                                                "MMMM Do, YYYY"
                                              ):  moment(item?._id).format(
                                                "MMMM"
                                              )}
                                            </p>

                                            {groupSaleTabOpen?.index ===
                                              gTIdx &&
                                              groupSaleTabOpen?.isOpen ? (
                                              <IoIosArrowDown
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupSaleTabOpen({
                                                    index: gTIdx,
                                                    isOpen: false,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <IoIosArrowUp
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupSaleTabOpen({
                                                    index: gTIdx,
                                                    isOpen: true,
                                                  })
                                                }
                                              />
                                            )}
                                          </div>

                                          {groupSaleTabOpen?.index === gTIdx &&
                                            groupSaleTabOpen?.isOpen && (
                                              <AnalyticsGroupProducts
                                                type={
                                                  query?.isDailySales
                                                    ? "Daily Sales"
                                                    : "Monthly Sales"
                                                }
                                                dateRange={
                                                  query?.isDailySales
                                                    ? "daily"
                                                    : "monthly"
                                                }
                                                className=""
                                                isRequestProduct={
                                                  isGroupProductsReq
                                                }
                                                products={
                                                  item?.topSalesProducts
                                                }
                                              />
                                            )}
                                        </div>
                                      )
                                    )}
                                  {!isGroupProductsReq &&
                                    !isValidArray(
                                      groupProducts?.topSales
                                        ?.groupMonthlySalesProducts
                                        ?.monthlyGroup
                                    ) && (
                                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                                        <EmptyTableSectionTwo />
                                      </div>
                                    )}
                                </>
                              )}
                            </div>

                            <div className="w-full mt-8">
                              <h2 className="box-title">
                                {query?.isDailySales ? "Daily" : "Monthly"}{" "}
                                Sales Chart
                              </h2>

                              <DailySalesChart
                                data={
                                  query?.isDailySales
                                    ? groupProducts?.topSales?.charts
                                    : groupProducts?.topSales
                                      ?.groupMonthlySalesProducts?.charts
                                }
                              />
                            </div>
                          </>
                        )}

                      {!isGroupProductsReq &&
                        !isValidArray(
                          groupProducts?.topSales?.groupProducts
                        ) && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="top-viewed">
                <div
                  className="mt-8  bg-white p-3  rounded"
                  ref={TopViewedProducts}
                >
                  <div className="">
                    <div className="flex justify-between flex-wrap">
                      <h2 className="box-title ">Top Viewed Products </h2>
                      {topViewMenuOpen ? (
                        <IoIosArrowDown
                          className="cursor-pointer  text-lg lg:text-2xl"
                          onClick={() => setTopViewMenuOpen(false)}
                        />
                      ) : (
                        <IoIosArrowUp
                          className="cursor-pointer  text-lg lg:text-2xl"
                          onClick={() => setTopViewMenuOpen(true)}
                        />
                      )}
                    </div>
                  </div>

                  {topViewMenuOpen &&
                    isValidArray(
                      groupProducts?.topViewed?.topViewedProducts
                    ) && (
                      <div className="w-full max-h-[500px] overflow-auto">
                        <AnalyticsTopViewProducts
                          className=""
                          isRequestProduct={isGroupProductsReq}
                          products={groupProducts.topViewed?.topViewedProducts}
                          dateRange={query?.isDailyViewed ? "daily" : "monthly"}
                        />
                      </div>
                    )}
                  {!isGroupProductsReq &&
                    !isValidArray(
                      groupProducts.topViewed?.topViewedProducts
                    ) && (
                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                        <EmptyTableSectionTwo />
                      </div>
                    )}
                </div>

                <div
                  className="mt-8  bg-white  rounded"
                  ref={TopViewedProducts}
                >
                  <div>
                    <div className="mt-0 p-3 bg-white  rounded-md">
                      <div className="flex justify-between items-center mb-3">
                        <h2 className="box-title">
                          {query?.isDailyViewed ? "Daily" : "Monthly"} Viewed
                        </h2>
                        {!isGroupProductsReq && viewGroupMenuOpen ? (
                          <IoIosArrowDown
                            className="cursor-pointer  text-lg lg:text-2xl"
                            onClick={() => setViewGroupMenuOpen(false)}
                          />
                        ) : (
                          <IoIosArrowUp
                            className="cursor-pointer  text-lg lg:text-2xl"
                            onClick={() => setViewGroupMenuOpen(true)}
                          />
                        )}
                      </div>

                      {viewGroupMenuOpen &&
                        isValidArray(
                          groupProducts?.topViewed?.topViewedProducts
                        ) && (
                          <>
                            <div className="lg:flex justify-between items-center">
                              <div className="py-1">
                                {query.isDailyViewed === true &&
                                  query.startDate &&
                                  query.endDate ? (
                                  <div className="font-[500]">
                                    <p className="flex items-center ">
                                      {" "}
                                      Total Views{" "}
                                      <ImEye className="ml-2 mr-1" />{" "}
                                      {isValidArray(
                                        groupProducts?.topViewed?.groupProducts
                                      )
                                        ? groupProducts?.topViewed.groupProducts.reduce(
                                          (acc, curr) => {
                                            return acc + curr?.totalView;
                                          },
                                          0
                                        )
                                        : "0"}{" "}
                                      (
                                      <span>
                                        {moment(query.startDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>{" "}
                                      <b className="px-2">To</b>{" "}
                                      <span>
                                        {moment(query.endDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>
                                      )
                                    </p>
                                  </div>
                                ) : (
                                  query.isDailyViewed === true && (
                                    <p className="flex items-center ">
                                      {" "}
                                      Total Views{" "}
                                      <ImEye className="ml-2 mr-1" /> (
                                      <span>
                                        {moment(query.startDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>{" "}
                                      <b className="px-2">To</b>{" "}
                                      <span>
                                        {moment(query.endDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>
                                      )
                                    </p>
                                  )
                                )}

                                {query.isDailyViewed === false &&
                                  query.startDate &&
                                  query.endDate ? (
                                  <div className="font-[500]">
                                    <p className="flex items-center ">
                                      {" "}
                                      Total Views{" "}
                                      <ImEye className="ml-2 mr-1" />{" "}
                                      {isValidArray(
                                        groupProducts?.topViewed
                                          ?.groupMonthlyViewedProducts
                                          ?.monthlyGroup
                                      )
                                        ? groupProducts?.topViewed.groupMonthlyViewedProducts?.monthlyGroup.reduce(
                                          (acc, curr) => {
                                            return acc + curr?.totalView;
                                          },
                                          0
                                        ) || 0
                                        : "0"}{" "}
                                      (
                                      <span>
                                        {moment(query.startDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>{" "}
                                      <b className="px-2">To</b>{" "}
                                      <span>
                                        {moment(query.endDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>
                                      )
                                    </p>
                                  </div>
                                ) : (
                                  query.isDailyViewed === false && (
                                    <p className="flex items-center ">
                                      {" "}
                                      Total Views{" "}
                                      <ImEye className="ml-2 mr-1" /> (
                                      <span>
                                        {moment(query.startDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>{" "}
                                      <b className="px-2">To</b>{" "}
                                      <span>
                                        {moment(query.endDate).format(
                                          "MMMM Do, YYYY"
                                        )}
                                      </span>
                                      )
                                    </p>
                                  )
                                )}
                              </div>

                              <div className="flex items-center gap-4 py-1">
                                <div className="">
                                  <input
                                    type="radio"
                                    id="group_by_viewed_1"
                                    checked={
                                      query.isDailyViewed ? "checked" : ""
                                    }
                                    name="group_by_viewed_1"
                                    value="group_by_viewed_1"
                                    className="focus:outline-none focus:ring-0  px-1 outline-none"
                                    onChange={() => {
                                      handleReCalculate();
                                      setQuery((prev) => {
                                        return {
                                          ...prev,
                                          isDailyViewed: true,
                                        };
                                      });
                                    }}
                                  />
                                  <label
                                    className="px-1"
                                    for="group_by_viewed_1"
                                  >
                                    Group By Daily
                                  </label>
                                  <br />
                                </div>

                                <div>
                                  <input
                                    className="focus:outline-none focus:ring-0  px-1 outline-none"
                                    checked={
                                      query?.isDailyViewed ? "" : "checked"
                                    }
                                    type="radio"
                                    id="group_by_viewed_2"
                                    name="group_by_viewed_2"
                                    value="group_by_sales"
                                    onChange={() => {
                                      handleReCalculate();
                                      setQuery((prev) => {
                                        return {
                                          ...prev,
                                          isDailyViewed: false,
                                        };
                                      });
                                    }}
                                  />
                                  <label className="px-1" for="css">
                                    Group By Month
                                  </label>
                                  <br />
                                </div>
                              </div>
                            </div>

                            <div className="overflow-auto max-h-[500px] mt-4">
                              {query?.isDailyViewed == true && (
                                <>
                                  {isValidArray(
                                    groupProducts?.topViewed?.groupProducts
                                  ) &&
                                    groupProducts?.topViewed?.groupProducts.map(
                                      (item, gTIdx) => (
                                        <div
                                          key={gTIdx}
                                          className="mb-2 cursor-pointer"
                                        >
                                          <div className="flex justify-between p-1 border rounded-sm px-2 items-center">
                                            <p
                                              className="w-[95%] text-md font-bold text-gray-900 dark:text-white"
                                              onClick={() =>
                                                setGroupViewTabOpen({
                                                  index: gTIdx,
                                                  isOpen: true,
                                                })
                                              }
                                            >
                                               {  query?.isDailyViewed?moment(item?._id).format(
                                                "MMMM Do, YYYY"
                                              ):  moment(item?._id).format(
                                                "MMMM"
                                              )}
                                            </p>

                                            {groupViewTabOpen?.index ===
                                              gTIdx &&
                                              groupViewTabOpen?.isOpen ? (
                                              <IoIosArrowDown
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupViewTabOpen({
                                                    index: gTIdx,
                                                    isOpen: false,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <IoIosArrowUp
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupViewTabOpen({
                                                    index: gTIdx,
                                                    isOpen: true,
                                                  })
                                                }
                                              />
                                            )}
                                          </div>

                                          {groupViewTabOpen?.index === gTIdx &&
                                            groupViewTabOpen?.isOpen && (
                                              <AnalyticViewGroupProducts
                                                type={
                                                  query?.isDailyViewed
                                                    ? "Daily Viewed"
                                                    : "Monthly Viewed"
                                                }
                                                dateRange={
                                                  query?.isDailyViewed
                                                    ? "daily"
                                                    : "monthly"
                                                }
                                                className=""
                                                isRequestProduct={
                                                  isGroupProductsReq
                                                }
                                                products={
                                                  item?.topViewedProducts
                                                }
                                              />
                                            )}
                                        </div>
                                      )
                                    )}

                                  {!isGroupProductsReq &&
                                    !isValidArray(
                                      groupProducts?.topViewed?.groupProducts
                                    ) && (
                                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                                        <EmptyTableSectionTwo />
                                      </div>
                                    )}
                                </>
                              )}

                              {query?.isDailyViewed == false && (
                                <>
                                  {isValidArray(
                                    groupProducts?.topViewed
                                      ?.groupMonthlyViewedProducts?.monthlyGroup
                                  ) &&
                                    groupProducts?.topViewed?.groupMonthlyViewedProducts?.monthlyGroup.map(
                                      (item, gTIdx) => (
                                        <div
                                          key={gTIdx}
                                          className="mb-2 cursor-pointer"
                                        >
                                          <div className="flex justify-between p-1 border rounded-sm px-2 items-center">
                                            <p
                                              className="text-md font-bold text-gray-900 dark:text-white w-[95%]"
                                              onClick={() =>
                                                setGroupViewTabOpen({
                                                  index: gTIdx,
                                                  isOpen: true,
                                                })
                                              }
                                            >
                                              {moment(item?._id).format(
                                                "MMMM Do, YYYY"
                                              )}
                                            </p>

                                            {groupSaleTabOpen?.index ===
                                              gTIdx &&
                                              groupSaleTabOpen?.isOpen ? (
                                              <IoIosArrowDown
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupViewTabOpen({
                                                    index: gTIdx,
                                                    isOpen: false,
                                                  })
                                                }
                                              />
                                            ) : (
                                              <IoIosArrowUp
                                                className="cursor-pointer  text-lg lg:text-2xl"
                                                onClick={() =>
                                                  setGroupViewTabOpen({
                                                    index: gTIdx,
                                                    isOpen: true,
                                                  })
                                                }
                                              />
                                            )}
                                          </div>

                                          {groupViewTabOpen?.index === gTIdx &&
                                            groupViewTabOpen?.isOpen && (
                                              <AnalyticViewGroupProducts
                                                type={
                                                  query?.isDailyViewed
                                                    ? "Daily Viewed"
                                                    : "Monthly Viewed"
                                                }
                                                dateRange={
                                                  query?.isDailyViewed
                                                    ? "daily"
                                                    : "monthly"
                                                }
                                                className=""
                                                isRequestProduct={
                                                  isGroupProductsReq
                                                }
                                                products={
                                                  item?.topViewedProducts
                                                }
                                              />
                                            )}
                                        </div>
                                      )
                                    )}
                                  {!isGroupProductsReq &&
                                    !isValidArray(
                                      groupProducts?.topViewed?.groupProducts
                                    ) && (
                                      <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                                        <EmptyTableSectionTwo />
                                      </div>
                                    )}
                                </>
                              )}
                            </div>

                            <div className="w-full mt-8">
                              <h2 className="box-title">
                                {query?.isDailyViewed ? "Daily" : "Monthly"}{" "}
                                Viewed Chart
                              </h2>

                              <DailyViewedChart
                                data={
                                  query?.isDailyViewed
                                    ? groupProducts?.topViewed?.charts
                                    : groupProducts?.topViewed
                                      ?.groupMonthlyViewedProducts?.charts
                                }
                              />
                            </div>
                          </>
                        )}

                      {!isGroupProductsReq &&
                        !isValidArray(
                          groupProducts?.topViewed?.topViewedProducts
                        ) && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pb-10">
            <div
              className={` mt-8 ${query?.productId ? "" : " bg-white"} p-3  w-full`}
              ref={MostSearchedKeywords}
            >
              {!query?.productId && <>
                <h2 className="box-title pb-4">Most Searched Keywords</h2>
                <div className="h-full xxl:h-[350px]  overflow-y-auto">
                  <div className="box-body p-0">
                    <div className="">
                      <table className="ti-custom-table ti-custom-table-head">
                        <thead>
                          <tr>
                            <th scope="col">Keyword</th>
                            <th scope="col">Search</th>
                            <th scope="col">Volume</th>
                          </tr>
                        </thead>
                        <tbody>
                          {!isMostKeywordsReq &&
                            isValidArray(mostKeywords?.mostKeywords) &&
                            mostKeywords?.mostKeywords.map((keyword, i) => (
                              <tr key={i}>
                                <td className="">
                                  <div className="flex items-center gap-2">
                                    <p className="my-0">{keyword?.keyword}</p>
                                  </div>
                                </td>
                                <td className="flex items-center">
                                  {keyword?.view}
                                  <i className="ri-arrow-up-s-fill ltr:ml-2 rtl:mr-2 text-base text-success my-auto"></i>
                                </td>
                                <td className="">
                                  <div className="ti-main-progress h-2 bg-gray-200 dark:bg-black/20">
                                    <div
                                      className="ti-main-progress-bar bg-primary text-xs text-white text-center"
                                      role="progressbar"
                                      style={{ width: keyword?.percent + "%" }}
                                      aria-valuenow="80"
                                      aria-valuemin="0"
                                      aria-valuemax="100"
                                    ></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>

                      {!isMostKeywordsReq &&
                        !isValidArray(mostKeywords?.mostKeywords) && (
                          <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                            <EmptyTableSectionTwo />
                          </div>
                        )}

                      {isMostKeywordsReq && (
                        <p className="text-center h-[340px] pt-[30px] flex justify-center">
                          <Loader bg="transparent" />
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </>}
            </div>
            <div
              className={` mt-8 ${query?.productId ? "" : " bg-white"} p-3  w-full`}
              ref={MostClickedOnCategories}
            >
              {
                !query?.productId && <>
                  <h2 className="box-title pb-4">Most Clicked On Categories</h2>
                  <div className="h-full xxl:h-[350px]  overflow-y-auto ">
                    <div className="box-body p-0">
                      <div className="">
                        <table className="ti-custom-table ti-custom-table-head">
                          <thead>
                            <tr>
                              <th scope="col">Category</th>
                              <th scope="col">Clicked</th>
                              <th scope="col">Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!isMostCategoriesReq &&
                              isValidArray(mostCategories?.mostCategories) &&
                              mostCategories.mostCategories.map((category, i) => (
                                <tr key={i}>
                                  <td className="">
                                    <div className="flex items-center gap-2">
                                      <p className="my-0">{category?.category}</p>
                                    </div>
                                  </td>
                                  <td className="flex items-center">
                                    {category?.view}
                                    <i className="ri-arrow-up-s-fill ltr:ml-2 rtl:mr-2 text-base text-success my-auto"></i>
                                  </td>
                                  <td className="">
                                    <div className="ti-main-progress h-2 bg-gray-200 dark:bg-black/20">
                                      <div
                                        className="ti-main-progress-bar bg-primary text-xs text-white text-center"
                                        role="progressbar"
                                        style={{ width: category?.percent + "%" }}
                                        aria-valuenow="80"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>

                        {!isMostCategoriesReq &&
                          !isValidArray(mostCategories?.mostCategories) && (
                            <div className="  w-10/12  lg:w-4/12 mx-auto  my-6">
                              <EmptyTableSectionTwo />
                            </div>
                          )}

                        {isMostCategoriesReq && (
                          <p className="text-center h-[340px] pt-[30px] flex justify-center">
                            <Loader bg="transparent" />
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              }
            </div>
          </div>

          <div
            className={`fixed top-[${open ? "30%" : "30%"
              }] right-4 w-auto h-auto  z-[10000]`}
          >
            {open && (
              <ul className="py-2 text-sm bg-white rounded-sm shadow-md w-auto h-auto">
                {!query?.productId && <>
                  <li
                    className="border-b"
                    onClick={() => handleScrollRef(CountriesVisiting)}
                    title="Countries Visiting"
                  >
                    <button className="block px-4 py-2">
                      <FaRegFlag size={0} />

                      {/* Countries Visiting */}
                    </button>
                  </li>
                  <li
                    className="border-b"
                    onClick={() => handleScrollRef(TrafficSources)}
                    title="Traffic Sources"
                  >
                    <button className="block px-4 py-2">
                      <RiOpenSourceLine size={20} />

                      {/* Traffic Sources */}
                    </button>
                  </li>
                  <li
                    className="border-b"
                    onClick={() => handleScrollRef(RefererSources)}
                    title="Referer Sources"
                  >
                    <button className="block px-4 py-2">
                      <PiShareFill size={20} />

                      {/* Referer Sources */}
                    </button>
                  </li>
                </>}
                <li
                  className="border-b"
                  onClick={() => handleScrollRef(MostUsedCoupons)}
                  title="Most Used (10) Coupons"
                >
                  <button className="block px-4 py-2">
                    <RiCoupon4Line size={20} />

                    {/* Most Used (10) Coupons */}
                  </button>
                </li>
                <li
                  className="border-b"
                  onClick={() =>
                    handleScrollRef(BundleProductsSavingsAnalytics)
                  }
                  title="Bundle Products (Savings) Analytics"
                >
                  <button className="block px-4 py-2">
                    <GrBundle size={18} />

                    {/* Bundle Products (Savings) Analytics */}
                  </button>
                </li>
                <li
                  className="border-b"
                  onClick={() => handleScrollRef(AverageOrdersChart)}
                  title="Average Orders Chart"
                >
                  <button className="block px-4 py-2">
                    <RiLineChartLine size={20} />

                    {/* Average Orders Chart */}
                  </button>
                </li>
                <li className="border-b" title="Top Purchased Products">
                  <button
                    className="block px-4 py-2"
                    onClick={() => handleScrollRef(TopPurchasedProducts)}
                  >
                    <RiProductHuntLine size={20} />

                    {/* Top Purchased Products */}
                  </button>
                </li>
                <li
                  className="border-b"
                  onClick={() => handleScrollRef(TopViewedProducts)}
                  title="Top Viewed Products"
                >
                  <button className="block px-4 py-2">
                    <LuView size={20} />
                  </button>
                </li>
                {!query?.productId && <>
                  <li
                    className="border-b"
                    onClick={() => handleScrollRef(MostSearchedKeywords)}
                    title="Most Searched Keywords"
                  >
                    <button className="block px-4 py-2">
                      <GrView size={20} />

                      {/* Most Searched Keywords */}
                    </button>
                  </li>
                  <li title="Most Clicked On Categories">
                    <button
                      className="block px-4 py-2"
                      onClick={() => handleScrollRef(MostClickedOnCategories)}
                    >
                      <BiCategory size={20} />

                      {/* Most Clicked On Categories */}
                    </button>
                  </li>
                </>}
              </ul>
            )}
            <div className="flex justify-end mt-1 items-center">
              {open ? (
                <button
                  className="rounded-full text-black flex items-center justify-between gap-1 bg-white  border p-1"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  {" "}
                  <AiFillCloseCircle size={30} />{" "}
                </button>
              ) : (
                <button
                  className="rounded-full text-black flex items-center justify-between gap-1 bg-white  border p-[6px]"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  {" "}
                  <MdOutlineOpenInNew size={25} />{" "}
                </button>
              )}
            </div>
          </div>
        </div>
      </Contentlayout>
    </div>
  );
};

export default Analytics;
