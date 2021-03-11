const fs = require('fs')
const puppeteer = require('puppeteer')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv)).argv

const startTimer = () => {
  const start = process.hrtime.bigint()
  return () => {
    const end = process.hrtime.bigint(start)
    return end - start
  }
}

const waitFor = async (ms) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

const startLogGroup = (group) => {
  const stopTimer = startTimer()
  console.log(group + ' started')

  return () => {
    const diff = stopTimer()
    console.log(group + ' ended, duration: ' + diff + 'ns')
  }
}

const main = async () => {
  const TEMP_FOLDER = 'tmp/'
  if (!fs.existsSync(TEMP_FOLDER)) {
    fs.mkdirSync(TEMP_FOLDER)
  }
  console.log('start benchmark')
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  page.on('console', (message) =>
    console.info('web-console: ' + message.text())
  )

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
  let totalTime = 0

  const events = trace.traceEvents ? trace.traceEvents : trace
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
}

main()
