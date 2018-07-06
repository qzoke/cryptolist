import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';

export const Resolutions = [
  { display: '1m', value: '_1m', seconds: 60 },
  { display: '5m', value: '_5m', seconds: 60 * 5 },
  { display: '15m', value: '_15m', seconds: 60 * 15 },
  { display: '30m', value: '_30m', seconds: 60 * 30 },
  { display: '1H', value: '_1h', seconds: 60 * 60 },
  { display: '2H', value: '_2h', seconds: 60 * 60 * 2 },
  { display: '4H', value: '_4h', seconds: 60 * 60 * 4 },
  { display: '1D', value: '_1d', seconds: 60 * 60 * 24 },
];

export const ResolutionGroup = ({ updateResolution, resolution }) => {
  let buttons = Resolutions.map(r => (
    <Button
      key={r.value}
      active={resolution.value === r.value}
      onClick={() => updateResolution(r)}
      size="sm"
    >
      {r.display}
    </Button>
  ));

  return <ButtonGroup>{buttons}</ButtonGroup>;
};

ResolutionGroup.propTypes = {
  updateResolution: PropTypes.func,
  resolution: PropTypes.object,
};
