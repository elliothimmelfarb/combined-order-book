import types from './types';

const initialState = {
  fetchingExchanges: false,
  exchanges: [],
  activeExchanges: {},
  marketPair: ['BTC', 'ETH'],
  liveUpdateInterval: '',
};

export default (state = initialState, action) => {
  switch(action.type) {
    case types.GET_SUPPORTED_EXCHANGES: {
      return Object.assign({}, state, {
        fetchingExchanges: true,
      });
    }
    case types.GET_SUPPORTED_EXCHANGES_SUCCESS: {
      return Object.assign({}, state, {
        activeExchanges: action.payload,
        exchanges: Object.keys(action.payload),
        fetchingExchanges: false,
      });
    }
    case types.GET_SUPPORTED_EXCHANGES_FAIL: {
      return Object.assign({}, state, {
        fetchingExchanges: false,
        exchanges: action.payload,
      });
    }
    case types.TOGGLE_EXCHANGE: {
      const activeExchanges = { ...state.activeExchanges}
      activeExchanges[action.payload] = !state.activeExchanges[action.payload]
      return Object.assign({}, state, {
        activeExchanges,
      })
    }
    case types.SET_MARKET_PAIR: {
      return Object.assign({}, state, {
        marketPair: action.payload,
      })
    }
    case types.INITIAL_BOOK_FETCHING: {
      return Object.assign({}, state, {
        initialBookFetching: true,
      })
    }
    default: return state
  }
}
