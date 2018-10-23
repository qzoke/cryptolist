import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';
import { ResolutionGroup } from './resolution-group';
import { IndicatorGroup } from './indicator-group';
import DateTime from 'react-datetime';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const CHART_STYLES = {
  candle: {
    displayName: 'Candle',
    iconName: 'chart-bar',
  },
  line: {
    displayName: 'Line',
    iconName: 'chart-line',
  },
};

export const DATETIME_FORMAT = 'M/D/YY H:m';

export class ChartUtils extends React.Component {
  static propTypes = {
    startTime: PropTypes.number,
    endTime: PropTypes.number,
    resolution: PropTypes.object,
    updateResolution: PropTypes.func,
    updateStartTime: PropTypes.func,
    updateEndTime: PropTypes.func,
    selectedChart: PropTypes.string,
    updateSelectedChart: PropTypes.func,
    timeseries: PropTypes.object,
    addIndicator: PropTypes.func,
    removeIndicator: PropTypes.func,
    indicators: PropTypes.array,
    allIndicators: PropTypes.array,
    base: PropTypes.string,
    quote: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.isValidStart = this.isValidStart.bind(this);
    this.isValidEnd = this.isValidEnd.bind(this);
    this.toggleStartTime = this.toggleStartTime.bind(this);
    this.toggleEndTime = this.toggleEndTime.bind(this);
    this.toggleChartSelector = this.toggleChartSelector.bind(this);
    this.hideDateTimes = this.hideDateTimes.bind(this);
    this.startTimeRef = React.createRef();
    this.endTimeRef = React.createRef();
    this.state = {
      startShown: false,
      endShown: false,
      chartSelectorShown: false,
    };
  }

  isValidStart(current) {
    return current.unix() * 1000 < this.props.endTime && current.unix() <= moment().unix();
  }

  isValidEnd(current) {
    return current.unix() * 1000 > this.props.startTime && current.unix() <= moment().unix();
  }

  toggleStartTime(e) {
    e.preventDefault();
    this.setState({ startShown: !this.state.startShown, endShown: false });
  }

  toggleEndTime(e) {
    e.preventDefault();
    this.setState({ endShown: !this.state.endShown, startShown: false });
  }

  toggleChartSelector() {
    this.setState(prevState => ({
      chartSelectorShown: !prevState.chartSelectorShown,
    }));
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.hideDateTimes, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.hideDateTimes, false);
  }

  hideDateTimes(e) {
    if (
      (this.startTimeRef && this.startTimeRef.contains && this.startTimeRef.contains(e.target)) ||
      (this.endTimeRef && this.endTimeRef.contains && this.endTimeRef.contains(e.target))
    ) {
      return;
    }
    this.setState({
      startShown: false,
      endShown: false,
    });
  }

  render() {
    return (
      <div className="controls row">
        <div className="control">
          <ResolutionGroup
            updateResolution={this.props.updateResolution}
            resolution={this.props.resolution}
          />
        </div>
        <div className="control">
          <IndicatorGroup
            addIndicator={this.props.addIndicator}
            allIndicators={this.props.allIndicators}
          />
        </div>
        <div className="startTime control">
          <Button onClick={this.toggleStartTime}>Start</Button>
          {this.state.startShown && (
            <div ref={ref => (this.startTimeRef = ref)}>
              <DateTime
                value={this.props.startTime}
                onChange={this.props.updateStartTime}
                isValidDate={this.isValidStart}
                input={false}
              />
            </div>
          )}
        </div>
        <div className="endTime control">
          <Button onClick={this.toggleEndTime}>End</Button>
          {this.state.endShown && (
            <div ref={ref => (this.endTimeRef = ref)}>
              <DateTime
                value={this.props.endTime}
                onChange={this.props.updateEndTime}
                isValidDate={this.isValidEnd}
                input={false}
              />
            </div>
          )}
        </div>
        <div className="align-self-end control">
          <Dropdown isOpen={this.state.chartSelectorShown} toggle={this.toggleChartSelector}>
            <DropdownToggle caret>
              <FontAwesomeIcon icon={CHART_STYLES[this.props.selectedChart].iconName} />
            </DropdownToggle>
            <DropdownMenu>
              {Object.keys(CHART_STYLES).map(key => {
                return (
                  <DropdownItem
                    color={this.props.selectedChart === key ? 'secondary' : 'link'}
                    onClick={() => this.props.updateSelectedChart(key)}
                    key={key}
                  >
                    <FontAwesomeIcon icon={CHART_STYLES[key].iconName} />{' '}
                    {CHART_STYLES[key].displayName}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </Dropdown>
        </div>
        {this.props.indicators.map(i => {
          return (
            <div className="control" key={i}>
              <Button color="link" onClick={() => this.props.removeIndicator(i)}>
                {i.toUpperCase()} <FontAwesomeIcon icon="times" />
              </Button>
            </div>
          );
        })}
        <div className="symbol ml-auto">
          ({this.props.base}/{this.props.quote})
        </div>
      </div>
    );
  }
}
