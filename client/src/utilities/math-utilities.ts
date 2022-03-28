function roundNumber(number: number, digits: number): number {
  return (
    Math.round((number + Number.EPSILON) * Math.pow(10, digits)) /
    Math.pow(10, digits)
  );
}

export { roundNumber };
