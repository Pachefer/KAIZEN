'use client';

import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'next/navigation';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

export const Shop: React.FC = () => {
  const params = useParams();
  const category = params.category
    ? decodeURIComponent(params.category as string)
    : 'all';
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLButtonElement>(null);
  const {dishes: data, loading} = hooks.useGetDishes();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    setIsMobile(check());
  }, []);

  const marginTop = constants.sizes.headerHeight + 50 + 10;

  const filteredDishes = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    if (category === 'popular') {
      filtered = data.filter((dish: DishType) => dish.isPopular);
    } else if (category === 'recommended') {
      filtered = data.filter((dish: DishType) => dish.isRecommended);
    } else if (category === 'all' || !category) {
      filtered = data;
    } else {
      filtered = data.filter(
        (dish: DishType) =>
          dish.category?.toLowerCase() === category.toString().toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      return filtered.filter(
        (dish: DishType) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dish.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [data, searchQuery]);

  if (loading) return <components.Loader />;

  const renderHeader = () => {
    return (
      <components.Header showGoBack={true} showBasket={true} title="Shop" />
    );
  };

  const renderSearch = () => {
    return (
      <button
        ref={searchInputRef}
        style={{
          backgroundColor: constants.colors.whiteColor,
          width: '100%',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          height: 50,
          paddingLeft: 20,
          cursor: 'pointer',
          position: 'fixed',
          top: constants.sizes.headerHeight + 10,
          zIndex: 10000,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: isMobile
            ? 'calc(100% - 40px)'
            : constants.sizes.screenWidth - 40,
        }}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          const result = window.prompt('Enter your search query', searchQuery);
          if (result !== null) {
            setSearchQuery(result);
          }
        }}
        type="button"
      >
        <span
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            marginRight: 'auto',
            paddingRight: 20,
            color: searchQuery
              ? constants.colors.mainDarkColor
              : constants.colors.textColor,
          }}
        >
          {searchQuery || 'Search dishes...'}
        </span>
        {/* clear text */}
        {searchQuery && (
          <div
            style={{
              position: 'absolute',
              right: 20,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setSearchQuery('');
            }}
          >
            <span>clear</span>
          </div>
        )}
      </button>
    );
  };

  const renderDishes = () => {
    if (!filteredDishes || filteredDishes.length === 0) {
      return null;
    }
    return (
      <main
        style={{
          padding: 20,
          marginTop: marginTop,
          overflowY: 'auto',
          height: '100%',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 15,
          }}
        >
          {filteredDishes.map((dish: DishType) => {
            return <items.ShopItem key={dish.id} dish={dish} />;
          })}
        </div>
      </main>
    );
  };

  const renderIfEmpty = () => {
    if (filteredDishes.length > 0 || !searchQuery.trim()) {
      return null;
    }
    return (
      <main style={{marginTop: marginTop, width: '100%', height: '100%'}}>
        {filteredDishes.length === 0 && searchQuery.trim() && (
          <div
            style={{
              textAlign: 'center',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{fontSize: 16, color: '#666'}}>
              No dishes found for &quot;{searchQuery}&quot;
            </span>
          </div>
        )}
      </main>
    );
  };

  return (
    <components.MotionWrapper>
      <components.SafeAreaView>
        {renderHeader()}
        {renderSearch()}

        {renderDishes()}
        {renderIfEmpty()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
