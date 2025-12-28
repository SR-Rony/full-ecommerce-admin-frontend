import { BsChat } from "react-icons/bs";
import { CgDropOpacity } from "react-icons/cg";
import { FaCar, FaShoppingBag, FaWallet } from "react-icons/fa";
import { FaEnvelopesBulk } from "react-icons/fa6";
import { GrChatOption } from "react-icons/gr";
import { IoMdGift } from "react-icons/io";
import { IoTicketOutline } from "react-icons/io5";
import {
  MdOutlineAnalytics,
  MdOutlineContactSupport,
  MdOutlineSettingsApplications,
} from "react-icons/md";
import { RiCoupon2Line, RiProductHuntLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";

//Svg icons of Dashboard

const DashboardSvg = <i className="ri-home-8-line side-menu__icon"></i>;

const NestedSvg = <i className="ri-node-tree side-menu__icon"></i>;

const AuthenticationSvg = (
  <i className="ri-error-warning-line side-menu__icon"></i>
);

export const MenuItems = [
  {
    menutitle: "Main Dashboard",
    Items: [
      {
        icon: DashboardSvg,
        title: "Dashboard",
        path: `/admin/dashboard`,
        type: "link",
        active: false,
        selected: false,
      },
      // {
      // 	icon: <MdSupportAgent />, title: "Live Support", path: `/admin/support/`, type: "link", active: false, selected: false,
      // },
      {
        icon: <MdOutlineAnalytics />,
        title: "Analytics",
        path: `/admin/analytics`,
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <RiProductHuntLine size={18} />,
        title: "Products",
        path: `/admin/products/alls`,
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            title: "All",
            path: `/admin/products/all`,
            type: "link",
            active: false,
            selected: false,
          },
          {
            title: "Inactive",
            path: `/admin/products/inactive`,
            type: "link",
            active: false,
            selected: false,
          },
        ],
      },
      {
        icon: <RiProductHuntLine size={18} />,
        title: "Lab Tested Products",
        path: `/admin/lab-tested-products`,
        type: "link",
      },
      {
        icon: <RiProductHuntLine size={18} />,
        title: "Freebie",
        path: "/admin/freebie",
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <RiProductHuntLine size={18} />,
        title: "Large Discount Products",
        path: "/admin/large-discount-products",
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <RxAvatar />,
        path: `/admin/customers/alls`,
        title: "Customers",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            title: "Customers",
            path: `/admin/customers/all`,
            type: "link",
            active: false,
            selected: false,
          },

          {
            title: "Test Customers",
            path: `/admin/customers/test-customers`,
            type: "link",
            active: false,
            selected: false,
          },

        ],
      },
      {
        icon: <FaWallet />,
        title: "Credit Balance",
        path: "/admin/wallet/balances",
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <FaShoppingBag />,
        path: `/admin/orders/alls`,
        title: "Orders",
        type: "sub",
        active: false,
        selected: false,
        children: [
          {
            title: "Orders",
            path: `/admin/orders/all`,
            type: "link",
            active: false,
            selected: false,
          },
          {
            title: "Pending",
            path: `/admin/orders/pending`,
            type: "link",
            active: false,
            selected: false,
          },
          {
            title: "Test Orders",
            path: `/admin/orders/test-orders`,
            type: "link",
            active: false,
            selected: false,
          },
          {
            title: "Add Order",
            path: `/admin/orders/new-order`,
            type: "link",
            active: false,
            selected: false,
          },
        ],
      },
      { // bulk-nav
        icon: <FaEnvelopesBulk />, title: "Bulk Contact", type: "link", path: `/admin/bulk-contact/custom-mail`, active: false, selected: false,
      },
      {
        icon: <FaCar />,
        title: "Shipping",
        path: `/admin/country/shipping`,
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <RiCoupon2Line />,
        title: "Coupons",
        path: `/admin/coupons/all`,
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <IoTicketOutline className="side-menu__icon" />,
        title: "Support Tickets",
        path: `/admin/support`,
        type: "link",
        active: false,
        selected: false,
      },
    ],
  },
  {
    menutitle: "App Settings",
    Items: [
      {
        icon: <MdOutlineSettingsApplications />,
        title: "App Info",
        path: `/admin/app-settings/app-info`,
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <IoMdGift />,
        title: "Freebie Setting",
        path: `/admin/app-settings/freebie`,
        type: "link",
        active: false,
        selected: false,
      },

      {
        icon: <MdOutlineContactSupport />,
        title: "Contact",
        path: `/admin/app-settings/contact`,
        type: "link",
        active: false,
        selected: false,
      },
      {
        icon: <CgDropOpacity />,

        title: "Popup",
        path: `/admin/app-settings/popups`,
        type: "link",
        active: false,
        selected: false,
      },
    ],
  },
  {
    menutitle: "Chats",
    Items: [
      {
        icon: <GrChatOption />,
        title: "Chat Options",
        type: "link",
        path: `/admin/chats/options`,
        active: false,
        selected: false,
        children: [],
      },
      {
        icon: <BsChat />,
        title: "Chats",
        type: "link",
        path: `/admin/chats/all`,
        active: false,
        selected: false,
        children: [],
      },
    ],
  },
  {
    menutitle: "Users",
    Items: [
      {
        icon: <RxAvatar />,
        title: "Admins",
        type: "link",
        path: `/admin/users/all`,
        active: false,
        selected: false,
        children: [],
      },
    ],
  },
];
export default MenuItems;
