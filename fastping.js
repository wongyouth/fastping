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

// get server list
// $('td').map((_, x) => /talkcute.com/.test(x.textContent) ? x.textContent.trim() : null).get()

// s => [s]
const readNodesFromFile = file =>
  fs.readFileSync(file).toString().split('\n').filter(x => /.com/.test(x))

// s => Promise(i)
const getPingTime = async ({node, count}) => {
  let output = await exec(`ping -c ${count} ${node}`)
  // console.log(output)
  let times = output
    .split('\n')
    .filter(x => /time=(.*) ms/.test(x))
    .map(x => +/time=(.*) ms/.exec(x)[1])

  return _.mean(times)
}

// s => s
const red = o => chalk.red(o.toString())
// s => s
const green = o => chalk.green(o.toString())

function main () {
  let nodeTimes = []

  Promise.map(readNodesFromFile(argv.f), async node => {
    try {
      let time = await getPingTime({node, count: argv.n})

      // console.log(node, time)

      nodeTimes.push({
        node,
        time
      })
    } catch (err) {
      console.log(red(err))
    }
  }, {concurrency: argv.c}).then(() => {
    let items = _.sortBy(nodeTimes, 'time')

    console.log(green('\nNodes sorted by mean ping time:'))
    items.forEach(({node, time}, index) => {
      console.log(`${index + 1}. ${node}: ${time} ms`)
    })

    console.log(green(`The fastest node: ${items[0].node}, mean ping time: ${items[0].time} ms`))
  })
}

main()
