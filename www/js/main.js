// When the page has finished loading
window.onload = () => {
  // Set thread setting to conform to the available resources
  const threads = navigator.hardwareConcurrency
  const threadSetting = document.getElementById('thread-count')
  threadSetting.max = threads
  threadSetting.value = Math.floor(threads / 2)

  // Initialize settings button
  const settingsButton = document.getElementById('settings').getElementsByTagName('button')[0]
  const settingsContainer = document.getElementById('settings').getElementsByTagName('div')[0]
  settingsButton.onclick = () => {
    if (settingsContainer.style.display === 'block') {
      settingsContainer.style.display = 'none'
      settingsButton.textContent = 'More information'
    } else {
      settingsContainer.style.display = 'block'
      settingsButton.textContent = 'Less information'
    }
  }

  // Default strategies
  const hardStrategy = [
    [null, '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    ['20', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['19', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['18', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['17', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'Rs'],
    ['16', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'Rh', 'Rh', 'Rh'],
    ['15', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'Rh', 'Rh'],
    ['14', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['13', 'S', 'S', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['12', 'H', 'H', 'S', 'S', 'S', 'H', 'H', 'H', 'H', 'H'],
    ['11', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H'],
    ['10', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H'],
    ['9', 'H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['8', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['7', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['6', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['5', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H'],
    ['4', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H']
  ]
  const softStrategy = [
    [null, '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    ['11+9', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['11+8', 'S', 'S', 'S', 'S', 'Ds', 'S', 'S', 'S', 'S', 'S'],
    ['11+7', 'Ds', 'Ds', 'Ds', 'Ds', 'Ds', 'S', 'S', 'H', 'H', 'H'],
    ['11+6', 'H', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['11+5', 'H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['11+4', 'H', 'H', 'Dh', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['11+3', 'H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['11+2', 'H', 'H', 'H', 'Dh', 'Dh', 'H', 'H', 'H', 'H', 'H'],
    ['11+1', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H', 'H']
  ]
  const pairStrategy = [
    [null, '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    ['AA', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['TT', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S'],
    ['99', 'P', 'P', 'P', 'P', 'P', 'S', 'P', 'P', 'S', 'S'],
    ['88', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'Rp'],
    ['77', 'P', 'P', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
    ['66', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H', 'H'],
    ['55', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'Dh', 'H', 'H'],
    ['44', 'H', 'H', 'H', 'Ph', 'Ph', 'H', 'H', 'H', 'H', 'H'],
    ['33', 'Ph', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H'],
    ['22', 'Ph', 'Ph', 'P', 'P', 'P', 'P', 'H', 'H', 'H', 'H']
  ]

  // Write default strategies to the tables
  const tables = document.getElementById('strategy').getElementsByTagName('table')
  appendStrategy(hardStrategy, tables[0])
  appendStrategy(softStrategy, tables[1])
  appendStrategy(pairStrategy, tables[2])

  // Append certain strategy to a table object
  function appendStrategy (strategy, table) {
    strategy.forEach((row, rIndex) => {
      const tr = document.createElement('tr')
      row.forEach((cell, cIndex) => {
        if (rIndex === 0 || cIndex === 0) {
          const th = document.createElement('th')
          th.innerHTML = cell
          tr.appendChild(th)
        } else {
          const td = document.createElement('td')
          const input = document.createElement('input')
          input.value = cell
          input.onclick = function () { this.select() }
          input.onchange = function () { updateCell(this) }
          updateCell(input)
          td.appendChild(input)
          tr.appendChild(td)
        }
      })
      table.appendChild(tr)
    })
  }

  // Make start button start the simulation
  const startButton = document.getElementById('results').getElementsByTagName('button')[0]
  startButton.textContent = 'Start simulation'
  startButton.onclick = simulate
}

// Update the color and text of a cell
function updateCell (cell) {
  if (cell.value.length === 2) {
    cell.value = cell.value.charAt(0).toUpperCase() + cell.value.charAt(1).toLowerCase()
  }
  if (cell.value.length === 1) {
    cell.value = cell.value.toUpperCase()
  }
  if (cell.value === 'S') {
    cell.style.backgroundColor = '#ED7A63'
  } else if (cell.value === 'H') {
    cell.style.backgroundColor = '#43B68D'
  } else if (cell.value === 'P') {
    cell.style.backgroundColor = '#57C7F7'
  } else if (cell.value === 'Dh' || cell.value === 'Ds') {
    cell.style.backgroundColor = '#E4D601'
  } else if (cell.value === 'Rh' || cell.value === 'Rs') {
    cell.style.backgroundColor = '#F6A239'
  } else if (cell.value === 'Rp' || cell.value === 'Ph') {
    cell.style.backgroundColor = '#F6A239'
  } else {
    cell.style.backgroundColor = '#FF0000'
  }
}

// Update the results box with statistics
function updateResults (stats) {
  const result = document.getElementById('results').getElementsByTagName('span')
  const totalTime = (Date.now() - stats.startTime) / 1000
  const speed = stats.games / totalTime / 1000000
  const houseEdge = -100 * stats.balance / stats.games
  result[0].textContent = stats.games.toLocaleString()
  result[1].textContent = totalTime.toLocaleString() + ' seconds'
  result[2].textContent = speed.toLocaleString() + ' million'
  result[3].textContent = stats.balance.toLocaleString()
  result[4].textContent = isNaN(houseEdge) ? '0 %' : houseEdge.toLocaleString() + ' %'
  result[5].textContent = stats.winsNormal.toLocaleString()
  result[6].textContent = stats.pushesNormal.toLocaleString()
  result[7].textContent = stats.lossesNormal.toLocaleString()
  result[8].textContent = stats.winsAfterDoubling.toLocaleString()
  result[9].textContent = stats.pushesAfterDoubling.toLocaleString()
  result[10].textContent = stats.lossesAfterDoubling.toLocaleString()
  result[11].textContent = stats.blackjacks.toLocaleString()
  result[12].textContent = stats.surrenders.toLocaleString()
  result[13].textContent = stats.splits.toLocaleString()
  result[14].textContent = stats.tripleSevenBonuses.toLocaleString()
}

// Read the rules and strategy from the DOM
function getRules () {
  const rules = {}
  rules.hardStrategy = []
  rules.softStrategy = []
  rules.pairStrategy = []
  const hardStrategyTable = document.getElementById('strategy').getElementsByTagName('table')[0]
  const softStrategyTable = document.getElementById('strategy').getElementsByTagName('table')[1]
  const pairStrategyTable = document.getElementById('strategy').getElementsByTagName('table')[2]

  for (let i = 20; i >= 4; i--) {
    rules.hardStrategy[i] = []
    for (let j = 11; j >= 2; j--) {
      rules.hardStrategy[i][j] = hardStrategyTable.rows[21 - i].cells[j - 1].children[0].value
    }
  }
  for (let i = 20; i >= 12; i--) {
    rules.softStrategy[i] = []
    for (let j = 11; j >= 2; j--) {
      rules.softStrategy[i][j] = softStrategyTable.rows[21 - i].cells[j - 1].children[0].value
    }
  }
  for (let i = 22; i >= 4; i -= 2) {
    rules.pairStrategy[i] = []
    for (let j = 11; j >= 2; j--) {
      rules.pairStrategy[i][j] = pairStrategyTable.rows[12 - (0.5 * i)].cells[j - 1].children[0].value
    }
  }

  rules.allowSurrender = document.querySelector('input[name="allow-surrender"]:checked').value !== 'never'
  rules.earlySurrender = document.querySelector('input[name="allow-surrender"]:checked').value === 'early'
  rules.allowDouble = document.querySelector('input[name="allow-double"]:checked').value !== 'never'
  rules.doubleRestricted = document.querySelector('input[name="allow-double"]:checked').value === 'restricted'
  rules.allowSplitting = document.querySelector('input[name="allow-splitting"]:checked').value !== 'never'
  rules.maxSplits = document.querySelector('input[name="allow-splitting"]:checked').value === 'restricted' ? parseInt(document.getElementById('max-splits').value) : 0
  rules.allowHittingSplitAces = document.querySelector('input[name="allow-hitting-split-aces"]:checked').value === 'true'
  rules.allowResplittingAces = document.querySelector('input[name="allow-resplitting-aces"]:checked').value === 'true'
  rules.allowDoubleAfterSplit = document.querySelector('input[name="allow-double-after-split"]:checked').value === 'true'
  rules.tripleSevenBonus = document.querySelector('input[name="triple-seven-bonus"]:checked').value === 'true'
  rules.dealerHitsSoft17 = document.querySelector('input[name="dealer-hits-soft-17"]:checked').value === 'true'
  rules.blackjackPayout = parseFloat(document.querySelector('input[name="blackjack-payout"]:checked').value)
  rules.shuffleEachGame = document.querySelector('input[name="shuffle-each-game"]:checked').value === 'true'
  rules.deckPenetration = parseInt(document.getElementById('deck-penetration').value)
  rules.deckCount = parseInt(document.getElementById('deck-count').value)
  rules.isRuleset = true
  return rules
}

// Main function to start the engines and control them
function simulate () {
  const startButton = document.getElementById('results').getElementsByTagName('button')[0]
  var stopMessages = false
  startButton.textContent = 'Stop simulation'
  startButton.onclick = () => {
    startButton.onclick = undefined
    startButton.textContent = 'Killing thread(s)...'
    stopMessages = true
  }

  const stats = {
    startTime: 0,
    games: 0,
    balance: 0,
    winsNormal: 0,
    pushesNormal: 0,
    lossesNormal: 0,
    winsAfterDoubling: 0,
    pushesAfterDoubling: 0,
    lossesAfterDoubling: 0,
    blackjacks: 0,
    surrenders: 0,
    splits: 0
  }

  const chunk = 200000
  const rules = getRules()
  const updateInterval = 100
  const timer = setInterval(() => updateResults(stats), updateInterval)
  const threads = parseInt(document.getElementById('thread-count').value)
  var games = parseInt(document.getElementById('max-games').value)
  let finishedThreads = 0

  for (let i = 0; i < threads; i++) {
    const engine = new window.Worker('js/engine.js')
    engine.onmessage = (result) => {
      if (games > 0 && !stopMessages) {
        const count = games >= chunk ? chunk : games
        engine.postMessage(count)
        games -= count
        if (stats.startTime === 0) {
          stats.startTime = Date.now()
        }
      } else {
        engine.terminate()
        finishedThreads++
        if (finishedThreads === threads) {
          setTimeout(() => clearInterval(timer), updateInterval + 1)
          startButton.onclick = undefined
          startButton.textContent = 'Done!'
          setTimeout(() => {
            startButton.textContent = 'Start simulation'
            startButton.onclick = simulate
          }, 2000)
        }
      }
      Object.keys(result.data).forEach((key) => {
        stats[key] += result.data[key]
      })
    }
    engine.postMessage(rules)
  }
}
