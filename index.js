// Add CSS animation for thinking dots
document.head.insertAdjacentHTML('beforeend', `
    <style>
        @keyframes thinking {
            0% { content: "."; }
            33% { content: ".."; }
            66% { content: "..."; }
        }
        
        .thinking:after {
            content: "";
            animation: thinking 1.5s infinite;
        }
    </style>
`);

/*
// Basic copy protection
(function() {
    // Disable right-clicking
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Disable keyboard shortcuts for viewing source
    document.onkeydown = function(e) {
        if (
            (e.keyCode === 123) || // F12
            (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
            (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
            (e.ctrlKey && e.keyCode === 85) // Ctrl+U
        ) {
            return false;
        }
    };
    
    // Add a unique signature
    window._gameDeveloper = "UPFSlam";
    window._gameVersion = "1.0";
    window._gameSignature = "UPF_" + Math.random().toString(36).substring(2, 15);
})();
*/

// Accordion functionality
const accordionHeader = document.querySelector('.accordion-header');
const accordionContent = document.querySelector('.accordion-content');

accordionHeader.addEventListener('click', function() {
    this.classList.toggle('open');
    accordionContent.classList.toggle('open');
});

// Game data and state
const gameState = {
    deck: [],
    playerCards: [],
    computerCards: [],
    currentPlayerCard: null,
    currentComputerCard: null,
    gameStarted: false,
    turnActive: false,
    selectedCategory: null,
    firstRound: true,
    currentTurn: 'player', // 'player' or 'computer'
    lastWinner: 'player',  // Start with player as first selector
    lastResult: null       // 'win', 'lose', or 'draw'
};

