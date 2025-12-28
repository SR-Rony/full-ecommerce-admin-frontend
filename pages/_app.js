import Authenticationlayout from '@/shared/layout-components/layout/authentication-layout';
import Contentlayout from "@/shared/layout-components/layout/content-layout";
import Landingpagelayout from '@/shared/layout-components/layout/landingpage-layout';
import Pagelayout from '@/shared/layout-components/layout/page-layout';
import store from "@/shared/redux/store";
import { Providers } from '@/shared/stage/Providers';
import { ToastContainer } from '@/utils/Toast';
import { Provider } from "react-redux";

// SCSS imports
// import '../styles/scss/style.scss';   // main SCSS entry (partials imported here)
// import '../styles/globals.scss';       // global styles
// import 'sweetalert2/src/sweetalert2.scss';

const layouts = {
  Contentlayout,
  Pagelayout,
  Landingpagelayout,
  Authenticationlayout,
};

function MyApp({ Component, pageProps }) {
  // যদি Component.layout না থাকে, fallback হিসেবে simple fragment use করবে
  const Layout = layouts[Component.layout] || (({ children }) => <>{children}</>);

  return (
    <Provider store={store}>
      <Providers>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <ToastContainer/>
      </Providers>
    </Provider>
  );
}

export default MyApp;
