'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {constants} from '@/constants';
import {components} from '@/components';

export const MyPromocodes: React.FC = () => {
  const {promocodes, isLoading} = hooks.useGetPromocodes();

  if (isLoading) return <components.Loader />;

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="My Promocodes" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: 20,
          ...constants.flex.column,
          gap: 10,
        }}
      >
        {promocodes?.map((promocode: any) => {
          return (
            <items.PromocodeItem key={promocode.id} promocode={promocode} />
          );
        })}
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
