const reporter = () => {
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
  return {
    report,
    getReport: () => {
      return reportGroups
    },
  }
}

const analyze = (reportGroups, events) => {
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

module.exports = {
  reporter,
  analyze,
}
