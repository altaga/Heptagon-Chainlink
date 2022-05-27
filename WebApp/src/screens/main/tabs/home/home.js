import React, { Component } from 'react';
import { Button, Col, Row } from 'reactstrap';
import Crypto from './components/crypto';
import Fiat from './components/fiat';
import Verify from './components/verify';
import NFT from './components/nft';
import ContextModule from '../../../../utils/contextModule';
import { networks, processNFT } from './components/utils/networks';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selector: 0,
            nft: [],
        };
    }

    static contextType = ContextModule;

    async componentDidMount() {
        let res = await networks[80001].getNFT(this.context.value.cryptoaddress.address)
        let nfts = await processNFT(res, this.context.value.cryptoaddress)
        this.setState({
            nft: nfts
        })
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <div style={{ paddingTop: "16px" }} >
                <Row md="1">
                    <Col xs="12">
                        <button className='roundButton' style={{ width: "90vw", fontSize: "1.5rem", fontWeight: "bolder", height:"7vh" }} onClick={() => {
                            if (this.state.selector === 1) {
                                this.setState({
                                    selector: 0
                                })
                            }
                            else {
                                this.setState({
                                    selector: 1
                                })
                            }
                        }}>
                            Fiat Account
                        </button>
                        <div
                            hidden={this.state.selector !== 1}
                            style={{
                                marginTop: "5px",
                                maxHeight: "71.8vh",
                            }}>
                            <Fiat />
                        </div>
                    </Col>
                    <div style={{ paddingTop: "4px" }} />
                    <Col xs="12">
                        <button  className='roundButton' style={{ width: "90vw", fontSize: "1.5rem", fontWeight: "bolder" , height:"7vh" }} onClick={() => {
                            if (this.state.selector === 2) {
                                this.setState({
                                    selector: 0
                                })
                            }
                            else {
                                this.setState({
                                    selector: 2
                                })
                            }
                        }}>
                            Crypto Account
                        </button>
                        <div
                            hidden={this.state.selector !== 2}
                            style={{
                                marginTop: "5px",
                                maxHeight: "64vh",
                            }}>
                            <Crypto />
                        </div>
                    </Col>
                    {
                        this.state.nft.length > 0 &&
                        <>
                            <div style={{ paddingTop: "4px" }} />
                            <Col xs="12">
                                <button  className='roundButton' style={{ width: "90vw", fontSize: "1.5rem", fontWeight: "bolder" , height:"7vh" }} onClick={() => {
                                    if (this.state.selector === 4) {
                                        this.setState({
                                            selector: 0
                                        })
                                    }
                                    else {
                                        this.setState({
                                            selector: 4
                                        })
                                    }
                                }}>
                                    NFT Collection
                                </button>
                                <div
                                    hidden={this.state.selector !== 4}
                                    style={{
                                        marginTop: "5px",
                                        maxHeight: "56.4vh",
                                    }}>
                                    <NFT nft={this.state.nft} />
                                </div>
                            </Col>
                        </>
                    }
                    <div style={{ paddingTop: "4px" }} />
                    <Col xs="12">
                        <button  className='roundButton' style={{ width: "90vw", fontSize: "1.5rem", fontWeight: "bolder" , height:"7vh" }} onClick={() => {
                            if (this.state.selector === 3) {
                                this.setState({
                                    selector: 0
                                })
                            }
                            else {
                                this.setState({
                                    selector: 3
                                })
                            }
                        }}>
                            Verify
                        </button>
                        <div
                            hidden={this.state.selector !== 3}
                            style={{
                                marginTop: "5px",
                                maxHeight: "56.4vh",
                            }}>
                            <Verify />
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Home;