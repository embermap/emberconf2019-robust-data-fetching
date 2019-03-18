let morgan = require('morgan');
let jsonApi = require("jsonapi-server");
let express = require('express');
let bodyParser = require('body-parser')
let faker = require('faker');

faker.seed(123);

let jsonApiRouter = new express.Router();

let delay = 1000;

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

let articles = [];
let comments = [];
let reviews = [];

let possibleArticles = [
  'Why Most Stocks Fail',
  'Best 50 Tips For Stocks',
	'5 Surefire Ways Stocks Will Ruin You',
	'What Bob Smith Can Teach You About Stocks',
	'2 Things You Must Know About Stocks',
	'Who Else Wants To Enjoy Stocks',
	'Can You Really Find Stocks on the Web?',
	'The Death Of Stocks And How To Avoid It',
	'Succeed With Stocks In 24 Hours',
	'10 Things You Have In Common With Stocks',
  'Why Most People Will Never Be Great At Stocks',
	'What Stocks Dont Want You To Know',
	'The Hidden Mystery Behind Stocks'
];

let possibleComments = [
  'Great article!',
  'Well, actually...',
  'Great read!',
  "This doesn't make any sense...",
  "Really well put, couldn't have said it better myself.",
  'Who wrote this crap!?',
  "I'm going to share this with everyone I know!",
  'Do you have any updates?',
];

stocks.forEach((stock) => {
  Array.from({ length: 2 }).forEach(() => {
    let articleId = makeId('articles');
    let article = {
      id: articleId,
      type: 'articles',
      title: possibleArticles[articleId % possibleArticles.length],
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

    articles.push(article);

    Array.from({ length: Math.floor(Math.random() * 5) + 1 }).forEach(() => {
      let commentId = makeId('comments');
      let comment = {
        id: commentId,
        type: 'comments',
        text: possibleComments[commentId % possibleComments.length],
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
  });

  Array.from({ length: 10 }).forEach(() => {
    let review = {
      id: makeId('reviews'),
      type: 'reviews',
      name: faker.fake("{{name.firstName}} {{name.lastName}}"),
      rating: Math.floor(Math.random() * 3) + 3,
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

});

// articles, comments
jsonApi.define({
  resource: "articles",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    title: jsonApi.Joi.string(),
    stock: jsonApi.Joi.one('stocks'),
    comments: jsonApi.Joi.many('comments')
  },
  examples: articles
});

jsonApi.define({
  resource: "comments",
  handlers: new jsonApi.MemoryHandler(),
  attributes: {
    text: jsonApi.Joi.string(),
    article: jsonApi.Joi.one('articles'),
  },
  examples: comments
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
    let low = stock.price - 5;
    let high = stock.price + 10;
    let newPrice = Math.abs(Math.floor(Math.random() * (high - low + 1) + low));
    stock.price = newPrice + (Math.abs(Math.floor(Math.random() * (99 - 0 + 1)) + 0) / 100.0)
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
