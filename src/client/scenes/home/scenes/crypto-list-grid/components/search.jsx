import * as React from 'react';
import { Input, Form, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.changeSearchText = this.changeSearchText.bind(this);
    this.changeSearchQuery = this.changeSearchQuery.bind(this);
    this.state = {
      searchText: '',
    };
  }

  changeSearchText(event) {
    this.setState({ searchText: event.target.value });
  }

  changeSearchQuery(event) {
    event.preventDefault();
    let search = this.state.searchText;
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
    this.props.updateQuery(query);
  }

  render() {
    return (
      <Form className="search" onSubmit={this.changeSearchQuery}>
        <Input
          type="text"
          placeholder="Search"
          name="searchText"
          onChange={this.changeSearchText}
        />
        <Button color="link">
          <FontAwesomeIcon icon="search" />
        </Button>
      </Form>
    );
  }
}

Search.propTypes = {
  updateQuery: PropTypes.func,
};
