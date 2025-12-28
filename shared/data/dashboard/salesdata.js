
import React from 'react';
import dynamic from "next/dynamic";
import { Component } from "react";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const icon1 = <svg className="fill-primary" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" viewBox="0 0 24 24">
  <path className="fill-primary" d="M9,10h2.5c0.276123,0,0.5-0.223877,0.5-0.5S11.776123,9,11.5,9H10V8c0-0.276123-0.223877-0.5-0.5-0.5S9,7.723877,9,8v1c-1.1045532,0-2,0.8954468-2,2s0.8954468,2,2,2h1c0.5523071,0,1,0.4476929,1,1s-0.4476929,1-1,1H7.5C7.223877,15,7,15.223877,7,15.5S7.223877,16,7.5,16H9v1.0005493C9.0001831,17.2765503,9.223999,17.5001831,9.5,17.5h0.0006104C9.7765503,17.4998169,10.0001831,17.276001,10,17v-1c1.1045532,0,2-0.8954468,2-2s-0.8954468-2-2-2H9c-0.5523071,0-1-0.4476929-1-1S8.4476929,10,9,10z M21.5,12H17V2.5c0.000061-0.0875244-0.0228882-0.1735229-0.0665283-0.2493896c-0.1375732-0.2393188-0.4431152-0.3217773-0.6824951-0.1842041l-3.2460327,1.8603516L9.7481079,2.0654297c-0.1536865-0.0878906-0.3424072-0.0878906-0.4960938,0l-3.256897,1.8613281L2.7490234,2.0664062C2.6731567,2.0227661,2.5871582,1.9998779,2.4996338,1.9998779C2.2235718,2.000061,1.9998779,2.223938,2,2.5v17c0.0012817,1.380188,1.119812,2.4987183,2.5,2.5H19c1.6561279-0.0018311,2.9981689-1.3438721,3-3v-6.5006104C21.9998169,12.2234497,21.776001,11.9998169,21.5,12z M4.5,21c-0.828064-0.0009155-1.4990845-0.671936-1.5-1.5V3.3623047l2.7412109,1.5712891c0.1575928,0.0872192,0.348877,0.0875854,0.5068359,0.0009766L9.5,3.0761719l3.2519531,1.8583984c0.157959,0.0866089,0.3492432,0.0862427,0.5068359-0.0009766L16,3.3623047V19c0.0008545,0.7719116,0.3010864,1.4684448,0.7803345,2H4.5z M21,19c0,1.1045532-0.8954468,2-2,2s-2-0.8954468-2-2v-6h4V19z"></path>
</svg>;

const icon2 = <svg className="fill-secondary" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24"
  viewBox="0 0 24 24">
  <path className="fill-secondary"
    d="M9.5,7h7C16.776123,7,17,6.776123,17,6.5S16.776123,6,16.5,6h-7C9.223877,6,9,6.223877,9,6.5S9.223877,7,9.5,7z M7.5,11h9c0.276123,0,0.5-0.223877,0.5-0.5S16.776123,10,16.5,10h-9C7.223877,10,7,10.223877,7,10.5S7.223877,11,7.5,11z M20.5,2H3.4993896C3.2234497,2.0001831,2.9998169,2.223999,3,2.5v19c-0.000061,0.1124268,0.0378418,0.2216187,0.1074829,0.3098755c0.1710205,0.2167358,0.4853516,0.2537231,0.7020874,0.0827026l2.8652344-2.2617188l2.3583984,1.7695312c0.1777954,0.1328125,0.421814,0.1328125,0.5996094,0L12,19.625l2.3671875,1.7753906c0.1777954,0.1328125,0.421814,0.1328125,0.5996094,0l2.3583984-1.7695312l2.8652344,2.2617188C20.2785034,21.9623413,20.3876343,22.0002441,20.5,22h0.0006104C20.7766113,21.9998169,21.0001831,21.7759399,21,21.5V2.4993896C20.9998169,2.2234497,20.776001,1.9998169,20.5,2z M20,20.46875l-2.3574219-1.8613281c-0.0882568-0.069519-0.1972656-0.1072998-0.3095703-0.1074219c-0.1080933-0.000061-0.2132568,0.0349121-0.2998047,0.0996094L14.6669922,20.375l-2.3671875-1.7753906c-0.1777954-0.1328125-0.421814-0.1328125-0.5996094,0L9.3330078,20.375l-2.3662109-1.7753906c-0.1817017-0.1348877-0.4311523-0.1317139-0.609375,0.0078125L4,20.46875V3h16V20.46875z M7.5,15h9c0.276123,0,0.5-0.223877,0.5-0.5S16.776123,14,16.5,14h-9C7.223877,14,7,14.223877,7,14.5S7.223877,15,7.5,15z">
  </path>
