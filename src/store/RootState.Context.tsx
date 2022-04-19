import React from 'react';
import UserStore from './userStore';
import MarkerStore from './markerStore';
import LayerStore from './layerStore';

interface RootStateContextValue {
  userStore: UserStore;
  markerStore: MarkerStore;
  layerStore: LayerStore;
}

const RootStateContext = React.createContext<RootStateContextValue>(
  {} as RootStateContextValue,
);

const userStore = new UserStore();
const markerStore = new MarkerStore();
const layerStore = new LayerStore();

export const RootStateProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => (
  <RootStateContext.Provider value={{ userStore, markerStore, layerStore }}>
    {children}
  </RootStateContext.Provider>
);

export const useRootStore = () => React.useContext(RootStateContext);
