// When the page has finished loading
window.onload = () => {

	// Set thread setting to conform to the clients resources
	let threads = navigator.hardwareConcurrency
	let threadSetting = document.getElementById("thread-count")
	threadSetting.max = threads
	threadSetting.value = Math.floor(threads / 2)

	// Initilalize settings button
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

	// Make strategy table cells interactive
	let strategyCells = document.getElementById("strategy").getElementsByTagName("input")
	for (let i = 0; i < strategyCells.length; i++) {
		updateCell(strategyCells[i])
		strategyCells[i].onclick = function() {
			this.select()
		}
		strategyCells[i].onchange = function() {
			updateCell(this)
		}
	}

	// Make start button start the simulation
	let startButton = document.getElementById("results").getElementsByTagName("button")[0]
	startButton.textContent = "Start simulation"
	startButton.onclick = simulate
}

// Update the color and text of a cell
function updateCell(cell) {
	if (cell.value.length == 2) {
		cell.value = cell.value.charAt(0).toUpperCase() + cell.value.charAt(1).toLowerCase()
	}
	if (cell.value.length == 1) {
		cell.value = cell.value.toUpperCase()
	}
	if (cell.value == "S") {
		cell.style.backgroundColor = "#ED7A63"
	} else if (cell.value == "H") {
		cell.style.backgroundColor = "#43B68D"
	} else if (cell.value == "P") {
		cell.style.backgroundColor = "#57C7F7"
	} else if (cell.value == "Dh" || cell.value == "Ds") {
		cell.style.backgroundColor = "#E4D601"
	} else if (cell.value == "Rh" || cell.value == "Rs") {
		cell.style.backgroundColor = "#F6A239"
	} else if (cell.value == "Rp" || cell.value == "Ph") {
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
		let engine = new Worker("engine.js")
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
			if (finishedThreads == threads) {
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