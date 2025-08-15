'use client';

import React from 'react';
import Link from 'next/link';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const Offers: React.FC = () => {
  hooks.useThemeColor('#EEF3FC');
  hooks.useBodyColor('#EEF3FC');

  const {offers: data, loading: isLoading} = hooks.useGetOffers();

  if (isLoading) return <components.Loader />;

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="All Offers" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingTop: constants.sizes.headerHeight + 10,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          overflowY: 'auto',
        }}
      >
        <ul style={{...constants.flex.flexColumn, gap: 16}}>
          {data.map((offer: any) => {
            return (
              <li key={offer.id}>
                <Link href={`${constants.routes.dish}/2`}>
                  <img
                    src={offer.image}
                    alt={offer.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 5,
                      objectFit: 'cover',
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
