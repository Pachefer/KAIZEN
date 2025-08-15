'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';

import {hooks} from '@/hooks';
import {constants} from '@/constants';
import {components} from '@/components';

export const SignIn: React.FC = () => {
  const router = useRouter();
  const footerRef = useRef<HTMLElement>(null);

  const [_, setFooterHeight] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const {form, handleChangeField} = hooks.useFormField({
    email: '',
    password: '',
  });

  useEffect(() => {
    if (footerRef.current) {
      setFooterHeight(footerRef.current.offsetHeight);
    }
  }, []);

  const renderHeader = () => {
    return <components.Header title="Sign In" showGoBack={true} />;
  };

  const renderContent = () => {
    return (
      <main
        style={{
          marginTop: constants.sizes.headerHeight,
          paddingBottom: 20,
          height: '100%',
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            ...constants.typography.h2,
            textTransform: 'capitalize',
            marginBottom: 10,
            fontFamily: 'var(--font-roboto)',
            color: constants.colors.seaGreenColor,
          }}
        >
          Welcome Back John!
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: 16,
            marginBottom: 28,
            color: constants.colors.textColor,
          }}
        >
          Sign in to continue
        </p>
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="johndoe@mail.com"
          value={form.email}
          onClickAction={() => handleChangeField('email', 'email')}
          isValid={form.email.length > 0 && form.email.includes('@')}
        />
        <components.Input
          containerStyle={{marginBottom: 15}}
          placeholder="**********"
          value={form.password}
          onClickAction={() => handleChangeField('password', 'password')}
          isValid={form.password.length > 0 && form.password.length >= 6}
        />
        <div
          style={{
            ...constants.flex.rowCenterBetween,
            marginBottom: 18,
            width: '100%',
          }}
        >
          <div
            style={{...constants.flex.rowCenter, gap: 10}}
            onClick={() => setRememberMe(!rememberMe)}
          >
            <components.Checkbox checked={rememberMe} />
            <span style={{color: constants.colors.textColor}}>Remember me</span>
          </div>
          <Link
            href={constants.routes.forgotPassword}
            style={{color: '#FE724E'}}
          >
            Forgot password ?
          </Link>
        </div>
        <components.Button
          label="Sign in"
          onClickAction={() => {
            router.push(constants.routes.home);
          }}
        />
      </main>
    );
  };

  const renderFooter = () => {
    return (
      <section
        ref={footerRef}
        style={{padding: 20, ...constants.flex.rowCenter, gap: 6}}
      >
        <span style={{color: constants.colors.mainDarkColor}}>
          {`Don't have an account?`}
        </span>
        <Link
          href={constants.routes.signUp}
          style={{color: constants.colors.seaGreenColor, fontWeight: 500}}
        >
          Sing up!
        </Link>
      </section>
    );
  };

  return (
    <components.MotionWrapper key="sign-in">
      <components.SafeAreaView>
        {renderHeader()}
        {renderContent()}
        {renderFooter()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
