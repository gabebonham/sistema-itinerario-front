export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface RouteRequest {
  origin: Coordinate;
  intermediates?: Coordinate[];
  destination: Coordinate;
}

export interface RouteData {
  distanceMeters: number;
  durationSeconds: number;
  encodedPolyline: string;
  optimizedIntermediateWaypointIndex: number[];
  legs: {
    distanceMeters: number;
    durationSeconds: number;
  }[];
}

