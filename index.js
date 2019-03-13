(function() {
  var registry = {
    getSpec: function(name) {
    return registry[name]
  }}

  function registerPredicate(specName, predicate) {
    registry[specName].predicates = registry[specName].predicates.concat(predicate)
  }

  function registerSpec(specName, defArgs) {
    registry[specName] = { predicates: [] }
    registry[specName].string = argsToSExpr(specName, defArgs)
    registry[specName].toString = function() { return registry[specName].string }
    return specName
  }

  function toAtom(val) {
    switch(typeof val) {
      case 'string':
        return `${val.length}:${val}`
      case 'object':
        if (Array.isArray(val)) return val.map(toAtom)
        return objectToAtoms(val)
      default:
        return ''
    }
  }

  function objectToAtoms(nested, keys, accumulated) {
    var keys = keys || Object.keys(nested)
    var key = keys.pop()
    var str = `${accumulated || ''}(${toAtom(key)}`

    if (typeof nested[key] === 'object') {
      str = str + objectToAtoms(nested[key])
    } else {
      str = str + ')'
    }

    if (keys.length === 0) return str + ')'

    return objectToAtoms(nested, keys, str)
  }

  function argsToSExpr(specName, defArgs) {
    return `(${defArgs.reduce(function(acc, val) {
      if (typeof val === 'function') {
        registerPredicate(specName, val)
        return acc
      } else if (val.predicates) {
        val.predicates.forEach(predicate => registerPredicate(specName, predicate))
        return acc + `${toAtom(val.string)}`
      } else {
        return acc + `${toAtom(val)}`
      }
    }, ``)})`
  }

  return {
    def: function(name) {
      return registerSpec(name, Array.from(arguments).slice(1))
    },
    valid: function(name, value) {
      var spec = registry.getSpec(name)
      for (var i = 0; i < spec.predicates.length; i++) {
        if (!spec.predicates[i](value)) return null
      }
      if (spec.toString().length && toAtom(value) !== spec.toString()) return null
      return true
    },
    getSpec: function(name) {
      return registry.getSpec(name)
    },
  }
})()