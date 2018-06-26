import * as React from 'react';
import { Input } from 'reactstrap';
import PropTypes from 'prop-types';

export const Search = ({ updateQuery }) => {
  let changeSearchQuery = event => {
    let search = event.target.value;
    let query = null;
    if (search.length) {
      query = {
        _or: [
          {
            currencySymbol_like: `%${search}%`,
          },
          {
            currencyName_like: `%${search}%`,
          },
        ],
      };
    }
    updateQuery(query);
  };

  return <Input type="text" placeholder="Search" onChange={changeSearchQuery} />;
};

Search.propTypes = {
  updateQuery: PropTypes.func,
};
