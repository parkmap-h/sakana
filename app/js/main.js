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
      currentPoint = point;
      this.setState({centerPoint: point});
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

  _handleCenterChanged(e) {
    var map = this.refs.map;
    var {lat, lng} = map.getCenter();
    var point = { latitude: lat(), longitude: lng() };
    this.setState({centerPoint: point});
  }

  render(): ?ReactElement {
    var spaces = this.state.spaces.map(function (s) {
      return (
        <div>
          <div>{prettydate.format(s.createAt)}</div>
          <div>{s.point.longitude.toString().substring(0,5)},{s.point.latitude.toString().substring(0,5)}に空きが{s.value}件あります。</div>
        </div>);
    });
    var postButton = "";
    if (this.state.currentPoint) {
      var m = {position: {lat: this.state.currentPoint.latitude, lng: this.state.currentPoint.longitude}};
      var now = new Date().getTime();
      var centerTarget = "";
      if (this.state.centerPoint != null) {
        centerTarget = (<OverlayView key="target"
                          position={{lat: this.state.centerPoint.latitude, lng: this.state.centerPoint.longitude}}
                          mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                          getPixelPositionOffset={this.getPixelPositionOffset}
                        >
                        <div style={{"font-size": "20px", "text-shadow": "0 0 4px #fff"}}>＋</div>
                        </OverlayView>);
      }
      postButton = (
      <div>
        <section style={{height: "75%"}}>
          <GoogleMap containerProps={{
            style: {
              height: "100%"
            }
          }}
          ref="map"
          defaultZoom={14}
          defaultCenter={{lat: this.state.currentPoint.latitude, lng: this.state.currentPoint.longitude}}
          onCenterChanged={this._handleCenterChanged.bind(this)}
          >
            <Marker key="currentPoint" position={{lat: this.state.currentPoint.latitude, lng: this.state.currentPoint.longitude}} />
            {this.state.spaces.map((space, index) => {
              var delta = 2 * 60 * 60 * 1000;
              var marker = {
                key: "space-" + space.createAt.getTime(),
                position: {
                  lat: space.point.latitude,
                  lng: space.point.longitude
                },
                label: space.value.toString(),
                opacity: 1 - ((now - space.createAt.getTime()) / delta),
                defaultAnimation: 4
              };
              return (<Marker {...marker} />);
            })}
          <div style={{position:"absolute", padding:"auto", margin:"auto", height:10, width:10, top:-16,bottom:0,right:0,left:-1, zIndex:1}}>+</div>
          </GoogleMap>
        </section>
            <button onClick={this._handleNoSpace.bind(this)}>空いてない</button>
            <button onClick={this._handleOneSpace.bind(this)}>1台</button>
            <button onClick={this._handleTwoSpace.bind(this)}>2台</button>
            <button onClick={this._handleThreeGreatorSpace.bind(this)}>3台以上</button>
      </div>
      );
    }
    return (
      <div className="app">
        {postButton}
        <div className="spaces">
        {spaces}
        </div>
      </div>
    );
  };
  getPixelPositionOffset (width, height) {
    return {x: -(width / 2), y: -(height / 2)};
  }
}

const PageContainer = Container.create(Page);
ReactDOM.render(<PageContainer />, document.getElementById("map"));
