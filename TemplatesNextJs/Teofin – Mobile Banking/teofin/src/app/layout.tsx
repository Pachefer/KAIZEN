import type {Metadata, Viewport} from 'next';
import {Mulish} from 'next/font/google';

import '../css/reset.css';
import '../css/globals.css';
import StoreProvider from '@/app/StoreProvider';

const mulish = Mulish({
  variable: '--font-mulish',
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#EDF0F2',
};

const APP_NAME = 'Teofin';
const APP_DEFAULT_TITLE = 'Teofin - PWA App';
const APP_TITLE_TEMPLATE = '%s - Teofin';
const APP_DESCRIPTION =
  'Teofin is a Progressive Web App designed to provide a seamless user experience across devices.';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${mulish.variable}`}
        style={{
          position: 'relative',
          margin: '0 auto',
        }}
      >
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