// Food item data with nutritional values - now based on % daily values per serving
// Updated foodItems array with image paths
const foodItems = [
    { 
        name: "Chocolate Chip Cookies", 
        image: "images/chocolate_chip_cookies.jpg", 
        stats: { 
            fats: 18,
            sugar: 25,
            protein: 5,
            sodium: 8,
            additives: "High"
        } 
    },
    { 
        name: "Frozen Yogurt Tube", 
        image: "images/frozen_yogurt.jpg", 
        stats: { 
            fats: 4, 
            sugar: 18, 
            protein: 12, 
            sodium: 3, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Candy Bar", 
        image: "images/candy_bar.jpg", 
        stats: { 
            fats: 22, 
            sugar: 35, 
            protein: 7, 
            sodium: 6, 
            additives: "High" 
        } 
    },
    { 
        name: "Breakfast Cereal", 
        image: "images/breakfast_cereal.jpg", 
        stats: { 
            fats: 5, 
            sugar: 30, 
            protein: 8, 
            sodium: 15, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Pizza Slice", 
        image: "images/pizza_slice.jpg", 
        stats: { 
            fats: 15, 
            sugar: 3, 
            protein: 15, 
            sodium: 25, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Hamburger", 
        image: "images/hamburger.jpg", 
        stats: { 
            fats: 30, 
            sugar: 10, 
            protein: 20, 
            sodium: 35, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Potato Chips", 
        image: "images/potato_chips.jpg", 
        stats: { 
            fats: 28, 
            sugar: 0, 
            protein: 5, 
            sodium: 40, 
            additives: "High" 
        } 
    },
    { 
        name: "Soda", 
        image: "images/soda.jpg", 
        stats: { 
            fats: 0, 
            sugar: 40, 
            protein: 0, 
            sodium: 2, 
            additives: "High" 
        } 
    },
    { 
        name: "Canned Fruit", 
        image: "images/canned_fruit.jpg", 
        stats: { 
            fats: 0, 
            sugar: 25, 
            protein: 1, 
            sodium: 5, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Canned Vegetables", 
        image: "images/canned_vegetables.jpg", 
        stats: { 
            fats: 0, 
            sugar: 3, 
            protein: 5, 
            sodium: 25, 
            additives: "Low" 
        } 
    },
    { 
        name: "Microwave Popcorn", 
        image: "images/microwave_popcorn.jpg", 
        stats: { 
            fats: 15, 
            sugar: 1, 
            protein: 5, 
            sodium: 30, 
            additives: "High" 
        } 
    },
    { 
        name: "Frozen Lasagna", 
        image: "images/frozen_lasagna.jpg", 
        stats: { 
            fats: 25, 
            sugar: 8, 
            protein: 18, 
            sodium: 35, 
            additives: "High" 
        } 
    },
    { 
        name: "Pancake Mix", 
        image: "images/pancake_mix.jpg", 
        stats: { 
            fats: 8, 
            sugar: 15, 
            protein: 6, 
            sodium: 20, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Muffin", 
        image: "images/muffin.jpg", 
        stats: { 
            fats: 20, 
            sugar: 30, 
            protein: 5, 
            sodium: 15, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Doughnut", 
        image: "images/doughnut.jpg", 
        stats: { 
            fats: 25, 
            sugar: 30, 
            protein: 4, 
            sodium: 10, 
            additives: "High" 
        } 
    },
    { 
        name: "Instant Noodles", 
        image: "images/instant_noodles.jpg", 
        stats: { 
            fats: 15, 
            sugar: 2, 
            protein: 8, 
            sodium: 60, 
            additives: "High" 
        } 
    },
    { 
        name: "Fruit Juice Box", 
        image: "images/fruit_juice_box.jpg", 
        stats: { 
            fats: 0, 
            sugar: 35, 
            protein: 1, 
            sodium: 5, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Granola Bar", 
        image: "images/granola_bar.jpg", 
        stats: { 
            fats: 15, 
            sugar: 20, 
            protein: 10, 
            sodium: 10, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Ice Cream", 
        image: "images/ice_cream.jpg", 
        stats: { 
            fats: 18, 
            sugar: 25, 
            protein: 3, 
            sodium: 5, 
            additives: "Medium" 
        } 
    },
    { 
        name: "Energy Drink", 
        image: "images/energy_drink.jpg", 
        stats: { 
            fats: 0, 
            sugar: 40, 
            protein: 0, 
            sodium: 5, 
            additives: "High" 
        } 
    },
    { 
        name: "Frozen Pizza", 
        image: "images/frozen_pizza.jpg", 
        stats: { 
            fats: 25, 
            sugar: 5, 
            protein: 15, 
            sodium: 40, 
            additives: "High" 
        } 
    },
    { 
        name: "Fruit Snacks", 
        image: "images/fruit_snacks.jpg", 
        stats: { 
            fats: 0, 
            sugar: 30, 
            protein: 0, 
            sodium: 2, 
            additives: "High" 
        } 
    }
];

// Define touch event handlers
function handleTouchStart() {
    this.style.backgroundColor = '#f0f0f0';
}

function handleTouchEnd() {
    this.style.backgroundColor = '';
}

// DOM elements
const startButton = document.getElementById('start-button');
const dealButton = document.getElementById('deal-button');
const restartButton = document.getElementById('restart-button');
const playerCard = document.getElementById('player-card');
const computerCard = document.getElementById('computer-card');
const playerArea = document.getElementById('player-area');
const computerArea = document.getElementById('computer-area');
const playerStats = document.getElementById('player-stats');
const computerStats = document.getElementById('computer-stats');
const playerFoodName = document.getElementById('player-food-name');
const computerFoodName = document.getElementById('computer-food-name');
const playerFoodImage = document.getElementById('player-food-image');
const computerFoodImage = document.getElementById('computer-food-image');
const playerScore = document.getElementById('player-score');
const computerScore = document.getElementById('computer-score');
const playerPrompt = document.getElementById('player-prompt');
const computerPrompt = document.getElementById('computer-prompt');
const resultMessage = document.getElementById('result-message');
const remainingCards = document.getElementById('remaining-cards');
const remainingRounds = document.getElementById('remaining-rounds');
const secondaryControls = document.querySelector('.secondary-controls');
const turnIndicator = document.getElementById('turn-indicator');
const gameBoard = document.querySelector('.game-board');

// Initialize the game
startButton.addEventListener('click', startGame);
dealButton.addEventListener('click', dealCards);
restartButton.addEventListener('click', startGame);

// Prevent double-tap zoom on iOS
document.addEventListener('touchend', function(event) {
    if (event.target.classList.contains('stat-row')) {
        event.preventDefault();
    }
}, false);

// Start a new game
function startGame() {
    // Reset game state
    gameState.deck = [...foodItems];
    gameState.playerCards = [];
    gameState.computerCards = [];
    gameState.currentPlayerCard = null;
    gameState.currentComputerCard = null;
    gameState.gameStarted = true;
    gameState.turnActive = false;
    gameState.selectedCategory = null;
    gameState.firstRound = true;
    gameState.currentTurn = 'player'; // Player always goes first in a new game
    gameState.lastWinner = 'player';
    gameState.lastResult = null;
    
    // Set button text to "PLAY" for first round
    dealButton.textContent = "PLAY";
    
    // Shuffle the deck
    shuffleDeck(gameState.deck);
    
    // Update UI
    playerCard.classList.remove('flipped');
    computerCard.classList.remove('flipped');
    playerStats.innerHTML = '';
    computerStats.innerHTML = '';
    playerFoodName.textContent = '';
    computerFoodName.textContent = '';
    playerFoodImage.innerHTML = '';
    computerFoodImage.innerHTML = '';
    playerScore.textContent = '0';
    computerScore.textContent = '0';
    remainingCards.textContent = gameState.deck.length;
    remainingRounds.textContent = Math.floor(gameState.deck.length / 2);
    
    // Show restart button in secondary controls area
    startButton.style.display = 'none';
    secondaryControls.style.display = 'block';
    dealButton.disabled = false;
    
    // Reset prompts and messages
    playerPrompt.style.display = 'none';
    computerPrompt.style.display = 'none';
    resultMessage.style.display = 'none';
    turnIndicator.textContent = "First round: Player selects category";
    
    // Clear any previous stat classes
    clearStatClasses();
}

// Deal cards to player and computer
function dealCards() {
    // Change button text after first round
    if (gameState.firstRound) {
        dealButton.textContent = "Next Round";
        gameState.firstRound = false;
    }
    
    if (gameState.deck.length === 0) {
        showResult("Game over! No more cards in the deck.");
        dealButton.disabled = true;
        return;
    }
    
    // Reset UI state
    playerCard.classList.remove('flipped');
    computerCard.classList.remove('flipped');
    clearStatClasses();
    resultMessage.style.display = 'none';
    playerPrompt.style.display = 'none';
    computerPrompt.style.display = 'none';
    
    // Deal cards if available
    if (gameState.deck.length >= 2) {
        gameState.currentPlayerCard = gameState.deck.pop();
        gameState.currentComputerCard = gameState.deck.pop();
    } else if (gameState.deck.length === 1) {
        gameState.currentPlayerCard = gameState.deck.pop();
        showResult("No more cards for the computer. Game ends!");
        updateScores();
        dealButton.disabled = true;
        return;
    } else {
        endGame();
        return;
    }
    
    // Update UI with new cards
    updateCardDisplay();
    
    // Update remaining cards and rounds
    remainingCards.textContent = gameState.deck.length;
    remainingRounds.textContent = Math.floor(gameState.deck.length / 2);
    
    // Set up the turn based on last winner
    setupTurn();
    
    dealButton.disabled = true;
}

// Setup whose turn it is to select a category
function setupTurn() {
    gameState.currentTurn = gameState.lastWinner;
    gameState.turnActive = true;
    
    // Update turn indicator
    if (gameState.currentTurn === 'player') {
        turnIndicator.textContent = "Your turn to select a category";
        
        // Only flip the player's card
        setTimeout(() => {
            playerCard.classList.add('flipped');
            playerPrompt.style.display = 'block';
            
            // Add event listeners to player stats for selection
            const statRows = playerStats.querySelectorAll('.stat-row');
            statRows.forEach(row => {
                row.addEventListener('click', handlePlayerSelection);
                row.addEventListener('touchstart', handleTouchStart, false);
                row.addEventListener('touchend', handleTouchEnd, false);
            });
        }, 500);
    } else {
        turnIndicator.textContent = "Computer's turn to select a category";
        
        // Only flip the computer's card
        setTimeout(() => {
            computerCard.classList.add('flipped');
            computerPrompt.style.display = 'block';
            
            // Computer makes a selection after a longer delay (3.5 seconds)
            setTimeout(() => {
                handleComputerSelection();
            }, 3500);
        }, 500);
    }
}

// Update the card display with current card information
function updateCardDisplay() {
    // Player Card
    playerFoodName.textContent = gameState.currentPlayerCard.name;
    playerFoodImage.innerHTML = `<img src="${gameState.currentPlayerCard.image}" alt="${gameState.currentPlayerCard.name}">`;
    
    // Computer Card
    computerFoodName.textContent = gameState.currentComputerCard.name;
    computerFoodImage.innerHTML = `<img src="${gameState.currentComputerCard.image}" alt="${gameState.currentComputerCard.name}">`;
    
    // Update stats display
    playerStats.innerHTML = '';
    computerStats.innerHTML = '';
    
    const categories = {
        fats: 'Fats',
        sugar: 'Sugar',
        protein: 'Protein',
        sodium: 'Sodium',
        additives: 'Additives'
    };
    
    for (const [key, label] of Object.entries(categories)) {
        const playerStatRow = document.createElement('div');
        playerStatRow.classList.add('stat-row');
        playerStatRow.dataset.category = key;
        
        const playerStatName = document.createElement('span');
        playerStatName.classList.add('stat-name');
        playerStatName.textContent = label;
        
        const playerStatValue = document.createElement('span');
        playerStatValue.classList.add('stat-value');
        
        // Handle additive values differently (text instead of number)
        if (key === 'additives') {
            playerStatValue.textContent = gameState.currentPlayerCard.stats[key];
            
            // Add color class based on risk level
            if (gameState.currentPlayerCard.stats[key] === 'High') {
                playerStatValue.classList.add('risk-high');
            } else if (gameState.currentPlayerCard.stats[key] === 'Medium') {
                playerStatValue.classList.add('risk-medium');
            } else {
                playerStatValue.classList.add('risk-low');
            }
        } else {
            // Format numerical value with % DV for daily values
            playerStatValue.textContent = gameState.currentPlayerCard.stats[key] + '% DV';
        }
        
        playerStatRow.appendChild(playerStatName);
        playerStatRow.appendChild(playerStatValue);
        playerStats.appendChild(playerStatRow);
        
        // Computer card stats (same structure)
        const computerStatRow = document.createElement('div');
        computerStatRow.classList.add('stat-row');
        computerStatRow.dataset.category = key;
        
        const computerStatName = document.createElement('span');
        computerStatName.classList.add('stat-name');
        computerStatName.textContent = label;
        
        const computerStatValue = document.createElement('span');
        computerStatValue.classList.add('stat-value');
        
        // Handle additive values differently
        if (key === 'additives') {
            computerStatValue.textContent = gameState.currentComputerCard.stats[key];
            
            // Add color class based on risk level
            if (gameState.currentComputerCard.stats[key] === 'High') {
                computerStatValue.classList.add('risk-high');
            } else if (gameState.currentComputerCard.stats[key] === 'Medium') {
                computerStatValue.classList.add('risk-medium');
            } else {
                computerStatValue.classList.add('risk-low');
            }
        } else {
            // Format numerical value with % DV for daily values
            computerStatValue.textContent = gameState.currentComputerCard.stats[key] + '% DV';
        }
        
        computerStatRow.appendChild(computerStatName);
        computerStatRow.appendChild(computerStatValue);
        computerStats.appendChild(computerStatRow);
    }
}

// Handle player's category selection
function handlePlayerSelection(event) {
    if (!gameState.turnActive || gameState.currentTurn !== 'player') return;
    
    const selectedRow = event.currentTarget;
    const category = selectedRow.dataset.category;
    
    // Clear previous selections
    clearStatClasses();
    
    // Process the selection
    processSelection(category, 'player');
}

// Handle computer's category selection
function handleComputerSelection() {
    if (!gameState.turnActive || gameState.currentTurn !== 'computer') return;
    
    // Computer AI logic to choose the best category based only on its own card
    const category = getComputerChoice();
    
    // Highlight the selected category in computer's card
    const computerStatRow = computerStats.querySelector(`.stat-row[data-category="${category}"]`);
    computerStatRow.classList.add('selected');
    
    // Process the selection
    processSelection(category, 'computer');
}

// Computer AI to select the best category - now only using its own card
function getComputerChoice() {
    // Gets the computer's card information
    const computerCard = gameState.currentComputerCard;
    
    // Fair computer strategy - choose based only on your own card's strengths
    const strengths = {};
    
    // For Fats, Sugar, Sodium - lower values are better
    strengths.fats = 100 - computerCard.stats.fats; // Invert so higher number = better
    strengths.sugar = 100 - computerCard.stats.sugar;
    strengths.sodium = 100 - computerCard.stats.sodium;
    
    // For Protein - higher is better
    strengths.protein = computerCard.stats.protein;
    
    // For Additives - convert to numeric strength
    const additiveStrength = {
        'Low': 90,
        'Medium': 50,
        'High': 10
    };
    strengths.additives = additiveStrength[computerCard.stats.additives];
    
    // Find the strongest category
    let bestCategory = 'protein'; // Default
    let bestStrength = 0;
    
    for (const [category, strength] of Object.entries(strengths)) {
        if (strength > bestStrength) {
            bestStrength = strength;
            bestCategory = category;
        }
    }
    
    // Add some randomness (20% chance to pick randomly)
    if (Math.random() < 0.2) {
        const categories = Object.keys(strengths);
        return categories[Math.floor(Math.random() * categories.length)];
    }
    
    return bestCategory;
}

// Process category selection from either player or computer
function processSelection(category, selector) {
    gameState.selectedCategory = category;
    gameState.turnActive = false;
    
    // Hide prompts
    playerPrompt.style.display = 'none';
    computerPrompt.style.display = 'none';
    
    // Highlight selected category on appropriate card
    const selectedRow = (selector === 'player') ? 
        playerStats.querySelector(`.stat-row[data-category="${category}"]`) :
        computerStats.querySelector(`.stat-row[data-category="${category}"]`);
    
    // Add selected class
    selectedRow.classList.add('selected');
    
    // Now flip the other card to reveal it
    if (selector === 'player') {
        setTimeout(() => {
            computerCard.classList.add('flipped');
        }, 500);
    } else {
        setTimeout(() => {
            playerCard.classList.add('flipped');
        }, 500);
    }
    
    // Compare values
    setTimeout(() => {
        let result;
        if (category === 'additives') {
            // For additives, compare risk levels (Low > Medium > High)
            const playerRisk = gameState.currentPlayerCard.stats[category];
            const computerRisk = gameState.currentComputerCard.stats[category];
            
            // Convert risk to numeric value for comparison
            const riskValue = {
                'Low': 3,
                'Medium': 2,
                'High': 1
            };
            
            if (riskValue[playerRisk] > riskValue[computerRisk]) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                result = 'win';
            } else if (riskValue[playerRisk] < riskValue[computerRisk]) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                result = 'lose';
            } else {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                result = 'draw';
            }
        } else if (category === 'protein') {
            // For protein, higher is better
            const playerValue = gameState.currentPlayerCard.stats[category];
            const computerValue = gameState.currentComputerCard.stats[category];
            
            if (playerValue > computerValue) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                result = 'win';
            } else if (playerValue < computerValue) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                result = 'lose';
            } else {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                result = 'draw';
            }
        } else {
            // For fat, sugar, sodium - lower is better
            const playerValue = gameState.currentPlayerCard.stats[category];
            const computerValue = gameState.currentComputerCard.stats[category];
            
            if (playerValue < computerValue) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                result = 'win';
            } else if (playerValue > computerValue) {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('losing');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('winning');
                result = 'lose';
            } else {
                playerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                computerStats.querySelector(`.stat-row[data-category="${category}"]`).classList.add('draw');
                result = 'draw';
            }
        }
        
        // Process the result after comparison
        processRound(result, category, selector);
    }, 1500);
}

// Process the round result
function processRound(result, category, selector) {
    // Store the result for next round
    gameState.lastResult = result;
    
    // Create message for the result
    let message = '';
    let details = '';
    const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);
    
    // Update who gets to select next (the winner)
    if (result === 'win') {
        gameState.lastWinner = 'player';
    } else if (result === 'lose') {
        gameState.lastWinner = 'computer';
    } else {
        // On a draw, the selector keeps initiative
        gameState.lastWinner = selector;
    }
    
    const playerCardName = gameState.currentPlayerCard.name;
    const computerCardName = gameState.currentComputerCard.name;
    
    if (category === 'additives') {
        const playerRisk = gameState.currentPlayerCard.stats[category];
        const computerRisk = gameState.currentComputerCard.stats[category];
        
        if (result === 'win') {
            message = `You win! Your ${categoryLabel} Risk (${playerRisk}) is better than Computer's (${computerRisk})`;
            details = `${playerCardName} has lower additive risk than ${computerCardName}`;
            if (selector === 'player') {
                message += " - You chose well!";
            } else {
                message += " - Computer's choice backfired!";
            }
            gameState.playerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
            resultMessage.className = 'result-message win-message';
        } else if (result === 'lose') {
            message = `You lose! Your ${categoryLabel} Risk (${playerRisk}) is worse than Computer's (${computerRisk})`;
            details = `${computerCardName} has lower additive risk than ${playerCardName}`;
            if (selector === 'player') {
                message += " - Not the best choice!";
            } else {
                message += " - Computer chose wisely!";
            }
            gameState.computerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
            resultMessage.className = 'result-message lose-message';
        } else {
            message = `Draw! Both have ${categoryLabel} Risk of ${playerRisk}`;
            details = `Both items have the same additive risk level`;
            gameState.playerCards.push(gameState.currentPlayerCard);
            gameState.computerCards.push(gameState.currentComputerCard);
            resultMessage.className = 'result-message draw-message';
        }
    } else {
        const playerValue = gameState.currentPlayerCard.stats[category];
        const computerValue = gameState.currentComputerCard.stats[category];
        
        if (category === 'protein') {
            // For protein, higher is better
            if (result === 'win') {
                message = `You win! Your ${categoryLabel} (${playerValue}% DV) is higher than Computer's (${computerValue}% DV)`;
                details = `${playerCardName} has ${playerValue - computerValue}% more protein than ${computerCardName}`;
                if (selector === 'player') {
                    message += " - You chose well!";
                } else {
                    message += " - Computer's choice backfired!";
                }
                gameState.playerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
                resultMessage.className = 'result-message win-message';
            } else if (result === 'lose') {
                message = `You lose! Your ${categoryLabel} (${playerValue}% DV) is lower than Computer's (${computerValue}% DV)`;
                details = `${computerCardName} has ${computerValue - playerValue}% more protein than ${playerCardName}`;
                if (selector === 'player') {
                    message += " - Not the best choice!";
                } else {
                    message += " - Computer chose wisely!";
                }
                gameState.computerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
                resultMessage.className = 'result-message lose-message';
            } else {
                message = `Draw! Both have ${categoryLabel} value of ${playerValue}% DV`;
                details = `Both items contain the same amount of protein`;
                gameState.playerCards.push(gameState.currentPlayerCard);
                gameState.computerCards.push(gameState.currentComputerCard);
                resultMessage.className = 'result-message draw-message';
            }
        } else {
            // For fat, sugar, sodium - lower is better
            if (result === 'win') {
                message = `You win! Your ${categoryLabel} (${playerValue}% DV) is lower than Computer's (${computerValue}% DV)`;
                details = `${playerCardName} has ${computerValue - playerValue}% less ${category.toLowerCase()} than ${computerCardName}`;
                if (selector === 'player') {
                    message += " - You chose well!";
                } else {
                    message += " - Computer's choice backfired!";
                }
                gameState.playerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
                resultMessage.className = 'result-message win-message';
            } else if (result === 'lose') {
                message = `You lose! Your ${categoryLabel} (${playerValue}% DV) is higher than Computer's (${computerValue}% DV)`;
                details = `${computerCardName} has ${playerValue - computerValue}% less ${category.toLowerCase()} than ${playerCardName}`;
                if (selector === 'player') {
                    message += " - Not the best choice!";
                } else {
                    message += " - Computer chose wisely!";
                }
                gameState.computerCards.push(gameState.currentPlayerCard, gameState.currentComputerCard);
                resultMessage.className = 'result-message lose-message';
            } else {
                message = `Draw! Both have ${categoryLabel} value of ${playerValue}% DV`;
                details = `Both items contain the same amount of ${category.toLowerCase()}`;
                gameState.playerCards.push(gameState.currentPlayerCard);
                gameState.computerCards.push(gameState.currentComputerCard);
                resultMessage.className = 'result-message draw-message';
            }
        }
    }
    
    // Update turn indicator for next round
    turnIndicator.textContent = gameState.lastWinner === 'player' ? 
        "Next round: Your turn to select" : 
        "Next round: Computer's turn to select";
    
    // Update scores
    updateScores();
    
    // Show result message with details
    resultMessage.innerHTML = message + `<span class="result-details">${details}</span>`;
    resultMessage.style.display = 'block';
    
    // Scroll to the result message on mobile
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            resultMessage.scrollIntoView({behavior: 'smooth', block: 'nearest'});
        }, 100);
    }
    
    // Check if game is over
    if (gameState.deck.length === 0) {
        setTimeout(() => {
            endGame();
        }, 2000);
    } else {
        // Enable deal button for next round
        dealButton.disabled = false;
    }
}

