import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import { round } from "./utils";

import Box from "./components/Box";
import Numbers from "./components/Numbers";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// ALL OF THESE QUESTS NEED COST MONEY
// increase box price for 10%
// sell N boxes
// produce N boxes

function App() {
  const [boxes, setBoxes] = useState(0);
  const [money, setMoney] = useState(10);
  const [workers, setWorkers] = useState(0);
  const [sellers, setSellers] = useState(0);

  const [boxesForAllTime, setBoxesForAllTime] = useState(0);

  const [boxPrice, setBoxPrice] = useState(0.01);
  const [workerPrice, setWorkerPrice] = useState(1);
  const [sellerPrice, setSellerPrice] = useState(1);

  const loadGameStateFromLS = () => {
    const gameInfo = localStorage.getItem("boxOfficeState")
      ? JSON.parse(localStorage.getItem("boxOfficeState"))
      : null;

    if (gameInfo) {
      setBoxes(gameInfo.boxes);
      setBoxesForAllTime(gameInfo.boxesForAllTime);
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
      boxesForAllTime,
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
    }
  };

  const calcBoxesAndMoney = () => {
    // calc produced boxes by workers:
    let boxesCalc = round(boxes + workers);

    // calc boxes if sellers can sell it:
    if (sellers > 0 && sellers <= boxes) {
      boxesCalc = round(boxesCalc - sellers);
    }

    // save boxes to state
    setBoxes(boxesCalc);
    setBoxesForAllTime((boxes) => boxes + workers);

    // calculate the money by sold boxes
    if (sellers > 0 && sellers <= boxes) {
      let newMoney = round(money + boxPrice * sellers);

      setMoney(newMoney);
    }
  };

  const notifyOnAchievments = () => {
    const checkBoxesCount = (minBoxesCount) => {
      const maxBoxesCount = minBoxesCount * 1.2;

      return boxesForAllTime > minBoxesCount && boxesForAllTime < maxBoxesCount;
    };

    if (checkBoxesCount(10)) {
      notify("Wow, you produced 10 boxes! Keep it up!", "10boxes");
    } else if (checkBoxesCount(50)) {
      notify("Wow, you produced 50 boxes! Keep it up!", "50boxes");
    } else if (checkBoxesCount(100)) {
      notify("Wow, you produced 100 boxes! Keep it up!", "100boxes");
    } else if (checkBoxesCount(500)) {
      notify("Wow, you produced 500 boxes! Keep it up!", "500boxes");
    } else if (checkBoxesCount(1000)) {
      notify("Wow, you produced 1000 boxes! Keep it up!", "1000boxes");
    }
  };

  const gameEngine = () => {
    if (workers || sellers) {
      calcBoxesAndMoney();
    }

    notifyOnAchievments();
    saveGameStateToLS();
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

  useEffect(() => {
    const id = setInterval(gameEngine, 100);
    return () => clearInterval(id);
  }, [sellers, workers, boxes, money]);

  const canSellBox = boxes <= 0;

  const canHireWorker = workerPrice <= money;
  const canHireSeller = sellerPrice <= money;

  const clearLS = () => {
    localStorage.removeItem("boxOfficeState");
  };

  return (
    <div className="app">
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

        <p>Box price: ${boxPrice}$</p>
        <p>Boxes produced for all time: {boxesForAllTime}</p>

        <div>
          <h2>Improvements</h2>

          <div>
            <button disabled={!canHireWorker} onClick={hireWorker}>
              Hire worker ({workerPrice}$)
            </button>
            <button disabled={!canHireSeller} onClick={hireSeller}>
              Hire seller ({sellerPrice}$)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
