const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.querySelector('#score-points'),
    },
    cardSprites: {
        avatar: document.querySelector('#card-image'),
        name: document.querySelector('#card-name'),
        type: document.querySelector('#card-type'),
    },
    fieldCards: {
        player: document.querySelector('#player-field-card'),
        computer: document.querySelector('#computer-field-card'),
    },
    playerSides: {
        player1: 'player-cards',
        player1Box: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBox: document.querySelector('#computer-cards'),
    },
    actions: {
        button: document.querySelector('#next-duel'),
    },
};



const pathImages = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },
];


async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
};

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement('img');
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', `${pathImages}card-back.png`);
    cardImage.setAttribute('data-id', IdCard);
    cardImage.classList.add('card');

    if (fieldSide === state.playerSides.player1) {

        cardImage.addEventListener('mouseover', () => {
            drawSelectCards(IdCard);
        });

        cardImage.addEventListener('click', () => {
            setCardsField(cardImage.getAttribute('data-id'));
        });
    };

    return cardImage;
};

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    await showHiddenCardFieldsImages(true);

    await hiddenCardDetails();

    await drawCardsInFields(cardId, computerCardId);

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();

    await drawButton(duelResults);
};

async function drawCardsInFields(cardId, computerCardId){    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;
};

async function showHiddenCardFieldsImages(value){
    if(value){
        state.fieldCards.player.style.display = 'block';
        state.fieldCards.computer.style.display = 'block';
    } else {
        state.fieldCards.player.style.display = 'none';
        state.fieldCards.computer.style.display = 'none';
    }
};

async function hiddenCardDetails(){    
    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';
};

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = 'draw';
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = 'Win';
        state.score.playerScore++;
    }

    if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = 'Lose';
        state.score.computerScore++;
    }

    await playAudio(duelResults);

    return duelResults;
};

async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = 'block';
};

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
};

async function removeAllCardsImages() {

    let { computerBox, player1Box } = state.playerSides;

    let imgElements = computerBox.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = player1Box.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

};

async function drawSelectCards(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Atribute : ' + cardData[index].type;
};


async function drawCards(cardNumber, fieldSide) {
    for (let i = 0; i < cardNumber; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.querySelector(`#${fieldSide}`).appendChild(cardImage);
    }
};

async function resetDuel() {
    state.cardSprites.avatar.src = '';
    state.actions.button.style.display = 'none';

    state.fieldCards.player.style.display = 'none';
    state.fieldCards.computer.style.display = 'none';

    init();
};

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    try {
        audio.play();
    } catch { }
};



function init() {

    showHiddenCardFieldsImages(false)

    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);

    const bgm = document.querySelector('#bgm')
    bgm.play();
};

init();