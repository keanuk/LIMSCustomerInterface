exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  capabilities: {
    'browserName': 'chrome'
  },

  specs: ['example-spec.js'],

  jasmineNodeOpts: {
    showColors: true
  }
};