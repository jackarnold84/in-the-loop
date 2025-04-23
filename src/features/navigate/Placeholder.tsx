import { Empty } from 'antd';
import React, { ReactElement } from 'react';

const lightGrey = "#d9d9d9";

interface PlaceholderProps {
  description: string;
  icon: ReactElement<{ color?: string; size?: number }>;
}

const Placeholder: React.FC<PlaceholderProps> = ({ description, icon }) => {
  const styledIcon = React.cloneElement(icon, {
    color: lightGrey,
    size: 84,
  });

  return (
    <Empty
      description={description}
      image={styledIcon}
    />
  );
};

export default Placeholder;
