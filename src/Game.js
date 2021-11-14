import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { round } from "./utils";

import Box from "./components/Box";
import Numbers from "./components/Numbers";
import "./Game.css";
import "react-toastify/dist/ReactToastify.css";

// ALL OF THESE QUESTS NEED COST MONEY
// increase box price for 10%
// sell N boxes
// produce N boxes

function Game() {
  const [boxes, setBoxes] = useState(0);
  const [money, setMoney] = useState(10);
  const [workers, setWorkers] = useState(0);
  const [sellers, setSellers] = useState(0);

  const [boxesProducedAllTime, setBoxesForAllTime] = useState(0);
  const [boxesSoldAllTime, setBoxesSoldAllTime] = useState(0);

  const [boxPrice, setBoxPrice] = useState(0.01);
  const [workerPrice, setWorkerPrice] = useState(1);
  const [sellerPrice, setSellerPrice] = useState(1);
  const [increaseBoxPriceCost, setIncreaseBoxPriceCost] = useState(10);

  const loadGameStateFromLS = () => {
    const gameInfo = localStorage.getItem("boxOfficeState")
      ? JSON.parse(localStorage.getItem("boxOfficeState"))
      : null;

    if (gameInfo) {
      setBoxes(gameInfo.boxes);
      setBoxesForAllTime(gameInfo.boxesProducedAllTime);
      setBoxesSoldAllTime(gameInfo.boxesSoldAllTime);
      setMoney(gameInfo.money);
      setWorkers(gameInfo.workers);
      setSellers(gameInfo.sellers);
      setBoxPrice(gameInfo.boxPrice);
      setWorkerPrice(gameInfo.workerPrice);
      setSellerPrice(gameInfo.sellerPrice);
    }
  };

  const saveGameStateToLS = () => {
    const gameInfo = JSON.stringify({
      boxes,
      boxesProducedAllTime,
      boxesSoldAllTime,
      money,
      workers,
      sellers,
      boxPrice,
      workerPrice,
      sellerPrice,
    });

    localStorage.setItem("boxOfficeState", gameInfo);
  };

  useEffect(() => {
    loadGameStateFromLS();
  }, []);

  const notify = (text, toastId) => {
    toast(text, {
      toastId,
    });
  };

  const createBox = () => {
    setBoxes((boxes) => boxes + 1);
    setBoxesForAllTime((boxes) => boxes + 1);
  };

  const sellBox = () => {
    if (boxes > 0) {
      setBoxes((boxes) => boxes - 1);
      setMoney((money) => round(money + boxPrice));
      setBoxesSoldAllTime((boxes) => boxes + 1);
    }
  };

  const calcBoxesAndMoney = () => {
    // calc produced boxes by workers:
    let boxesCalc = round(boxes + workers);

    // calc boxes that will be sold by sellers if they can:
    if (sellers > 0 && sellers <= boxes) {
      boxesCalc = round(boxesCalc - sellers);
    }

    // save boxes to state
    setBoxes(boxesCalc);
    setBoxesForAllTime((boxes) => boxes + workers);
    setBoxesSoldAllTime((boxes) => boxes + sellers);

    // calculate the money by sold boxes
    if (sellers > 0 && sellers <= boxes) {
      let newMoney = round(money + boxPrice * sellers);

      setMoney(newMoney);
    }
  };

  const giveRewardToUser = (rewardId, rewardCost) => {
    const userRewards = localStorage.getItem("boxOfficeRewards");

    if (!userRewards) {
      localStorage.setItem("boxOfficeRewards", "[]");
    }

    const userRewardsParsed = JSON.parse(
      localStorage.getItem("boxOfficeRewards")
    );

    if (userRewardsParsed && !userRewardsParsed.includes(rewardId)) {
      userRewardsParsed.push(rewardId);

      localStorage.setItem(
        "boxOfficeRewards",
        JSON.stringify(userRewardsParsed)
      );

      setMoney((money) => money + rewardCost);
    }
  };

  const notifyOnAchievmentsAndGiveReward = () => {
    const checkBoxesCount = (minBoxesCount) => {
      const maxBoxesCount = minBoxesCount * 1.2;

      return (
        boxesProducedAllTime > minBoxesCount &&
        boxesProducedAllTime < maxBoxesCount
      );
    };

    if (checkBoxesCount(10)) {
      notify("Wow, you produced 10 boxes! Keep it up!", "10boxes");
      giveRewardToUser("10boxes", 3);
    } else if (checkBoxesCount(200)) {
      notify("Wow, you produced 200 boxes! Keep it up!", "200boxes");
      giveRewardToUser("20boxes", 3);
    } else if (checkBoxesCount(1000)) {
      notify("Wow, you produced 1000 boxes! Keep it up!", "1000boxes");
    } else if (checkBoxesCount(5000)) {
      notify("Wow, you produced 5000 boxes! Keep it up!", "5000boxes");
    } else if (checkBoxesCount(20000)) {
      notify("Wow, you produced 20000 boxes! Keep it up!", "20000boxes");
    }
  };

  const gameEngine = () => {
    if (workers || sellers) {
      calcBoxesAndMoney();
    }

    notifyOnAchievmentsAndGiveReward();
  };

  const increaseWorkerHiringPrice = () => {
    setWorkerPrice((workerPrice) => workerPrice * 2);
  };

  const hireWorker = () => {
    increaseWorkerHiringPrice();
    setMoney((money) => round(money - workerPrice));
    setWorkers((worker) => worker + 1);
  };

  const increaseSellerHiringPrice = () => {
    setSellerPrice((sellerPrice) => sellerPrice * 2);
  };

  const hireSeller = () => {
    increaseSellerHiringPrice();
    setMoney((money) => round(money - sellerPrice));
    setSellers((seller) => seller + 1);
  };

  const increaseBoxPrice = () => {
    setBoxPrice((boxPrice) => boxPrice * 2);
    setIncreaseBoxPriceCost((increaseBoxPriceCost) => increaseBoxPriceCost * 3);
  };

  useEffect(() => {
    const id = setInterval(gameEngine, 100);
    return () => clearInterval(id);
  }, [sellers, workers, boxes, money]);

  const canSellBox = boxes <= 0;

  const canHireWorker = workerPrice <= money;
  const canHireSeller = sellerPrice <= money;
  const canIncreaseBoxPrice = increaseBoxPriceCost <= money;

  const clearLS = () => {
    localStorage.removeItem("boxOfficeState");
  };

  return (
    <div className="game">
      <header>
        <div className="header-info">Box price: ${boxPrice}$</div>
        <div className="header-info">
          Boxes produced for all time: {boxesProducedAllTime}
        </div>
        <div className="header-info">
          Boxes sold for all time: {boxesSoldAllTime}
        </div>
      </header>

      <div className="game-content">
        <ToastContainer
          position="top-center"
          autoClose={7000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
        />

        <div className="content">
          <div className="box-container">
            <div className="box-info">Click on the box to produce boxes</div>

            <Box createBox={createBox} />

            <button onClick={sellBox} disabled={canSellBox}>
              Sell box
            </button>

            <button onClick={clearLS}>Clear LS</button>
          </div>

          <Numbers
            money={money}
            boxes={boxes}
            workers={workers}
            sellers={sellers}
          />

          <div>
            <h2>Improvements</h2>

            <div>
              <button disabled={!canHireWorker} onClick={hireWorker}>
                Hire worker ({workerPrice}$)
              </button>
              <button disabled={!canHireSeller} onClick={hireSeller}>
                Hire seller ({sellerPrice}$)
              </button>
              <button
                disabled={!canIncreaseBoxPrice}
                onClick={increaseBoxPrice}
              >
                Increase box price x2 ({increaseBoxPriceCost}$)
              </button>

              <button onClick={saveGameStateToLS}>Save the game</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
