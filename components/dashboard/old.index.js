import Loader from '@/shared/Loader/Loader';
import Seo from '@/shared/layout-components/seo/seo';
import { isValidArray } from '@/utils/func';
import {
  getAnalyticDashboardGroupProducts,
  getAnalyticDashboardTopProductsStats,
  getMostUsedCoupons,
  getOrderState
} from '@/utils/instance';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import AnalyticsTopSaleProducts from '../Analytics/AnalyticsTopSaleProducts';

import useIntersectionObserver from '@/hooks/useInspectionObserver';
import { ImEye } from 'react-icons/im';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import DashboardTopViewProducts from '../Analytics/DashBord/DashboardTopViewProducts';
import MostUsedCoupons from '../Analytics/DashBord/MostUsedCoupons';
import TopProductSalesStats from '../Analytics/DashBord/TopProductSalesStats';
import TopProductViewStats from '../Analytics/DashBord/TopProductViewStats';

const Dashboard = () => {
  const router = useRouter();
  const [topStatsProductChart, setTopStatsProductChart] = useState([]);
  const [groupProducts, setGroupProducts] = useState({});
  const [isOpenSalesMenu, setIsOpenSalesMenu] = useState(true);
  const [isOpenViewedMenu, setIsOpenViewedMenu] = useState(true);
  const [topMenuOpen, setTopMenuOpen] = useState(true);
  const [isRequestGroupProducts, setIsRequestGroupProducts] = useState(false);

  const [dashboardState, setDashboardState] = useState([]);
  const [mostCoupon, setMostCoupon] = useState({});
  const [isReqToState, setIsReqTopState] = useState(false);
  const [activeRange, setActiveRange] = useState("Life Time");
  const [filterLoadingDate, setFilterLoadingDate] = useState(false);
  const [query, setQuery] = useState({
    isDailyViewed: true,
    isDailySales: true,
    startDate: "",
    endDate: "",
    days: 365
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

  const boxRefsArray = [box1ref, box2ref, box3ref];

  const boxRefs = useRef(boxRefsArray);

  const boxIntersection = useIntersectionObserver(boxRefs);

  const [box1inView, setBox1inView] = useState(false);
  const [box2inView, setBox2inView] = useState(false);
  const [box3inView, setBox3inView] = useState(false);

  useEffect(() => {
    switch (boxIntersection.target) {
      case box1ref.current:
        setBox1inView(true);
        break;
      case box2ref.current:
        if (!box2inView) {
          fetchAnalyticsTopStatsProduct();
          fetchUsedCoupons();

        }
        setBox2inView(true);
        break;
      case box3ref.current:
        if (!box3inView) {
          fetchGroupProducts();
        }
        setBox3inView(true);

        break;
      default:
        break;
    }
  }, [boxIntersection.target]);

  const handleDateRangeChange = async (startDate, endDate) => {
    setQuery((prev) => {
      return {
        ...prev,
        startDate: startDate || "",
        endDate: endDate || ""
      };
    });
    await fetchDashboardStats({ startDate, endDate });
    await fetchGroupProducts({ startDate, endDate });
    await fetchUsedCoupons({ startDate, endDate });
    await fetchAnalyticsTopStatsProduct({ startDate, endDate });

  };
  const calculateDateRange = async (option) => {
    setActiveRange(option);
    let startDate = "";
    let endDate = "";

    switch (option) {
      case "Past 24 Hours":
        startDate = moment().startOf("day").format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");

        break;
      case "Past 7 Days":
        startDate = moment().subtract(6, 'days').startOf("day").format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      case "Past 30 Days":
        startDate = moment().subtract(30, 'days').startOf("day").format("YYYY-MM-DD");
        endDate = moment().endOf("day").format("YYYY-MM-DD");
        break;
      case "Life Time":
        startDate = "";
        endDate = "";
        break;
      default:
        startDate = "";
        endDate = "";
    }

    await handleDateRangeChange(startDate, endDate);
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getFullYear();
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(moment().format('M'));

  const handleYearChange = e => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleMonthChange = e => {
    setSelectedMonth(parseInt(e.target.value));
  };
  const fetchGroupProducts = async (startDate, endDate) => {
    try {
      setIsRequestGroupProducts(true);

      const res = await getAnalyticDashboardGroupProducts({
        year: selectedYear,
        month: selectedMonth,
        days: query.days,
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
      const res = await getAnalyticDashboardTopProductsStats({ ...query, ..._dataParam });
      setIsReqTopState(false);
      if (res.data.success) {
        setTopStatsProductChart(res?.data?.data);
        const percents = res.data?.data?.bundleAnalytic?.percents;

      }

    } catch (error) {
      setIsReqTopState(false);
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

  }, []);

  return (
    <div >
      <Seo title={'Analytics Dashboard'} />

      <div className='block justify-between page-header md:flex'>
        <div>
          <h3 className='text-gray-700 hover:text-gray-900 dark:text-white dark:hover:text-white text-2xl font-medium'>
            Dashboard
          </h3>
        </div>
      </div>
      <div className="w-full md:w-[65%] mb-6">
        {/* <h2 className="box-title  font-bold py-1 pb-2">Filter Analytics</h2> */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xxl:grid-cols-5 gap-4 flex-wrap">
          {buttonOptions.map((option, index) => (
            <div key={index} className="flex" onClick={() => {
              calculateDateRange(option);
            }}>
              <input
                type="radio"
                id={`buttonOption_${index}`}
                name="date-range"
                value={option}
                className="mr-2 hidden"
              />
              {activeRange == option && filterLoadingDate ? <p
                htmlFor={`buttonOption_${index}`}
                className={`cursor-pointer px-3 py-1 text-[12px] bg-gray-200 text-gray-800 rounded-full transition-colors duration-300 hover:bg-gray-300 flex items-center ${option == (activeRange) && "!bg-blue-500 border !text-white"}`}
              >
                <span className='flex items-center gap-x-2 justify-between'>
                  <span > {option}</span> {activeRange == option && filterLoadingDate ? <Loader width={'w-2 h-2'} bg="transparent" /> : ''}
                </span>
              </p> :

                <p
                  htmlFor={`buttonOption_${index}`}
                  className={`cursor-pointer px-3 py-2 text-[12px] bg-gray-200 text-gray-800 rounded-full transition-colors duration-300 hover:bg-gray-300 flex items-center ${option == (activeRange) && "!bg-blue-500 border !text-white"}`}
                >
                  {option}
                </p>}
            </div>
          ))}
        </div>

      </div>
      <div className='col-span-12' ref={box1ref}>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6'>
          {isValidArray(dashboardState) && dashboardState.map((item, i) => (
            <div className='box' key={i}>
              <div className=''>
                <div className='box-body'>
                  <div className='flex items-start'>
                    <div className='ltr:mr-4 rtl:ml-4'>
                      <span className='avatar bg-primary/20 text-primary text-2xl p-3 rounded-sm'>
                        <i className='ri-flag-2-line leading-none'></i>
                      </span>
                    </div>
                    <div className='flex-1'>
                      <div className='font-medium text-sm mb-1'>{item?.title}</div>
                      <div className='flex items-center justify-between mb-1'>
                        <h5 className='text-xl font-bold text-gray-800 dark:text-white'>
                          {item?.count || 0}
                        </h5>
                      </div>
                      <p className='text-gray-500 dark:text-white/70 mb-0 text-xs'>

                        {item?.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
          }
        </div>
      </div>

      <div ref={box2ref}>

        <div className='lg:grid grid-cols-2 gap-4 mt-10'>
          <div className='box'>
            <div className='box-body bg-white'>
              <h2 className='box-title pb-4'>Top 10 Purchased Products</h2>
              {isValidArray(topStatsProductChart?.mostPurchased?.labels) ? (
                <TopProductSalesStats
                  type={'Sales'}
                  data={topStatsProductChart?.mostPurchased}
                />
              ) : (
                <p className='text-center h-[340px] pt-[30px]'>
                  {' '}
                  No Data Available
                </p>
              )}
            </div>
          </div>

          <div className='box'>
            <div className='box-body bg-white'>
              <h2 className='box-title pb-4'>
                Top 10 Most Viewed But (Not/Less) Purchased
              </h2>
              {isValidArray(
                topStatsProductChart?.mostViewedSalesASC?.labels
              ) ? (
                <TopProductSalesStats
                  type={'Sales'}
                  data={topStatsProductChart?.mostViewedSalesASC}
                />
              ) : (
                <p className='text-center h-[340px] pt-[30px]'>
                  {' '}
                  No Data Available
                </p>
              )}
            </div>
          </div>

          <div className='box'>
            <div className='box-body bg-white'>
              <h2 className='box-title pb-4'>Top 10 Viewed Products</h2>
              {isValidArray(topStatsProductChart?.mostViewed?.labels) ? (
                <TopProductViewStats
                  type={'Views'}
                  data={topStatsProductChart?.mostViewed}
                />
              ) : (
                <p className='text-center h-[340px] pt-[30px]'>
                  {' '}
                  No Data Available
                </p>
              )}
            </div>
          </div>

          <div className='box'>
            <div className='box-body bg-white'>
              <h2 className='box-title pb-4'>
                Most Used (10) Coupons
              </h2>
              {isValidArray(
                mostCoupon?.chartData?.labels
              ) ? (

                <MostUsedCoupons data={mostCoupon?.chartData} />

              ) : (
                <p className='text-center h-[340px] pt-[30px]'>
                  {' '}
                  No Data Available
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      <div className='' ref={box3ref}>
        <div>

          <div className='box bg-white  mb-4'>
            <div className='box-header flex items-center justify-between'>
              <h2 className='text-lg font-bold'>Monthly Report</h2>
            </div>

            <div className='w-full md:w-[450px] ms-auto pr-8 pt-7'>
              <div className='flex items-center justify-end gap-4 flex-wrap'>
                <div>
                  <p className='pb-1' htmlFor='year'>
                    {' '}
                    Select Year:
                  </p>
                  <select
                    id='year'
                    name='year'
                    value={selectedYear}
                    onChange={handleYearChange}
                  >
                    <option>Select Year</option>
                    <option  value={currentYear}>
                          {currentYear}
                        </option>
                  </select>
                </div>
                <div>
                  <p className='pb-1' htmlFor='month'>
                    Select Month
                  </p>
                  <select
                    id='month'
                    name='month'
                    value={selectedMonth}
                    onChange={handleMonthChange}
                  >
                    <option value=''>Select Month</option>
                    {months.map(month => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className='flex justify-end gap-4 py-1'>
                <div className='w-[100px] my-2   h-full bg-blue-500 text-white rounded-md'>
                  {isRequestGroupProducts ? (
                    <div className='py-1'>
                      <Loader bg='transparent' width={'w-5 h-5'} />
                    </div>
                  ) : (
                    <button
                      className='w-full h-full cursor-pointer py-2'
                      onClick={async () => {
                        fetchGroupProducts();
                      }}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
           
          </div>

          <div>
          <div className='bg-white rounded-md mt-7 relative px-4 py-3'>
              <div className='flex items-center justify-between '>
                <h2 className='text-[1rem] font-bold'>Top Purchased Products</h2>

                {topMenuOpen ? <IoIosArrowDown size={28} className='cursor-pointer' onClick={() => setTopMenuOpen(false)} /> : <IoIosArrowUp size={28} className='cursor-pointer' onClick={() => setTopMenuOpen(true)} />}

              </div>
              {topMenuOpen && <>

                {isValidArray(groupProducts?.topSales?.topSalesProducts) ? (
                  <AnalyticsTopSaleProducts className="" isRequestProduct={isRequestGroupProducts} products={groupProducts?.topSales?.topSalesProducts} dateRange={"monthly"} />
                ) : (
                  <p className='text-center h-[340px] pt-[30px]'>
                    {' '}
                    No Data Available
                  </p>
                )}

              </>}
            </div>
          </div>
          <div className=' bg-white mt-7 rounded-md px-4 box py-3'>

            <div className='bg-white '>
              <div className='flex items-center justify-between'>
                <h2 className='text-[1rem] font-bold '>Sales</h2>

                {isOpenSalesMenu ? <IoIosArrowDown size={28} className='cursor-pointer' onClick={() => setIsOpenSalesMenu(false)} /> : <IoIosArrowUp size={28} className='cursor-pointer' onClick={() => setIsOpenSalesMenu(true)} />}
              </div>
              {isOpenSalesMenu && <>
                <div>

                  <div>
                    <div className=' p-6 bg-white border rounded-md'>
                      <div className='w-full md:w-[100%]'>
                        <div className='flex justify-between flex-wrap pb-2'>
                          <div>
                            <h2 className='box-title'>{'Monthly'} Sales</h2>
                            {selectedYear && selectedMonth && (
                              <div className='font-[500]'>
                                <p>
                                  {' '}
                                  Total sold amount $
                                  {isValidArray(groupProducts?.topSales?.groupProducts)
                                    ? parseFloat(
                                      groupProducts?.topSales.groupProducts.reduce(
                                        (acc, curr) => {
                                          return acc + curr?.totalSalesAmount;
                                        },
                                        0
                                      )
                                    ).toFixed(2)
                                    : '0.00'}{' '}
                                  (
                                  <span>
                                    {moment(`${selectedYear}-${selectedMonth}`)
                                      .clone()
                                      .startOf('month')
                                      .format('MMMM Do, YYYY')}
                                  </span>{' '}
                                  <b>To</b>{' '}
                                  <span>
                                    {moment(`${selectedYear}-${selectedMonth}`)
                                      .clone()
                                      .endOf('month')
                                      .format('MMMM Do, YYYY')}
                                  </span>
                                  )
                                </p>
                              </div>
                            )}
                          </div>

                          <div className='pt-4'>{/* date */}</div>
                        </div>

                        <div className='overflow-auto h-full'>
                          {isValidArray(groupProducts?.topSales?.groupProducts) &&
                            groupProducts?.topSales?.groupProducts.map(
                              (item, gTIdx) => (
                                <div key={gTIdx}>
                                  <time className='text-[1rem] font-semibold text-gray-900 dark:text-white'>
                                    {moment(item?._id).format('MMMM Do, YYYY')}
                                  </time>
                                  {/* {console.log(item,'item')} */}
                                  <AnalyticsTopSaleProducts
                                    type={'Monthly Sales'}
                                    className=''
                                    isRequestProduct={isRequestGroupProducts}
                                    products={item?.topSalesProducts}
                                    dateRange={"monthly"}
                                  />
                                </div>
                              )
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </>}
            </div>
          </div>
          <div className='box px-4 py-3 box mt-7 rounded-md'>
            <div>
            <div className='flex items-center justify-between'>
                <h2 className='text-[1rem] font-bold '>Viewed</h2>

                {isOpenViewedMenu ? <IoIosArrowDown size={28} className='cursor-pointer' onClick={() => setIsOpenViewedMenu(false)} /> : <IoIosArrowUp size={28} className='cursor-pointer' onClick={() => setIsOpenViewedMenu(true)} />}
              </div>
          {  isOpenViewedMenu&&  <div className=' p-6 bg-white gap-4 border rounded-md'>
                <div className='w-full md:w-[100%]'>
                  <div className='flex justify-between flex-wrap pb-2'>
                    <div>
                      <h2 className='box-title'>
                        {'Monthly'} Viewed Products
                      </h2>

                      {selectedYear && selectedMonth && (
                        <div className='font-[500]'>
                          <p className='flex items-center '>
                            {' '}
                            Total Views <ImEye className='ml-2 mr-1' />{' '}
                            {isValidArray(groupProducts?.topViewed?.groupProducts)
                              ? groupProducts?.topViewed?.groupProducts.reduce(
                                (acc, curr) => {
                                  return acc + curr?.totalView;
                                },
                                0
                              )
                              : '0'}{' '}
                            (
                            <span>
                              {moment(`${selectedYear}-${selectedMonth}`)
                                .clone()
                                .startOf('month')
                                .format('MMMM Do, YYYY')}
                            </span>{' '}
                            <b className='px-1'>To</b>{' '}
                            <span>
                              {moment(`${selectedYear}-${selectedMonth}`)
                                .clone()
                                .endOf('month')
                                .format('MMMM Do, YYYY')}
                            </span>
                            )
                          </p>
                        </div>
                      )}
                    </div>

                    <div className='pt-4'>{/* date */}</div>
                  </div>

                  <div className='overflow-auto h-full'>
                    {Array.isArray(groupProducts?.topViewed?.groupProducts) &&
                      groupProducts.topViewed.groupProducts.map((item, gTIdx) => (
                        <div key={gTIdx}>
                          <time className='text-[1rem] font-semibold text-gray-900 dark:text-white'>
                            {moment(item?._id).format('MMMM Do, YYYY')} {''}
                          </time>
                          <DashboardTopViewProducts
                            type={
                              query?.isDailyViewed
                                ? 'Daily Viewed'
                                : 'Monthly Viewed'
                            }
                            className=''
                            dateRange="monthly"
                            isRequestProduct={isRequestGroupProducts}
                            products={item?.topViewedProducts}
                          />
                        </div>
                      ))}
                  </div>
                </div>

              </div>}
            </div>
          </div>
        </div>

        {/* <hr className='mt-[30px]'/> */}

      </div>

    </div>
  );
};

Dashboard.layout = 'Contentlayout';

export default Dashboard;
