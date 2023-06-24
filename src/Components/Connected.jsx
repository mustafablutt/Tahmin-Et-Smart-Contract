import React from "react";

const Connected = (props) => {
    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask</h1>
            <p className="connected-account">Metamask Account: {props.account}</p>
            <p className="connected-account">Remaining Time: {props.remainingTime}</p>
            { props.showButton ? (
                <p className="connected-account">You have already voted</p>
            ) : (
                <div>
                    
                    <input type="number" value={props.number} onChange={props.handleNumberChange} placeholder="Senet İndexi: " />
                    <input type="number" value={props.buyShares} onChange={props.handleBuySharesChange} placeholder="Almak İstediğiniz Senet Sayısı: " />   
            <button className="login-button" onClick={props.buySharesFunction} >Satın Al</button>
                </div>
            )}
            
            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Senet Numarası</th>
                    <th>Senet İsmi</th>
                    <th>Senet Sayısı</th>
                </tr>
                </thead>
                <tbody>
                {props.stocks.map((stock, index) => (
                    <tr key={index}>
                    <td>{stock.index}</td>
                    <td>{stock.name}</td>
                    <td>{stock.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
        </div>
    )
}

export default Connected;