import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectionRecord } from 'aries-framework-javascript';

const connectionsSlice = createSlice({
  name: 'connections',
  initialState: [] as Array<ConnectionRecord>,
  reducers: {
    setConnections(state, action: PayloadAction<ConnectionRecord[]>): Array<ConnectionRecord> {
      state = action.payload;
      return state;
    },
    addConnection(state, action: PayloadAction<ConnectionRecord>): Array<ConnectionRecord> {
      state.push(action.payload);
      return state;
    },
    removeConnection(state, action: PayloadAction<string>): Array<ConnectionRecord> {
      const newState = state.filter((conn: ConnectionRecord) => {
        return conn.id !== action.payload;
      });
      state = newState;
      return state;
    },
  },
});

const connectionsReducer = connectionsSlice.reducer;
const { setConnections, addConnection, removeConnection } = connectionsSlice.actions;
export { connectionsReducer, setConnections, addConnection, removeConnection };
