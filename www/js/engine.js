var deck // To hold the deck in between instructions
var rules // To hold ruleset in between instructions
var stats // To keep track of statistics of a single instruction
var random // To hold an array of random values required for shuffling

this.onmessage = (msg) => {
  
  // Reset statistics
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
    splits: 0,
    tripleSevenBonuses: 0
  }

  // Read ruleset and create deck or run a given amount of simulations
  if (msg.data.isRuleset) {
    rules = msg.data
    deck = new Array(rules.deckCount * 52)
    deck.index = 0
    random = new Uint32Array(deck.length)
    for (let card = 2, index = 0; card <= 11; card++) {
      const amount = (card === 10) ? 16 * rules.deckCount : 4 * rules.deckCount
      for (let k = 0; k < amount; k++) {
        deck[index] = card
        index++
      }
    }
  } else {
    const count = msg.data
    const deckThreshold = Math.round(52 * rules.deckCount * (100 - rules.deckPenetration) / 100)
    for (let i = 0; i < count; i++) {
      if (deck.index < deckThreshold || rules.shuffleEachGame) {
        this.self.crypto.getRandomValues(random)
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor((random[i] / (0xffffffff + 1)) * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]]
        }
        deck.index = deck.length - 1
      }
      playGame()
    }
  }

  // Send back statistics when instruction is finished
  this.postMessage(stats)
}

// Take a card from the deck
function takeCard () {
  return deck[deck.index--]
}

// Count the total value of a hand
function handValue (hand) {
  return hand.reduce((a, b) => (a + b), 0)
}

// Count the amount of aces in a hand
function aceCount (hand) {
  return hand.reduce((a, b) => (b === 11 ? a + 1 : a), 0)
}

