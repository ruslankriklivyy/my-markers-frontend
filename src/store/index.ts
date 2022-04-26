import { createContext } from 'react';
import UserStore from './user-store';
import MarkerStore from './marker-store';
import LayerStore from './layer-store';

const rootStoreContext = createContext({
  userStore: new UserStore(),
  markerStore: new MarkerStore(),
  layerStore: new LayerStore(),
});

export default rootStoreContext;
