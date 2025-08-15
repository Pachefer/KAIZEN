'use client';

import React from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

const privacyPolicy = [
  {
    id: 1,
    title: '1. Terms',
    content: `By accessing this website, you are agreeing to be bound by these website Terms and Conditions of Use,
      applicable laws and regulations and their compliance. If you disagree with any of the stated terms and
      conditions, you are prohibited from using or accessing this site. The materials contained in this site
      are secured by relevant copyright and trademark law.`,
  },
  {
    id: 2,
    title: '2. Use Licence',
    content: `Permission is allowed to temporarily download one duplicate of the materials (data or programming)
      on Company's site for individual and non-business use only. This is just a permit of license and
      not an exchange of title, and under this permit, you may not:`,
  },
];

export const PrivacyPolicy: React.FC = () => {
  hooks.useThemeColor('#fff');
  hooks.useBodyColor('#fff');

  const renderHeader = () => {
    return (
      <components.Header
        title="Privacy policy"
        showGoBack={true}
        containerStyle={{backgroundColor: constants.colors.whiteColor}}
      />
    );
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
          paddingBottom: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <h2 style={{...constants.typography.h2, marginBottom: 30}}>
          Privacy policy
        </h2>
        <ul style={{display: 'flex', flexDirection: 'column', gap: 30}}>
          {privacyPolicy.map((item) => {
            return (
              <li key={item.id}>
                <h4 style={{...constants.typography.h4, marginBottom: 14}}>
                  {item.title}
                </h4>
                <p style={{...constants.typography.bodyText}}>{item.content}</p>
              </li>
            );
          })}
        </ul>
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
