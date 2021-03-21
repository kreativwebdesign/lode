const reporter = () => {
  const reportGroups = {
    modelLoading: null,
    fps: [],
    renderLoop: [],
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
  const handleModelLoading = (entry) => {
    if (reportGroups.modelLoading !== null) {
      throw new Error(
        'modelLoading may only be recorded once, this is likely an error. Check the demo scene.'
      )
    }
    reportGroups.modelLoading = entry.duration
  }
  const handleRenderLoop = (entry) => {
    reportGroups.renderLoop.push(entry.duration)
  }
  const reportPerformanceEntries = (entry) => {
    switch (entry.name) {
      case 'renderLoop':
        return handleRenderLoop(entry)
      case 'modelLoading':
        return handleModelLoading(entry)
    }
  }
  return {
    report,
    reportPerformanceEntries,
    getReport: () => {
      return reportGroups
    },
  }
}

const taskGroup = {
  gpu: {
    id: 'gpu',
    label: 'GPU Tasks',
    traceEventNames: ['GPUTask'],
  },
}

const taskGroups = Object.values(taskGroup)

const getMedian = (raw) => {
  const values = [...raw]
  values.sort((a, b) => a - b)

  const half = Math.floor(values.length / 2)

  if (values.length % 2) {
    return values[half]
  }

  return (values[half - 1] + values[half]) / 2.0
}

const analyze = (reportGroups, events) => {
  let traceEventGroupStats = {}
  for (const group of taskGroups) {
    traceEventGroupStats[group.id] = {
      totalTime: 0,
      totalEvents: 0,
    }
  }

  events.forEach((event) => {
    for (const group of taskGroups) {
      if (group.traceEventNames.includes(event.name)) {
        if (event.ph === 'X') {
          // complete events do have an associated duration
          // dur is in microseconds (instead of ms)
          traceEventGroupStats[group.id].totalTime += event.dur / 1000
          traceEventGroupStats[group.id].totalEvents += 1
        } else if (event.ph === 'I') {
          // instant events do not have an associated duration
          traceEventGroupStats[group.id].totalEvents += 1
        }
      }
    }
  })

  console.log(traceEventGroupStats)
  console.log('median fps: ' + getMedian(reportGroups.fps))
  console.log(
    'renderloop median duration: ' + getMedian(reportGroups.renderLoop)
  )
  console.log('number of renders: ' + reportGroups.renderLoop.length)
  console.log('model load duration: ' + reportGroups.modelLoading)
}

module.exports = {
  reporter,
  analyze,
}