</svg>;

const icon3 = <svg className="fill-warning" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24"
  viewBox="0 0 24 24" id="shopping-bag">
  <path className="fill-warning" fill="#4B5563"
    d="M19.5,7H16V5.9169922c0-2.2091064-1.7908325-4-4-4s-4,1.7908936-4,4V7H4.5C4.4998169,7,4.4996338,7,4.4993896,7C4.2234497,7.0001831,3.9998169,7.223999,4,7.5V19c0.0018311,1.6561279,1.3438721,2.9981689,3,3h10c1.6561279-0.0018311,2.9981689-1.3438721,3-3V7.5c0-0.0001831,0-0.0003662,0-0.0006104C19.9998169,7.2234497,19.776001,6.9998169,19.5,7z M9,5.9169922c0-1.6568604,1.3431396-3,3-3s3,1.3431396,3,3V7H9V5.9169922z M19,19c-0.0014038,1.1040039-0.8959961,1.9985962-2,2H7c-1.1040039-0.0014038-1.9985962-0.8959961-2-2V8h3v2.5C8,10.776123,8.223877,11,8.5,11S9,10.776123,9,10.5V8h6v2.5c0,0.0001831,0,0.0003662,0,0.0005493C15.0001831,10.7765503,15.223999,11.0001831,15.5,11c0.0001831,0,0.0003662,0,0.0006104,0C15.7765503,10.9998169,16.0001831,10.776001,16,10.5V8h3V19z">
  </path>
</svg>;

const icon4 = <svg className="fill-success" xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24"
  viewBox="0 0 24 24">
  <path className="fill-success"
    d="M10.75,8H12h0.0006104H15.5C15.776123,8,16,7.776123,16,7.5S15.776123,7,15.5,7h-3V5.5C12.5,5.223877,12.276123,5,12,5s-0.5,0.223877-0.5,0.5V7h-0.75C9.2312012,7,8,8.2312012,8,9.75s1.2312012,2.75,2.75,2.75h2.5c0.9664917,0,1.75,0.7835083,1.75,1.75S14.2164917,16,13.25,16H8.5C8.223877,16,8,16.223877,8,16.5S8.223877,17,8.5,17h3v1.5c0,0.0001831,0,0.0003662,0,0.0005493C11.5001831,18.7765503,11.723999,19.0001831,12,19c0.0001831,0,0.0003662,0,0.0006104,0c0.2759399-0.0001831,0.4995728-0.223999,0.4993896-0.5V17h0.75c1.5187988,0,2.75-1.2312012,2.75-2.75s-1.2312012-2.75-2.75-2.75h-2.5C9.7835083,11.5,9,10.7164917,9,9.75S9.7835083,8,10.75,8z M12,1C5.9248657,1,1,5.9248657,1,12s4.9248657,11,11,11c6.0722656-0.0068359,10.9931641-4.9277344,11-11C23,5.9248657,18.0751343,1,12,1z M12,22C6.4771729,22,2,17.5228271,2,12S6.4771729,2,12,2c5.5201416,0.0064697,9.9935303,4.4798584,10,10C22,17.5228271,17.5228271,22,12,22z">
  </path>
</svg>;

export const sales = [
  { id: 1, class: 'Total Revenue', data: '20%', text: '$26,35,262', icon: icon1, color: 'primary' },
  { id: 2, class: 'Total Sales', data: '1.8%', text: '$56,35,262', icon: icon2, color: 'secondary' },
  { id: 3, class: 'Total Products', data: '1.8%', text: '$4,262', icon: icon3, color: 'warning' },
  { id: 4, class: 'Total Expenses', data: '1.2%', text: '$35,262', icon: icon4, color: 'success' },
];

//Top Customaers

