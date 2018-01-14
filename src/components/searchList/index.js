import React from 'react'
import SearchItem from '../searchItem'
import {Grid, Row, Col, Button} from 'react-bootstrap';
const SearchList = props => {
  return (
    <Grid>
      {props.results.items.map(item =>
        <SearchItem
          key={item.id}
          setLeft={props.setLeft}
          setRight={props.setRight}
          item={item}
        />
      )}
  </Grid>
  );
}

export default SearchList
