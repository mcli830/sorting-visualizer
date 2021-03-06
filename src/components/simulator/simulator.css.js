import styled from 'styled-components'
import theme from '../theme'

export default styled.div`
  position: relative;
  display: flex;
  height: 400px;
  min-height: 25vh;
  max-height: 30vh;
  width: 100%;
  min-width: 100%;
  flex-direction: row;
  align-items: flex-end;
  border-top: 1px solid rgba(0,0,0,0.08);
  border-bottom: 2px solid ${theme.textOff};

  ${props => props.gap && `
    & > li:not(:first-child) {
      margin-left: 1px;
    }
  `}

`;
