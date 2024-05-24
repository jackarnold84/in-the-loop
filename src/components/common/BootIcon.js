import PropTypes from 'prop-types';
import * as React from "react";

const BootIcon = ({ name, fill, size = 'inherit', color = 'inherit', style }) => {
  return (
    <i
      className={`bi bi-${name}${fill ? '-fill' : ''}`}
      style={{ fontSize: size, color, ...style }}
    />
  )
}

BootIcon.propTypes = {
  name: PropTypes.string.isRequired,
  fill: PropTypes.bool,
  size: PropTypes.string,
  color: PropTypes.string,
  style: PropTypes.object,
}

export default BootIcon
