import { createContext } from 'react';
import UserStore from './userStore';
import MarkerStore from './markerStore';
import LayerStore from './layerStore';

const rootStoreContext = createContext({
  userStore: new UserStore(),
  markerStore: new MarkerStore(),
  layerStore: new LayerStore(),
});

export default rootStoreContext;
