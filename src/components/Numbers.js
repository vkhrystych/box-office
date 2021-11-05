const Numbers = ({ boxes, money, workers, sellers }) => (
  <section className="numbers">
    <div className="numbers-card">
      <span className="numbers-count">{boxes}</span>
      <span className="numbers-title">boxes in warehouse</span>
    </div>
    <div className="numbers-card">
      <span className="numbers-count">{money.toFixed(2)}$</span>
      <span className="numbers-title">money</span>
    </div>
    <div className="numbers-card">
      <span className="numbers-count">{workers}</span>
      <span className="numbers-title">workers</span>
    </div>
    <div className="numbers-card">
      <span className="numbers-count">{sellers}</span>
      <span className="numbers-title">sellers</span>
    </div>
  </section>
);

export default Numbers;
