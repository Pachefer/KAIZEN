'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

const menuItems = [
  {
    id: 1,
    title: 'Add new card',
    icon: svg.CreditCardSvg,
    link: constants.routes.openNewCard,
  },
  {
    id: 2,
    title: 'Create invoice',
    icon: svg.EditSvg,
    link: constants.routes.createInvoice,
  },
  {
    id: 3,
    title: 'Statistics',
    icon: svg.BarChartSvg,
    link: constants.routes.statistics,
  },
  {
    id: 4,
    title: 'Scanner QR',
    icon: svg.ScannerSvg,
    link: null,
  },
  {
    id: 5,
    title: 'FAQ',
    icon: svg.HelpCircleSvg,
    link: constants.routes.faq,
  },
  {
    id: 6,
    title: 'Support',
    icon: svg.MessageSvg,
    link: null,
  },
  {
    id: 7,
    title: 'Charity',
    icon: svg.HeartSvg,
    link: null,
  },
  {
    id: 8,
    title: 'Privacy policy',
    icon: svg.FileTextSvg,
    link: constants.routes.privacyPolicy,
  },
];

export const More: React.FC = () => {
  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const router = useRouter();

  const isMobile = hooks.useIsMobile();

  const renderContent = () => {
    return (
      <main
        style={{
          paddingTop: constants.sizes.headerHeight,
          marginBottom: constants.sizes.tabBarHeight,
          paddingLeft: 20,
          paddingRight: 20,
          overflowY: 'auto',
          paddingBottom: 20,
        }}
      >
        <h2 style={{...constants.typography.h2, marginBottom: 20}}>More</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 14,
          }}
        >
          {menuItems.map((item) => {
            return (
              <button
                key={item.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  paddingTop: 23,
                  paddingBottom: 23,
                  backgroundColor: constants.colors.whiteColor,
                }}
                onClick={() => {
                  if (item.link) {
                    router.push(item.link);
                  } else {
                    alert('Link not available');
                  }
                }}
              >
                <item.icon />
                <h5 style={{...constants.typography.h5, marginTop: 12}}>
                  {item.title}
                </h5>
              </button>
            );
          })}
        </div>
      </main>
    );
  };

  const renderBottomBar = () => {
    return <components.BottomTabBar />;
  };

  const renderHomeIndicatorBG = () => {
    return (
      <div
        style={{
          backgroundColor: constants.colors.whiteColor,
          height: 'env(safe-area-inset-bottom, 0px)',
          width: isMobile ? '100%' : constants.sizes.screenWidth,
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      ></div>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderContent()}
        {renderBottomBar()}
      </components.SafeAreaView>
      {renderHomeIndicatorBG()}
    </components.MotionWrapper>
  );
};
