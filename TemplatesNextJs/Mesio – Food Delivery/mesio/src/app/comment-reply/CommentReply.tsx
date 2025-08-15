'use client';

import React from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const CommentReply: React.FC = () => {
  const router = useRouter();
  const {form, handleChangeField} = hooks.useFormField({comment: ''});

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Reply" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20,
        }}
      >
        <h2
          style={{marginBottom: 10, fontSize: 16, textTransform: 'capitalize'}}
        >
          Write your reply
        </h2>
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
          label="Submit Reply"
          onClickAction={() => {
            router.back();
          }}
        />
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
