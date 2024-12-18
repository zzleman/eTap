import React from 'react';
import { HashLoader } from 'react-spinners';

const Loading = ({ loading }) => {
  return (
    loading && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
        <HashLoader loading={loading} size={70} color="#3498db" />
      </div>
    )
  );
};

export default Loading;
