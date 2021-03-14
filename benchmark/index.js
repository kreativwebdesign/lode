const fs = require('fs')
const puppeteer = require('puppeteer')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { waitFor, startLogGroup, createFolderIfNotExist } = require('./helpers')

const argv = yargs(hideBin(process.argv)).argv

const main = async () => {
  const TEMP_FOLDER = 'tmp/'
  createFolderIfNotExist(TEMP_FOLDER)
  console.log('start benchmark')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  const reportGroups = {
    fps: [],
  }

  const report = (log) => {
    const namespaces = log.split('::')
    if (namespaces.length !== 4) {
      console.error(
        'received non matching log message, must follow ::benchmark::namepsace::value semantics',
        log
      )
      return
    }
    const action = namespaces[2]
    switch (action) {
      case 'fps':
        reportGroups.fps.push(parseInt(namespaces[3]))
        break
      default:
        console.error('unknown action', action, log)
    }
  }

  page.on('console', (message) => {
    const log = message.text()
    if (log.includes('::benchmark::')) {
      report(log)
    } else {
      console.info('web-console: ' + message.text())
    }
  })

  let finishGroup = startLogGroup('load page')
  await page.goto(`http://localhost:8080?${argv.o ? 'optimize' : ''}`)
  finishGroup()

  finishGroup = startLogGroup('start trace')
  await page.tracing.start({ path: `${TEMP_FOLDER}trace.json` })

  await waitFor(3000)

  await page.tracing.stop()
  finishGroup()

  // screenshot is only used for manual qa
  await page.screenshot({ path: `${TEMP_FOLDER}screenshot.jpg` })

  await browser.close()
  console.log('stop benchmark')

  console.log('start analyzer')

  const trace = JSON.parse(fs.readFileSync(`${TEMP_FOLDER}trace.json`, 'utf8'))

  const events = trace.traceEvents ? trace.traceEvents : trace

  let totalTime = 0
  let numberOfEvents = 0
  events.forEach((event) => {
    if (event.name.toLowerCase().includes('gpu')) {
      // complete events only
      if (event.ph === 'X') {
        // tdur is in microseconds (instead of ms)
        totalTime += event.dur
        numberOfEvents++
      }
    }
  })
  console.log('gpu duration: ' + totalTime)
  console.log('total tasks: ' + numberOfEvents)
  console.log('fps: ' + reportGroups.fps)
}

main()
