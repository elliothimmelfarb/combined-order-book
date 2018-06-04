const router = require('express').Router();
const api = require('./api/poloniexAPI');
const standardize = require('./util/standardizeOrderBooks').poloniex
const translateMarket = require('./util/translateMarketSyntax').poloniex

router.get('/', (req, res) => res.send('poloniex'));
router.get('/get-order-book', getOrderBook);

async function getOrderBook(req, res) {

  const market = (
    req.query.market && translateMarket(req.query.market)
  ) || 'BTC_ETH';

  let response;

  try {
    response = await api.getOrderBook(market);
    if (response.error) return res.status(400).send(response.error);
    const orderBook = standardize(response);
    res.send(response);
  } catch(err) {
    res.status(404).send(err);
  }

}

module.exports = router;
