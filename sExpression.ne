sExpression -> string {% id %} | list {% id %}
string -> display:? raw {% data => {
  console.log('string', data)
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
      console.log(data, 'failed')
      return reject
    } else {
      console.log(data, 'success')
      return data[2].join('')
    }
  }
%}
list -> "(" sExpression list:? ")" {% data => ({
  expression: {
    value: data[1],
    subExpression: data[2]
  }}) %}