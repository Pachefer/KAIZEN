'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {ReviewType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

export const Reviews: React.FC = () => {
  const {reviews, isLoading} = hooks.useGetReviews();

  if (isLoading) return <components.Loader />;

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Reviews" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 18,
          overflowY: 'auto',
          paddingBottom: 20,
        }}
      >
        <ul style={{...constants.flex.column, gap: 14}}>
          {reviews?.map((review: ReviewType) => {
            return <items.ReviewItem key={review.id} review={review} />;
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
