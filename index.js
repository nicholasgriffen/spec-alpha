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
    registry[specName].string = parseDefArgs(specName, defArgs)
    registry[specName].toString = function() { return registry[specName].string }
    return specName
  }

  function reduceToSExp(acc, val) {
    return `${acc}${toSExp(val)}`.replace(')(', '')
  }

  function toSExp(atom) {
    switch(typeof atom) {
      case 'string':
        return `(${atom.length}:${atom})`
      case 'object':
        if (Array.isArray(atom)) return atom.reduce(reduceToSExp, ``)
        return objectToSExp(atom)
      default:
        return ''
    }
  }

  function objectToSExp(nested) {
    var str = ''

    for (key in nested) {
      str = str + `(${key.length}:${key}${objectToSExp(nested[key])})`
    }

    return str.replace(/\)(\(.*)$/, '$1)')
  }

  function parseDefArgs(specName, defArgs) {
    return defArgs.reduce(function(acc, val) {
      if (typeof val === 'function') {
        registerPredicate(specName, val)
        return acc
      } else if (val.predicates) {
        val.predicates.forEach(predicate => registerPredicate(specName, predicate))
        return acc + toSExp(val.string)
      } else {
        return acc + toSExp(val)
      }
    }, ``)
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
      if (spec.toString().length && toSExp(value) !== spec.toString()) return null
      return true
    },
    getSpec: function(name) {
      return registry.getSpec(name)
    },
  }
})()