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

  let splitTitle = title.split('-');
  console.log(splitTitle);

  let detailsStyle = {
    fontSize: 'xx-small',
  };
  let titleStyle = {
    fontSize: 'small',
  };

  const handleSearch = (text) => {
    props.search(text)
  }
  return (
    <div className="search-item">
      <Row>
        <Col xs={12} lg={12}>
          <p style={titleStyle}>{
            splitTitle.map(title =>
              <a onClick={handleSearch.bind(this, title)}>{title}</a>
            )}
          </p>
        </Col>
      </Row>
      <Row>
        <Col xs={6} lg={6}>
          <img src={src} height={height} width={width} />
        </Col>
        <Col xs={6} lg={6}>
          <Row style={detailsStyle}>
            <p>durata: {duration} views: {viewCount}</p>
          </Row>
          <Row>
            <Button onClick={props.setLeft.bind(this, id)}><Glyphicon glyph="chevron-left" /></Button>
            <Button onClick={props.setRight.bind(this, id)}><Glyphicon glyph="chevron-right" /></Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default SearchItem
