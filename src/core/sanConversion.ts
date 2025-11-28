const sanConversions = {
  white: {
    N: "♘",
    B: "♗",
    R: "♖",
    Q: "♕",
    K: "♔",
  },
  black: {
    N: "♞",
    B: "♝",
    R: "♜",
    Q: "♛",
    K: "♚",
  },
};

const pieceRegex = /[NBRQK]/;

function convertSanToFan(san: string, isWhiteMove: boolean) {
  const colorIndex = isWhiteMove ? "white" : "black";
  return san.replace(pieceRegex, (match) => {
    const innerMap = sanConversions[colorIndex];
    return innerMap[match as keyof typeof innerMap];
  });
}

export default convertSanToFan;
