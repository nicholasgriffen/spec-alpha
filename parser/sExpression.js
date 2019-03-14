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
            console.log('reject')
            return reject
          } else {
            console.log('pass')
            return data[2].join('')
          }
        }
        },
    {"name": "list$ebnf$1", "symbols": [{"literal":"("}], "postprocess": id},
    {"name": "list$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list$ebnf$2", "symbols": []},
    {"name": "list$ebnf$2", "symbols": ["list$ebnf$2", "sExpression"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "list$ebnf$3", "symbols": [{"literal":")"}], "postprocess": id},
    {"name": "list$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "list", "symbols": [{"literal":"("}, "list$ebnf$1", "sExpression", "list$ebnf$2", {"literal":")"}, "list$ebnf$3"], "postprocess":  data => {
        return {
          [data[2]]: data[3]
        }} }
]
  , ParserStart: "sExpression"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
