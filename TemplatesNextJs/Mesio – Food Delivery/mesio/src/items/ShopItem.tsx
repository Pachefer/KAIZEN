'use client';

import Link from 'next/link';
import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';
import {wishlistActions} from '@/lib/wishlistSlice';

import type {DishType} from '@/types';

type Props = {
  dish: DishType;
};

export const ShopItem: React.FC<Props> = ({dish}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  const isInWishlist = wishlist.some((item: DishType) => item.id === dish?.id);

  function getFirstTwoWords(text: string) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 2) return text;
    return words.slice(0, 2).join(' ') + '…';
  }

  return (
    <Link
      href={`${constants.routes.dish}/${dish.id}`}
      style={{
        ...constants.styles.boxShadow,
        borderRadius: 10,
        padding: 12,
        paddingTop: 3,
        position: 'relative',
      }}
    >
      <button
        onClick={() => router.push(`${constants.routes.dish}/${dish.id}`)}
      >
        <img src={dish.image} alt={dish.name} style={{width: '100%'}} />
      </button>
      <button
        style={{position: 'absolute', top: 0, right: 0, padding: 10}}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          dispatch(cartActions.addToCart(dish));
        }}
      >
        <svg.AddToCartSvg />
      </button>
      <button
        style={{position: 'absolute', top: 0, left: 0, padding: 10}}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          dispatch(wishlistActions.addToWishlist(dish));
        }}
      >
        <svg.WishlistAddSvg
          color={isInWishlist ? constants.colors.redColor : '#BDBDBD'}
        />
      </button>
      <h2
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
      <p
        style={{
          fontSize: 14,
          textAlign: 'center',
          marginBottom: 14,
          color: constants.colors.textColor,
        }}
      >
        {getFirstTwoWords(dish.ingredients?.join(', ') || 'No ingredients')}
      </p>
      <span
        style={{
          textAlign: 'center',
          display: 'block',
          fontSize: 14,
          fontWeight: 600,
          color: '#FE724E',
          marginBottom: 10,
        }}
      >
        ${dish.price.toFixed(2)}
      </span>
      <components.AddToCart dish={dish} />
    </Link>
  );
};
