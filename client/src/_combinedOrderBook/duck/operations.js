import axios from 'axios'
import actions from './actions'

const fetchSupportedExchanges = () => {
  return dispatch => {
    dispatch(actions.getSupportedExchanges())
    return axios.get('/api/get-supported-exchanges')
      .then(res => {
        const activeExchanges = res.data.reduce((obj, ex) => {
          obj[ex] = true;
          return obj;
        }, {})
        dispatch(actions.getSupportedExchangesSuccess(activeExchanges))
      })
      .catch(res => {
        const status = res.response.status;
        dispatch(actions.getSupportedExchangesFail(status));
      });
  }
}

const fetchBookInitial = () => {
  return (dispatch, getState) => {
    const state = getState().combinedOrderBook

    window.clearInterval(state.autoUpdateIntervalObj)
    dispatch(actions.initialBookFetching())

    const market = state.marketPair.join('-');
    const exchanges = state.exchanges.filter(ex =>
      state.activeExchanges[ex]
    ).join(',');

    const baseUrl = './api/get-order-books';
    const url = `${baseUrl}?market=${market}&exchanges=${exchanges}`;
    return axios.get(url)
      .then(res => {
        dispatch(actions.initialBookFetchingSuccess(res.data))
        const autoUpdateInterval = window.setInterval(
          fetchBookOnInterval(dispatch, url),
          4000,
        );
        dispatch(actions.setAutoUpdateInterval(autoUpdateInterval))
      })
      .catch(res => {
        dispatch(actions.fetchBookFail(res.response))
      })
  }
}


// this is passed to the interval created in the function above
function fetchBookOnInterval(dispatch, url) {
  return () => {
    dispatch(actions.fetchBook());
    return axios.get(url)
      .then(res => {
        dispatch(actions.fetchBookSuccess(res.data));
      })
      .catch(res => {
        dispatch(actions.fetchBookFail(res));
      });
  }
}

const {
  toggleExchange,
  setMarketPair,
} = actions;

export default {
  fetchSupportedExchanges,
  toggleExchange,
  setMarketPair,
  fetchBookInitial,
};
