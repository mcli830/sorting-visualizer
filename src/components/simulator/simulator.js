import React from 'react'
import PropTypes from 'prop-types'
import StyledSimulator from './simulator.css'
import Item from './item'
import Meta from './meta'
import Center from '../ui/center'

// items: array of objects = { id: int, value: int }

const Simulator = ({ items, selected, scanning, flag, counter, algorithmName }) => {

  // store max value
  const [max, setMax] = React.useState(0);
  // only rerender on data change
  React.useEffect(() => {
    // get maximum value from data items for relative height render
    setMax(Math.max(...items.filter(item => !!item).map(item => item.value)));
  }, [items])

  return (
    <div>
      <Meta algorithm={algorithmName} operations={counter} />
      <StyledSimulator gap={items.length <= 100}>
        {items.length > 0 ? items.map((item,i) => (
          <Item
            key={i}
            size={item && item.value ? (item.value / max) * 100 : 0}
            selected={selected === i}
            scanning={scanning === i}
            flagged={flag === i}
            />
        )) : (
          <Center>✘</Center>
        )}
      </StyledSimulator>
    </div>
  )
}

Simulator.propTypes = {
  items: PropTypes.array,
  current: PropTypes.number,
  scanning: PropTypes.number,
  flag: PropTypes.number,
  counter: PropTypes.number,
  algorithmName: PropTypes.string,
}

Simulator.defaultProps = {
  items: [],
}

export default Simulator
