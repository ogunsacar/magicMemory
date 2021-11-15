import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

// images doesnt change so we make it global
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];

function App() {
  const [cards, setCards] = useState([]); // all the cards
  const [turns, setTurns] = useState(0); // turns when user selects two card
  const [choiceOne, setChoiceOne] = useState(null); // users first select
  const [choiceTwo, setChoiceTwo] = useState(null); // users second select
  const [disabled, setDisabled] = useState(false); //if card is selected

  // shuffle cards - starts new game
  const shuffleCards = () => {
    const shuffleCards = [...cardImages, ...cardImages] // double the cards
      .sort(() => Math.random() - 0.5) // sort them to the random order
      .map((card) => ({ ...card, id: Math.random() })); // map all 12 card and add them unique id

    setCards(shuffleCards); // change the card state with that array
    setChoiceOne(null); // reset the users first choice
    setChoiceTwo(null); // reset the users second choice
    setTurns(0); // reset the turns
  };

  // handle a choice - decides if users select is first one or second and that runs useeffect beacuse there is a change on one of these states
  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  // compare two selected cards
  useEffect(() => {
    if (choiceTwo && choiceOne) {
      // check if there are two choices
      setDisabled(true); // if there is two choice set them disabled so user cant select more then two card
      if (choiceOne.src === choiceTwo.src) {
        // if two select matches
        setCards((prevCards) => {
          // make the previous card array and map that array. for each card in that array find ones that matches with the selected ones
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true }; // and change that two card's mathced property to true
            } else {
              return card; // there should be 10 card which doesnt match return them as it is. so it stays as same
            }
          });
        });
        resetTurn(); // it does reset the user's choices and adds 1 to the turns state. after that it changes disabled to false
      } else {
        setTimeout(() => {
          // if it doesnt match reset the turn after 1 sec.
          resetTurn();
        }, 1000);
      }
    }
  }, [choiceOne, choiceTwo]); // does that ever choices changes

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  //start a game when page loads
  useEffect(() => {
    shuffleCards();
  }, []);

  return (
    // make SingleCard component for every card. it needs key property for every one of them because of all should be unique. it has card object as props to know which card it is. puts handlechoice function as props to use that in the component.there is three option for card being flipped(if it users first choice-or second and if users match their two select). and its not disabled for all singlecard components, we have to assign as a prop if we wanna use that variable in that component.
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p className="">{turns}</p>
    </div>
  );
}

export default App;
