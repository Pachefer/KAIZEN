'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {utils} from '@/utils';
import {constants} from '@/constants';
import {components} from '@/components';

export const Onboarding: React.FC = () => {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [_, setInsets] = useState({top: 0, right: 0, bottom: 0, left: 0});

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInsets(utils.getSafeAreaInsets());
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const renderCarousel = () => {
    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Swiper
          onSlideChange={(swiper: any) =>
            setCurrentSlideIndex(swiper.activeIndex)
          }
        >
          {constants.data.onboarding.map((item: any) => (
            <SwiperSlide
              key={item.id}
              style={{
                width: '100%',
                height: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <img
                src={item.image}
                alt="Onboarding"
                style={{
                  width: '80%',
                  height: 'auto',
                  margin: '0 auto',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    );
  };

  const renderDetails = () => {
    const currentItem = constants.data.onboarding[currentSlideIndex];

    return (
      <section
        className="container"
        style={{
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 20,
          paddingTop: 48,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          backgroundColor: constants.colors.seaGreenColor,
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            textTransform: 'capitalize',
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 20,
            color: constants.colors.whiteColor,
          }}
        >
          {currentItem.title}
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: constants.colors.whiteColor,
            marginBottom: 40,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 320,
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
          }}
        >
          {currentItem.description}
        </p>
        <section
          className="container"
          style={{
            gap: 10,
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {constants.data.onboarding.map((item: any, index: number) => (
            <div
              key={item.id}
              style={{
                width: 12,
                height: 12,
                borderRadius: '6px',
                backgroundColor:
                  currentSlideIndex === index
                    ? constants.colors.orangeColor
                    : constants.colors.whiteColor,
              }}
            />
          ))}
        </section>
        <components.Button
          label="Get Started"
          containerStyle={{backgroundColor: constants.colors.orangeColor}}
          onClickAction={() => {
            router.push(constants.routes.signIn);
          }}
        />
      </section>
    );
  };

  const renderSafeAreaInsetBottom = () => {
    return (
      <div
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
          width: '100%',
          height: 'env(safe-area-inset-bottom)',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: constants.colors.seaGreenColor,
        }}
      />
    );
  };

  return (
    <components.MotionWrapper key="onboarding">
      <components.SafeAreaView>
        {renderCarousel()}
        {renderDetails()}
        {renderSafeAreaInsetBottom()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
