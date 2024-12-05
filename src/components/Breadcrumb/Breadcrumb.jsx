import React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumb = ({ path }) => {
  function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }

  const pathSegments = path.split('/').filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    if (index === pathSegments.length - 1) {
      return (
        <Typography
          key={index}
          sx={{
            color: 'text.primary',
          }}
        >
          {segment}
        </Typography>
      );
    }

    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    return (
      <Link
        key={index}
        underline="hover"
        color="inherit"
        href={href}
        onClick={handleClick}
      >
        {segment}
      </Link>
    );
  });

  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="10px" />}
      aria-label="breadcrumb"
    >
      {breadcrumbs}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