// Update scores display
function updateScores() {
    playerScore.textContent = gameState.playerCards.length;
    computerScore.textContent = gameState.computerCards.length;
}

// End the game and determine winner
function endGame() {
    let finalMessage = '';
    
    if (gameState.playerCards.length > gameState.computerCards.length) {
        finalMessage = `Game Over! You win with ${gameState.playerCards.length} cards versus Computer's ${gameState.computerCards.length} cards.`;
        resultMessage.className = 'result-message win-message';
    } else if (gameState.playerCards.length < gameState.computerCards.length) {
        finalMessage = `Game Over! Computer wins with ${gameState.computerCards.length} cards versus your ${gameState.playerCards.length} cards.`;
        resultMessage.className = 'result-message lose-message';
    } else {
        finalMessage = `Game Over! It's a tie! Both have ${gameState.playerCards.length} cards.`;
        resultMessage.className = 'result-message draw-message';
    }
    
    resultMessage.innerHTML = finalMessage;
    resultMessage.style.display = 'block';
    dealButton.disabled = true;
    turnIndicator.textContent = "Game Over! Check the final score.";
    
    // Scroll to the result message on mobile
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            resultMessage.scrollIntoView({behavior: 'smooth', block: 'center'});
        }, 100);
    }
}

// Show a result message
function showResult(message, type = 'draw') {
    resultMessage.textContent = message;
    resultMessage.className = `result-message ${type}-message`;
    resultMessage.style.display = 'block';
}

