'use client';

import React from 'react';
import Link from 'next/link';

import {svg} from '@/assets/svg';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';
import {wishlistActions} from '@/lib/wishlistSlice';

type Props = {
  dish: DishType;
};

export const PopularItem: React.FC<Props> = ({dish}) => {
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  const isInWishlist = wishlist.some((item) => item.id === dish.id);
  const inCart = cart.find((item) => item.id === dish?.id);

  return (
    <Link
      href={`${constants.routes.dish}/${dish.id}`}
      style={{
        borderRadius: 10,
        maxWidth: 155,
        width: '100%',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        paddingTop: 4,
        position: 'relative',
        ...constants.styles.boxShadow,
      }}
    >
      <img
        src={dish.image}
        alt={dish.name}
        style={{width: '100%', height: 'auto', objectFit: 'contain'}}
      />
      <h2
        className="number-of-lines-1"
        style={{
          fontSize: 14,
          textAlign: 'center',
          color: constants.colors.mainDarkColor,
          marginBottom: 5,
          fontWeight: 500,
          marginLeft: 5,
          marginRight: 5,
          textTransform: 'capitalize',
        }}
      >
        {dish.name}
      </h2>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          justifyContent: 'center',
          marginBottom: 11,
        }}
      >
        <components.Rating rating={dish.rating} />
        <span style={{fontSize: 12, color: constants.colors.textColor}}>
          {dish.rating}
        </span>
      </div>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          textAlign: 'center',
          margin: '0 auto',
          display: 'block',
          color: '#FE724E',
          marginBottom: 11,
        }}
      >
        ${dish.price?.toFixed(2) || '0'}
      </span>
      <components.AddToCart dish={dish} />
      <button
        style={{position: 'absolute', top: 0, right: 0, padding: 12}}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          dispatch(cartActions.addToCart(dish));
        }}
      >
        <components.AddToCartIcon inCart={inCart ? true : false} />
      </button>
      <button
        style={{position: 'absolute', top: 0, left: 0, padding: 12}}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (dish) {
            if (isInWishlist) {
              dispatch(wishlistActions.removeFromWishlist(dish));
            } else {
              dispatch(wishlistActions.addToWishlist(dish));
            }
          }
        }}
      >
        <svg.WishlistAddSvg
          color={isInWishlist ? constants.colors.redColor : '#BDBDBD'}
        />
      </button>
    </Link>
  );
};
