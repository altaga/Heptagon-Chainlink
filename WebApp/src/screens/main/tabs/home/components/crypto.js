import React, { Component } from 'react';
import Ctransactions from './utils/cryptotransactions';
import ContextModule from '../../../../../utils/contextModule';
import { networks } from "./utils/networks";

function epsilonRound(num) {
    const zeros = 6;
    return Math.round((num + Number.EPSILON) * Math.pow(10, zeros)) / Math.pow(10, zeros)
}

class Crypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            account: "",
            provider: "",
            transactions: []
        };
        this.axios = require('axios');
    }

    static contextType = ContextModule;

    async componentDidMount() {
        var config = {
            method: 'get',
            url: `https://deep-index.moralis.io/api/v2/${this.context.value.cryptoaddress.address}/balance?chain=mumbai`,
            headers: {
                'accept': 'application/json',
                'X-API-Key': 'xxxxxxxxxxxxxxxxxx'
            }
        };
        this.axios(config)
            .then((response) => {
                this.context.setValue({ cryptobalance: response.data.balance / 1000000000000000000 });
            })
            .catch((error) => {
                console.log(error);
            });
        let transactions = await networks[80001].getTransactions(this.context.value.cryptoaddress.address);
        this.setState({ transactions });
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div style={{
                height: '100%',
                fontSize: '1.4em',
                paddingBottom: '10px',
            }}>
                <div>
                    <a
                        href={`${this.state.provider.explorer}address/${this.state.account}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {"\n" + this.state.account.substring(0, 21) + "\n" + this.state.account.substring(21, 42)}
                    </a>
                </div>
                <div>
                    Network :
                    <span style={{
                        color: "purple"
                    }}>
                        {" "}{"Polygon Mumbai"}
                    </span>
                </div>
                <div>
                    Balance:{" "} {epsilonRound(this.context.value.cryptobalance)}{" "} &nbsp;
                    {
                        this.state.provider.icon && <img src={this.state.provider.icon} alt="icon" width="30px"></img>
                    }
                </div>
                <hr />
                <div style={{ paddingBottom: "10px" }}>
                    Transactions:
                </div>
                <div>
                    <Ctransactions transactions={this.state.transactions} />
                </div>
            </div>
        );
    }
}

export default Crypto;