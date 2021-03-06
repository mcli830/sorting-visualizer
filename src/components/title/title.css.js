import styled from 'styled-components'
import theme from '../theme'
import breakpoints from '../breakpoints'

export default styled.h1`
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  font-family: ${theme.font.main};
  color: ${theme.primary};
  margin: 0;

  @media only screen and (min-width: ${breakpoints.md}px) {
    font-size: 2rem;
  }
`;
