'use client';

import React from 'react';
import Link from 'next/link';

import {ReviewType} from '@/types';
import {constants} from '@/constants';
import {components} from '@/components';

type Props = {
  review: ReviewType;
};

export const ReviewItem: React.FC<Props> = ({review}) => {
  return (
    <li
      style={{
        backgroundColor: constants.colors.whiteColor,
        ...constants.styles.boxShadow,
        padding: 20,
        borderRadius: 10,
      }}
    >
      {/* top block */}
      <div
        style={{
          ...constants.flex.row,
          marginBottom: 11,
          borderBottom: '1px solid #E0E0E0',
          paddingBottom: 11,
          gap: 14,
        }}
      >
        <img
          src={review.avatar}
          alt={review.name}
          style={{width: 30, height: 30, borderRadius: '50%'}}
        />
        <div style={{flex: 1}}>
          <div
            style={{
              flex: 1,
              ...constants.flex.rowCenterBetween,
              marginBottom: 2,
            }}
          >
            <h5 style={{color: constants.colors.mainDarkColor, fontSize: 14}}>
              {review.name}
            </h5>
            <span style={{fontSize: 12}}>{review.date}</span>
          </div>
          <div style={{flex: 1, ...constants.flex.rowCenterBetween}}>
            <components.Rating rating={review.rating} />
            <Link
              href={constants.routes.commentReply}
              style={{fontSize: 10, color: constants.colors.seaGreenColor}}
            >
              Reply
            </Link>
          </div>
        </div>
      </div>
      {/* botttom block */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.5,
          color: constants.colors.textColor,
        }}
      >
        {review.comment}
      </p>
    </li>
  );
};
