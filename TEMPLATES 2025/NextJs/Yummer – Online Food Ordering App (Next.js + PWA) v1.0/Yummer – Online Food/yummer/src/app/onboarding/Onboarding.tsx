'use client';

import {useRouter} from 'next/navigation';
import React, {useEffect, useRef, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {utils} from '@/utils';
import {constants} from '@/constants';
import {components} from '@/components';

export const Onboarding: React.FC = () => {
  const router = useRouter();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [_, setInsets] = useState({top: 0, right: 0, bottom: 0, left: 0});

  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setInsets(utils.getSafeAreaInsets());
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  const renderHeader = () => {
    return <components.Header showSkip={true} />;
  };

  const renderCarousel = () => {
    return (
      <section
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flex: 1,
          minHeight: '1%',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: constants.sizes.headerHeight + 0,
        }}
      >
        <Swiper
          ref={swiperRef}
          style={{width: '100%', height: '100%'}}
          onSlideChange={(swiper) => setCurrentSlideIndex(swiper.activeIndex)}
        >
          {constants.data.onboarding.map((item: any) => {
            return (
              <SwiperSlide
                key={item.id}
                style={{
                  width: '100%',
                  height: '100%',
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
                    maxWidth: 320,
                    objectFit: 'cover',
                  }}
                />
              </SwiperSlide>
            );
          })}
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
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            textTransform: 'capitalize',
            ...constants.typography.h2,
            marginBottom: 16,
          }}
        >
          {currentItem.title}
        </h1>
        <p
          style={{
            textAlign: 'center',
            marginBottom: 40,
            paddingLeft: 20,
            paddingRight: 20,
            maxWidth: 320,
            marginLeft: 'auto',
            marginRight: 'auto',
            color: constants.colors.textColor,
          }}
        >
          {currentItem.description}
        </p>
        <section
          className="container"
          style={{
            gap: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24%',
          }}
        >
          {constants.data.onboarding.map((item: any, index: number) => (
            <div
              key={item.id}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                border: `2px solid ${constants.colors.mainColor}`,
                backgroundColor:
                  currentSlideIndex === index
                    ? constants.colors.mainColor
                    : 'transparent',
              }}
            />
          ))}
        </section>
        <components.Button
          label={
            currentSlideIndex === constants.data.onboarding.length - 1
              ? 'Get Started'
              : 'Next'
          }
          containerStyle={{backgroundColor: constants.colors.orangeColor}}
          onClickAction={() => {
            if (currentSlideIndex === constants.data.onboarding.length - 1) {
              router.push(constants.routes.signIn);
            } else {
              swiperRef.current?.swiper?.slideNext();
            }
          }}
        />
      </section>
    );
  };

  return (
    <components.MotionWrapper key="onboarding">
      <components.SafeAreaView>
        {renderHeader()}
        {renderCarousel()}
        {renderDetails()}
      </components.SafeAreaView>
    </components.MotionWrapper>
  );
};
