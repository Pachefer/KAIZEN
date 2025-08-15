'use client';

import axios from 'axios';
import {useEffect, useState} from 'react';

import {URLS} from '@/config';

export const useGetReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getReviews = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(URLS.GET_REVIEWS);

      if (!response.data) {
        throw new Error('No data in response');
      }

      const reviews = response.data.reviews || response.data || [];
      setReviews(reviews);
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
    getReviews();
  }, []);

  return {reviews, isLoading};
};
