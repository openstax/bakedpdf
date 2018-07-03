const path = require('path')
const yargs = require('yargs')
require('dotenv').config()
const bunyan = require('bunyan')
const BunyanFormat = require('bunyan-format')
const mathJaxPath = require.resolve('mathjax/unpacked/MathJax')
const converter = require('./converter')

const log = bunyan.createLogger({
  name: 'node-typeset',
  level: process.env.LOG_LEVEL || 'info',
  stream: new BunyanFormat({outputMode: process.env.LOG_FORMAT || 'short'})
})

const argv = yargs
  .option('format', {
    alias: 'f',
    describe: 'Output format for MathJax Conversion: HTML-CSS, SVG. Default: HTML-CSS'
  })
  .option('xhtml', {
    alias: 'i',
    describe: 'Input XHTML File'
  })
  .option('css', {
    alias: 'c',
    describe: 'Input CSS File'
  })
  .option('output', {
    alias: 'o',
    describe: 'Output XHTML File'
  })
  .demandOption(['xhtml', 'output'])
  .help()
  .argv

const pathToInput = path.resolve(argv.xhtml)
const pathToCss = argv.css ? path.resolve(argv.css) : null
const mathJaxOutputFormat = argv.format ? argv.format : 'HTML-CSS'

log.debug(`Converting Math Using XHTML="${argv.xhtml}" and CSS="${argv.css}"`)
converter.injectMathJax(log, pathToInput.replace(/\\/g, '/'), pathToCss, argv.output, mathJaxPath, mathJaxOutputFormat)