(function() {
  var registry = (function() {
    var store = {
      predicates: {}
    }
    return {
      addSpec: function(name, defArgs) {
        store[name] = {
          predicates: [],
          string: argsToSExpr(name, defArgs),
          toString: function() { return store[name].string }
        }
      },
      addPredicate: function(name, predicate) {
        var regHash = hashPredicate(predicate)

        store.predicates[regHash] = store.predicates[regHash] || predicate

        if (store[name] && store[name].predicates && !store[name].predicates.includes(regHash)) {
          store[name].predicates.push(regHash)
        }
      },
      getSpec: function(name) {
        return store[name]
      },
      getPredicate: function(name) {
        return store.predicates[name]
      }
    }
  })()

  function parseSExpr(value, macro, sub) {
    var hydrated = macro || {}
    var target = sub || hydrated
    var sExpr = /\(\d+\:(.(?!\()+)/

    if (sExpr.test(value)) {
      var key = value.match(sExpr)[1]
      target[key] = {}
      return parseSExpr(value.replace(sExpr, ''), hydrated, target[key])
    }
    return hydrated
  }

  function hashPredicate(p) {
    return p.toString().split('').reduce(function(acc, val) { return acc + val.charCodeAt(0) } , 0)
  }

  function registerPredicate(specName, predicate) {
    registry.addPredicate(specName, predicate)
  }

  function registerSpec(specName, defArgs) {
    registry.addSpec(specName, defArgs)

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
      for (var predicate of spec.predicates) {
        if (!registry.getPredicate(predicate)(value)) return null
      }
      return true
    },
    getSpec: function(name) {
      return registry.getSpec(name)
    },
  }
})()

'((1:z)(1:a(1:b(1:c)))(1:b)))'