// When the page has finished loading
window.onload = () => {

	// Set thread setting to conform to the clients resources
	let threads = navigator.hardwareConcurrency
	let threadSetting = document.getElementById("thread-count")
	threadSetting.max = threads
	threadSetting.value = Math.floor(threads / 2)

	// Initialize settings button
	let settingsButton = document.getElementById("settings").getElementsByTagName("button")[0]
	let settingsContainer = document.getElementById("settings").getElementsByTagName("div")[0]
	settingsButton.onclick = () => {
		if (settingsContainer.style.display === "block") {
			settingsContainer.style.display = "none"
			settingsButton.textContent = "More information"
		} else {
			settingsContainer.style.display = "block"
			settingsButton.textContent = "Less information"
		}
	}

	// Default strategies
	let hardStrategy = [
		[null, "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
		["20", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
		["19", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
		["18", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
		["17", "S", "S", "S", "S", "S", "S", "S", "S", "S", "Rs"],
		["16", "S", "S", "S", "S", "S", "H", "H", "Rh", "Rh", "Rh"],
		["15", "S", "S", "S", "S", "S", "H", "H", "H", "Rh", "Rh"],
		["14", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
		["13", "S", "S", "S", "S", "S", "H", "H", "H", "H", "H"],
		["12", "H", "H", "S", "S", "S", "H", "H", "H", "H", "H"],
		["11", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "H"],
		["10", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "H", "H"],
		["9", "H", "Dh", "Dh", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["8", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
		["7", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
		["6", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
		["5", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"],
		["4", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"]
	]
	let softStrategy = [
		[null, "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
		["11+9", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
		["11+8", "S", "S", "S", "S", "Ds", "S", "S", "S", "S", "S"],
		["11+7", "Ds", "Ds", "Ds", "Ds", "Ds", "S", "S", "H", "H", "H"],
		["11+6", "H", "Dh", "Dh", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["11+5", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["11+4", "H", "H", "Dh", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["11+3", "H", "H", "H", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["11+2", "H", "H", "H", "Dh", "Dh", "H", "H", "H", "H", "H"],
		["11+1", "H", "H", "H", "H", "H", "H", "H", "H", "H", "H"]
	]
	let pairStrategy = [
		[null, "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
		["AA", "P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
		["TT", "S", "S", "S", "S", "S", "S", "S", "S", "S", "S"],
		["99", "P", "P", "P", "P", "P", "S", "P", "P", "S", "S"],
		["88", "P", "P", "P", "P", "P", "P", "P", "P", "P", "Rp"],
		["77", "P", "P", "P", "P", "P", "P", "H", "H", "H", "H"],
		["66", "Ph", "P", "P", "P", "P", "H", "H", "H", "H", "H"],
		["55", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "Dh", "H", "H"],
		["44", "H", "H", "H", "Ph", "Ph", "H", "H", "H", "H", "H"],
		["33", "Ph", "Ph", "P", "P", "P", "P", "H", "H", "H", "H"],
		["22", "Ph", "Ph", "P", "P", "P", "P", "H", "H", "H", "H"],
	]

	// Write default strategies to the tables
	let tables = document.getElementById("strategy").getElementsByTagName("table")
	appendStrategy(hardStrategy, tables[0])
	appendStrategy(softStrategy, tables[1])
	appendStrategy(pairStrategy, tables[2])

	// Append certain strategy to a table object
	function appendStrategy(strategy, table) {
		strategy.forEach((row, rIndex) => {
			let tr = document.createElement("tr")
			row.forEach((cell, cIndex) => {
				if (rIndex === 0 || cIndex === 0) {
					let th = document.createElement("th")
					th.innerHTML = cell
					tr.appendChild(th)
				} else {
					let td = document.createElement("td")
					let input = document.createElement("input")
					input.value = cell
					input.onclick = function() { this.select() }
					input.onchange = function() { updateCell(this) }
					updateCell(input)
					td.appendChild(input)
					tr.appendChild(td)
				}
			})
			table.appendChild(tr)
		})
	}

	// Make start button start the simulation
	let startButton = document.getElementById("results").getElementsByTagName("button")[0]
	startButton.textContent = "Start simulation"
	startButton.onclick = simulate
}

// Update the color and text of a cell
function updateCell(cell) {
	if (cell.value.length === 2) {
		cell.value = cell.value.charAt(0).toUpperCase() + cell.value.charAt(1).toLowerCase()
	}
	if (cell.value.length === 1) {
		cell.value = cell.value.toUpperCase()
	}
	if (cell.value === "S") {
		cell.style.backgroundColor = "#ED7A63"
	} else if (cell.value === "H") {
		cell.style.backgroundColor = "#43B68D"
	} else if (cell.value === "P") {
		cell.style.backgroundColor = "#57C7F7"
	} else if (cell.value === "Dh" || cell.value === "Ds") {
		cell.style.backgroundColor = "#E4D601"
	} else if (cell.value === "Rh" || cell.value === "Rs") {
		cell.style.backgroundColor = "#F6A239"
	} else if (cell.value === "Rp" || cell.value === "Ph") {
		cell.style.backgroundColor = "#F6A239"
	} else {
		cell.style.backgroundColor = "#FF0000"
	}
}

// Update the results box with statistics
function updateResults(stats) {
	let result = document.getElementById("results").getElementsByTagName("span")
	let time = ((new Date() - stats.startTime) / 1000)
	let speed = Math.round(((stats.games / 1000000) / time) * 10) / 10
	let houseEdge = (-100 * (stats.balance / stats.games))
	result[0].textContent = stats.games.toLocaleString()
	result[1].textContent = time.toLocaleString() + " seconds"
	result[2].textContent = speed.toLocaleString() + " million"
	result[3].textContent = stats.balance.toLocaleString()
	result[4].textContent = houseEdge.toLocaleString() + " %"
	result[5].textContent = stats.winsNormal.toLocaleString()
	result[6].textContent = stats.pushesNormal.toLocaleString()
	result[7].textContent = stats.lossesNormal.toLocaleString()
	result[8].textContent = stats.winsAfterDoubling.toLocaleString()
	result[9].textContent = stats.pushesAfterDoubling.toLocaleString()
	result[10].textContent = stats.lossesAfterDoubling.toLocaleString()
	result[11].textContent = stats.blackjacks.toLocaleString()
	result[12].textContent = stats.surrenders.toLocaleString()
	result[13].textContent = stats.splits.toLocaleString()
}

// Main function to fetch rules, rev up some engines and control them
function simulate() {

	let startButton = document.getElementById("results").getElementsByTagName("button")[0]
	let stopMessages = false
	startButton.textContent = "Stop simulation"
	startButton.onclick = () => { 
		startButton.onclick = undefined
		startButton.textContent = "Killing thread(s)..."
		stopMessages = true
	}

	let rules = {}

	rules.hardStrategy = new Array()
	rules.softStrategy = new Array()
	rules.pairStrategy = new Array()

	let hardStrategyTable = document.getElementById("strategy").getElementsByTagName("table")[0]
	let softStrategyTable = document.getElementById("strategy").getElementsByTagName("table")[1]
	let pairStrategyTable = document.getElementById("strategy").getElementsByTagName("table")[2]

	for (let i = 20; i >= 4; i--) {
		rules.hardStrategy[i] = new Array()
		for (let j = 11; j >= 2; j--) {
			rules.hardStrategy[i][j] = hardStrategyTable.rows[21 - i].cells[j - 1].children[0].value
		}
	}
	for (let i = 20; i >= 12; i--) {
		rules.softStrategy[i] = new Array()
		for (let j = 11; j >= 2; j--) {
			rules.softStrategy[i][j] = softStrategyTable.rows[21 - i].cells[j - 1].children[0].value
		}
	}
	for (let i = 22; i >= 4; i -= 2) {
		rules.pairStrategy[i] = new Array()
		for (let j = 11; j >= 2; j--) {
			rules.pairStrategy[i][j] = pairStrategyTable.rows[12 - (0.5 * i)].cells[j - 1].children[0].value
		}
	}

	rules.allowSurrender = document.querySelector("input[name='allow-surrender']:checked").value !== "never"
	rules.earlySurrender = document.querySelector("input[name='allow-surrender']:checked").value === "early"
	rules.allowDouble = document.querySelector("input[name='allow-double']:checked").value !== "never"
	rules.doubleRestricted = document.querySelector("input[name='allow-double']:checked").value === "restricted"
	rules.allowSplitting = document.querySelector("input[name='allow-splitting']:checked").value !== "never"
	rules.maxSplits = document.querySelector("input[name='allow-splitting']:checked").value === "restricted" ? parseInt(document.getElementById("max-splits").value) : 0
	rules.allowHittingSplitAces = document.querySelector("input[name='allow-hitting-split-aces']:checked").value === "true"
	rules.allowResplittingAces = document.querySelector("input[name='allow-resplitting-aces']:checked").value === "true"
	rules.allowDoubleAfterSplit = document.querySelector("input[name='allow-double-after-split']:checked").value === "true"
	rules.tripleSevenBonus = document.querySelector("input[name='triple-seven-bonus']:checked").value === "true"
	rules.dealerHitsSoft17 = document.querySelector("input[name='dealer-hits-soft-17']:checked").value === "true"
	rules.blackjackPayout = parseFloat(document.querySelector("input[name='blackjack-payout']:checked").value)
	rules.shuffleEachGame = document.querySelector("input[name='shuffle-each-game']:checked").value === "true"
	rules.deckPenetration = parseInt(document.getElementById("deck-penetration").value)
	rules.deckCount = parseInt(document.getElementById("deck-count").value)

	let maxGames = parseInt(document.getElementById("max-games").value)
	let chunk = 200000
	let threads = parseInt(document.getElementById("thread-count").value)
	let finishedThreads = 0

	let stats = {
		startTime: new Date(),
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
	
	for (let i = 0; i < threads; i++) {
		let engine = new Worker("js/engine.js")
		engine.onmessage = (result) => {
			Object.keys(result.data).forEach((key) => {
				stats[key] += result.data[key]
			})
			updateResults(stats)
			instructWorker(engine)
		}
		engine.postMessage(rules)
		instructWorker(engine)
	}

	function instructWorker(engine) {
		if (maxGames >= chunk && !stopMessages) {
			engine.postMessage(chunk)
			maxGames -= chunk
		} else if (maxGames > 0 && !stopMessages) {
			engine.postMessage(maxGames)
			maxGames = 0
		} else {
			engine.terminate()
			finishedThreads++
			if (finishedThreads === threads) {
				startButton.onclick = undefined
				startButton.textContent = "Done!"
				setTimeout(() => {
					startButton.textContent = "Start simulation"
					startButton.onclick = simulate
				}, 2000)
			}
		}
	}
}
