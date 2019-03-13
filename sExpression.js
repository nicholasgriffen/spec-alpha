// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "sExpression", "symbols": ["string"], "postprocess": id},
    {"name": "sExpression", "symbols": ["list"], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": ["display"], "postprocess": id},
    {"name": "string$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "string", "symbols": ["string$ebnf$1", "raw"], "postprocess":  data => {
          console.log('string', data)
          if (data[0] && data[0].display) {
            var strObj = String(data[1])
            strObj.display = data[0].display
            return strObj
          } else {
            return data[1]
          }
        } },
    {"name": "display", "symbols": [{"literal":"["}, "raw", {"literal":"]"}], "postprocess": data => ({display: data[1]})},
    {"name": "raw$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "raw$ebnf$1", "symbols": ["raw$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "raw$ebnf$2", "symbols": [/./]},
    {"name": "raw$ebnf$2", "symbols": ["raw$ebnf$2", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "raw", "symbols": ["raw$ebnf$1", {"literal":":"}, "raw$ebnf$2"], "postprocess": 
        function(data, location, reject) {
          if (data[2].length !== +data[0]) {
            console.log(data, 'failed')
            return reject
          } else {
            console.log(data, 'success')
            return data[2].join('')
          }
        }
        },
    {"name": "list$ebnf$1", "symbols": ["list"], "postprocess": id},
    {"name": "list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list", "symbols": [{"literal":"("}, "sExpression", "list$ebnf$1", {"literal":")"}], "postprocess":  data => ({
        expression: {
          value: data[1],
          subExpression: data[2]
        }}) }
]
  , ParserStart: "sExpression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
