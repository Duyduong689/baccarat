import React from "react";
import { Player } from "../models";
interface PlayerProps {
  player: Player;
  isRevealHand: boolean;
}
const PlayerCard: React.FC<PlayerProps> = (props) => {
  const { isRevealHand } = props;
  const { name, coins, hand, points } = props.player;
  return (
    <div className="player">
      <div className="playerInfo">
        <span>{name}</span>
        <img
          src="https://gamek.mediacdn.vn/133514250583805952/2020/5/12/photo-1-1589270609553645901855.jpg"
          width={150}
          height={150}
          alt="playerAvt"
        />
        <span>Coins: {coins}</span>
      </div>
      {coins > 0 ? (
        <div className="handWrapper">
          <div className="cardsWrapper">
            {isRevealHand
              ? hand.map((item, index) => {
                  return (
                    <div key={index}>
                      <img src={item.image} width={120} />
                    </div>
                  );
                })
              : Array.from({ length: 3 }, (_, index) => (
                  <div key={index}>
                    <img
                      alt="card-back"
                      src={"https://deckofcardsapi.com/static/img/back.png"}
                      width={120}
                    />
                  </div>
                ))}
          </div>
          <span className="pointLabel">
            Point: {isRevealHand ? points : ""}
          </span>
        </div>
      ) : (
        <div className="loseLabel">
          <img
            src="https://cdn-icons-png.flaticon.com/512/8346/8346459.png"
            width={150}
            alt=""
          />
          <span style={{ fontSize: "25px" }}>Not enough money</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
