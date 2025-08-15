'use client';

import axios from 'axios';
import {useEffect, useState} from 'react';

import {URLS} from '@/config';
import type {DishType} from '@/types';

export const useGetDishes = () => {
  const [data, setData] = useState<DishType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getDishes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URLS.GET_DISHES);
      const dishes = response.data.dishes || response.data || [];
      setData(dishes);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('API request failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return {data, isLoading};
};
