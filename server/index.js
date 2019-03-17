let morgan = require('morgan');
let jsonApi = require("jsonapi-server");
let express = require('express');
let bodyParser = require('body-parser')

let jsonApiRouter = new express.Router();

let delay = 300;

jsonApi.setConfig({
  base: 'api',
  router: jsonApiRouter
});

let baseIds = {};
let makeId = function(type) {
  if (!baseIds[type]) {
    baseIds[type] = 1;
  }

  return String(baseIds[type]++);
};

let stocks = [{
  id: 'AAPL',
  type: 'stocks',
  symbol: 'AAPL',
  name: 'Apple',
  price: 180.12,
  articles: [],
  reviews: []
},{
  id: 'AMZN',
  type: 'stocks',
  symbol: 'AMZN',
  name: 'Amazon',
  price: 1712.36,
  articles: [],
  reviews: []
},{
  id: 'GOOGL',
  type: 'stocks',
  symbol: 'GOOGL',
  name: 'Google',
  price: 1190.30,
  articles: [],
  reviews: []
},{
  id: 'MSFT',
  type: 'stocks',
  symbol: 'MSFT',
  name: 'Amazon',
  price: 115.91,
  articles: [],
  reviews: []
},{
  id: 'BRK.A',
  type: 'stocks',
  symbol: 'BRK.A',
  name: 'Berkshire Hathaway',
  price: 307250.00,
  articles: [],
  reviews: []
},{
  id: 'FB',
  type: 'stocks',
  symbol: 'FB',
  name: 'Facebook',
  price: 165.98,
  articles: [],
  reviews: []
}];

let comments = [];
let reviews = [];

let possibleArticles = [
  'Ten reasons to buy this stock in 2019',
  'Avoid this stock, what the street isnt telling you!',
  'Ten companies you need to own, is this one of them?',
];

let possibleComments = [
  'Great article!',
  'Well, actually...',
  'Great read'
];

let articles = stocks.reduce((result, stock, i) => {
  let article = {
    id: makeId('articles'),
    type: 'articles',
    title: possibleArticles[i % possibleArticles.length],
    stock: {
      type: 'stocks',
      id: stock.id
    },
    comments: []
  };

  stock.articles.push({
    type: 'articles',
    id: article.id
  });

  [1,2,3].forEach((id, j) => {
    let comment = {
      id: makeId('comments'),
      type: 'comments',
      text: possibleComments[j % possibleComments.length],
      article: {
        type: 'articles',
        id: article.id
      }
    };

    article.comments.push({
      type: 'comments',
      id: comment.id
    });

    comments.push(comment);
  });

  result.push(article);

  [1,2,3].forEach(() => {
    let review = {
      id: makeId('reviews'),
      type: 'reviews',
      rating: Math.floor(Math.random() * 5) + 2,
      stock: {
        type: 'stocks',
        id: stock.id
      }
    };

    stock.reviews.push({
      type: 'reviews',
      id: review.id
    });

    reviews.push(review);
  });

  return result;
}, []);

// articles, comments
jsonApi.define({
  resource: "articles",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    title: jsonApi.Joi.string(),
    stock: jsonApi.Joi.one('stocks'),
    comments: jsonApi.Joi.many('comments')
    // comments: jsonApi.Joi.many({
    //   resource: 'comments',
    //   as: 'article'
    // })
  },
  examples: articles
  // examples: [
  //   {
  //     id: '1',
  //     type: 'articles',
  //     title: 'Ten reasons to buy this stock',
  //     stock: {
  //       type: 'stocks',
  //       id: 'AAPL'
  //     },
  //     comments: [{
  //       type: 'comments',
  //       id: '1'
  //     }]
  //   },
  // ]
});

jsonApi.define({
  resource: "comments",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    text: jsonApi.Joi.string(),
    article: jsonApi.Joi.one('articles'),
  },
  examples: comments
  // examples: [
  //   {
  //     id: '1',
  //     type: 'comments',
  //     text: 'This is a great read!',
  //     article: {
  //       type: 'articles',
  //       id: '1'
  //     }
  //   }
  // ]
});

jsonApi.define({
  resource: "reviews",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    name: jsonApi.Joi.string(),
    rating: jsonApi.Joi.number(),
    stock: jsonApi.Joi.one('stocks')
  },
  examples: reviews
  // [
  //   {
  //     id: '1',
  //     type: 'reviews',
  //     rating: 4,
  //     stock: {
  //       type: 'stocks',
  //       id: '1'
  //     }
  //   },{
  //     id: '2',
  //     type: 'reviews',
  //     rating: 3,
  //     comments: {
  //       type: 'stocks',
  //       id: '2'
  //     }
  //   }
  // ]
});

let stocksStore = new jsonApi.MemoryHandler();

jsonApi.define({
  resource: "stocks",
  handlers: stocksStore,
  attributes: {
    name: jsonApi.Joi.string(),
    symbol: jsonApi.Joi.string(),
    price: jsonApi.Joi.number(),
    articles: jsonApi.Joi.many('articles'),
    reviews: jsonApi.Joi.many('reviews')
  },
  examples: stocks
});

jsonApi.start();

setInterval(function() {
  stocks.forEach(stock => {
    let low = stock.price - 10;
    let high = stock.price + 10;
    let newPrice = Math.abs(Math.floor(Math.random() * (high - low + 1) + low));
    stock.price = newPrice;
  });
}, 1000);

module.exports = function(app) {
  app.use(morgan('dev'));

  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      setTimeout(jsonApiRouter, delay, req, res, next);
    } else {
      next();
    }
  });

  app.get('/delay', (req, res) => {
    res.json({ delay: delay });
  });

  app.use(bodyParser.json());
  app.post('/delay', (req, res) => {
    delay = parseInt(req.body.delay);
    res.json({ delay: delay });
  });
};
