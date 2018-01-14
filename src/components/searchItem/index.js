import React from 'react'
import {Grid, Row, Col, Button, Glyphicon} from 'react-bootstrap';

const SearchItem = props => {
  let src = props.item.snippet.thumbnails.default.url;
  let height = props.item.snippet.thumbnails.default.height;
  let width = props.item.snippet.thumbnails.default.width;
  let id = props.item.id;
  let duration = props.item.contentDetails.duration.slice(2);
  let viewCount = props.item.statistics.viewCount;
  let likeCount = props.item.statistics.likeCount;
  let title = props.item.snippet.title;

  let detailsStyle = {
    fontSize: 'xx-small',
  };
  let titleStyle = {
    fontSize: 'small',
  };
  return (
    <Grid className="">
      <Row>
        <p style={titleStyle}>{title}</p>
      </Row>
      <Row>
        <img src={src} height={height} width={width} />
          <div style={detailsStyle}>
            <p>duration: {duration}</p>
            <p>viewCount: {viewCount}</p>
            <p>likeCount: {likeCount}</p>
            <p>id: {id}</p>
          </div>
      </Row>
      <Row>
        <Col xs={12} lg={4}>
          <Button onClick={props.setLeft.bind(this, id)}><Glyphicon glyph="chevron-left" /></Button>
          <Button onClick={props.setRight.bind(this, id)}><Glyphicon glyph="chevron-right" /></Button>
        </Col>
      </Row>
    </Grid>
  );
}

export default SearchItem
