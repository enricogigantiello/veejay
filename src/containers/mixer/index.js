import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {Grid, Row, Col, Button, FormGroup, InputGroup, FormControl, Glyphicon} from 'react-bootstrap';
import Rheostat from 'rheostat';
import SearchList from '../../components/searchList'
import SliderPit from '../../components/sliderPit'
import SliderHandle from '../../components/sliderHandle'
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
};

let leftVideo = null;
let rightVideo = null;
let timeForSwitch = 1;
let loops = {
  'left' : {
    looping: false,
    start: null,
    end: null,
    duration: null,
  },
  'right' : {
    looping: false,
    start: null,
    end: null,
    duration: null,
  }
}

const onLeftReady = (event) => {
  // access to player in all event handlers via event.target
  leftVideo = event.target;
}

const onRightReady = (event) => {
  // access to player in all event handlers via event.target
  rightVideo = event.target;
}

const togglePlayer = () => {
  if (leftVideo.getPlayerState() === PLAYING) {
    leftVideo.pauseVideo();
    rightVideo.setVolume(leftVideo.getVolume());
    rightVideo.unMute();
    rightVideo.playVideo();
  } else if (rightVideo.getPlayerState() === PLAYING) {
    rightVideo.pauseVideo();
    leftVideo.unMute();
    leftVideo.setVolume(rightVideo.getVolume());
    leftVideo.playVideo();
  } else {
    console.log("No video Playing");
  }

}

const toggleLeftToRight = () => {
  console.log(timeForSwitch);
  var seconds = timeForSwitch > 0 ? timeForSwitch * 1000 : 3000
  var interval = seconds / parseInt(leftVideo.getVolume());
  if (rightVideo.isMuted()){
    rightVideo.unMute()
  }
  rightVideo.setVolume(1);
  rightVideo.playVideo();
  var vol = leftVideo.getVolume();
  var intr = setInterval(function() {
    leftVideo.setVolume(vol);
    rightVideo.setVolume(100 - vol);
    if (--vol === 1) {
      clearInterval(intr);
      leftVideo.mute();
    }
  }, interval);
}


const toggleRightToLeft = () => {
  console.log(timeForSwitch);
  var seconds = timeForSwitch > 0 ? timeForSwitch * 1000 : 3000
  var interval = seconds / parseInt(rightVideo.getVolume());
  if (leftVideo.isMuted()){
    leftVideo.unMute()
  }
  leftVideo.setVolume(1);
  leftVideo.playVideo();
  var vol = rightVideo.getVolume();
  var intr = setInterval(function() {
    rightVideo.setVolume(vol);
    leftVideo.setVolume(100 - vol);
    if (--vol === 1) {
      clearInterval(intr);
      rightVideo.mute();
    }
  }, interval);
}

const handleSwitchTimeChange = (e) => {
  e.preventDefault();
  console.log(e);
  timeForSwitch = parseInt(e.target.value)
}

const editAudioFromSlider = (mode, val) => {
  if (mode === 'total') {
    editTotalAudioFromSlider(val)
  } else {
    editPartialAudioFromSlider(val)
  }
}

const editTotalAudioFromSlider = (val) => {
  if (leftVideo && rightVideo) {
    var sliderValue = val.values[0];
    if (sliderValue < 100) {
      if (leftVideo.isMuted()){
        leftVideo.unMute()
      }
      leftVideo.setVolume(100 - sliderValue);
      rightVideo.setVolume(0);
    } else if (sliderValue > 100) {
      if (rightVideo.isMuted()){
        rightVideo.unMute()
      }
      rightVideo.setVolume(sliderValue - 100)
      leftVideo.setVolume(0);
    } else {
      rightVideo.setVolume(0);
      leftVideo.setVolume(0);
    }
  }
}

const editPartialAudioFromSlider = (val) => {
  if (leftVideo && rightVideo) {
    var sliderValue = val.values[0];
    leftVideo.unMute();
    rightVideo.unMute();
    rightVideo.setVolume(sliderValue)
    leftVideo.setVolume(100 - sliderValue);
  }
}

const getVideo = (side) => {
  if (side === 'left') {
    return leftVideo;
  } else {
    return rightVideo;
  }
}
const startRepeat = (side) => {
  var video = getVideo(side);
  if (video.getPlayerState() === PLAYING) {
    loops[side].start = video.getCurrentTime();
  }
}

