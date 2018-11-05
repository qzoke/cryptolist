import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export class RefreshButton extends React.Component {
  static propTypes = {
    update: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.update = this.update.bind(this);

    this.state = {
      isRefreshing: false,
    };
  }

  update() {
    this.setState({ isRefreshing: true });
    this.props.update().then(() => {
      this.setState({ isRefreshing: false });
    });
  }

  render() {
    return (
      <Button size="sm" onClick={this.update}>
        <FontAwesomeIcon icon="sync" className={this.state.isRefreshing ? 'fa-spin' : ''} />
      </Button>
    );
  }
}
