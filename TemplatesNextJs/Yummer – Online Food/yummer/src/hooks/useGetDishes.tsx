'use client';

import axios from 'axios';
import {useState, useEffect} from 'react';

import {URLS} from '@/config';

export const useGetDishes = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDishes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(URLS.GET_DISHES);

      if (!response.data) {
        throw new Error('No data in response');
      }

      const dishes = response.data.dishes || response.data || [];
      setDishes(dishes);
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDishes();
  }, []);

  return {dishes, loading};
};
