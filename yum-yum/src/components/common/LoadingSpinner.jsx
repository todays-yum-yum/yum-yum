import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

export default function LoadingSpinner({ loading }) {
  return (
    <ClipLoader
      color='#111'
      loading={loading}
      size={130}
      aria-label='Loading Spinner'
      data-testid='loader'
    ></ClipLoader>
  );
}
