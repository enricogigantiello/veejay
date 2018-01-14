import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Grid, Row, Col, Button, FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';
import SearchList from '../../components/searchList'
import {
  search
} from '../../modules/search';
import {
  setLeft,
  setRight
} from '../../modules/mixer';
import {
  getSuggestions
} from '../../modules/suggestions';
import YouTube from 'react-youtube';
const PAUSED = 2;
const PLAYING = 1;
const opts = {
  height: '150',
  width: '375',
  // playerVars: { // https://developers.google.com/youtube/player_parameters
  //   autoplay: 0
  // }
};

let leftVideo = null;
let rightVideo = null;

const onLeftReady = (event) => {
  // access to player in all event handlers via event.target
  leftVideo = event.target;
}

const onRightReady = (event) => {
  // access to player in all event handlers via event.target
  rightVideo = event.target;
}

const togglePlayer = () => {
  var left = leftVideo.getPlayerState();
  var right = rightVideo.getPlayerState();
  console.log(left, right);
  if (leftVideo.getPlayerState() === PLAYING) {
    leftVideo.pauseVideo();
    rightVideo.playVideo();
  } else if (rightVideo.getPlayerState() === PLAYING) {
    leftVideo.playVideo();
    rightVideo.pauseVideo();
  } else {
    console.log("No video Playing");
  }

}

const Mixer = props => {
  let input;
  console.log(props);
  return (
    <Grid>
      <Row className="show-grid">
        <Col xs={4} lg={4} md={4}>
          <YouTube
            videoId={props.leftId}
            opts={opts}
            onReady={onLeftReady}
            onPlay={() => {console.log('onplay');}}
            onPause={() => {console.log('onPause');}}
            onEnd={() => {console.log('onEnd');}}
            onError={() => {console.log('onError');}}
            onStateChange={() => {console.log('onStateChange');}}
            onPlaybackRateChange={() => {console.log('onPlaybackRateChange');}}
          />
        </Col>
        <Col xs={4} lg={4} md={4}>
          <form onSubmit={e => {
            e.preventDefault()
            if (!input.value.trim()) {
              return
            }
            props.search(input.value);
            input.value = ''
          }}>
            <FormGroup>
              <InputGroup>
                <InputGroup.Addon>
                  <Glyphicon glyph="search" />
                </InputGroup.Addon>
                <input className="form-control" type="text" ref={node => { input = node }}/>
              </InputGroup>
            </FormGroup>
          </form>

          <Button onClick={togglePlayer.bind(this)}>Mixamelo</Button>
        </Col>
        <Col xs={4} lg={4} md={4}>
          <YouTube
            videoId={props.rightId}
            opts={opts}
            onReady={onRightReady}
            onPlay={() => {console.log('onplay');}}
            onPause={() => {console.log('onPause');}}
            onEnd={() => {console.log('onEnd');}}
            onError={() => {console.log('onError');}}
            onStateChange={() => {console.log('onStateChange');}}
            onPlaybackRateChange={() => {console.log('onPlaybackRateChange');}}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={4}>
          { props.leftId && props.suggestionsResult && props.suggestionsResult[props.leftId] &&
            <SearchList
              results={props.suggestionsResult[props.leftId]}
              setLeft={props.setLeft}
              setRight={props.setRight}
            />
          }
        </Col>
        <Col lg={4}>
          { props.searchResult &&
            <SearchList
              results={props.searchResult}
              setLeft={props.setLeft}
              setRight={props.setRight}
            />
          }
        </Col>
        <Col lg={4}>
          { props.rightId && props.suggestionsResult && props.suggestionsResult[props.rightId] &&
            <SearchList
              results={props.suggestionsResult[props.rightId]}
              setLeft={props.setLeft}
              setRight={props.setRight}
            />
          }
        </Col>
      </Row>
    </Grid>
  );
}

const mapStateToProps = state => ({

  suggestionsResult: state.suggestions.suggestionsResult,
  searchResult: state.search.searchResult,
  searching: state.search.searching,
  leftId: state.mixer.leftId,
  rightId: state.mixer.rightId,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  search,
  setLeft,
  setRight,
  getSuggestions,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Mixer)
