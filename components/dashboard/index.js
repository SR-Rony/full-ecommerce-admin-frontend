import Loader from "@/shared/Loader/Loader";
import Seo from "@/shared/layout-components/seo/seo";
import { isValidArray } from "@/utils/func";
import {
  getAnalyticDashboardGroupProducts,
  getAnalyticDashboardTopProductsStats,
  getMostUsedCoupons,
  getOrderState,
  getTop20Sales,
  getTotalSales,
} from "@/utils/instance";
import moment from "moment";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import useIntersectionObserver from "@/hooks/useInspectionObserver";
import { ImEye } from "react-icons/im";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiTrendingUp, FiShoppingCart, FiDollarSign, FiPackage } from "react-icons/fi";
import AnalyticsGroupProducts from "../Analytics/AnalyticsGroupProducts";
import AnalyticsTotalSale from "../Analytics/AnalyticsTotalSale";
import AnalyticViewGroupProducts from "../Analytics/AnalyticsViewGroupProducts";
import DashboardTopSalesProduct from "../Analytics/DashBord/DashboardTopSalesProduct";
import MostUsedCoupons from "../Analytics/DashBord/MostUsedCoupons";
import TopProductSalesStats from "../Analytics/DashBord/TopProductSalesStats";
import TopProductViewStats from "../Analytics/DashBord/TopProductViewStats";
import EmptyTableSection from "../EmptyDataSection/EmptyTableSection";
import OrderSiteStatus from "../Shared/OrderSiteStatus";
import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

