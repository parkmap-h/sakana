'use strict';

import Immutable from 'immutable';

const SpaceRecord = Immutable.Record({
  point: undefined,
  value: undefined,
  createAt: undefined,
});

export default class Space extends SpaceRecord {
  point: Object;
  value: number;
  createAt: Date;

  constructor(latitude: number, longitude: number, value: number, createAt: number) {
    var point = {
        latitude: latitude,
        longitude: longitude
    };
    super({
      point: point,
      value: value,
      createAt: new Date(createAt * 1000)
    });
  }

  static fromFeature(feature) {
    return new Space(feature.geometry.coordinates[1], feature.geometry.coordinates[0], feature.properties.value, feature.properties.createAt);
  }
};
