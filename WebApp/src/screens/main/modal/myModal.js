import React, { Component } from 'react';
import reactAutobind from 'react-autobind';
import { Card, CardBody, CardHeader, Col, Modal, Row, Button, CardFooter, Input } from 'reactstrap';
import chat from '../../../assets/img/chat.png';
import { abi } from '../../../contract/chatContract';
import { abi2 } from '../../../contract/nftContract';
import { networks } from '../tabs/home/components/utils/networks';
import { Spinner } from 'reactstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ContextModule from '../../../utils/contextModule';

function ipfsTohtml(uri) {
    let substring = uri.substring(0, uri.lastIndexOf('/')).replace("ipfs://", 'https://')
    let substring2 = uri.substring(uri.lastIndexOf('/'), uri.length).replace("/", '.ipfs.dweb.link/')
    return substring + substring2
}

const ethers = require('ethers');

const etherTable = {
    "wei": "1",
    "kwei": "1000",
    "mwei": "1000000",
    "gwei": "1000000000",
    "szabo": "1000000000000",
    "finney": "1000000000000000",
    "ether": "1000000000000000000",
    "kether": "1000000000000000000000",
    "grand": "1000000000000000000000",
    "mether": "1000000000000000000000000",
    "gether": "1000000000000000000000000000",
    "tether": "1000000000000000000000000000000"
}

function transform(value, unit) {
    if (value === undefined || value === null) {
        return "";
    }
    let result = value.toString();
    result = result / etherTable[unit];
    return result;
}

function mergeAndSort(a, b) {
    let result = [];
    let tempA = [];
    let tempB = [];
    a.forEach(function (item) {
        let req = 0
        let delString = "";
        if (item.mess.indexOf(":req:") > -1) {
            delString = item.mess.substring(item.mess.indexOf(":req:"), item.mess.length)
            req = parseFloat(delString.replace(":req:", ""))
        }
        let json = {
            blocktime: item.blocktime,
            money: transform(item.value, "ether"),
            type: "from",
            to: item.to,
            message: item.mess.replace(delString, ""),
            req: req
        };
        tempA.push(json);
    });
    b.forEach(function (item) {
        let req = 0
        let delString = "";
        if (item.mess.indexOf(":req:") > -1) {
            delString = item.mess.substring(item.mess.indexOf(":req:"), item.mess.length)
            req = parseFloat(delString.replace(":req:", ""))
        }
        let json = {
            blocktime: item.blocktime,
            money: transform(item.value, "ether"),
            type: "to",
            to: item.to,
            message: item.mess.replace(delString, ""),
            req: req
        };
        tempB.push(json);
    });
    result = result.concat(tempA);
    result = result.concat(tempB);
    result.sort((a, b) => {
        return a.blocktime - b.blocktime;
    });
    return result;
}

class MyModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            deposit: false,
            withdraw: false,
            fiat: false,
            crypto: false,
            result: '',
            chatAddress: '',
            messageHistory: [],
            noMessage: false,
            sending: false,
            number: '',
            req: false,
            message: "",
            chatStarted: false,
            syncFlag: false,
            network: {},
            nfts: [],
            keyboardAppear: false,
            nftSelected: null,
        };
        reactAutobind(this);
        this.chatContract = null;
        this.contractsNFT = [];
        this.syncMessages = null;
        this.syncNFT = null;
    }

    static contextType = ContextModule;

    async componentDidMount() {
        this.chatContract = new ethers.Contract(networks[80001].contractAddress, abi(), this.context.value.cryptoaddress);
        let temp = await networks[80001].getNFT(this.context.value.cryptoaddress.address)
        temp.forEach((item) => {
            if (item.contractAddress !== "") {
                this.contractsNFT.push(new ethers.Contract(item.contractAddress, abi2(), this.context.value.cryptoaddress));
            }
        })
        let res = []
        let memory = []
        for (let i = 0; i < this.contractsNFT.length; i++) {
            try {
                let flag = false
                for (let j = 0; j < memory.length; j++) {
                    if (memory[j] === this.contractsNFT[i].address) {
                        flag = true
                    }
                }
                if (flag) {
                    continue
                }
                memory.push(this.contractsNFT[i].address)
                let owner = await this.contractsNFT[i].ownerOf("0");
                if (owner.toLowerCase() !== this.context.value.cryptoaddress.address.toLowerCase()) {
                    continue;
                }
                temp = await this.contractsNFT[i].tokenURI("0");
                temp = await fetch(ipfsTohtml(temp))
                temp = await temp.json()
                temp.image = ipfsTohtml(temp.image)
                temp.contract = this.contractsNFT[i]
                res.push(temp)
            }
            catch (e) { }
        }
        this.setState({
            nfts: res
        })
        this.syncNFT = setInterval(async () => {
            let temp = await networks[80001].getNFT(this.context.value.cryptoaddress.address)
            temp.forEach((item) => {
                if (item.contractAddress !== "") {
                    this.contractsNFT.push(new ethers.Contract(item.contractAddress, abi2(), this.context.value.cryptoaddress));
                }
            })
            let res = []
            let memory = []
            for (let i = 0; i < this.contractsNFT.length; i++) {
                try {
                    let flag = false
                    for (let j = 0; j < memory.length; j++) {
                        if (memory[j] === this.contractsNFT[i].address) {
                            flag = true
                        }
                    }
                    if (flag) {
                        continue
                    }
                    memory.push(this.contractsNFT[i].address)
                    let owner = await this.contractsNFT[i].ownerOf("0");
                    if (owner.toLowerCase() !== this.context.value.cryptoaddress.address.toLowerCase()) {
                        continue;
                    }
                    temp = await this.contractsNFT[i].tokenURI("0");
                    temp = await fetch(ipfsTohtml(temp))
                    temp = await temp.json()
                    temp.image = ipfsTohtml(temp.image)
                    temp.contract = this.contractsNFT[i]
                    res.push(temp)
                }
                catch (e) { }
            }
            if (this.state.nfts.length !== res.length) {
                this.setState({
                    nfts: res
                })
            }
        }, 10000)
    }

    componentWillUnmount() {
        clearInterval(this.syncMessages);
        clearInterval(this.syncNFT);
    }

    async checkMessages(account, to) {
        let messages = [];
        const messagesCounter = await this.chatContract.chatCounter(account); // Check how many messages are in the chat
        for (let i = 0; i < messagesCounter; i++) {
            let result = await this.chatContract.chatHistory(account, i)
            if (result.to.toLowerCase() === to.toLowerCase()) { // Check messages and filter them by to address
                messages.push(result);
            }
        }
        return messages;
    }
    async getAndProcessMessages(from, to) {
        let from_messages = await this.checkMessages(from, to);
        let to_messages = await this.checkMessages(to, from);
        let messages = mergeAndSort(from_messages, to_messages);
        return messages;
    }

    async startChat(from, to) {
        this.setState({
            chatStarted: true,
            syncFlag: true
        })
        this.syncMessages = setInterval(async () => {
            if (this.state.syncFlag) {
                this.setState({
                    syncFlag: false
                }, async () => {
                    let messages = await this.getAndProcessMessages(from, to);
                    if (messages.length > 0 && this.state.messageHistory.length !== messages.length) {
                        console.log("Checking messages...");
                        this.setState({
                            messageHistory: messages,
                            syncFlag: true
                        })
                    }
                    else {
                        this.setState({
                            syncFlag: true
                        })
                    }
                })
            }
        }, 1000);
    }

    async sendMessage(to, message, num) {
        let tempMessage = message;
        if (this.state.req) {
            tempMessage += ":req:" + num
        }
        this.setState({
            sending: true
        }, async () => {
            if (this.state.nftSelected ? true : false) {
                const options = { value: this.state.req ? "0" : ethers.utils.parseEther(num) }
                const transaction = await this.state.nftSelected.contract.transferFrom(this.context.value.cryptoaddress.address, to, "0");
                const result = await transaction.wait();
                tempMessage += ":nft:" + this.state.nftSelected.image + ":nft:" + ":nftcontract:" + this.state.nftSelected.contract.address + ":nftcontract:"
            }
            const options = { value: this.state.req ? "0" : ethers.utils.parseEther(num) }
            const transaction = await this.chatContract.addMessage(to, tempMessage, options)
            await transaction.wait();
            this.setState({
                sending: false,
                req: false,
                message: ""
            })
        })
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen,
        });
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.state.isOpen}>
                    <Card>
                        <CardHeader>
                            <Row md="1">
                                <Col xs="12">
                                    <button
                                        disabled={this.state.chatAddress.length !== 42}
                                        className='roundButton' style={{ width: "100%", fontSize: "1.5rem" }}
                                        onClick={() => {
                                            if (this.state.chatAddress.length === 42) {
                                                if (!this.state.chatStarted) {
                                                    this.setState({
                                                        chatStarted: true,
                                                    }, async () => {
                                                        await this.startChat(this.context.value.cryptoaddress.address, this.state.chatAddress)
                                                    })
                                                }
                                                else {
                                                    clearInterval(this.syncMessages);
                                                    this.setState({
                                                        isOpen: false,
                                                        chatAddress: "",
                                                        messageHistory: [],
                                                        noMessage: false,
                                                        sending: false,
                                                        number: 0,
                                                        req: false,
                                                        message: "",
                                                        chatStarted: false,
                                                        syncFlag: false,
                                                        nftSelected: null,
                                                    })
                                                }
                                            }
                                        }}>
                                        {
                                            this.state.chatStarted ? "Close" : "Start Chat"
                                        }
                                    </button>
                                </Col>
                            </Row>
                        </CardHeader>
                        {
                            !this.state.chatStarted &&
                            <>
                                <CardBody>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Input type="text" placeholder="Enter your address"
                                            style={{
                                                borderRadius: "25px",
                                                border: "2px solid #0d6efd",
                                                fontSize: "1.5rem",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                            }}
                                            value={this.state.chatAddress}
                                            onChange={(e) =>
                                                this.setState({
                                                    chatAddress: e.target.value,
                                                })
                                            } />
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <button className='roundButton' style={{ width: "100%", fontSize: "1.5rem" }} onClick={() => this.toggle()}>
                                        Close
                                    </button>
                                </CardFooter>
                            </>
                        }
                        {
                            this.state.chatStarted &&
                            <>
                                <CardBody style={
                                    {
                                        maxHeight: this.state.keyboardAppear ? "20vh" : "50vh",
                                        overflowY: "scroll",
                                        overflowX: "hidden",
                                    }
                                }>
                                    {
                                        this.state.messageHistory.map((message, index) => {
                                            let check = message.message
                                            let nft = ""
                                            let nftcontract = ""
                                            if (check.includes(":nft:")) {
                                                check = check.split(":nft:")[0]
                                                nft = message.message.split(":nft:")[1]
                                                nftcontract = message.message.split(":nftcontract:")[1]
                                            }
                                            return (
                                                <div
                                                    key={"Message" + index}
                                                    style={{
                                                        contentAlign: "right",
                                                        display: "flex",
                                                        justifyContent: message.type === "from" ? "flex-end" : "flex-start",
                                                        alignItems: "center",
                                                        textAlign: "left",
                                                        paddingBottom: "10px",
                                                    }}>
                                                    <Card
                                                        color={message.type === "from" ? "primary" : ""}
                                                        style={{
                                                            width: "80%",
                                                            color: message.type === "from" ? "white" : "black",
                                                            border: check !== "" ? "1px solid black" : "",
                                                        }}>
                                                        {
                                                            check !== "" &&
                                                            <CardBody
                                                                style={{
                                                                    borderBottom: parseFloat(message.money) > 0 ? "1px solid black" : "",
                                                                    backgroundColor: message.type === "from" ? "#8345e6" : "white",
                                                                }}
                                                            >
                                                                {
                                                                    check
                                                                }
                                                            </CardBody>
                                                        }
                                                        {
                                                            nft !== "" &&
                                                            <CardBody
                                                                style={{
                                                                    borderBottom: "1px solid black",
                                                                    backgroundColor: message.type === "from" ? "#8345e6" : "white",
                                                                }}
                                                            >
                                                                <LazyLoadImage
                                                                    key={"NFTimage" + index}
                                                                    alt={"NFTimage" + index}
                                                                    height={"auto"}
                                                                    width={"100%"}
                                                                    src={nft}
                                                                    placeholder={<Spinner style={{ width: "5rem", height: "5rem" }} />}
                                                                />
                                                            </CardBody>
                                                        }
                                                        <div hidden={!(parseFloat(message.money) > 0)}>
                                                            <CardFooter
                                                                style={{
                                                                    backgroundColor: message.type === "from" ? "#6536b3" : "#d9d9d9",
                                                                }}
                                                            >
                                                                {
                                                                    message.money
                                                                }
                                                                {
                                                                    <img src={networks[80001].icon} style={{
                                                                        width: "20px",
                                                                        height: "20px",
                                                                        marginLeft: "10px",
                                                                        marginRight: "10px",
                                                                    }} />
                                                                }
                                                            </CardFooter>
                                                        </div>
                                                    </Card>
                                                </div>
                                            )
                                        })
                                    }
                                </CardBody>
                                <CardFooter>
                                    <div style={{
                                        paddingBottom: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Input type="text" placeholder="Message"
                                            style={{
                                                borderRadius: "25px",
                                                border: "2px solid #0d6efd",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "70%",
                                            }}
                                            value={this.state.message}
                                            onChange={(e) =>
                                                this.setState({
                                                    message: e.target.value,
                                                })
                                            }
                                            onFocus={() => {
                                                this.setState({
                                                    keyboardAppear: true,
                                                })
                                            }}
                                            onBlur={() => {
                                                this.setState({
                                                    keyboardAppear: false,
                                                })
                                            }}
                                        />
                                        <Input type="number" placeholder="Amount"
                                            style={{
                                                borderRadius: "25px",
                                                border: "2px solid #0d6efd",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "30%",
                                            }}
                                            value={this.state.number}
                                            onChange={(e) =>
                                                this.setState({
                                                    number: e.target.value,
                                                })
                                            }
                                            onFocus={() => {
                                                this.setState({
                                                    keyboardAppear: true,
                                                })
                                            }}
                                            onBlur={() => {
                                                this.setState({
                                                    keyboardAppear: false,
                                                })
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        paddingBottom: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}>
                                        <Input type="select"
                                            style={{
                                                borderRadius: "25px",
                                                border: "2px solid #0d6efd",
                                                fontSize: "1rem",
                                                fontWeight: "bold",
                                                textAlign: "center",
                                                width: "100%",
                                            }}
                                            onChange={(e) =>
                                                this.setState({
                                                    nftSelected: this.state.nfts[e.target.value],
                                                })
                                            }
                                            defaultValue={"Select"}
                                            onFocus={() => {
                                                this.setState({
                                                    keyboardAppear: true,
                                                })
                                            }}
                                            onBlur={() => {
                                                this.setState({
                                                    keyboardAppear: false,
                                                })
                                            }}
                                        >
                                            <option disabled value="Select">Select</option>
                                            {
                                                this.state.nfts.map((nft, index) => {
                                                    return (
                                                        <option key={"NFT" + index} value={index}>{nft.name}</option>
                                                    )
                                                })
                                            }
                                        </Input>
                                    </div>
                                    <button
                                        disabled={this.state.sending}
                                        className='roundButton' style={{ width: "100%", fontSize: "1.5rem" }} onClick={() => this.sendMessage(this.state.chatAddress, this.state.message, parseFloat(this.state.number) > 0 ? this.state.number.toString() : "0")}>
                                        Send
                                    </button>
                                </CardFooter>
                            </>
                        }
                    </Card>
                </Modal>
                <img src={chat} alt="logo" style={{ height: "6vh" }} onClick={() => this.toggle()} />
            </div>
        );
    }
}

export default MyModal;