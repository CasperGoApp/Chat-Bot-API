require('dotenv').config()
const RpcClient = require('@gnometech/divid-rpc')

const rpc = new RpcClient({
  user: process.env.DIVI_RPC_USER,
  pass: process.env.DIVI_RPC_PASSWORD,
  host: process.env.DIVI_RPC_HOST,
  protocol: 'http',
})

const formatArgs = (argarray) => {
  if (!argarray) {
    argarray = []
  }
  for (let i = 0; i < argarray.length; i++) {
    if (Array.isArray(argarray[i]) || typeof argarray[i] == 'object') {
      argarray[i] = JSON.stringify(argarray[i])
    }
  }
  return argarray
}

const rpcFunction = (functionName, argarray) =>
  new Promise((resolve) =>
    rpc[functionName](
      ...[
        ...formatArgs(argarray),
        ...[
          (err, res) =>
            resolve(
              err
                ? { error: err }
                : typeof res.result != 'undefined'
                ? res.result
                : res
            ),
        ],
      ]
    )
  )

const rpcs = {}

for (let x in rpc) {
  const functionName = x
  if (!rpcs[functionName]) {
    rpcs[functionName] = (...args) =>
      rpcFunction(functionName, args ? args : [])
  }
}

module.exports = rpcs
