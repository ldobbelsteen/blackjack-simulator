var rules // To hold ruleset between instructions
var stats // To keep track of statistics of an instruction
var deckIndex // To keep track of how deep into the deck we are
var deck // To hold the currently used deck

// When receiving a ruleset, load it and create a deck
// When receiving an integer, simulate that amount of games
onmessage = (msg) => {
	if (Number.isInteger(msg.data)) {
		simulate(msg.data)
	} else {
		rules = msg.data
		deck = new Array(rules.deckCount * 52)
		for (let card = 2, index = 0; card <= 11; card++) {
			let amount = (card == 10) ? 16 * rules.deckCount : 4 * rules.deckCount
			for (let k = 0; k < amount; k++) {
				deck[index] = card
				index++
			}
		}
		shuffleDeck()
	}
}

// Simulate a given amount of games
// Needs 'rules' and 'deck' to be specified
function simulate(count) {
	stats = {
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
	let deckThreshold = ((100 - rules.deckPenetration) / 100) * rules.deckCount * 52
	for (let i = 0; i < count; i++) {
		playGame()
		stats.games++
		if (deckIndex < deckThreshold || rules.shuffleEachGame) {
			shuffleDeck()
		}
	}
	postMessage(stats)
}

// Play a single full game
function playGame() {
	var playerStartingHand = new Array()
	var dealerStartingHand = new Array()
	playerStartingHand.push(takeCard())
	dealerStartingHand.push(takeCard())
	playerStartingHand.push(takeCard())
	dealerStartingHand.push(takeCard())
	if (handValue(playerStartingHand) == 21) {
		if (handValue(dealerStartingHand) == 21) {
			stats.pushesNormal++
			return
		} else {
			stats.blackjacks++
			stats.balance += rules.blackjackPayout
			return
		}
	}
	var playerFinalHands = playerTurn(playerStartingHand, dealerStartingHand[0])
	if (playerFinalHands === "surrender") {
		if (rules.earlySurrender || !(handValue(dealerStartingHand) == 21)) {
			stats.surrenders++
			stats.balance -= 0.5
			return
		} else {
			stats.lossesNormal++
			stats.balance -= 1
			return
		}
	}
	var dealerFinalHand = dealerTurn(dealerStartingHand)
	if (rules.tripleSevenBonus && playerFinalHands[0][0] == 7 && playerFinalHands[0][1] == 7 && playerFinalHands[0][2] == 7 && typeof(playerFinalHands[1]) == "undefined") {
		stats.balance += 1
	}
	for (let hand of playerFinalHands) {
		stats.balance += calculateWinner(handValue(hand), hand.doubled, handValue(dealerFinalHand))
	}
	return
}

// Count the total value of a hand
function handValue(hand) {
	return hand.reduce((a, b) => a + b)
}

// Count the amount of aces in a hand
function aceCount(hand) {
	return hand.reduce((a, b) => (b === 11 ? a + 1 : a), 0)
}

// Shuffle the global deck using the Knuth algorithm
function shuffleDeck() {
	for (let i = deck.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[deck[i], deck[j]] = [deck[j], deck[i]]
	}
	deckIndex = deck.length - 1
}

// Take a card from the deck
function takeCard() {
	return deck[deckIndex--]
}

// Simulate the player's actions on a given hand
function playHand(hand, splitAvailable, surrenderAvailable, resultOfSplit, dealerUpcard) {
	hand.doubled = false
	hand.split = false
	var skipWhile = false
	var move
	if (resultOfSplit && !rules.allowHittingSplitAces && hand[0] === 11 && !(hand[0] === 11 && hand[1] === 11 && rules.allowResplittingAces)) {
		if (handValue(hand) > 21) {
			hand[0] = 1
		}
		skipWhile = true
	}
	while (!skipWhile) {
		if (handValue(hand) === 21) {
			break
		}
		if (hand[0] === hand[1] && hand.length === 2) {
			move = rules.pairStrategy[handValue(hand)][dealerUpcard]
		} else if (aceCount(hand) > 0) {
			move = rules.softStrategy[handValue(hand)][dealerUpcard]
		} else {
			move = rules.hardStrategy[handValue(hand)][dealerUpcard]
		}
		if (move.charAt(0) === "R") {
			if (rules.allowSurrender && surrenderAvailable && hand.length == 2) {
				return "surrender"
			} else {
				move = move.charAt(1).toUpperCase()
			}
		}
		if (move.charAt(0) === "D") {
			if (!rules.allowDouble || hand.length > 2 || (!rules.allowDoubleAfterSplit && resultOfSplit) || (rules.doubleRestricted && !(handValue(hand) == 9) && !(handValue(hand) == 10) && !(handValue(hand) == 11))) {
				move = move.charAt(1).toUpperCase()
			} else {
				hand.push(takeCard())
				hand.doubled = true
				skipWhile = true
			}
		}
		if (move.charAt(0) === "P") {
			if (move === "Ph" && !rules.allowDoubleAfterSplit) {
				move = "H"
			} else {
				if (splitAvailable && rules.allowSplitting) {
					stats.splits += 1
					hand.split = true
					return hand
				} else {
					hand.push(0)
				}
			}
		}
		if (move === "H") {
			hand.push(takeCard())
		}
		if (move === "S") {
			break
		}
		while (aceCount(hand) > 0 && handValue(hand) > 21) {
			hand[hand.indexOf(11)] = 1
		}
		if (aceCount(hand) === 0 && handValue(hand) > 21) {
			break
		}
	}
	return hand
}

// Play the player's turn
function playerTurn(startingHand, dealerUpcard) {
	var cumulativeHands = []
	var splitCount = 0
	var splitAllowed = true
	var firstPlayResult = playHand(startingHand, splitAllowed, true, false, dealerUpcard)
	if (firstPlayResult === "surrender") {
		return "surrender"
	} else if (firstPlayResult.split) {
		if (firstPlayResult === [11, 11] && !allowResplittingAces) {
			splitAllowed = false
		}
		splitCount++
		split(firstPlayResult)
	} else {
		cumulativeHands.push(firstPlayResult)
	}
	function split(source) {
		if (splitCount >= rules.maxSplits && !(rules.maxSplits == 0)) {
			splitAllowed = false
		}
		for (let i = 0; i < 2; i++) {
			var hand = [source[i], takeCard()]
			var result = playHand(hand, splitAllowed, false, true, dealerUpcard)
			if (result.split) {
				splitCount++
				split(result)
			} else {
				cumulativeHands.push(result)
			}
		}
	}
	return cumulativeHands
}

// Play out the dealers hand
function dealerTurn(hand) {
	while (true) {
		if (handValue(hand) < 17) {
			hand.push(takeCard())
			continue
		}
		if (rules.dealerHitsSoft17 && handValue(hand) === 17 && aceCount(hand) === 1) {
			hand.push(takeCard())
			continue
		}
		if (handValue(hand) > 21 && aceCount(hand) > 0) {
			hand[hand.indexOf(11)] = 1
			continue
		}
		break
	}
	return hand
}

// Calculate the winner based on the players and the dealers hands
function calculateWinner(playerValue, doubled, dealerValue) {
	if (playerValue > 21) {
		if (doubled) {
			stats.lossesAfterDoubling++
			return -2
		} else {
			stats.lossesNormal++
			return -1
		}
	} else if (dealerValue > 21) {
		if (doubled) {
			stats.winsAfterDoubling++
			return 2
		} else {
			stats.winsNormal++
			return 1
		}
	} else if (dealerValue === playerValue) {
		if (doubled) {
			stats.pushesAfterDoubling++
			return 0
		} else {
			stats.pushesNormal++
			return 0
		}
	} else if (dealerValue > playerValue) {
		if (doubled) {
			stats.lossesAfterDoubling++
			return -2
		} else {
			stats.lossesNormal++
			return -1
		}
	} else if (dealerValue < playerValue) {
		if (doubled) {
			stats.winsAfterDoubling++
			return 2
		} else {
			stats.winsNormal++
			return 1
		}
	}
}