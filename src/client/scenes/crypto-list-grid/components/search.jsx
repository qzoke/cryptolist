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
    this.props.updateQuery(this.state.searchText);
  }

  render() {
    return (
      <div className="row">
        <Form className="search col-md-12" onSubmit={this.changeSearchQuery}>
          <Input
            type="text"
            placeholder="Search"
            name="searchText"
            onChange={this.changeSearchText}
            defaultValue={this.props.search}
            autoComplete="off"
          />
          <Button color="link">
            <FontAwesomeIcon icon="search" />
          </Button>
        </Form>
      </div>
    );
  }
}

Search.propTypes = {
  updateQuery: PropTypes.func,
  search: PropTypes.string,
};
