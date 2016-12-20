#!/usr/bin/env node

const fs      = require('fs')
const _       = require('lodash')
const chalk   = require('chalk')
const Promise = require('bluebird')
const exec    = Promise.promisify(require('child_process').exec)

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

function main () {
  let nodeTimes = []

  Promise.map(readNodesFromFile('nodes'), async node => {
    try {
      let time = await getPingTime(node)

      console.log(node, time)

      nodeTimes.push({
        node,
        time
      })
    } catch (err) {
      console.log(red(err))
    }
  }).then(() => {
    var items = _.sortBy(nodeTimes, 'time')

    console.log('\nNodes sorted by ping time:')
    console.log(items)

    console.log(green(`The fastest node: ${items[0].node}, ping time: ${items[0].time} ms`))
  })
}

main()
