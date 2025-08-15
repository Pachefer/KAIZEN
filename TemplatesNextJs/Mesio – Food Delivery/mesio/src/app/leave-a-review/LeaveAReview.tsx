'use client';

import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const LeaveAReview: React.FC = () => {
  const router = useRouter();

  const [rating, setRating] = useState<number>(0);

  const {form, handleChangeField} = hooks.useFormField({comment: ''});

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Leave a review" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          height: '100%',
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <section style={{width: '100%'}}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <svg.CommentSvg />
          </div>

          <p
            className="t16"
            style={{
              textAlign: 'center',
              marginBottom: 20,
              color: constants.colors.textColor,
            }}
          >
            Your comments and suggestions help <br /> us improve the service
            quality better!
          </p>
          <components.RatingStars
            rating={rating}
            setRatingAction={setRating}
            containerStyle={{marginBottom: 20}}
          />
          <button
            style={{
              marginBottom: 20,
              borderRadius: 10,
              width: '100%',
              backgroundColor: constants.colors.lightGrayColor,
            }}
            value={form.comment}
            onClick={() => handleChangeField('comment', 'comment')}
          >
            <p
              style={{
                height: 127,
                width: '100%',
                padding: 14,
                border: 'none',
                fontSize: 16,
                color: '#748BA0',
                backgroundColor: 'transparent',
                resize: 'none',
              }}
            >
              {form.comment || 'Write your review here...'}
            </p>
          </button>
          <components.Button
            label="Send review"
            onClickAction={() => {
              router.back();
            }}
          />
        </section>
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
