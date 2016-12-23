const fs      = require('fs')
const _       = require('lodash')
const chalk   = require('chalk')
const Promise = require('bluebird')
const exec    = Promise.promisify(require('child_process').exec)
const argv    = require('yargs')
  .usage('Usage: $0 -f [file] [options]')
  .demand(['f'])
  .alias('f', 'file')
  .describe('f', 'Nodes file to load')
  .describe('n', 'Number of ping requests to perform for a single node')
  .describe('c', 'Concurrency, number of multiple ping requests to make at a time')
  .default({n: 3, c: 0})
  .help('h')
  .alias('h', 'help')
  .argv

// s => [s]
const readNodesFromFile = file =>
  fs.readFileSync(file)
    .toString()
    .split('\n')
    .filter(x => x.trim().length != 0)

// s => Promise(i)
const getPingTime = async ({node, count}) =>
  _(await exec(`ping -c ${count} ${node}`))
    // .tap(console.log)
    .split('\n')
    .filter(x => /time=(.*) ms/.test(x))
    .map(x => +/time=(.*) ms/.exec(x)[1])
    .mean()

// s => s
const red = o => chalk.red(o.toString())
// s => s
const green = o => chalk.green(o.toString())

// start
Promise.map(readNodesFromFile(argv.f), async node => {
  try {
    let time = await getPingTime({node, count: argv.n})

    // console.log(node, time)

    return {
      node,
      time
    }
  } catch (err) {
    console.log(red(err))
  }
}, {concurrency: argv.c}).then(nodeTimes =>
  _.chain(nodeTimes)
    .compact() // filters errred node
    .sortBy(x => x.time)
    .tap(_ => console.log(green('Nodes sorted by mean ping time:')))
    .tap(items => items.forEach(({node, time}, index) =>
      console.log(_.padEnd(`${index + 1}.`, 4), _.padEnd(`${node}`, 20), `${time} ms`)))
    .head()
    .tap(item =>
      console.log(green(`The fastest node: ${item.node}, mean ping time: ${item.time} ms`)))
    .value()
)

