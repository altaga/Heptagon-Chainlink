import React, { Component } from 'react';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { Button, Input } from 'reactstrap';
import reactAutobind from 'react-autobind';

function epsilonRound(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
}

const generator = require('creditcard-generator')

function randomNumber(min, max, check = false) {
    if (check) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num < 10) {
            num = "0" + num;
        }
        return num
    }
    else {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        if (num < 10) {
            num = "00" + num;
        }
        else if (num < 100) {
            num = "0" + num;
        }
        return num;
    }
}

class Cash extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cvc: '',
            expiry: '',
            focus: "number",
            name: ' ',
            number: '',
            show: true,
            text: "Show cvc ",
            icon: <VisibilityIcon />,
            redirect_url: "",
            amount: "",
            transferNumber: "",
            loading: false,
            loading2: false,
        }
        this.axios = require('axios');
        reactAutobind(this);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    createSpeiTransfer() {
        this.setState({
            loading: true
        })
        this.axios({
            method: 'get',
            url: 'XXXXXXXXXXXXXXX/create-banktransfer',
            headers: {
                'amount': this.state.amount,
            }
        })
            .then((response) => {
                console.log(response.data.data.redirect_url);
                this.setState({
                    redirect_url: response.data.data.redirect_url,
                    creating: false,
                    loading: false
                });
            })
    }

    issueCard() {
        this.setState({
            loading2: true
        })
        var config = {
            method: 'get',
            url: 'https://XXXXXXXXXXXXXXX',
            headers: {
                'ewallet': "ewallet_39c38f3c402027b5c86624c3af7d652a"
            }
        };
        this.axios(config)
            .then((response) => {
                config = {
                    method: 'get',
                    url: 'https://XXXXXXXXXXXXXXX/card-issue',
                    headers: {
                        //'ewallet_contact': this.props.ewallet,
                        'ewallet_contact': response.data.data.contacts.data[0].id
                    }
                };
                this.axios(config)
                    .then((response) => {
                        this.setState({
                            number: generator.GenCC("VISA")[0],
                            expiry: randomNumber(1, 12, true) + "/" + randomNumber(25, 26, true),
                            cvc: randomNumber(0, 999).toString(),
                            loading2: false
                        })
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
    }

    showCard() {
        if (this.state.show) {
            this.setState({
                show: !this.state.show,
                text: "Hide cvc ",
                icon: <VisibilityOffIcon />,
                focus: "cvc"
            })
        }
        else {
            this.setState({
                show: !this.state.show,
                text: "Show  cvc",
                icon: <VisibilityIcon />,
                focus: "number"
            })
        }
    }

    render() {
        return (
            <div style={{
                paddingTop: "10px",
            }}>
                <div style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                }}>
                    Virtual Card:
                </div>
                {
                    this.state.cvc !== "" ?
                        <>
                            <Cards
                                style={{ cursor: 'pointer' }}
                                cvc={this.state.cvc}
                                expiry={this.state.expiry}
                                focused={this.state.focus}
                                name={this.state.name}
                                number={this.state.number}
                            />
                            <div><br /><button
                                className='roundButton'
                                style={{ fontSize: "1.5rem", height: "7vh", width: "80vw" }} onClick={() => this.showCard()}>{this.state.text}{this.state.icon} </button></div>
                            <hr />
                        </>
                        :
                        <>
                            <div>
                                <br />
                                <button
                                    className='roundButton'
                                    disabled={this.state.loading2}
                                    style={{ fontSize: "1.5rem", height: "7vh", width: "80vw" }} onClick={() => this.issueCard()}> Issue Card</button>
                            </div>
                            <br />
                            <hr />
                        </>
                }
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}>
                    <div style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        paddingBottom: "10px",
                    }}>
                        Transfer Money:
                    </div>
                    <div>
                        <Input
                            disabled={this.state.loading}
                            style={{
                                width: '80vw',
                                height: '50px',
                                borderRadius: '25px',
                                border: '2px solid #8345e6',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: 'black',
                                marginTop: '10px',
                                marginBottom: '10px',
                                textAlign: 'center',
                            }} type="number" name="amount" id="amount" placeholder="Amount"
                            value={this.state.amount}
                            onChange={(e) =>
                                this.setState({ amount: epsilonRound(parseFloat(e.target.value)) })
                            } />
                    </div>
                    <br />
                    <div>
                        <button
                            className='roundButton'
                            disabled={this.state.loading}
                            style={{ fontSize: "1.5rem", height: "7vh", width: "80vw" }} onClick={() => this.state.redirect_url === "" ? this.createSpeiTransfer() : window.open(this.state.redirect_url)}>
                            {
                                this.state.redirect_url !== "" ? "Pay" : "Transfer"
                            }
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Cash;