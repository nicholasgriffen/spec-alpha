sExpression -> string {% id %} | list {% id %}
string -> display:? raw {% data => {
  if (data[0] && data[0].display) {
    var strObj = String(data[1])
    strObj.display = data[0].display
    return strObj
  } else {
    return data[1]
  }
} %}
display -> "[" raw "]" {% data => ({display: data[1]}) %}
raw -> [0-9]:+ ":" .:+ {%
  function(data, location, reject) {
    if (data[2].length !== +data[0]) {
      console.log('reject')
      return reject
    } else {
      console.log('pass')
      return data[2].join('')
    }
  }
%}
list -> "(" "(":? sExpression sExpression:* ")" ")":? {% data => {
  return {
    [data[2]]: data[3]
  }} %}