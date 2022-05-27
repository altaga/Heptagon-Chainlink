import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import { Card, CardBody, CardHeader, Col, Row, Button, ButtonGroup } from 'reactstrap';
import Cash from './tabs/cash/cash';
import Home from './tabs/home/home';
import Swap from './tabs/swap/swap';
import ContextModule from '../../utils/contextModule';
import logo from '../../assets/img/logo.png';
import MyModal from './modal/myModal';
import Feeds from './tabs/feed/feeds';
import HomeIcon from '@mui/icons-material/Home';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import MoneyIcon from '@mui/icons-material/Money';

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selector: 4,
        };
        reactAutobind(this);
    }

    static contextType = ContextModule;

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    nftCallback(value) {
        this.context.setValue({
            nft: value
        })
    }

    render() {
        const style1 = {
            borderRadius: '25px 25px 0px 0px',
            backgroundColor: '#8345e6',
            fontSize: '20px',
            fontWeight: 'bold',
        }
        const style2 = {
            border: '2px solid #8345e6',
            borderRadius: '25px 25px 0px 0px',
            backgroundColor: '#ffffff',
            color: 'black',
            fontSize: '20px',
            fontWeight: 'bold',
        }
        return (
            <div>
                <div className='header' style={{
                    borderBottom: '2px solid #8345e6',
                }}>
                    <Row md="3" style={{ paddingTop: "2vh" }}>
                        <Col xs="4">
                            <img src={logo} alt="logo" style={{ height: "6vh" }} />
                        </Col>
                        <Col xs="4" style={{ paddingTop: "0.5vh" }}>
                            <MyModal />
                        </Col>
                        <Col xs="4">
                            <Button id="logoutButton" className='roundButton' style={{ width: "90%", fontWeight: "bolder" }} onClick={() => {
                                this.context.setValue({
                                    ewallet: "",
                                    cryptowallet: "",
                                    cryptoaddress: "",
                                    page: 1
                                });
                            }}>
                                Logout
                            </Button>
                        </Col>
                    </Row>
                </div>
                <div className='body'>
                    {
                        this.state.selector === 1 &&
                        <Home nft={this.context.value.nft} />
                    }
                    {
                        this.state.selector === 2 &&
                        <Swap ewallet={this.context.value.ewallet} />
                    }
                    {
                        this.state.selector === 3 &&
                        <Cash ewallet={this.context.value.ewallet} />
                    }
                    {
                        this.state.selector === 4 &&
                        <Feeds />
                    }
                </div>
                <div className='footer'>
                    <ButtonGroup style={{
                        width: '100%',
                        height: '8vh',
                    }}>
                        <Button style={
                            this.state.selector !== 4 ? style1 : style2
                        } onClick={() => this.setState({ selector: 4 })}>
                            <Row md="1">
                                <Col xs="12" style={{
                                    marginTop: "-0.5vh"
                                }}>
                                    <HomeIcon />
                                </Col>
                                <Col xs="12" style={{
                                    marginTop: "-1vh"
                                }}>
                                    <span style={{
                                        fontSize: '1rem',
                                    }}>
                                        Home
                                    </span>
                                </Col>
                            </Row>
                        </Button>
                        <Button style={
                            this.state.selector !== 1 ? style1 : style2
                        }
                            onClick={() => this.setState({ selector: 1 })}
                        >
                            <Row md="1">
                                <Col xs="12" style={{
                                    marginTop: "-0.5vh"
                                }}>
                                    <SwitchAccountIcon />
                                </Col>
                                <Col xs="12" style={{
                                    marginTop: "-1vh"
                                }}>
                                    <span style={{
                                        fontSize: '1rem',
                                    }}>
                                        Accounts
                                    </span>
                                </Col>
                            </Row>
                        </Button>
                        <Button style={
                            this.state.selector !== 2 ? style1 : style2
                        } onClick={() => this.setState({ selector: 2 })}>
                            <Row md="1">
                                <Col xs="12" style={{
                                    marginTop: "-0.5vh"
                                }}>
                                    <SwapVertIcon />
                                </Col>
                                <Col xs="12" style={{
                                    marginTop: "-1vh"
                                }}>
                                    <span style={{
                                        fontSize: '1rem',
                                    }}>
                                        Swap
                                    </span>
                                </Col>
                            </Row>
                        </Button>
                        <Button style={
                            this.state.selector !== 3 ? style1 : style2
                        } onClick={() => this.setState({ selector: 3 })}>
                            <Row md="1">
                                <Col xs="12" style={{
                                    marginTop: "-0.5vh"
                                }}>
                                    <MoneyIcon />
                                </Col>
                                <Col xs="12" style={{
                                    marginTop: "-1vh"
                                }}>
                                    <span style={{
                                        fontSize: '1rem',
                                    }}>
                                        Cash Out
                                    </span>
                                </Col>
                            </Row>
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        );
    }
}

export default Main;