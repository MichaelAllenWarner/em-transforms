const round = (n: number, fractionDigits: number = 10) =>
  parseFloat(n.toFixed(fractionDigits));

export default round;