// Play a single full round/game
function playGame () {
  const playerStartingHand = []
  const dealerStartingHand = []

  // Deal initial cards
  playerStartingHand.push(takeCard())
  dealerStartingHand.push(takeCard())
  playerStartingHand.push(takeCard())
  dealerStartingHand.push(takeCard())

  // Calculate hand values
  const playerStartingHandValue = handValue(playerStartingHand)
  const dealerStartingHandValue = handValue(dealerStartingHand)

  // Check for blackjack(s)
  if (playerStartingHandValue === 21) {
    if (dealerStartingHandValue === 21) {
      stats.pushesNormal++
    } else {
      stats.blackjacks++
      stats.balance += rules.blackjackPayout
    }
    return
  }

  // Variables for the player's turn
  const playerFinalHands = []
  var splitAllowed
  var splitCount = 0

  // Simulate the player's turn, recursing when splitting
  function playerTurn (hand, isFirstHand) {
    splitAllowed = !(splitCount >= rules.maxSplits)
    if (!isFirstHand && !rules.allowHittingSplitAces && hand[0] === 11 && !(hand[0] === 11 && hand[1] === 11 && rules.allowResplittingAces)) {
      if (handValue(hand) > 21) {
        hand[0] = 1
      }
      playerFinalHands.push(hand)
      return
    }
    var move
    var skipWhile = false
    while (!skipWhile) {
      if (handValue(hand) === 21) {
        playerFinalHands.push(hand)
        return
      }
      if (hand[0] === hand[1] && hand.length === 2) {
        move = rules.pairStrategy[handValue(hand)][dealerStartingHand[0]]
      } else if (aceCount(hand) > 0) {
        move = rules.softStrategy[handValue(hand)][dealerStartingHand[0]]
      } else {
        move = rules.hardStrategy[handValue(hand)][dealerStartingHand[0]]
      }
      if (move.charAt(0) === 'R') {
        if (rules.allowSurrender && isFirstHand && hand.length === 2) {
          if (rules.earlySurrender || !(dealerStartingHandValue === 21)) {
            stats.surrenders++
            stats.balance -= 0.5
          } else {
            stats.lossesNormal++
            stats.balance -= 1
          }
          return
        } else {
          move = move.charAt(1).toUpperCase()
        }
      }
      if (move.charAt(0) === 'D') {
        if (!rules.allowDouble || hand.length > 2 || (!rules.allowDoubleAfterSplit && !isFirstHand) || (rules.doubleRestricted && !(handValue(hand) === 9) && !(handValue(hand) === 10) && !(handValue(hand) === 11))) {
          move = move.charAt(1).toUpperCase()
        } else {
          hand.push(takeCard())
          hand.doubled = true
          skipWhile = true
        }
      }
      if (move.charAt(0) === 'P') {
        if (move === 'Ph' && !rules.allowDoubleAfterSplit) {
          move = 'H'
        } else {
          if (splitAllowed && rules.allowSplitting) {
            stats.splits++
            splitCount++
            playerTurn([hand[0], takeCard()], false)
            playerTurn([hand[1], takeCard()], false)
            return
          } else {
            hand.push(0)
          }
        }
      }
      if (move === 'H') {
        hand.push(takeCard())
      }
      if (move === 'S') {
        playerFinalHands.push(hand)
        return
      }
      while (aceCount(hand) > 0 && handValue(hand) > 21) {
        hand[hand.indexOf(11)] = 1
      }
      if (aceCount(hand) === 0 && handValue(hand) > 21) {
        playerFinalHands.push(hand)
        return
      }
      if (hand.doubled) {
        playerFinalHands.push(hand)
        return
      }
    }
  }

  // Start the player's turn and catch a surrender
  if (playerTurn(playerStartingHand, true) === 0) {
    return
  }

  // Simulate the dealer's turn
  const dealerFinalHand = dealerStartingHand
  while (true) {
    if (handValue(dealerFinalHand) < 17) {
      dealerFinalHand.push(takeCard())
      continue
    }
    if (rules.dealerHitsSoft17 && handValue(dealerFinalHand) === 17 && aceCount(dealerFinalHand) === 1) {
      dealerFinalHand.push(takeCard())
      continue
    }
    if (handValue(dealerFinalHand) > 21 && aceCount(dealerFinalHand) > 0) {
      dealerFinalHand[dealerFinalHand.indexOf(11)] = 1
      continue
    }
    break
  }
  const dealerFinalHandValue = handValue(dealerFinalHand)

  // Triple seven bonus logic
  if (rules.tripleSevenBonus && playerFinalHands.length === 1 && playerFinalHands[0][0] === 7 && playerFinalHands[0][1] === 7 && playerFinalHands[0][2] === 7) {
    stats.tripleSevenBonuses++
    stats.balance += 1
  }

  // Calculate winner of each hand
  for (const hand of playerFinalHands) {
    const playerHandValue = handValue(hand)
    if (playerHandValue > 21) {
      if (hand.doubled) {
        stats.lossesAfterDoubling++
        stats.balance -= 2
      } else {
        stats.lossesNormal++
        stats.balance -= 1
      }
    } else if (dealerFinalHandValue > 21) {
      if (hand.doubled) {
        stats.winsAfterDoubling++
        stats.balance += 2
      } else {
        stats.winsNormal++
        stats.balance += 1
      }
    } else if (dealerFinalHandValue === playerHandValue) {
      if (hand.doubled) {
        stats.pushesAfterDoubling++
      } else {
        stats.pushesNormal++
      }
    } else if (dealerFinalHandValue > playerHandValue) {
      if (hand.doubled) {
        stats.lossesAfterDoubling++
        stats.balance -= 2
      } else {
        stats.lossesNormal++
        stats.balance -= 1
      }
    } else if (dealerFinalHandValue < playerHandValue) {
      if (hand.doubled) {
        stats.winsAfterDoubling++
        stats.balance += 2
      } else {
        stats.winsNormal++
        stats.balance += 1
      }
    }
  }
  stats.games++
}
