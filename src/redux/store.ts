import { createStore } from '@reduxjs/toolkit';
import { reducers } from './reducers';

const store = createStore(reducers);

export { store };
