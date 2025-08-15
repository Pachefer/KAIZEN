'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';
import {wishlistActions} from '@/lib/wishlistSlice';

type Props = {
  id: string;
};

export const Dish: React.FC<Props> = ({id}) => {
  const dispatch = useAppDispatch();
  const {dish, isLoading} = hooks.useGetDish(Number(id));
  const wishlist = useAppSelector((state) => state.wishlist.list);
  const cart = useAppSelector((state) => state.cart.list);
  hooks.useThemeColor('#FFF');
  hooks.useBodyColor('#FFF');

  if (isLoading) return <components.Loader />;

  const inCart = cart.find((item) => item.id === dish?.id);
  const quantity = inCart ? inCart.quantity : 0;
  const isInWishlist = wishlist.some((item) => item.id === dish?.id);

  const handleAddToCart = () => {
    if (dish) {
      dispatch(cartActions.addToCart(dish));

      if (quantity) {
        return;
      }
    }
  };

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showBasket={true}
        title="Dish Details"
        containerStyle={{backgroundColor: 'transparent'}}
      />
    );
  };

  const renderImage = () => {
    return (
      <div
        style={{
          position: 'relative',
          marginBottom: 30,
        }}
      >
        <img
          src={dish?.image}
          alt={dish?.name}
          style={{
            width: '100%',
          }}
        />

        <button
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 20,
            padding: 20,
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (dish) {
              dispatch(wishlistActions.addToWishlist(dish));
            }
          }}
        >
          <components.InWishlist
            fillColor={
              isInWishlist ? constants.colors.mainColor2 : 'transparent'
            }
            strokeColor={
              isInWishlist
                ? constants.colors.mainColor2
                : constants.colors.textColor
            }
          />
        </button>
      </div>
    );
  };

  const renderNameAndDescription = () => {
    return (
      <section style={{paddingLeft: 20, paddingRight: 20, marginBottom: 14}}>
        <h4
          style={{
            marginBottom: 7,
            ...constants.typography.h4,
          }}
          className="number-of-lines-1"
        >
          {dish?.name}
        </h4>
        <p style={{fontSize: 16, lineHeight: 1.5}}>{dish?.description}</p>
      </section>
    );
  };

  const renderPriceAndCounter = () => {
    return (
      <section
        style={{
          marginBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
          ...constants.flex.rowCenterBetween,
        }}
      >
        <span style={{fontSize: 24, color: '#FE724E', fontWeight: 700}}>
          ${dish?.price.toFixed(2)}{' '}
          <span
            style={{
              fontSize: 14,
              color: constants.colors.textColor,
              fontWeight: 600,
            }}
          >
            {dish?.weight && `${dish?.weight}g`}
          </span>
        </span>
        <div
          style={{
            backgroundColor: '#EEF3FC',
            padding: 10,
            borderRadius: 5,
            ...constants.flex.rowCenterBetween,
            gap: 24,
            height: 50,
            width: 138,
            right: 6,
            bottom: 6,
            paddingLeft: 16.89,
            paddingRight: 16.89,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(cartActions.removeFromCart(dish!));
            }}
          >
            <svg.CounterMinusSvg />
          </button>
          <span style={{fontSize: 14, fontWeight: 600}}>{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(cartActions.addToCart(dish!));
            }}
          >
            <svg.CounterPlusSvg />
          </button>
        </div>
      </section>
    );
  };

  const renderButton = () => {
    return (
      <div style={{marginBottom: 40, paddingLeft: 20, paddingRight: 20}}>
        <components.Button
          label={
            inCart?.quantity ? `Add more (${inCart.quantity})` : 'Add to Cart'
          }
          containerStyle={{marginBottom: 10}}
          onClickAction={() => {
            handleAddToCart();
          }}
        />
      </div>
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 10,
          overflowY: 'auto',
        }}
      >
        {renderImage()}
        {renderNameAndDescription()}
        {renderPriceAndCounter()}
        {renderButton()}
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
