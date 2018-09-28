import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';
import { ResolutionGroup } from './resolution-group';
import DateTime from 'react-datetime';
import moment from 'moment';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

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
  };

  constructor(props) {
    super(props);
    this.isValidStart = this.isValidStart.bind(this);
    this.isValidEnd = this.isValidEnd.bind(this);
    this.toggleStartTime = this.toggleStartTime.bind(this);
    this.toggleEndTime = this.toggleEndTime.bind(this);
    this.hideDateTimes = this.hideDateTimes.bind(this);
    this.startTimeRef = React.createRef();
    this.endTimeRef = React.createRef();
    this.state = {
      startShown: false,
      endShown: false,
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
        <div className="col-sm-2">
          <ResolutionGroup
            updateResolution={this.props.updateResolution}
            resolution={this.props.resolution}
          />
        </div>
        <div
          className="startTime offset-sm-1 col-sm-4"
          style={{ position: 'absolute' /* Bug fix for safari */ }}
        >
          <Button onClick={this.toggleStartTime}>
            {moment(this.props.startTime).format(DATETIME_FORMAT)}
          </Button>
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
        <div
          className="endTime offset-sm-3 col-sm-2"
          style={{ position: 'absolute' /* Bug fix for safari */ }}
        >
          <Button onClick={this.toggleEndTime}>
            {moment(this.props.endTime).format(DATETIME_FORMAT)}
          </Button>
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
        <div className="col-sm-2 offset-sm-3 align-self-end">
          <ButtonGroup size="sm">
            <Button
              color={this.props.selectedChart === 'line' ? 'secondary' : 'link'}
              onClick={() => this.props.updateSelectedChart('line')}
            >
              <FontAwesomeIcon icon="chart-line" />
            </Button>
            <Button
              color={this.props.selectedChart === 'candle' ? 'secondary' : 'link'}
              onClick={() => this.props.updateSelectedChart('candle')}
            >
              <FontAwesomeIcon icon="chart-bar" />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}
