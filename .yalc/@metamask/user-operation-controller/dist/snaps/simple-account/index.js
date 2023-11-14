"use strict";
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable n/no-process-env */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
const utils_1 = require("@metamask/utils");
const logger_1 = require("../../logger");
const SimpleAccount_1 = require("./SimpleAccount");
const VerifyingPaymaster_1 = require("./VerifyingPaymaster");
const log = (0, utils_1.createModuleLogger)(logger_1.projectLogger, 'simple-account-snap');
const onUserOperationRequest = (request) => __awaiter(void 0, void 0, void 0, function* () {
    log('Received user operation request');
    const { data, ethereum, to, value } = request;
    const provider = new providers_1.Web3Provider(ethereum);
    const potentialInitCode = (0, SimpleAccount_1.getInitCode)(process.env.SIMPLE_ACCOUNT_OWNER, process.env.SIMPLE_ACCOUNT_SALT);
    const sender = yield (0, SimpleAccount_1.getSender)(potentialInitCode, provider);
    const callData = (0, SimpleAccount_1.getCallData)(to, value, data, sender);
    const code = yield provider.getCode(sender);
    const isDeployed = Boolean(code) && code !== '0x';
    const initCode = isDeployed ? '0x' : potentialInitCode;
    const nonce = yield (0, SimpleAccount_1.getNonce)(sender, isDeployed, provider);
    return {
        callData,
        initCode,
        nonce,
        sender,
    };
});
const onPaymasterRequest = (request) => __awaiter(void 0, void 0, void 0, function* () {
    log('Received paymaster request', process.env.SIMPLE_ACCOUNT_OWNER, process.env.SIMPLE_ACCOUNT_SALT, process.env.PAYMASTER_ADDRESS);
    const { userOperation, ethereum, privateKey } = request;
    const provider = new providers_1.Web3Provider(ethereum);
    const paymasterAddress = process.env.PAYMASTER_ADDRESS;
    const paymasterAndData = paymasterAddress
        ? yield (0, VerifyingPaymaster_1.getPaymasterAndData)(paymasterAddress, 0, 0, userOperation, privateKey, provider)
        : '0x';
    if (!paymasterAddress) {
        log('Skipping paymaster');
    }
    return { paymasterAndData };
});
exports.default = {
    onUserOperationRequest,
    onPaymasterRequest,
};
//# sourceMappingURL=index.js.map