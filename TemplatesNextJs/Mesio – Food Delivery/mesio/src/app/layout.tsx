import {Roboto} from 'next/font/google';

import type {Metadata, Viewport} from 'next';
import StoreProvider from '@/app/StoreProvider';
import {BurgerContacts} from '@/components/BurgerContacts';

const APP_NAME = 'Mesio';
const APP_DEFAULT_TITLE = 'Mesio - PWA App';
const APP_TITLE_TEMPLATE = '%s - Mesio';
const APP_DESCRIPTION =
  'Mesio is a Progressive Web App designed to provide a seamless user experience across devices.';

import 'swiper/css';
import '../css/reset.css';
import '../css/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#FFFFFF',
};

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        style={{
          position: 'relative',
          margin: '0 auto',
        }}
        className={`${roboto.variable}`}
      >
        <StoreProvider>
          <BurgerContacts />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
