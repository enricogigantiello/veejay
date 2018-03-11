import React from 'react'
import SearchItem from '../searchItem'
import {Grid, Row, Col, Button} from 'react-bootstrap';
const SearchList = props => {
  return (
    <div>
      {props.results.items.map(item =>
        <SearchItem
          key={item.id}
          setLeft={props.setLeft}
          setRight={props.setRight}
          item={item}
          search={props.search}
        />
      )}
  </div>
  );
}

export default SearchList