const Dashboard = () => {
  const router = useRouter();
  const [updateData, setUpdateData] = useState({});
  const [topStatsProductChart, setTopStatsProductChart] = useState([]);
  const [groupProducts, setGroupProducts] = useState({});
  const [isOpenSalesMenu, setIsOpenSalesMenu] = useState(true);
  const [isOpenViewedMenu, setIsOpenViewedMenu] = useState(true);
  const [frequency,setFrequency]=useState("monthly");
  const [groupSaleTabOpen, setGroupSaleTabOpen] = useState({
    index: 0,
    isOpen: true,
  });
  const [groupViewTabOpen, setGroupViewTabOpen] = useState({
    index: 0,
    isOpen: true,
  });
  const [topMenuOpen, setTopMenuOpen] = useState(true);
  const [isRequestGroupProducts, setIsRequestGroupProducts] = useState(false);
  const [top20Products, setTop20Products] = useState([]);
  const [isReqTop20Product, setIsReqTop20Product] = useState(false);
  const [dashboardState, setDashboardState] = useState([]);
  const [mostCoupon, setMostCoupon] = useState({});
  const [isReqToState, setIsReqTopState] = useState(false);
  const [activeRange, setActiveRange] = useState("Life Time");
  const [filterLoadingDate, setFilterLoadingDate] = useState(false);
  const [totalSalesData,setTotalSalesData] = useState({series:[],categories:[]});
  const [totalSalesDataReq,setTotalSalesDataReq]=useState(false);
  const [query, setQuery] = useState({
    isDailyViewed: true,
    isDailySales: true,
    startDate: "",
    endDate: "",
    days: 365,
    site: { label: "All Sites", value: "" },
  });

  const buttonOptions = [
    "Past 24 Hours",
    "Past 7 Days",
    "Past 30 Days",
    "Life Time",
  ];

  const box1ref = useRef(null);
  const box2ref = useRef(null);
  const box3ref = useRef(null);
  const box4ref = useRef(null);

  const boxRefsArray = [box1ref, box2ref, box3ref, box4ref];

  const boxRefs = useRef(boxRefsArray);

  const boxIntersection = useIntersectionObserver(boxRefs);

  const [box1inView, setBox1inView] = useState(false);
  const [box2inView, setBox2inView] = useState(false);
  const [box3inView, setBox3inView] = useState(false);
  const [box4inView, setBox4inView] = useState(false);
  const [vsDateRange,setVsDateRange] = useState({});

    const fetchTotalSales = async (data = {}) => {
      try {
        setTotalSalesDataReq(true);
        const res = await getTotalSales({ ...query,frequency, ...data });
        if (res.data.success) {
          setTotalSalesData(res?.data?.data);
          setVsDateRange({
            fromDate: moment(new Date(res.data.data.fromDate)).format("YYYY-MM-DD"),
            toDate: moment(new Date(res.data.data.toDate)).format("YYYY-MM-DD"),
          });
        }
        setTotalSalesDataReq(false);
      } catch (error) {
        setTotalSalesDataReq(false);
        console.log(error);
      }
    };
  useEffect(() => {
    switch (boxIntersection.target) {
      case box1ref.current:
        setBox1inView(true);
        break;
      case box2ref.current:
        if (!box2inView) {
          fetchTotalSales({});
          fetchAnalyticsTopStatsProduct();
          fetchUsedCoupons();
        }
        setBox2inView(true);
        break;
      case box3ref.current:
        if (!box3inView) {
          fetchTop20Products();
        }
        setBox3inView(true);

        break;
      case box4ref.current:
        if (!box4inView) {
          fetchGroupProducts();
        }
        setBox4inView(true);

        break;
      default:
        break;
    }
  }, [boxIntersection.target]);

  const handleDateRangeChange = async (startDate, endDate,frequency) => {
    setFrequency(frequency);
    setQuery((prev) => {
      return {
        ...prev,
        startDate: startDate || "",
        endDate: endDate || "",
        
      };
    });

    // switch (boxIntersection.target) {
    //   case box1ref.current:

    //     setBox1inView(true);
    //     break;
    //   case box2ref.current:

    //     setBox2inView(true);
    //     break;
    //   case box3ref.current:

    //     setBox3inView(true);

    //     break;
    //   case box4ref.current:

    //     setBox4inView(true);

    //     break;
    //   default:
    //     break;
    // }
    fetchTotalSales({ startDate, endDate,frequency });
    fetchDashboardStats({ startDate, endDate });
    fetchAnalyticsTopStatsProduct({ startDate, endDate });
    fetchUsedCoupons({ startDate, endDate });
    fetchTop20Products({ startDate, endDate });
    fetchGroupProducts({ startDate, endDate });
  };
  const calculateDateRange = async (option) => {
    setActiveRange(option);
    let startDate = "";
    let endDate = "";
    let frequency = ""; // Variable to hold frequency
    switch (option) {
      case "Past 24 Hours":
        frequency = "daily"; // Set frequency to daily
        startDate = moment().startOf("day").format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
    
        break;
      case "Past 7 Days":
        frequency = "weekly";
        startDate = moment()
          .subtract(6, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      case "Past 30 Days":
        frequency = "monthly";
        startDate = moment()
          .subtract(30, "days")
          .startOf("day")
          .format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      case "Life Time":
        frequency = "monthly";
        startDate = "";
        endDate = "";
        break;
      default:
        frequency="monthly";
        startDate = "";
        endDate = "";
    }
   
    await handleDateRangeChange(startDate, endDate,frequency);
    
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getFullYear();
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("M"));

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };
  const fetchGroupProducts = async (filter = {}) => {
    try {
      setIsRequestGroupProducts(true);

      const res = await getAnalyticDashboardGroupProducts({
        ...query,
        year: selectedYear,
        month: selectedMonth,
        days: query.days,
        ...filter,
        // startDate:startDate||query?.startDate,
        // endDate:endDate||query?.endDate,
      });
      if (res.data.success) {
        const date = res.data.data.date;
        setSelectedYear(date.year);
        setSelectedMonth(date.month);
        setGroupProducts(res.data.data);
      }
      setIsRequestGroupProducts(false);
    } catch (error) {
      setIsRequestGroupProducts(false);
      /* empty */
    }
  };

  const fetchAnalyticsTopStatsProduct = async (_dataParam = {}) => {
    try {
      setIsReqTopState(true);
      const res = await getAnalyticDashboardTopProductsStats({
        ...query,
        ..._dataParam,
      });
      setIsReqTopState(false);
      if (res.data.success) {
        setTopStatsProductChart(res?.data?.data);
      }
    } catch (error) {
      setIsReqTopState(false);
      /* empty */
    }
  };
  const fetchTop20Products = async (_dataParam = {}) => {
    try {
      setIsReqTop20Product(true);
      const res = await getTop20Sales({
        ...query,
        startDate: query?.startDate ?? "",
        endDate: query?.endDate ?? "",
        ..._dataParam,
      });
      setIsReqTop20Product(false);
      if (res.data.success) {
        setTop20Products(res?.data?.data);
      }
    } catch (error) {
      setIsReqTop20Product(false);
      /* empty */
    }
  };

  const fetchUsedCoupons = async (_dataParam = {}) => {
    try {
      const res = await getMostUsedCoupons({ ...query, ..._dataParam });
      if (res.data.success) {
        setMostCoupon(res?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDashboardStats = async (_dataParam = {}) => {
    try {
      setFilterLoadingDate(true);
      const res = await getOrderState({ ...query, ..._dataParam });
      setFilterLoadingDate(false);
      if (res?.data?.success) {
        setDashboardState(res?.data?.data);
      }
    } catch (error) {
      setFilterLoadingDate(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchDashboardStats();
    fetchTotalSales({ });
  }, []);
  const onChangeSiteType = async (site) => {
    setQuery({ ...query, site });

    try {
      fetchTotalSales({ ...query, site });
      fetchDashboardStats({ ...query, site });
      fetchAnalyticsTopStatsProduct({ ...query, site });
      fetchUsedCoupons({ ...query, site });
      fetchTop20Products({ ...query, site });
      fetchGroupProducts({ ...query, site });
    } catch (error) {
      console.log(error, " error in hammer bell site filter");
    }
  };

  // Icon mapping for stats cards
  const getStatIcon = (title) => {
    const titleLower = title?.toLowerCase() || '';
    if (titleLower.includes('order')) return <FiShoppingCart className="text-2xl" />;
    if (titleLower.includes('sale') || titleLower.includes('revenue')) return <FiDollarSign className="text-2xl" />;
    if (titleLower.includes('product')) return <FiPackage className="text-2xl" />;
    return <FiTrendingUp className="text-2xl" />;
  };

  // Color mapping for stats cards
  const getStatColor = (index) => {
    const colors = [
      { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'bg-blue-500', text: 'text-blue-600' },
      { bg: 'bg-green-50 dark:bg-green-900/20', icon: 'bg-green-500', text: 'text-green-600' },
      { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'bg-purple-500', text: 'text-purple-600' },
      { bg: 'bg-orange-50 dark:bg-orange-900/20', icon: 'bg-orange-500', text: 'text-orange-600' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6">
      <Seo title={"Analytics Dashboard"} />

      {/* Modern Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        {filterLoadingDate && (
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Loader width={"w-4 h-4"} bg="transparent" />
            <span className="text-sm text-blue-600 dark:text-blue-400">Loading data...</span>
          </div>
        )}
      </div>

      {/* Total Sales Chart - Premium Look */}
      <Card variant="default" className="overflow-hidden">
        <div className="p-6">
          <AnalyticsTotalSale 
            vsDateRange={vsDateRange} 
            data={totalSalesData}
            isReq={totalSalesDataReq} 
            activeRange={activeRange}
          />
        </div>
      </Card>
      {/* Modern Filter Bar */}
      <Card variant="default">
        <div className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Time Range Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
                Quick Filters:
              </span>
              {buttonOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => calculateDateRange(option)}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg
                    transition-all duration-200
                    ${option === activeRange 
                      ? 'bg-blue-500 text-white shadow-md hover:bg-blue-600' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                    ${activeRange === option && filterLoadingDate ? 'opacity-75 cursor-wait' : ''}
                  `}
                  disabled={activeRange === option && filterLoadingDate}
                >
                  <span className="flex items-center gap-2">
                    {option}
                    {activeRange === option && filterLoadingDate && (
                      <Loader width={"w-3 h-3"} bg="transparent" />
                    )}
                  </span>
                </button>
              ))}
            </div>

            {/* Site Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Site:
              </span>
              <OrderSiteStatus
                data={updateData}
                setData={setUpdateData}
                query={query}
                onChanges={onChangeSiteType}
              />
            </div>
          </div>
        </div>
      </Card>
      {/* Modern Stats Cards */}
      <div ref={box1ref}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {isValidArray(dashboardState) &&
            dashboardState.map((item, i) => {
              const colorScheme = getStatColor(i);
              return (
                <Card 
                  key={i}
                  variant="hover"
                  className={`${colorScheme.bg} border-none transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${colorScheme.icon} p-3 rounded-xl text-white shadow-lg`}>
                        {getStatIcon(item?.title)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {item?.title}
                      </p>
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {item?.count?.toLocaleString() || 0}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {item?.subtitle}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Charts Section - Premium Look */}
      <div ref={box2ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Purchased Products */}
          <Card variant="default">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <FiTrendingUp className="text-xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Top 10 Purchased Products
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Best selling items
                  </p>
                </div>
              </div>
              {isValidArray(topStatsProductChart?.mostPurchased?.labels) ? (
                <TopProductSalesStats
                  type={"Sales"}
                  data={topStatsProductChart?.mostPurchased}
                />
              ) : (
                <EmptyTableSection />
              )}
            </div>
          </Card>

          {/* Most Viewed But Less Purchased */}
          <Card variant="default">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                  <ImEye className="text-xl text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Most Viewed But (Not/Less) Purchased
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    High views, low conversions
                  </p>
                </div>
              </div>
              {isValidArray(topStatsProductChart?.mostViewedSalesASC?.labels) ? (
                <TopProductSalesStats
                  type={"Sales"}
                  data={topStatsProductChart?.mostViewedSalesASC}
                />
              ) : (
                <EmptyTableSection />
              )}
            </div>
          </Card>

          {/* Top Viewed Products */}
          <Card variant="default">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <ImEye className="text-xl text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Top 10 Viewed Products
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Most popular items
                  </p>
                </div>
              </div>
              {isValidArray(topStatsProductChart?.mostViewed?.labels) ? (
                <TopProductViewStats
                  type={"Views"}
                  data={topStatsProductChart?.mostViewed}
                />
              ) : (
                <EmptyTableSection />
              )}
            </div>
          </Card>

          {/* Most Used Coupons */}
          <Card variant="default">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FiDollarSign className="text-xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Most Used (10) Coupons
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Popular discount codes
                  </p>
                </div>
              </div>
              {isValidArray(mostCoupon?.chartData?.labels) ? (
                <MostUsedCoupons data={mostCoupon?.chartData} />
              ) : (
                <EmptyTableSection />
              )}
            </div>
          </Card>
        </div>
      </div>
      {/* Top 20 Products Section */}
      <div ref={box3ref}>
        <Card variant="default">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <FiPackage className="text-xl text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Top (20) Purchased Products
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your best performing products
                  </p>
                </div>
              </div>

              <button
                onClick={() => setTopMenuOpen(!topMenuOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                {topMenuOpen ? (
                  <IoIosArrowUp className="text-2xl text-gray-600 dark:text-gray-400" />
                ) : (
                  <IoIosArrowDown className="text-2xl text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>

            {topMenuOpen && (
              <div className="mt-6">
                <DashboardTopSalesProduct
                  className=""
                  isRequestProduct={isReqTop20Product}
                  products={top20Products}
                />
              </div>
            )}

            {!isReqTop20Product && !isValidArray(top20Products) && topMenuOpen && (
              <div className="py-8">
                <EmptyTableSection />
              </div>
            )}
            
            {isReqTop20Product && topMenuOpen && (
              <div className="py-8">
                <Loader />
              </div>
            )}
          </div>
        </Card>
      </div>
      {/* Monthly Report Section */}
      <div ref={box4ref}>
        <Card variant="default">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <FiTrendingUp className="text-xl text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Monthly Report
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Detailed monthly analytics
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 flex-wrap">
                <select
                  id="year"
                  name="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option>Select Year</option>
                  <option value={currentYear}>{currentYear}</option>
                </select>
                
                <select
                  id="month"
                  name="month"
                  value={parseInt(selectedMonth)}
                  onChange={handleMonthChange}
                  className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                <Button
                  variant="primary"
                  loading={isRequestGroupProducts}
                  onClick={() => fetchGroupProducts()}
                  className="whitespace-nowrap"
                >
                  {isRequestGroupProducts ? 'Loading...' : 'Apply Filters'}
                </Button>
              </div>
            </div>

            {/* Sales Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <FiDollarSign className="text-lg text-green-600" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Sales</h4>
                </div>

                <button
                  onClick={() => setIsOpenSalesMenu(!isOpenSalesMenu)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isOpenSalesMenu ? (
                    <IoIosArrowUp className="text-xl text-gray-600 dark:text-gray-400" />
                  ) : (
                    <IoIosArrowDown className="text-xl text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              {isOpenSalesMenu && (
                <div className="mt-4">
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="mb-4">
                      <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                        Monthly Sales Summary
                      </h5>
                      {selectedYear && selectedMonth && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400">Total Sales (Without Credit):</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                              ${isValidArray(groupProducts?.topSales?.groupProducts)
                                ? parseFloat(
                                    groupProducts?.topSales.groupProducts.reduce(
                                      (acc, curr) => acc + (parseFloat(curr?.totalSalesAmountWithoutCredit) || 0),
                                      0
                                    )
                                  ).toFixed(2)
                                : "0.00"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <span className="text-gray-600 dark:text-gray-400">Total Sales (With Credit):</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              ${isValidArray(groupProducts?.topSales?.groupProducts)
                                ? parseFloat(
                                    groupProducts?.topSales.groupProducts.reduce(
                                      (acc, curr) => acc + (parseFloat(curr?.totalSalesAmountWithCredit) || 0),
                                      0
                                    )
                                  ).toFixed(2)
                                : "0.00"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Period: {moment(`${groupProducts?.date?.year || selectedYear}-${(groupProducts?.date?.month || selectedMonth).toString().padStart(2,"0")}`)
                              .clone()
                              .startOf("month")
                              .format("MMMM Do, YYYY")} to {moment(`${groupProducts?.date?.year || selectedYear}-${(groupProducts?.date?.month || selectedMonth).toString().padStart(2,"0")}`)
                              .clone()
                              .endOf("month")
                              .format("MMMM Do, YYYY")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="overflow-auto max-h-[500px]">
                            {/* {isValidArray(groupProducts?.topSales?.groupProducts) &&
                            groupProducts?.topSales?.groupProducts.map(
                              (item, gTIdx) => (
                                <div key={gTIdx}>
                                  <time className='text-[1rem] font-semibold text-gray-900 dark:text-white'>
                                    {moment(item?._id).format('MMMM')}
                                  </time>
                                
                                  <AnalyticsTopSaleProducts
                                    type={'Monthly Sales'}
                                    className=''
                                    isRequestProduct={isRequestGroupProducts}
                                    products={item?.topSalesProducts}
                                    dateRange={"monthly"}
                                  />
                                </div>
                              )
                            )} */}

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
                                          "MMMM"
                                        )}
                                      </p>

                                      {groupSaleTabOpen?.index === gTIdx &&
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
                                          type={"Monthly Sales"}
                                          dateRange={"monthly"}
                                          className=""
                                          isRequestProduct={
                                            isRequestGroupProducts
                                          }
                                          products={item?.topSalesProducts}
                                        />
                                      )}
                                  </div>
                                )
                              )}
                    </div>
                  </div>
                </div>
              )}

              {!isRequestGroupProducts &&
                !isOpenSalesMenu &&
                !isValidArray(groupProducts?.topSales?.groupProducts) && (
                  <div className="py-8">
                    <EmptyTableSection />
                  </div>
                )}
            </div>
            {/* Viewed Section */}
            <div className="mt-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <ImEye className="text-lg text-blue-600" />
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Viewed</h4>
                </div>

                <button
                  onClick={() => setIsOpenViewedMenu(!isOpenViewedMenu)}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  {isOpenViewedMenu ? (
                    <IoIosArrowUp className="text-xl text-gray-600 dark:text-gray-400" />
                  ) : (
                    <IoIosArrowDown className="text-xl text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
              {isOpenViewedMenu && (
                <div className="mt-4">
                  <div className="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="mb-4">
                      <h5 className="text-md font-semibold text-gray-900 dark:text-white mb-2">
                        Monthly Viewed Products Summary
                      </h5>
                      {selectedYear && selectedMonth && (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                              <ImEye className="text-blue-600" />
                              <span className="text-gray-600 dark:text-gray-400">Total Views:</span>
                            </div>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {isValidArray(groupProducts?.topViewed?.groupProducts)
                                ? groupProducts?.topViewed?.groupProducts.reduce(
                                    (acc, curr) => acc + curr?.totalView,
                                    0
                                  ).toLocaleString()
                                : "0"}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Period: {moment(`${groupProducts?.date?.year || selectedYear}-${(groupProducts?.date?.month || selectedMonth).toString().padStart(2,"0")}`)
                              .clone()
                              .startOf("month")
                              .format("MMMM Do, YYYY")}{" "}
                            to {moment(`${groupProducts?.date?.year || selectedYear}-${(groupProducts?.date?.month || selectedMonth).toString().padStart(2,"0")}`)
                              .clone()
                              .endOf("month")
                              .format("MMMM Do, YYYY")}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="overflow-auto max-h-[500px]">
                      {isValidArray(groupProducts?.topViewed?.groupProducts) &&
                        groupProducts?.topViewed?.groupProducts.map(
                          (item, gTIdx) => (
                            <div key={gTIdx} className="mb-2 cursor-pointer">
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
                                  {moment(item?._id).format("MMMM")}
                                </p>

                                {groupViewTabOpen?.index === gTIdx &&
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
                                    type={"Monthly Viewed"}
                                    dateRange={"monthly"}
                                    className=""
                                    isRequestProduct={isRequestGroupProducts}
                                    products={item?.topViewedProducts}
                                  />
                                )}
                            </div>
                          )
                        )}
                    </div>
                  </div>
                </div>
              )}

              {!isRequestGroupProducts &&
                !isOpenViewedMenu &&
                !isValidArray(groupProducts?.topViewed?.groupProducts) && (
                  <div className="py-8">
                    <EmptyTableSection />
                  </div>
                )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

Dashboard.layout = "Contentlayout";

export default Dashboard;
