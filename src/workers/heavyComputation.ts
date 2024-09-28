// Web Worker for heavy computations
self.onmessage = (event) => {
  const result = performHeavyComputation(event.data);
  self.postMessage(result);
};

function performHeavyComputation(input: number): number {
  // Simulate a heavy computation
  let result = input;
  for (let i = 0; i < 1000000; i++) {
    result = Math.sqrt(result * i);
  }
  return result;
}
