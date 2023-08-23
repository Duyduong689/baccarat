import { useEffect, useState } from "react";
import "./App.css";
import { deckService, useGetDeck } from "./services";
import { useMutation } from "react-query";
import { Player, Card, CardValue } from "./models";
import PlayerCard from "./components/Player";
import { CARD_VALUE_MAP } from "./constants";

function App() {
  const [players, setPlayers] = useState<Player[]>([
    {
      name: "P4",
      hand: [],
      points: 0,
      coins: 5000,
    },
    {
      name: "P3",
      hand: [],
      points: 0,
      coins: 5000,
    },
    {
      name: "P2",
      hand: [],
      points: 0,
      coins: 5000,
    },
    {
      name: "P1",
      hand: [],
      points: 0,
      coins: 5000,
    },
  ]);

  const [currentDrawCards, setCurrentDrawCards] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState<number>(52);
  const [isRevealHand, setIsRevealHand] = useState<boolean>(false);
  const [alivePlayer, setAlivePlayer] = useState<
    ({ name: string; index: number } | undefined)[]
  >([]);

  const { data: deckData, isLoading: isLoadingDeckData } = useGetDeck();
  const useDrawCardFromDeck = useMutation(deckService.drawCardFromDeck, {
    onSuccess: (data: any) => {
      setRemainingCards(data.remaining);
      setCurrentDrawCards(data.cards);
    },
    onError: (error: string) => {
      console.log(error);
    },
  });
  const useShuffleDeck = useMutation(deckService.shuffleDeck, {
    onSuccess: (data: any) => {
      setRemainingCards(data.remaining);
      setIsRevealHand(false);
      setPlayers((prev) => {
        prev[0].hand = [];
        prev[1].hand = [];
        prev[2].hand = [];
        prev[3].hand = [];
        return [...prev];
      });
    },
    onError: (error: string) => {
      console.log(error);
    },
  });
  const handleShuffleDeck = () => {
    if (handleVerdictGame()) {
      handleResetDeck();
    } else {
      useShuffleDeck.mutate(deckData["deck_id"]);
    }
  };
  const handleDrawnDeck = () => {
    if (handleVerdictGame()) {
      handleResetDeck();
    } else {
      if (remainingCards >= 3 * alivePlayer.length) {
        useDrawCardFromDeck.mutate({
          deckId: deckData["deck_id"],
          count: 3 * alivePlayer.length,
        });
      } else {
        alert("There are not enough card to drawn, the deck will be shuffle!");
        handleShuffleDeck();
      }
    }
  };

  const dealCardToPlayers = (cards: Card[]) => {
    setIsRevealHand(false);
    handleSetCoinsPlayer();
    const sortedAlivePlayer = alivePlayer
      .slice()
      .sort((a, b) => (b?.index || 0) - (a?.index || 0));

    const mappingArray = sortedAlivePlayer.map((item, index) => {
      let count = 0;
      let handArray = [];
      for (let i = 0; i < 3; i++) {
        handArray.push(cards[count + index]);
        count += sortedAlivePlayer.length;
      }
      return { ...item, handArray };
    });
    setPlayers((prev) => {
      mappingArray.map((item) => {
        prev[item?.index || 0].hand = item.handArray;
        prev[item?.index || 0].points = countPointPerHand(
          prev[item?.index || 0].hand
        );
      });
      return [...prev];
    });
  };
  const countPointPerHand = (hand: { value: CardValue }[]) => {
    let point = 0;
    hand.map((item) => {
      point += CARD_VALUE_MAP[item.value];
    });
    return point % 10;
  };
  const handleRevealDeck = () => {
    if (handleVerdictGame()) {
      handleResetDeck();
    } else {
      if (!isRevealHand && remainingCards !== 52) {
        setIsRevealHand(true);
      }
    }
  };
  const handleSetCoinsPlayer = () => {
    setPlayers((prev) => {
      const maxIndex = prev.reduce((maxIndex, currentObject, currentIndex) => {
        if (currentObject.points > prev[maxIndex].points) {
          return currentIndex;
        } else {
          return maxIndex;
        }
      }, 0);
      prev = [
        ...prev.map((item, index) => {
          if (item.points < prev[maxIndex].points && item.coins > 0) {
            item.coins -= 900;
            item.coins = item.coins > 0 ? item.coins : 0;
          }
          return item;
        }),
      ];
      return prev;
    });
  };
  const handleResetDeck = () => {
    useShuffleDeck.mutate(deckData["deck_id"]);
    setPlayers((prev) => {
      prev[0] = { ...prev[0], coins: 5000, hand: [], points: 0 };
      prev[1] = { ...prev[1], coins: 5000, hand: [], points: 0 };
      prev[2] = { ...prev[2], coins: 5000, hand: [], points: 0 };
      prev[3] = { ...prev[3], coins: 5000, hand: [], points: 0 };
      return [...prev];
    });
  };
  const handleVerdictGame = () => {
    if (alivePlayer.length <= 1) {
      alert(
        "There are not enough player to continue to play, the game will be reset!"
      );
      return true;
    }
    return false;
  };
  useEffect(() => {
    if (currentDrawCards.length > 0) {
      dealCardToPlayers(currentDrawCards);
    }
  }, [currentDrawCards]);
  useEffect(() => {
    if (players) {
      setAlivePlayer((prev) => {
        let result = players
          .map((item, index) => {
            if (item.coins > 0) {
              return { name: item.name, index: index };
            }
          })
          .filter((item) => item !== undefined);
        return [...result];
      });
    }
  }, [players]);
  return (
    <div>
      <div className="table">
        <div className="vertical">
          <PlayerCard player={players[3]} isRevealHand={isRevealHand} />
        </div>
        <div className="horizontal">
          <PlayerCard player={players[0]} isRevealHand={isRevealHand} />
          <div className="btnWrapper">
            {useShuffleDeck.isLoading || useDrawCardFromDeck.isLoading ? (
              <div className="lds-ring">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            ) : (
              <>
                <div className="remaining">
                  <span>Deck Cards {remainingCards}</span>
                </div>
                <div className="groupBtn">
                  <button
                    className="button-5"
                    style={{ background: "#078b04", color: "white" }}
                    onClick={handleShuffleDeck}
                  >
                    Shuffle
                  </button>
                  <button
                    className="button-5"
                    style={{ background: "rgb(184 189 10)", color: "white" }}
                    onClick={handleDrawnDeck}
                  >
                    Drawn
                  </button>
                  <button
                    className="button-5"
                    style={{ background: "rgb(53 59 203)", color: "white" }}
                    onClick={handleRevealDeck}
                  >
                    Reveal
                  </button>
                  <button
                    className="button-5"
                    style={{ background: "rgb(181 45 104)", color: "white" }}
                    onClick={handleResetDeck}
                  >
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
          <PlayerCard player={players[2]} isRevealHand={isRevealHand} />
        </div>
        <div className="vertical">
          <PlayerCard player={players[1]} isRevealHand={isRevealHand} />
        </div>
      </div>
    </div>
  );
}

export default App;
