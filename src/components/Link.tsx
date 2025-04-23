import { useLocation } from '@reach/router';
import { Link as GatsbyLink, GatsbyLinkProps } from 'gatsby';
import React from 'react';

const Link: React.FC<GatsbyLinkProps<any>> = ({ to, state, ref, children, ...props }) => {
  const location = useLocation();
  const source = location.pathname;

  return (
    <GatsbyLink
      to={to}
      state={{ ...state, source }}
      {...props}
    >
      {children}
    </GatsbyLink>
  );
};

export default Link;
