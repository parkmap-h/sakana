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
      var now = new Date();
      var targetTime = now.setHours(now.getHours() - 2);
      return Immutable.OrderedMap(
        Immutable.OrderedMap(spaces)
          .merge(state)
          .toArray()
          .filter((space, index) => {
            return space.createAt > targetTime; })
          .map((s) => { return [s.createAt, s]; }));
    default:
      return state;
    }
  }
};

const instance = new SpaceStore(dispatcher);
export default instance;
