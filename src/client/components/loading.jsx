import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


export const Loading = () => (
<div className="loading">
  <FontAwesomeIcon icon="spinner" pulse />
  <div>Loading</div>
</div>);
