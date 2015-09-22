'use strict';

import type {Action} from './spaceActions';

import Immutable from 'immutable';
import {ReduceStore} from 'flux/utils';
import Space from './space';
import dispatcher from './spaceDispatcher';

type State = Immutable.OrderedMap<string, Space>;


class SpaceStore extends ReduceStore<string, Space> {
  getInitialState(): State {
    return Immutable.OrderedMap();
  }

  reduce(state: State, action: Action): State {
    switch (action.type) {
    case 'space/load':
      var s = state.merge(action.spaces.map(function(s) { return [s.createAt,s]; }));;
      return s;
    default:
      return state;
    }
  }
};

const instance = new SpaceStore(dispatcher);
export default instance;