export const customerdata = [
  { id: 1, src: "../../../assets/img/users/2.jpg", class: 'Socrates Itumay', data: '15 Purchases', text: '$1,835' },
  { id: 2, src: "../../../assets/img/users/3.jpg", class: ' Json Taylor', data: '18 Purchases', text: '$2,415' },
  { id: 3, src: "../../../assets/img/users/4.jpg", class: 'Suzika Stallone', data: '21 Purchases', text: '$2,341' },
  { id: 4, src: "../../../assets/img/users/5.jpg", class: 'Angelina Hose', data: '24 Purchases', text: '2,624' },
  { id: 5, src: "../../../assets/img/users/6.jpg", class: 'Selena Deoyl', data: ' 12 Purchases', text: '$1,035' },
  { id: 6, src: "../../../assets/img/users/10.jpg", class: 'Charlie Davieson', data: '15 Purchases', text: '$1,835' },
];

//order details 

export const orderdetails = [
  { id: 1, src: '../../../assets/img/ecommerce/products/1.png', src1: "../../../assets/img/users/2.jpg", class: 'Black Heals For Women', class1: 'Socrates Itumay', data: '10-12-2022', data1: 'socratesitumay@gmail.com', user: '#user1', date: '10-12-2022', color: 'success', text: 'Success', data2: '$999' },
  { id: 2, src: '../../../assets/img/ecommerce/products/2.png', src1: '../../../assets/img/users/3.jpg', class: 'White Tshirt', class1: 'Json Taylor', data: '11-12-2022', data1: 'jsontaylor2416@gmail.com', user: '#user2', date: '11-12-2022', color: 'primary', text: 'Shipping', data2: '$699' },
  { id: 3, src: '../../../assets/img/ecommerce/products/3.png', src1: '../../../assets/img/users/4.jpg', class: 'Jacket For Men', class1: 'Suzika Stallone', data: '12-12-2022', data1: 'suzikastallone3214@gmail.com', user: '#user3', date: '12-12-2022', color: 'warning', text: 'Out For Delivary', data2: '$599' },
  { id: 4, src: '../../../assets/img/ecommerce/products/4.png', src1: '../../../assets/img/users/5.jpg', class: 'Airpods', class1: 'Selena Deoyl', data: '12-12-2022', data1: 'selenadeoyl114@gmail.com', user: '#user4', date: '12-12-2022', color: 'danger', text: 'Cancelled', data2: '$299' },
  { id: 5, src: '../../../assets/img/ecommerce/products/5.png', src1: '../../../assets/img/users/9.jpg', class: 'Jasmine Fragrance', class1: 'Roman Killon', data: '13-12-2022', data1: 'romankillon143@gmail.com', user: '#user5', date: '13-12-2022', color: 'primary', text: 'Ordered', data2: '$299' },
  { id: 6, src: '../../../assets/img/ecommerce/products/6.png', src1: '../../../assets/img/users/10.jpg', class: 'Smart Watch', class1: 'Charlie Davieson', data: '13-12-2022', data1: 'charliedavieson@gmail.com', user: '#user6', date: '13-12-2022	', color: 'secondary', text: 'Packed', data2: '$299' },
];

//Top Selling Products

export const topselling = [
  { id: 1, src: "../../../assets/img/ecommerce/products/13.png", data1: 'Ethnic School bag for children (24L)', data: 'Bags', color: 'success', text: 'In Stock', sale: '5,093' },
  { id: 2, src: "../../../assets/img/ecommerce/products/14.png", data1: 'Leather jacket for men (S,M,L,XL)', data: 'Clothing', color: 'success', text: 'In Stock', sale: '6,890' },
  { id: 3, src: "../../../assets/img/ecommerce/products/15.png", data1: 'Childrens Teddy toy of high quality', data: 'Toys', color: 'danger', text: 'Out Of Stock', sale: '5,423' },
  { id: 4, src: "../../../assets/img/ecommerce/products/16.png", data1: 'Orange smart watch (24mm)', data: 'Fashion', color: 'danger', text: 'Out Of Stock', sale: '10,234' },
  { id: 5, src: "../../../assets/img/ecommerce/products/17.png", data1: 'Black Camera', data: 'Electronic', color: 'success', text: 'In Stock', sale: '10,234' },
  { id: 6, src: "../../../assets/img/ecommerce/products/18.png", data1: 'Hand Bag For Ladies', data: 'Fashion', color: 'danger', text: 'Out Of Stock', sale: '1,034' },
];

