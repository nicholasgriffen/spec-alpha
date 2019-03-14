var nearley = require('nearley')
var grammer = require('./sExpression.js')

module.exports = {
    objectFromSExpression: function(s) {
    var parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammer))
    parser.feed(s)
    return parser.results[0]
  }
}