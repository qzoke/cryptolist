import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

export const Loading = ({ showText = true }) => (
  <div className="loading">
    <FontAwesomeIcon icon="spinner" pulse />
    {showText ? <div>Loading</div> : null}
  </div>
);

Loading.propTypes = {
  showText: PropTypes.bool,
};
