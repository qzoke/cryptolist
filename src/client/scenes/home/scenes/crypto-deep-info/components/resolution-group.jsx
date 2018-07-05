import React from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonGroup } from 'reactstrap';

export const ResolutionGroup = ({ updateResolution, resolution }) => {
  let resolutions = [
    { d: '1m', v: '_1m' },
    { d: '5m', v: '_5m' },
    { d: '15m', v: '_15m' },
    { d: '30m', v: '_30m' },
    { d: '1H', v: '_1h' },
    { d: '2H', v: '_2h' },
    { d: '4H', v: '_4h' },
    { d: '1D', v: '_1d' },
  ];
  let buttons = resolutions.map(r => (
    <Button key={r.v} active={resolution === r.v} onClick={() => updateResolution(r.v)} size="sm">
      {r.d}
    </Button>
  ));

  return <ButtonGroup>{buttons}</ButtonGroup>;
};

ResolutionGroup.propTypes = {
  updateResolution: PropTypes.func,
  resolution: PropTypes.string,
};