// Clear all stat highlighting classes
function clearStatClasses() {
    const allStatRows = document.querySelectorAll('.stat-row');
    allStatRows.forEach(row => {
        row.removeEventListener('click', handlePlayerSelection);
        row.removeEventListener('touchstart', handleTouchStart);
        row.removeEventListener('touchend', handleTouchEnd);
        row.classList.remove('selected', 'winning', 'losing', 'draw');
        row.style.backgroundColor = '';
    });
}

// Shuffle the deck using Fisher-Yates algorithm
function shuffleDeck(array) {
    let currentIndex = array.length;
    let randomIndex;
    
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

// Debug function to check image loading
function checkImages() {
    const images = document.querySelectorAll('.food-image img');
    images.forEach(img => {
        console.log(`Image: ${img.src}, Complete: ${img.complete}, Natural dimensions: ${img.naturalWidth}x${img.naturalHeight}`);
        
        // Add fallback text if image fails
        img.onerror = function() {
            this.style.display = 'none';
            this.parentNode.innerHTML += '<div style="padding: 20px; text-align: center;">Image not available</div>';
        };
        
        // Add a load event listener to verify loading
        img.onload = function() {
            console.log(`Image loaded successfully: ${this.src}`);
        };
    });
}

// Run the check after cards are flipped
playerCard.addEventListener('transitionend', function() {
    if (playerCard.classList.contains('flipped')) {
        setTimeout(checkImages, 500);
    }
});

// Also check when computer card flips
computerCard.addEventListener('transitionend', function() {
    if (computerCard.classList.contains('flipped')) {
        setTimeout(checkImages, 500);
    }
});

// Initialize display
remainingCards.textContent = "0";
remainingRounds.textContent = "0";