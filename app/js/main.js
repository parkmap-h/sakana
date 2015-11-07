import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Space from './space';
import prettydate from "pretty-date";
import spaceStore from './spaceStore';
import {dispatch} from './spaceDispatcher';
import {Container} from 'flux/utils';
import {GoogleMap, Marker, OverlayView} from "react-google-maps";
var googlemaps = window.google.maps;
var base_url = "https://parkmap-h.appspot.com/";

function getSpaces() {
  var req = new XMLHttpRequest();
  req.open('GET', base_url + 'spaces');
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var featureCollection = JSON.parse(req.responseText);
      var spaces = featureCollection.features.map(function (s) {
        return Space.fromFeature(s);
      });
      dispatch({ type: "space/load", spaces: spaces});
    };
  };
  req.send();
}

function createSpace(point, value) {
  var req = new XMLHttpRequest();
  req.open('POST', base_url + 'spaces');
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var feature = JSON.parse(req.responseText);
      var space = Space.fromFeature(feature);
      dispatch({ type: "space/load", spaces: [space]});
    };
  };
  var obj = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [point.longitude, point.latitude]
    },
    "properties": { "value": value }
  };
  req.send(JSON.stringify(obj));
}

function getCurrentPosition(callback) {
  if( navigator.geolocation )
  {
    navigator.geolocation.getCurrentPosition(
      function(position){ callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }); },
      function (){} );
  }
}

var littleSpace = new googlemaps.MarkerImage(
  'littleSpace.png',
  new googlemaps.Size(5,5),
  new googlemaps.Point(0,0),
  new googlemaps.Point(3,3));
var space = new googlemaps.MarkerImage(
  'space.png',
  new googlemaps.Size(10,10),
  new googlemaps.Point(0,0),
  new googlemaps.Point(5,5));
var noSpace = new googlemaps.MarkerImage(
  'noSpace.png',                     // url
  new googlemaps.Size(10,10),
  new googlemaps.Point(0,0),
  new googlemaps.Point(5,5));

var spaceIcon = [noSpace, littleSpace, space];

var currentPoint = null;

class Page extends Component<{}, {}, State> {
  static getStores(): Array<Store> {
    return [spaceStore];
  }

  static calculateState(prevState: ?State): State {
    return {
      spaces: spaceStore.getState(),
      currentPoint: currentPoint
    };
  }

  componentWillMount() {
    getSpaces();
    var handleCurrentPoint = (point) => {
      currentPoint = point;
      this.setState({currentPoint: point});
    };
    var handleCenterPoint = (point) => {
      var isNeedInit = this.state.currentPoint;
      currentPoint = point;
      this.setState({centerPoint: point});
      if (isNeedInit) {
        this._handleCurrentPosition(null);
      }
    };
    getCurrentPosition(handleCenterPoint);
    getCurrentPosition(handleCurrentPoint);
    var positionLoop = () => {
      getCurrentPosition(handleCurrentPoint);
      window.setTimeout(positionLoop, 3000);
    };
    window.setTimeout(positionLoop, 3000);

    var getSpacesLoop = () => {
      getSpaces();
      window.setTimeout(getSpacesLoop, 5000);
    };
    window.setTimeout(getSpacesLoop, 5000);
  }

  _handleNoSpace() {
    createSpace(this.state.centerPoint, 0);
  }

  _handleOneSpace(e) {
    createSpace(this.state.centerPoint, 1);
  }

  _handleTwoSpace(e) {
    createSpace(this.state.centerPoint, 2);
  }

  _handleThreeGreatorSpace(e) {
    createSpace(this.state.centerPoint, 3);
  }

  _handleCurrentPosition(e) {
    var map = this.refs.map;
    var { latitude, longitude } = this.state.currentPoint;
    map.panTo({lat: latitude, lng: longitude});
  }

  _handleCenterChanged(e) {
    var map = this.refs.map;
    var {lat, lng} = map.getCenter();
    var point = { latitude: lat(), longitude: lng() };
    this.setState({centerPoint: point});
  }

  render(): ?ReactElement {
    var spaces;
    if (this.state.spaces.length > 0) {
      spaces = this.state.spaces.map(function (s) {
      return (
        <div className="space">
          <div>{prettydate.format(s.createAt)}</div>
          <div>{s.point.longitude.toString().substring(0,5)},{s.point.latitude.toString().substring(0,5)}に空きが情報が登録されました。</div>
        </div>);
      });
    } else {
      spaces = (
        <div className="warn">
          空き情報が登録されていません。
        </div>);
    }
    var postButton = "";
    var now = new Date().getTime();
    var currentMarker;
    if (this.state.currentPoint != null) {
      currentMarker = <Marker key="currentPoint" position={{lat: this.state.currentPoint.latitude, lng: this.state.currentPoint.longitude}} />;
    }
    postButton = (
    <div>
      <section style={{height: "400px"}}>
        <GoogleMap containerProps={{
          style: {
            height: "100%"
          }
        }}
        ref="map"
        defaultZoom={16}
        defaultCenter={{lat: 0, lng: 0}}
        onCenterChanged={this._handleCenterChanged.bind(this)}
        >
        {currentMarker}
          {this.state.spaces.map((space, index) => {
            var delta = 2 * 60 * 60 * 1000;
            var marker = {
              key: "space-" + space.createAt.getTime(),
              position: {
                lat: space.point.latitude,
                lng: space.point.longitude
              },
              icon: spaceIcon[space.value],
              opacity: 1 - ((now - space.createAt.getTime()) / delta),
              defaultAnimation: 4
            };
            return (<Marker {...marker} />);
          })}
        <div style={{position:"absolute", padding:"auto", margin:"auto", height:10, width:10, top:-14,bottom:0,right:0,left:-1, zIndex:1}}>+</div>
        </GoogleMap>
      </section>
      <div className="tool">
        <button onClick={this._handleCurrentPosition.bind(this)}>中央を現在地に合わせる</button>
      </div>
      <div className="spaceRegister">
        <button onClick={this._handleNoSpace.bind(this)}>空いてない</button>
        <button onClick={this._handleOneSpace.bind(this)}>1〜3台ほど<br />停められる</button>
        <button onClick={this._handleTwoSpace.bind(this)}>そこそこ停められる</button>
      </div>
    </div>
    );
    return (
      <div className="app">
        <header><h1>空き情報 パークマップ</h1></header>
        {postButton}
        <div className="spaces">
        {spaces}
        </div>
        <div>
          <p>
            駐車場の空き情報は誰でも登録できます。空いている駐車場をみつけたら地図の真ん中に駐車場を合わせて、空いている台数にあったボタンをタップしてください。
            空き情報は登録されて2時間以内のものだけが表示されています。
            古い情報は少しづつ見えなくなっていきます。
          </p>
          <p>みんなで空き情報パークマップをつくりましょう。</p>
        </div>
        <footer>
          <a href="http://parkmap.eiel.info">パークマップ広島</a>
        </footer>
      </div>
    );
  };
  getPixelPositionOffset (width, height) {
    return {x: -(width / 2), y: -(height / 2)};
  }
}

const PageContainer = Container.create(Page);
ReactDOM.render(<PageContainer />, document.getElementById("map"));
