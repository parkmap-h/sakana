import React, {Component}  from 'react';
import Space from './space';
import prettydate from "pretty-date";
import spaceStore from './spaceStore';
import dispatcher from './spaceDispatcher';
import {Container} from 'flux/utils';

function getSpaces() {
  var req = new XMLHttpRequest();
  req.open('GET', 'https://parkmap-h.appspot.com/spaces');
  req.onreadystatechange = function() {
    if (req.readyState === 4 && req.status === 200){
      var featureCollection = JSON.parse(req.responseText);
      var spaces = featureCollection.features.map(function (s) {
        return Space.fromFeature(s);
      });
      dispatcher.dispatch({ type: "space/load", spaces: spaces});
    };
  };
  req.send();
}

class Page extends Component<{}, {}, State> {
  static getStores(): Array<Store> {
    return [spaceStore];
  }

  static calculateState(prevState: ?State): State {
    return {
      spaces: spaceStore.getState()
    };
  }

  componentWillMount() {
    getSpaces();
  }

  render(): ?ReactElement {
    var spaces = this.state.spaces.map(function (s) {
      return (
        <div>
          {prettydate.format(s.createAt)} {s.point.longitude},{s.point.latitude}に空き駐車場が{s.value}件あります。
        </div>);
    });
    return (
      <div className="app">
        {spaces}
      </div>
    );
  }
}

const PageContainer = Container.create(Page);
React.render(<PageContainer />, document.body);
