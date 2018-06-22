import React from 'react';
import {} from 'reactstrap';
import PropTypes from 'prop-types';

export class Graph extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return <div className="currency-info-container">Graph</div>;
  }
}

Graph.propTypes = {
  currency: PropTypes.object,
};
