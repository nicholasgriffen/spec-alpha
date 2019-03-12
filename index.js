(function() {
  var registry = {
    def: function(name) {
      return registerSpec(name, Array.from(arguments).slice(1))
    },
    valid: function(spec, value) {
      var s = spec
      if (typeof spec === 'string') {
        s = registry[spec]
      }
      for (var i = 0; i < s.predicates.length; i++) {
        if (!s.predicates[i](value)) return null
      }
      if (s.toString().length && value !== stringFromSExp(s.toString())) return null
      return true
    }
  }

  function registerPredicate(specName, predicate) {
    registry[specName].predicates = registry[specName].predicates.concat(predicate)
  }

  function registerSpec(specName, defArgs) {
    registry[specName] = { predicates: [] }
    registry[specName].string = parseDefArgs(specName, defArgs)
    registry[specName].toString = function() { return registry[specName].string }
    return registry[specName]
  }

  function reduceToSExp(acc, val) {
    if (typeof val === 'string' || typeof val === 'object') {
      return `${acc}${atomToSExp(val)}`.replace(')(', '')
    }
    return acc
  }

  function atomToSExp(atom) {
    switch(typeof atom) {
      case 'string':
        return `(${atom.length}:${atom})`
      case 'object':
        if (Array.isArray(atom)) return atom.reduce(reduceToSExp, ``)
        return `${Object.getOwnPropertyNames(atom).reduce(reduceToSExp, ``)}`
      default:
        return null
    }
  }

  function stringFromSExp(sexp) {
    return sexp.replace(/\(\d+:(.*)\)/, '$1')
  }

  function parseDefArgs(specName, defArgs) {
    return defArgs.reduce(function(acc, val) {
      if (typeof val === 'function') {
        registerPredicate(specName, val)
        return acc
      } else if (val.predicates) {
        val.predicates.forEach(predicate => registerPredicate(specName, predicate))
        return reduceToSExp(acc, stringFromSExp(val.string))
      } else {
        return reduceToSExp(acc, val)
      }
    }, ``)
  }

  return registry
})()