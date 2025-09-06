// import { Provider } from 'next-auth/client';
// import { Provider } from 'next-auth/react';

// import Layout from '../components/layout/layout';
// import '../styles/globals.css';

// function MyApp({ Component, pageProps }) {
//   return (
//     <Provider session={pageProps.session}>
//       <Layout>
//         <Component {...pageProps} />
//       </Layout>
//     </Provider>
//   );
// }

// export default MyApp;


import { SessionProvider } from 'next-auth/react';

import Layout from '../components/layout/layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  );
}

export default MyApp;