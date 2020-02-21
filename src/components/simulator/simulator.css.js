import styled from 'styled-components'
import theme from '../theme'

export default styled.div`
  position: relative;
  display: flex;
  height: 400px;
  width: 100%;
  min-width: 100%;
  flex-direction: row;
  align-items: flex-end;
  border-top: 1px solid rgba(0,0,0,0.08);
  border-bottom: 2px solid ${theme.text};

  ${props => props.gap && `
    & > li:not(:first-child) {
      margin-left: 1px;
    }
  `}

`;
