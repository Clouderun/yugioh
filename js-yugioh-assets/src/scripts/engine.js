const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById('score_points'),

    },

    cardSprites: {
        avatar: document.getElementById('card-image'),
        name: document.getElementById('card-name'),
        type: document.getElementById('card-type'),
    },

    fieldCards: {
        player: document.getElementById('player-field-card'),
        computer: document.getElementById('computer-field-card')
    },

    playerSides: {
        player1: 'player-cards',
        player1BOX: document.querySelector('#player-cards'),
        computer: 'computer-cards',
        computerBOX: document.querySelector('#computer-cards'),
    },

    actions: {
        button: document.getElementById('next-duel')
    },

};


const pathImages = './src/assets/icons/';

const cardData = [
    {
        id: 0,
        name: 'Blue Eyes White Dragon',
        type: 'Paper',
        img: `${pathImages}dragon.png`,
        WinOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: 'Dark Magician',
        type: 'Rock',
        img: `${pathImages}magician.png`,
        WinOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: 'Exodia',
        type: 'Scissors',
        img: `${pathImages}exodia.png`,
        WinOf: [0],
        LoseOf: [1],
    },
];


async function getRandomCardId() {
    // adicionamos o limite para a aleatoriedade com o *
    // colocamos o floor pra arrendodar o valor para n dar um numero quebrado
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// precisa do id pra saber qual img, e pra que lado do campo pra setar a img
async function createCardImage(IdCard, fieldSide) {
    // cria um elemento (tag html), criando ele dinamicamente
    const cardImage = document.createElement('img');
    // coloca o atributo e o valor dele
    cardImage.setAttribute('height', '100px');
    cardImage.setAttribute('src', './src/assets/icons/card-back.png');
    // toda vez q aparece uma carta se cria um id pra ele
    cardImage.setAttribute('data-id', IdCard);
    // para personalizar no css
    cardImage.classList.add('card');

    // faz com que nao possa clica nas cartas do computador
    if (fieldSide === state.playerSides.player1) {
        cardImage.addEventListener('mouseover', () => {
            drawSelectCard(IdCard);
        })
        cardImage.addEventListener('click', () => {
            // toda vez que clicar na carta, ela e posta no campo na tela
            setCardsField(cardImage.getAttribute('data-id'))
        });

    }



    return cardImage;

}


async function setCardsField(cardId) {


    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = 'block';
    state.fieldCards.computer.style.display = 'block';

    await hiddenCardDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;


    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);

}

async function hiddenCardDetails() {
    state.cardSprites.avatar.src = '';
    state.cardSprites.name.innerText = '';
    state.cardSprites.type.innerText = '';
}



async function drawButton(text) {
    state.actions.button.innerText = text
    state.actions.button.style.display = 'block'
}

async function updateScore() {
    state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}


async function checkDuelResults(playerCardId, ComputerCardId) {
    let duelResults = 'DRAW'
    let playerCard = cardData[playerCardId];

    // verifica se dentro tem o computer card id, se tiver, o player ganha
    if (playerCard.WinOf.includes(ComputerCardId)) {
        duelResults = 'WIN'
        state.score.playerScore++;
    }

    if (playerCard.LoseOf.includes(ComputerCardId)) {
        duelResults = 'LOSE'
        state.score.computerScore++;
    }

    await playAudio(duelResults)

    return duelResults;
}


async function removeAllCardsImages() {
    // o que tiver na classe cardbox com o id computercards
    // pega oque tem tag img e remove
    // fazendo assim que n possa clicar mais aleatoriamente
    let { computerBOX, player1BOX } = state.playerSides;
    let imgElements = computerBOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll('img');
    imgElements.forEach((img) => img.remove());
}


async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = 'Atribute : ' + cardData[index].type;
}


async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        // await para esperar
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        // pendura o card image dentro dp field side
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}


async function resetDuel() {
    state.cardSprites.avatar.src = ''
    state.actions.button.style.display = 'none'

    state.fieldCards.player.style.display = 'none'
    state.fieldCards.computer.style.display = 'none'

    init();
}

// status pra saber se ganhou ou perdeu
async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);

    try {
        audio.play();
    } catch {
    }



}

function init() {
    drawCards(5, state.playerSides.player1);
    drawCards(5, state.playerSides.computer);


    const bgm = document.getElementById('bgm');
    bgm.play();
}

init();





