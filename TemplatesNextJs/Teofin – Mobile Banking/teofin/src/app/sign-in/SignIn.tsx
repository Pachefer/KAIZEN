'use client';

import Link from 'next/link';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';

import {hooks} from '@/hooks';
import {svg} from '@/assets/svg';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignIn: React.FC = () => {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);

  hooks.useThemeColor('#EDF0F2');
  hooks.useBodyColor('#EDF0F2');

  const {form, handleChangeField} = hooks.useFormField({
    email: '',
    password: '',
  });

  const renderHeader = () => {
    return <components.Header showGoBack={true} title="Sign In" />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight + 10,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <h1
          style={{
            ...constants.typography.h1,
            textAlign: 'center',
            marginBottom: 30,
          }}
        >
          Welcome to <br />
          Teofin!
        </h1>
        <components.InputField
          value={form.email}
          placeholder="cristinawolf@mail.com"
          containerStyle={{marginBottom: 14}}
          onClickAction={() => handleChangeField('email', 'Email')}
        />
        <components.InputField
          value={form.password}
          placeholder="••••••••"
          containerStyle={{marginBottom: 20}}
          inputType="password"
          onClickAction={() => handleChangeField('password', 'password')}
        />
        <div
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
          }}
        >
          <button
            style={{display: 'flex', alignItems: 'center', gap: 14}}
            onClick={() => setRememberMe(!rememberMe)}
          >
            <div
              style={{
                width: 22,
                height: 22,
                border: '1px solid #868698',
                borderRadius: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {rememberMe && <svg.CheckSvg />}
            </div>
            <span
              style={{
                ...constants.typography.bodyText,
                lineHeight: 1.4,
                marginBottom: 1,
              }}
            >
              Remember me
            </span>
          </button>
          <Link
            href={constants.routes.forgotPassword}
            style={{
              ...constants.typography.bodyText,
              color: constants.colors.linkColor,
              fontWeight: 500,
            }}
          >
            Lost your password?
          </Link>
        </div>
        <components.Button
          title="Sign In"
          containerStyle={{marginBottom: 30}}
          onClickAction={() => {
            router.push(constants.routes.dashboard);
          }}
        />
        <span style={{...constants.typography.bodyText, marginBottom: '16%'}}>
          No account?{' '}
          <Link
            href={constants.routes.signUp}
            style={{color: constants.colors.linkColor}}
          >
            Register now
          </Link>
        </span>
        <div style={{display: 'flex', gap: 10, alignSelf: 'center'}}>
          <Link href={constants.routes.dashboard}>
            <svg.FacebookSvg />
          </Link>
          <Link href={constants.routes.dashboard}>
            <svg.TwitterSvg />
          </Link>
          <Link href={constants.routes.dashboard}>
            <svg.GoogleSvg />
          </Link>
        </div>
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
