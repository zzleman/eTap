import React from 'react';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

const VacanciesDashboard = () => {
  return (
    <div className="flex mx-36 my-10 border-2 rounded-xl p-5 justify-between w-8/12">
      <div className="flex gap-7">
        <div className="left">
          <img
            className="size-20"
            src="https://www.pngplay.com/wp-content/uploads/3/Amazon-Logo-Transparent-PNG.png"
            alt=""
          />
        </div>
        <div className="middle flex flex-col gap-2">
          <p>Amazon</p>
          <h5>Senior Cloud Architect</h5>
          <p>Remote * Baku * Full-Time</p>
        </div>
      </div>
      <div className="right flex gap-2">
        <EditOutlinedIcon style={{ fontSize: 'large' }} />
        <DeleteOutlineOutlinedIcon style={{ fontSize: 'large' }} />
      </div>
    </div>
  );
};

export default VacanciesDashboard;
