import type { Enclosure } from '@/types';

export const enclosures: Enclosure[] = [
  {
    id: 'polar-frontier',
    name: 'Polar Frontier',
    polygon: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.1195, 40.1580],
            [-83.1175, 40.1580],
            [-83.1175, 40.1568],
            [-83.1195, 40.1568],
            [-83.1195, 40.1580],
          ],
        ],
      },
    },
    labelPosition: { lat: 40.1574, lng: -83.1185 },
  },
  {
    id: 'heart-of-africa',
    name: 'Heart of Africa',
    polygon: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.1180, 40.1566],
            [-83.1158, 40.1566],
            [-83.1158, 40.1553],
            [-83.1180, 40.1553],
            [-83.1180, 40.1566],
          ],
        ],
      },
    },
    labelPosition: { lat: 40.15595, lng: -83.1169 },
  },
  {
    id: 'asia-quest',
    name: 'Asia Quest',
    polygon: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.1208, 40.1556],
            [-83.1188, 40.1556],
            [-83.1188, 40.1544],
            [-83.1208, 40.1544],
            [-83.1208, 40.1556],
          ],
        ],
      },
    },
    labelPosition: { lat: 40.1550, lng: -83.1198 },
  },
  {
    id: 'north-america',
    name: 'North America',
    polygon: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.1222, 40.1572],
            [-83.1204, 40.1572],
            [-83.1204, 40.1560],
            [-83.1222, 40.1560],
            [-83.1222, 40.1572],
          ],
        ],
      },
    },
    labelPosition: { lat: 40.1566, lng: -83.1213 },
  },
  {
    id: 'shores-aquarium',
    name: 'Shores & Aquarium',
    polygon: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-83.1165, 40.1550],
            [-83.1148, 40.1550],
            [-83.1148, 40.1538],
            [-83.1165, 40.1538],
            [-83.1165, 40.1550],
          ],
        ],
      },
    },
    labelPosition: { lat: 40.1544, lng: -83.1156 },
  },
];
