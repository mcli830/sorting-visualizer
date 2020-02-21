import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Container from '../components/container/container'
import Column from '../components/columns/columns'
import Title from '../components/title/title'
import Simulator from '../components/simulator/simulator'
import Row from '../components/ui/row'
import Button from '../components/button/button'
import Control from '../components/control/control'
import Information from '../components/information/information'
import Log from '../components/log/log'
import Footer from '../components/footer/footer'
import { generateArray } from '../lib/array'
import theme from '../components/theme'

import insertionSort from '../lib/algorithms/insertionSort'
import selectionSort from '../lib/algorithms/selectionSort'
import bubbleSort from '../lib/algorithms/bubbleSort'

const algorithm = {
  insertionSort,
  selectionSort,
  bubbleSort,
}

const arraySizes = [12, 30, 60, 100, 150, 200];

// initial state used for React page state
const initialState = (size) => ({
  array: generateArray(size),
  counter: 0,
  running: false,
  // name of running algorithm for handler mapping
  runningAlgorithm: null,
  // an algorithm is in progress
  inProgress: false,
  // index positions of algorithm
  selected: null,
  scanning: null,
  flag: null,
  // persisting state
  arraySize: arraySizes[2],
  // name of algorithm in information view
  info: 'insertionSort',
  // previous completed algorithm run data
  logs: [],
})

const IndexPage = () => {

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const [state, setState] = React.useState(initialState());

  // algorithm control handlers
  const handler = {
    setArraySize: (arraySize) => () => {
      setState(state => ({
        ...state,
        arraySize,
        array: state.inProgress ? state.array : generateArray(arraySize),
      }));
    },
    reset: (name) => () => {
      // reset algorithm
      if (name) {
        algorithm[name].processor.reset();
      }
      // reset page state
      setTimeout(() => {
        setState(state => ({
          ...initialState(),
          array: generateArray(state.arraySize),
          arraySize: state.arraySize,
          info: state.info,
          logs: state.logs,
        }));
      }, 20);
    },
    play: (name) => () => {
      algorithm[name].processor.run(state.array);
      setState(state => ({
        ...state,
        runningAlgorithm: name,
        inProgress: true,
        running: true,
      }));
    },
    pause: (name) => () => {
      algorithm[name].processor.pause();
      setState(state => ({
        ...state,
        running: false,
      }))
    },
    // currently viewing algorithm in info section
    viewInfo: (name) => () => {
      setState(state => ({
        ...state,
        info: name,
      }))
    }
  }

  // algorithm specifications requiring page state
  React.useEffect(() => {
    Object.values(algorithm).forEach(algo => {
      algo.processor.fps = 60;
      algo.processor.update = (processState) => {
        const { data, selected, scanning, flag, meta } = processState;
        setState(state => ({
          ...state,
          array: data,
          selected,
          scanning,
          flag,
          counter: meta.counter,
        }));
      };
      algo.processor.onComplete = (processState) => {
        setState(state => {
          console.log(`${state.runningAlgorithm} complete with ${processState.meta.counter} operations.`);
          return {
            ...state,
            selected: null,
            scanning: null,
            flag: null,
            running: false,
            inProgress: false,
            logs: [
              ...state.logs,
              {
                algorithm: algorithm[state.runningAlgorithm].shortName,
                count: state.counter,
                sample: state.arraySize,
              },
            ]
          }
        })
      }
    });
  }, []);

  return (
    <Layout>
      <SEO title="Home" />
      <Title>{data.site.siteMetadata.title}</Title>

      <Container size="xl" style={{marginLeft: 0, maxWidth: 1480}}>
        <Column.container break="md" reverse>
          <Column.item size={9} style={{padding: '0 1rem'}}>
              <Simulator
                items={state.array}
                selected={state.selected}
                scanning={state.scanning}
                flag={state.flag}
                counter={state.counter}
                algorithmName={algorithm[state.runningAlgorithm || state.info].shortName}
              />
              <Row stretch>
                {arraySizes.map(v => (
                  <Button
                    key={v}
                    secondary
                    onClick={handler.setArraySize(v)}
                    active={state.arraySize === v}
                    style={{padding: '0.3em', fontSize: '0.8rem'}}
                  >
                    {v}
                  </Button>
                ))}
              </Row>

              <Control
                algorithms={algorithm}
                currentView={state.info}
                handleReset={handler.reset(state.runningAlgorithm)}
                handleViewInfo={handler.viewInfo}
              />
              <Information
                algorithm={algorithm[state.info]}
                running={state.running}
                runningThis={state.runningAlgorithm === state.info}
                inProgress={state.inProgress}
                handlePlay={handler.play(state.info)}
                handlePause={handler.pause(state.info)}
              />
          </Column.item>
          <Column.item size={3} style={{
            backgroundColor: theme.backgroundSoft,
            borderRight: `1px solid ${theme.primaryAlpha}`,
          }}>
            <Log logs={state.logs} />
          </Column.item>
        </Column.container>
      </Container>

      <Footer />
    </Layout>
  )
}

export default IndexPage
