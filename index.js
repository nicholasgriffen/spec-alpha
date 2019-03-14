(function() {
    var parseApi = require('./parser/api')
    var registry = (function() {
    var store = {
      predicates: {}
    }
    return {
      addSpec: function(name, defArgs) {
        var parsedArgs = parseArgs(defArgs)

        store[name] = {
          predicates: [],
          sExpression: argsToSExpr(parsedArgs.notPredicates),
          toString: function() { return store[name].sExpression }
        }

        parsedArgs.predicates.forEach(predicate => registerPredicate(name, predicate))
      },
      addPredicate: function(name, predicate) {
        if (+predicate) {
          predicate = store.predicates[predicate]
        }
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
        if (Array.isArray(val)) return argsToSExpr(val)
        if (val.sExpression) return val.sExpression.substring(1, val.sExpression.length - 1)
        return objectToAtoms(val).replace(/\)$/m, '')
      default:
        return ''
    }
  }

  function objectToAtoms(nested, keys, accumulated) {
    var keys = keys || Object.keys(nested)
    var key = keys.pop()
    var str = `${accumulated || ''}(${toAtom(key)}`

    if (typeof nested[key] === 'object') {
      str = str + toAtom(nested[key])
    } else {
      str = str + ')'
    }

    if (keys.length === 0) return str + ')'

    return objectToAtoms(nested, keys, str)
  }

  function argsToSExpr(args) {
    return `(${args.reduce(function(acc, val) {
        return acc + `${toAtom(val)}`
      }, ``)})`
  }
  function parseArgs(args) {
    var predicates = []
    var notPredicates = []
    args.forEach(arg => {
      if (typeof arg === 'function') {
        predicates = predicates.concat(arg)
      } else if (arg && arg.predicates) {
        predicates = predicates.concat(arg.predicates)
        notPredicates = notPredicates.concat(arg)
      } else {
        notPredicates = notPredicates.concat(arg)
      }
    })
    return {predicates: predicates, notPredicates: notPredicates}
  }

  return {
    def: function(name) {
      return registerSpec(name, Array.from(arguments).slice(1))
    },
    valid: function(name, value) {
      var spec = registry.getSpec(name)

      registry.addPredicate(name, function(val) {
        return argsToSExpr([val]) === spec.sExpression
      })

      for (var predicate of spec.predicates) {
        if (!registry.getPredicate(predicate)(value)) return null
      }
      return true
    },
    getSpec: function(name) {
      return registry.getSpec(name)
    },
    debug: function() {
      return parseApi
    }
  }
})()