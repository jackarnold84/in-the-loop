import PropTypes from 'prop-types';
import styled from "styled-components";

const Span = styled.span.attrs(({
  size, left, right
}) => ({
  size,
  left: left || size,
  right: right || size,
}))`
  padding-left: ${props => props.left}px;
  padding-right: ${props => props.right}px;
`

Span.defaultProps = {
  size: 4,
}

Span.propTypes = {
  size: PropTypes.number,
  left: PropTypes.number,
  right: PropTypes.number,
}

export default Span
