'use client';

import React from 'react';

import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';

export const MyFavorite: React.FC = () => {
  const favorites = useAppSelector((state) => state.wishlist.list);

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="My Favorite" />;
  };

  const renderContent = () => {
    if (favorites.length > 0) {
      return (
        <main
          style={{
            marginTop: constants.sizes.headerHeight + 20,
            overflowY: 'auto',
            paddingBottom: 20,
          }}
        >
          <ul
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              ...constants.flex.flexColumn,
              gap: 20,
            }}
          >
            {favorites.map((dish: DishType) => {
              return <items.FavoriteItem key={dish.id} dish={dish} />;
            })}
          </ul>
        </main>
      );
    }

    return null;
  };

  const renderIfEmpty = () => {
    if (favorites.length === 0) {
      return (
        <main
          style={{
            marginTop: constants.sizes.headerHeight,
            ...constants.flex.columnCenterCenter,
            height: '100%',
            width: '100%',
          }}
        >
          <span
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: constants.colors.textColor,
              textAlign: 'center',
            }}
          >
            You have no favorite dishes yet. <br /> Start adding some!
          </span>
        </main>
      );
    }

    return null;
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderIfEmpty()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
