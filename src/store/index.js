import { createStore } from 'vuex'

const ethers = require('ethers')
const provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/D7HCbcClU0Rk_SOco6-Xbw_orW1G_zmt')

// web3 - npm version 1.8.2
const Web3 = require('web3')
const web3 = new Web3('wss://eth-goerli.g.alchemy.com/v2/XruToWBXmylHCyWPYvePYpPW7r_rmbWs')

import {multisigABI} from "@/contracts/Multisig_sol_Multisig.abi.js"
import {targetABI} from "@/contracts/target_sol_Target.abi.js"

export default createStore({
    state: {
        provider: {},
        address: "",
        chain: "",
        chainId: "",
        admins: ["0xfcF7869A1b7f8ED480E1C9Dc5b4C83F93D5C18DC", "0xfFcEA03599abBAE1409519a8D7cfae56fa4f3D0b"],
        admin: false,
        multisigAddress: "0xa895315Ca9e90aBffC2670F049cf099247a38133",
        multisig: {},
        //targetAddress: "0xf86cF5825AB32780b297611C323CB1e4f1d7C956",
        //target: {},
        message: {},
        newMessage: false,
        enoughtSignatures: false
    },
    getters: {
    },
    mutations: {
        addBlock(state, newBlock){
            state.blocks.unshift(newBlock)
        }
    },
    actions: {
        async connectionWallet({state}){
            // проверяем, что есть метамаск и подключаем его
            if (typeof window.ethereum !== 'undefined') {
                console.log("Ethereum client installed!")
                if (ethereum.isMetaMask === true) {
                    console.log("Metamask installed")
                    if (ethereum.isConnected() !== true) {
                        console.log("Metamask is not conneted!")
                        await ethereum.enable()
                    }
                    console.log("Metamask connected!")
                }
                else{
                    alert("Metamask is not installed!")
                }
            }
            else{
                alert("Etherium client is not installed!")
            }
            // подключаем аккаунт
            await ethereum.request({method: "eth_requestAccounts"})
            .then(accounts => {
                state.address = ethers.utils.getAddress(accounts[0])
                if (state.admins.includes(state.address)) {
                    state.admin = true
                } else {
                    state.admin = false
                }
                console.log(`Account ${state.address} connected`)
            })
            // создаём провайдера
            state.provider = new ethers.providers.Web3Provider(ethereum)
            // получаем параметры сети
            // let network = await state.provider.getNetwork()

            state.chainId = await window.ethereum.request({ method: 'eth_chainId' });
            // state.chain = network.name

            // подписка на изменение аккаунта
            ethereum.on('accountsChanged', (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0])
                console.log(`Accounts changed to ${state.address}`)
                if (state.admins.includes(state.address)) {
                    state.admin = true
                } else {
                    state.admin = false
                }
            })

            // подписка на изменение сети
            ethereum.on('chainChanged', async (chainId) => {
                state.provider = new ethers.providers.Web3Provider(ethereum)
                // получаем параметры сети
                let network = await state.provider.getNetwork()
                state.chainId = network.chainId
                state.chain = network.name
                console.log(`ChainId changed to ${state.chainId}`)
                console.log(`Chain changed to ${state.chain}`)
            })
        },
        async newMessage({state}, args){
            const [targetAddress, functionName, functionArgs] = args
            // Собираем сигнатуру целевой функции
            let functionSignature = "function " + functionName + "("
            for(let i = 0; i <functionArgs.types.length; i++){
                functionSignature += functionArgs.types[i] + ", "
            }
            functionSignature = functionSignature.slice(0, -2) + ")"
            console.log("functionSignature: ", functionSignature)

            // Собираем интерефейс целевого контракта
            const iTarget = new ethers.utils.Interface([functionSignature])
            console.log("iTarget: ", iTarget)

            // Собираем calldata
            const payload = iTarget.encodeFunctionData(functionName, functionArgs.args)
            console.log("payload: ", payload)

            // Получаем nonce
            // Для начала получили провайдера и инстанс контракта
            const provider = ethers.getDefaultProvider(ethers.BigNumber.from(state.chainId).toNumber())
            state.multisig = new ethers.Contract(state.multisigAddress, multisigABI, provider)
            // nonce
            const nonce = await state.multisig.nonce()
            console.log("nonce: ", nonce)

            // Начинаем собирать сообщение
            const message = ethers.utils.arrayify(ethers.utils.solidityPack(
                ["uint256", "address", "address", "bytes"],
                [nonce, state.multisigAddress, targetAddress, payload]
            ))

            //Подписант из metamask
            const signer = state.provider.getSigner()
            console.log("signer: ", signer)

            // Подписываем сообщение
            const rawSignature = await signer.signMessage(message)

            // Вытаскиваем непосредственно саму подпись
            const signature = ethers.utils.splitSignature(rawSignature)

            // Вытаскиваем v r s и добавляем структуру с масивами
            let signatures = {
                v: [signature.v], 
                r: [signature.r], 
                s: [signature.s]}

            // Сохраняем параметры сообщения на подпись
            state.message = {
                targetAddress: targetAddress,
                functionName: functionName,
                functionArgs: functionArgs,
                nonce: nonce,
                payload: payload,
                message: message,
                signers: [state.address],
                signatures: signatures
            }

            // Говорим что есть новое сообщение
            state.newMessage = true
            console.log("state.newMessage: ", state.newMessage)

        },
        async signMessage({state}){
            //Подписант из metamask
            const signer = state.provider.getSigner()
            console.log("signer: ", signer)

            // Подписываем сообщение
            const rawSignature = await signer.signMessage(state.message.message)

            // Вытаскиваем непосредственно саму подпись
            const signature = ethers.utils.splitSignature(rawSignature)

            // Добавляем его подписи к уже имеющимся
            state.message.signatures.v.push(signature.v)
            state.message.signatures.r.push(signature.r)
            state.message.signatures.s.push(signature.s)
            state.message.signers.push(state.address)

            console.log("New sign: ", state.address)
            console.log("Sign count: ", state.message.signers.length)

            if (state.message.signers.length > state.admins.length / 2) {
                console.log("Enough signatures")
                state.enoughtSignatures = true
            }
        },
        async sendMessage({state}){
            const iMultisig = new ethers.utils.Interface(multisigABI)

            // Собираем calldata для функции verify
            const data = iMultisig.encodeFunctionData("verify",
            [
                state.message.nonce,
                state.message.targetAddress,
                state.message.payload,
                state.message.signatures.v,
                state.message.signatures.r,
                state.message.signatures.s,
            ])
            // Отправляем транзакцию
            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.multisigAddress,
                    data: data
                }]
            })
            console.log("txHash:", txHash)
            // Ждём квитанцию
            const provider = ethers.getDefaultProvider(ethers.BigNumber.from(state.chainId).toNumber())
            const receipt = await provider.waitForTransaction(txHash)
            console.log("receipt", receipt)

            const target = new ethers.Contract(state.message.targetAddress, targetABI, provider)
            const number = await target.number()
            console.log("number: ", number)

            state.newMessage = false
            state.enoughtSignatures = false
        }
    },
    modules: {
    }
    })
