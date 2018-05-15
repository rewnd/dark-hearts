module.exports = {
  'extends': 'airbnb-base',
  'env': {
    'browser': true,
    'meteor': true,
    'node': true,
    'es6': true
  },
  'rules': {
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
  }
};