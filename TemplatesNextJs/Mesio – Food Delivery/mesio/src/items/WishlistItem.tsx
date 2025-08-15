'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {svg} from '@/assets/svg';
import {DishType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppSelector} from '@/lib/store';
import {useAppDispatch} from '@/lib/store';
import {wishlistActions} from '@/lib/wishlistSlice';

type Props = {
  dish: DishType;
};

export const WishlistItem: React.FC<Props> = ({dish}) => {
  const navigate = useRouter();
  const dispatch = useAppDispatch();

  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  const isInWishlist = wishlist.some((item) => item.id === dish?.id);

  function getWords(text: string) {
    if (!text) return '';
    const words = text.split(' ');
    if (words.length <= 2) return text;
    return words.slice(0, 3).join(' ') + '…';
  }

  return (
    <li
      style={{
        gap: 4,
        ...constants.flex.rowCenter,
        ...constants.styles.boxShadow,
        borderRadius: 10,
        padding: 6,
        paddingTop: 0,
        paddingLeft: 0,
        paddingRight: 20,
        width: '100%',
      }}
    >
      <button
        onClick={() => {
          navigate.push(`${constants.routes.dish}/${dish.id}`);
        }}
      >
        <img
          src={dish.image}
          alt={dish.name}
          style={{width: 100, height: 'auto', borderRadius: 10}}
        />
      </button>

      <div style={{display: 'flex', flexDirection: 'column', flex: 1}}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            justifyContent: 'space-between',
          }}
        >
          <h2
            style={{
              fontSize: 14,
              color: constants.colors.mainDarkColor,
              fontWeight: 500,
              marginBottom: 6,
              textTransform: 'capitalize',
            }}
          >
            {dish.name}
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              dispatch(wishlistActions.removeFromWishlist(dish));
            }}
          >
            <svg.WishlistAddSvg
              color={isInWishlist ? constants.colors.redColor : '#BDBDBD'}
            />
          </button>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginBottom: 2,
          }}
        >
          <components.Rating rating={3} />
          <span style={{fontSize: 12, color: constants.colors.textColor}}>
            ({dish.rating})
          </span>
        </div>
        <p
          style={{fontSize: 12, color: '#666', marginTop: 4}}
          className="number-of-lines-1"
        >
          {getWords(dish.ingredients?.join(', ') || 'No ingredients')}
        </p>
      </div>
    </li>
  );
};
