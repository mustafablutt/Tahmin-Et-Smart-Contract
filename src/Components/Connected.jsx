import React from "react";

const Connected = (props) => {
  const sortedStocks = [...props.stocks].sort(
    (a, b) => b.stockCount - a.stockCount
  );

  return (
    <div className="connected-container">
      <h1 className="connected-header">{props.title}</h1>
      <p className="connected-account">Metamask Hesabın: {props.account}</p>
      <p className="connected-account">Marketin Kapanmasına: {props.remainingTime}</p>

      <div>
        <input
          type="number"
          value={props.number}
          onChange={props.handleNumberChange}
          placeholder="Senet İndexi: "
        />
        <br/>
        <input
          type="number"
          value={props.buyShares}
          onChange={props.handleBuySharesChange}
          placeholder="Almak İstediğiniz Senet Sayısı: "
        />
         <br/>
        <button className="login-button" onClick={props.buySharesFunction}>
          Satın Al
        </button>
      </div>

      <table id="myTable" className="candidates-table">
        <thead>
          <tr>
            <th>Senet Numarası</th>
            <th>Senet İsmi</th>
            <th>Senet Sayısı</th>
          </tr>
        </thead>
        <tbody>
          {sortedStocks.map((stock, index) => (
            <tr key={index}>
              <td>{stock.index}</td>
              <td>{stock.name}</td>
              <td>{stock.stockCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Connected;