const endRepeat = (side) => {
  var video = getVideo(side);
  if (video.getPlayerState() === PLAYING) {
    console.log(video);
    loops[side].end = video.getCurrentTime();
    video.seekTo(loops[side].start)
  }
}

const startLoop = (side) => {
  var video = getVideo(side);

  if (video.getPlayerState() === PLAYING && !loops[side].looping) {
    loops[side].looping = true;
    loops[side].start = video.getCurrentTime();
  } else {
    loops[side].looping = false;
  }
}

const loop = (side) => {
  var video = getVideo(side);

  if (video.getPlayerState() === PLAYING ) {
    loops[side].end = video.getCurrentTime();
    loops[side].duration = loops[side].end - loops[side].start;
    console.log(loops[side].start, loops[side].end, loops[side].duration);
    video.seekTo(loops[side].start)
    var myFunction = function() {
        if (loops[side].looping) {
          video.seekTo(loops[side].start);
          setTimeout(myFunction, loops[side].duration * 1000);
        }
    }
    setTimeout(myFunction, loops[side].duration * 1000);
  }
}

const splitLoop = (side) => {
  loops[side].duration = loops[side].duration / 2;
}

const Mixer = props => {
  let search, time;
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
          <Row>
            <Col xs={12}>
              <form onSubmit={e => {
                e.preventDefault()
                if (!search.value.trim()) {
                  return
                }
                props.search(search.value);
                search.value = ''
              }}>
                <FormGroup>
                  <InputGroup>
                    <InputGroup.Addon>
                      <Glyphicon glyph="search" />
                    </InputGroup.Addon>
                    <input className="form-control" type="text" ref={node => { search = node }}/>
                  </InputGroup>
                </FormGroup>
              </form>
            </Col>
          </Row>
          <Row>
            <Col xs={12} align="center">
              <Button onClick={togglePlayer.bind(this)}>
                <Glyphicon glyph="resize-horizontal" />
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <Button onMouseDown={startRepeat.bind(this, 'left')} onMouseUp={endRepeat.bind(this, 'left')}>Repeat</Button>
            </Col>
            <Col xsOffset={7} xs={2}>
              <Button onMouseDown={startRepeat.bind(this, 'right')} onMouseUp={endRepeat.bind(this, 'right')}>Repeat</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <Button onMouseDown={startLoop.bind(this, 'left')} onMouseUp={loop.bind(this, 'left')}>Loop</Button>
            </Col>
            <Col xsOffset={7} xs={2}>
              <Button onMouseDown={startLoop.bind(this, 'right')} onMouseUp={loop.bind(this, 'right')}>Loop</Button>
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <Button onClick={splitLoop.bind(this, 'left')}>Split</Button>
            </Col>
            <Col xsOffset={7} xs={2}>
              <Button onClick={splitLoop.bind(this, 'right')}>Split</Button>
            </Col>
          </Row>
          <Row>

            <Col xsOffset={3}xs={2}>
              <Button onClick={toggleLeftToRight.bind(this)}><Glyphicon glyph="menu-right" /></Button>
            </Col>
            <Col xs={2} align="center">
              <Row>
                <FormGroup>
                  <InputGroup>
                    <input className="form-control" type="number" ref={timeNode => { time = timeNode }} onChange={handleSwitchTimeChange.bind(this)}/>
                  </InputGroup>
                </FormGroup>
              </Row>
            </Col>
            <Col xs={2}>
              <div className="pull-right">
                <Button onClick={toggleRightToLeft.bind(this)}><Glyphicon glyph="menu-left" /></Button>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Rheostat
                min={1}
                max={200}
                values={[100]}
                onValuesUpdated={editAudioFromSlider.bind(this, 'total')}
                pitComponent={SliderPit}
                pitPoints={[25, 50, 75, 100, 125, 150, 175]}
                handle={SliderHandle}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Rheostat
                min={1}
                max={100}
                values={[100]}
                onValuesUpdated={editAudioFromSlider.bind(this, 'partial')}
                pitComponent={SliderPit}
                pitPoints={[25, 50, 75, 100]}
                handle={SliderHandle}
              />
            </Col>
          </Row>
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
