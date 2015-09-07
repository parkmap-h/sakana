'use strict';

import type {Action} from './spaceActions';

import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import Space from './space';
import dispatcher from './spaceDispatcher';

type State = Immutable.OrderedMap<int, Space>;


class SpaceStore extends ReduceStore<int, Space> {
  getInitialState(): State {
    return Immutable.OrderedMap();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
    case 'space/load':
      var spaces = action.spaces.map(function(s) { return [s.createAt, s]; });
      var s = Immutable.OrderedMap(spaces).merge(state);
      return s;
    default:
      return state;
    }
  }
};

const instance = new SpaceStore(dispatcher);
export default instance;
