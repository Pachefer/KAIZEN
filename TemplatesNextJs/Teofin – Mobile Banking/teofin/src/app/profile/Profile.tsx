'use client';

import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {items} from '@/items';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

import React, {useState} from 'react';

export const Profile: React.FC = () => {
  const router = useRouter();

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const [settings, setSettings] = useState({
    notifications: false,
    faceId: false,
  });

  const handleToggle = (key: keyof typeof settings) => (newValue: boolean) => {
    setSettings((prev) => ({...prev, [key]: newValue}));
  };

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Profile" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          paddingBottom: 20,
          display: 'flex',
          flexDirection: 'column',
          marginTop: constants.sizes.headerHeight,
          paddingTop: 20,
        }}
      >
        {/* User info */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 30,
              borderBottom: '1px solid #CED6E1',
              paddingBottom: 20,
            }}
            onClick={() => {
              router.push(constants.routes.editPersonalInfo);
            }}
          >
            <img
              alt="user"
              src="https://george-fx.github.io/teofin-data/photos/01.jpg"
              style={{
                width: 70,
                height: 70,
                borderRadius: '50%',
              }}
            />
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <h4 style={{marginBottom: 2, ...constants.typography.h4}}>
                Cristina Wolf
              </h4>
              <span
                style={{color: constants.colors.bodyTextColor, fontSize: 14}}
              >
                +1 954 621 7845
              </span>
            </div>
          </div>
        </section>

        {/* Menu */}
        <section>
          <div
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
            }}
          >
            <items.ProfileMenuItem
              leftSideIcon={<svg.ProfileMenuUserSvg />}
              title="Personal Info"
              rightSideIcon={<svg.RightArrowSvg />}
              onClickAction={() => {
                router.push(constants.routes.editPersonalInfo);
              }}
            />
            <items.ProfileMenuItem
              leftSideIcon={<svg.ProfileMenuMessageSvg />}
              title="Notifications"
              checked={settings.notifications}
              onToggleAction={handleToggle('notifications')}
            />
            <items.ProfileMenuItem
              leftSideIcon={<svg.ProfileMenuFaceIDSvg />}
              title="Face ID"
              checked={settings.faceId}
              onToggleAction={handleToggle('faceId')}
            />
            <items.ProfileMenuItem
              leftSideIcon={<svg.ProfileExitSvg />}
              title="Log Out"
              rightSideIcon={<svg.RightArrowSvg />}
              onClickAction={() => {
                router.push(constants.routes.signIn);
              }}
            />
          </div>
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
