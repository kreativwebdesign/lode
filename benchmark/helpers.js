const fs = require('fs')

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

const createFolderIfNotExist = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
}

module.exports = {
  startTimer,
  waitFor,
  startLogGroup,
  createFolderIfNotExist,
}
