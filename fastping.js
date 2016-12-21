const fs      = require('fs')
const _       = require('lodash')
const chalk   = require('chalk')
const Promise = require('bluebird')
const exec    = Promise.promisify(require('child_process').exec)
const argv    = require('minimist')(process.argv.slice(1))

// get server list
// $('td').map((_, x) => /talkcute.com/.test(x.textContent) ? x.textContent.trim() : null).get()

// s => [s]
const readNodesFromFile = file =>
  fs.readFileSync(file).toString().split('\n').filter(x => /.com/.test(x))

// s => Promise(i)
const getPingTime = async node => {
  let output = await exec(`ping -c 3 ${node}`)
  // console.log(output)
  let times = output
    .split("\n")
    .filter(x => /time=(.*) ms/.test(x))
    .map(x => +/time=(.*) ms/.exec(x)[1])

  return _.mean(times)
}

// s => s
const red = o => chalk.red(o.toString())
// s => s
const green = o => chalk.green(o.toString())

function checkArguments () {
  let file = argv['f']

  if (!file || !fs.existsSync(file)) {
    console.log('Usage: fastping -f file')
    process.exit(1)
  }
}

function main () {
  checkArguments()

  let nodeTimes = []

  Promise.map(readNodesFromFile(argv['f']), async node => {
    try {
      let time = await getPingTime(node)

      // console.log(node, time)

      nodeTimes.push({
        node,
        time
      })
    } catch (err) {
      console.log(red(err))
    }
  }).then(() => {
    let items = _.sortBy(nodeTimes, 'time')

    console.log(green('\nNodes sorted by mean ping time:'))
    items.forEach(({node, time}, index) => {
      console.log(`${index+1}. ${node}: ${time} ms`)
    })

    console.log(green(`The fastest node: ${items[0].node}, mean ping time: ${items[0].time} ms`))
  })
}

main()
