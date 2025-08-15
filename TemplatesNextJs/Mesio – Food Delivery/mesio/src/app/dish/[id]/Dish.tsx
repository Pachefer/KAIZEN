'use client';

import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';

import {items} from '@/items';
import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {ReviewType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';
import {useAppDispatch} from '@/lib/store';
import {useAppSelector} from '@/lib/store';
import {cartActions} from '@/lib/cartSlice';
import {wishlistActions} from '@/lib/wishlistSlice';

type Props = {
  id: string;
};

export const Dish: React.FC<Props> = ({id}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {list: cart} = useAppSelector((state) => state.cart);
  const {list: wishlist} = useAppSelector((state) => state.wishlist);
  const {reviews, isLoading: reviewsIsLoading} = hooks.useGetReviews();

  const isInWishlist = wishlist.some((item) => item.id === Number(id));

  const {dish, isLoading} = hooks.useGetDish(Number(id));

  if (isLoading || reviewsIsLoading) return <components.Loader />;

  const inCart = cart.find((item) => item.id === dish?.id);

  const renderHeader = () => {
    return (
      <components.Header
        showGoBack={true}
        showBasket={true}
        title="Dish Details"
      />
    );
  };

  const renderImage = () => {
    return (
      <div
        style={{
          position: 'relative',
          marginBottom: 10,
          paddingLeft: 20,
          paddingRight: 20,
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
            zIndex: 10,
            padding: 10,
          }}
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
          <components.InWishlist
            fillColor={isInWishlist ? constants.colors.redColor : 'transparent'}
            strokeColor={
              isInWishlist
                ? constants.colors.redColor
                : constants.colors.textColor
            }
          />
        </button>
      </div>
    );
  };

  const renderNameAndDescription = () => {
    return (
      <section>
        <h1
          style={{
            fontSize: 18,
            color: constants.colors.mainDarkColor,
            fontWeight: 600,
            marginBottom: 7,
          }}
        >
          {dish?.name}
        </h1>
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.5,
            marginBottom: 14,
            color: constants.colors.textColor,
          }}
        >
          {dish?.description}
        </p>
      </section>
    );
  };

  const renderPriceAndRating = () => {
    return (
      <section
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 20,
        }}
      >
        <span style={{fontSize: 24, color: '#FE724E', fontWeight: 700}}>
          ${dish?.price.toFixed(2)}
        </span>
        <Link
          href={constants.routes.reviews}
          style={{
            marginBottom: 1,
            ...constants.flex.row,
            gap: 5,
          }}
        >
          <svg.StarSvg />
          <span style={{color: constants.colors.textColor}}>
            {reviews?.length} Review
          </span>
        </Link>
      </section>
    );
  };

  const renderButtons = () => {
    return (
      <div style={{marginBottom: 40}}>
        <components.Button
          label={`Add to Cart - (${inCart ? inCart.quantity : 0})`}
          containerStyle={{marginBottom: 10}}
          onClickAction={() => {
            if (dish) {
              dispatch(cartActions.addToCart(dish));
            }
          }}
        />
        {inCart && (
          <components.Button
            label={'Remove from Cart'}
            colorScheme="secondary"
            onClickAction={() => {
              if (dish) {
                dispatch(cartActions.removeFromCart(dish));
              }
            }}
          />
        )}
      </div>
    );
  };

  const renderReviews = () => {
    return (
      <div>
        <components.BlockHeading
          title={`Happy clients say (${reviews?.length || 0})`}
          href={constants.routes.reviews}
          containerStyle={{paddingLeft: 0, paddingRight: 0, marginBottom: 14}}
        />
        <ul
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 14,
            marginBottom: 20,
          }}
        >
          {reviews.slice(0, 3).map((review: ReviewType) => {
            return <items.ReviewItem key={review.id} review={review} />;
          })}
        </ul>
        <components.Button
          label="Leave a Review"
          onClickAction={() => {
            router.push(constants.routes.leaveAReview);
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
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: 25,
          overflowY: 'auto',
        }}
      >
        {renderImage()}
        {renderNameAndDescription()}
        {renderPriceAndRating()}
        {renderButtons()}
        {renderReviews()}
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
