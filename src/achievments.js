const LS_NAME = "boxOfficeAchievments";

const ACHIEVMENTS_LIST = {
  produced: [
    {
      boxes: 10,
      reward: 1,
    },
    { boxes: 200, reward: 5 },
    { boxes: 1000, reward: 10 },
    { boxes: 5000, reward: 20 },
    { boxes: 20000, reward: 50 },
    { boxes: 50000, reward: 100 },
  ],
  sold: [
    {
      boxes: 10,
      reward: 1,
    },
    { boxes: 200, reward: 5 },
    { boxes: 1000, reward: 10 },
    { boxes: 5000, reward: 20 },
    { boxes: 20000, reward: 50 },
    { boxes: 50000, reward: 100 },
  ],
};

export const notifyOnAchievmentsAndGiveReward = (
  boxesProducedAllTime,
  boxedSoldAllTime,
  notify,
  giveRewardToUser
) => {
  const achievmentsList = localStorage.getItem(LS_NAME);

  if (!achievmentsList) {
    localStorage.setItem(LS_NAME, JSON.stringify(ACHIEVMENTS_LIST));
  }

  const achievmentsListParsed = JSON.parse(localStorage.getItem(LS_NAME));

  const checkForAchievment = (achievmentKey) => {
    const checkBoxesCount = (minBoxesCount) => {
      const maxBoxesCount = minBoxesCount * 1.2;

      const boxesCount =
        achievmentKey === "produced" ? boxesProducedAllTime : boxedSoldAllTime;

      return boxesCount >= minBoxesCount && boxesCount <= maxBoxesCount;
    };

    const nextProducedAchievment = achievmentsListParsed[achievmentKey][0];

    console.log(achievmentsListParsed[achievmentKey][0]);

    if (checkBoxesCount(nextProducedAchievment.boxes)) {
      const achievmentId = `${achievmentKey}${nextProducedAchievment.boxes}`;

      notify(
        `Wow, you ${achievmentKey} ${nextProducedAchievment.boxes} boxes! Keep it up!`,
        achievmentId
      );
      giveRewardToUser(achievmentId, nextProducedAchievment.reward);

      achievmentsListParsed[achievmentKey].shift();

      localStorage.setItem(LS_NAME, JSON.stringify(achievmentsListParsed));
    }
  };

  checkForAchievment("produced");
  checkForAchievment("sold");
};