//Upcoming Products

export const products = [
  { id: 1, src: '../../../assets/img/ecommerce/jpg/1.jpg', data: 'Smart Phone', data1: 'Mobile', text: '$199.99' },
  { id: 2, src: '../../../assets/img/ecommerce/jpg/2.jpg', data: 'White Headphones', data1: 'Music', text: '$79.49' },
  { id: 3, src: '../../../assets/img/ecommerce/jpg/3.jpg', data: 'Stop Watch', data1: 'Electronics', text: '$49.29' },
  { id: 4, src: '../../../assets/img/ecommerce/jpg/4.jpg', data: 'Kikon Camera', data1: 'Electronics', text: '$1,699.00' },
  { id: 5, src: '../../../assets/img/ecommerce/jpg/6.jpg', data: 'Kids Shoes', data1: 'Clothing', text: '$149.00' },
  { id: 6, src: '../../../assets/img/ecommerce/jpg/5.jpg', data: 'Photo Frame', data1: 'Furniture', text: '$29.99' },
];

//Sales Over View

export class SalesOverView extends Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [
        {
          name: "Income",
          data: [20, 38, 38, 72, 55, 63, 43, 76, 55, 80, 40, 80],
        },
        {
          name: "Expenses",
          data: [85, 65, 75, 38, 85, 35, 62, 40, 40, 64, 50, 89],
        },
      ],
      options: {
        chart: {
          animations: {
            enabled: false,
          },
          type: "bar",
          zoom: {
            enabled: false,
          },
          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            endingShape: "rounded",
            borderRadius: 5,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: false,
        },
        stroke: {
          show: true,
          width: 3,
          colors: ["transparent"],
        },
        grid: {
          borderColor: "rgba(107 ,114 ,128,0.1)",
        },
        colors: ["rgb(90,102,241)", "rgb(203,213,225)"],
        yaxis: {
          title: {
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
          labels: {
            style: {
              colors: "rgb(107 ,114 ,128)",
              fontSize: "12px",
            },
            formatter: function (y) {
              return y.toFixed(0) + "";
            },
          },
        },
        xaxis: {
          type: "month",
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
            style: {
              colors: "rgb(107 ,114 ,128)",
              fontSize: "12px",
            },
          },
        },
      },
    };
  }

  render() {
    return (

      <div>
        <ReactApexChart height={280} options={this.state.options} series={this.state.series} type="bar" />
      </div>
    );
  }
};

//Social visitors

export class SocialVisitor extends Component {
  constructor(props) {
    super(props);

    this.state = {

      series: [
        {
          data: [400, 470, 540, 690, 1100, 1380],
        },
      ],
      options: {
        chart: {
          redrawOnWindowResize: true,
          type: "bar",
          height: 370,
          toolbar: {
            show: false,
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 1,
            colorStops: [
              {
                offset: 0,
                color: "#60a5fa",
                opacity: 1,
              },
              {
                offset: 100,
                color: "#5a66f1",
                opacity: 1,
              },
            ],
          },
        },
        plotOptions: {
          bar: {
            borderRadius: 4,
            horizontal: true,
          },
        },
        colors: ["#5e76a6"],
        grid: {
          borderColor: "transparent",
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: [
            "Facebook",
            "Instagram",
            "Dribble",
            "Twitter",
            "Chrome",
            "Pininterest",
          ],
          axisBorder: {
            show: true,
            color: 'rgba(119, 119, 142, 0.1)',
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: 'solid',
            color: 'rgba(119, 119, 142, 0.1)',
            width: 6,
            offsetX: 0,
            offsetY: 0
          },
          labels: {
            show: true,
            rotate: -90,
            style: {
              colors: "#adb5be",
              fontSize: "11px",
              fontWeight: 600,
              cssclassName: "apexcharts-xaxis-label",
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            style: {
              colors: "#adb5be",
              fontSize: "11px",
              fontWeight: 600,
              cssclassName: "apexcharts-yaxis-label",
            },
          },
        },
      },
    };
  }

  render() {
    return (

      <div className='visitors'>
        <ReactApexChart height={370} options={this.state.options} series={this.state.series} type="bar" />
      </div>
    );
  }
};
