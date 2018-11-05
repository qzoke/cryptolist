import React from 'react';
import PropTypes from 'prop-types';
import { RefreshButton } from '../../../components/refresh-button';

export const Toolbar = ({ getData }) => {
  return (
    <div className="controls row">
      <div className="control">
        <RefreshButton update={getData} />
      </div>
    </div>
  );
};

Toolbar.propTypes = {
  getData: PropTypes.func,
};
