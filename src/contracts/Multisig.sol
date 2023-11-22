// SPDX-License-Identifier: Unlicensed

pragma solidity 0.8.21;

contract Multisig{ 
    
    mapping(address => bool) admins;
    uint256 adminsCount;
    uint256 public nonce;

    constructor(address[] memory _admins) {
        adminsCount = _admins.length;
        for(uint256 i = 0; i < adminsCount; i++){
            admins[_admins[i]] = true;
        }
    }

    function verify(
        uint256 _nonce,
        address target,
        bytes calldata payload,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) public {
            // Проверяем nonce
            require(_nonce == nonce, "Bad nonce");
            nonce++;
            // Проверям масивы
            require(v.length == r.length && r.length == s.length, "Bad arrays");
            // Получаем хеш сообщения, который подписывался
            bytes32 messageHash = getMessageHash(_nonce, target, payload);
            // Получаем правильные подписи
            uint256 signed = _verify(messageHash, v, r, s);
            // Проверяем что подписей достаточно
            require(signed > adminsCount / 2, "Not enought signatures");
            // Делаем вызов
            (bool success, ) = target.call(payload);
            require(success);

        }

    function _verify(
        bytes32 messageHash,
        uint8[] calldata v,
        bytes32[] calldata r,
        bytes32[] calldata s
    ) internal view returns(uint256) {
        // Количество правильных подписей
        uint256 signed = 0;
        // Массив админов, которые подписали
        address[] memory adrs = new address[](v.length);
        // В цикле восстанавливаем адреса и считаем сколько там админов
        for (uint256 i = 0; i < v.length; i++) {
            // Восстанавливаем очередную подпись
            address adr = ecrecover(messageHash, v[i], r[i], s[i]);
            // если она есть в списке админов
            if(admins[adr] == true) {
                // проверяем нет ли уже этой подписи среди подписавших
                bool check = true;
                for(uint256 j = 0; j < adrs.length; j++){
                    if(adrs[i] == adr){
                        check = false;
                        break;
                    }
                }
                if(check){
                    adrs[signed] = adr;
                    signed++;
                }
            }
        }
        return signed;
    }

    function getMessageHash(
        uint256 _nonce,
        address target,
        bytes calldata payload
    ) internal view returns(bytes32) {
        bytes memory message = abi.encodePacked(_nonce, address(this), target, payload);
        bytes memory prefix = "\x19Ethereum Signed Message:\n";
        bytes memory digest = abi.encodePacked(prefix, toBytes(message.length), message);
        return keccak256(digest);
    }

    // Функция для перевода числа в строку
    function toBytes(uint256 value) internal pure returns (bytes memory) {
        uint256 temp = value;
        uint256 digits;
        do {
            digits++;
            temp /= 10;
        } while (temp != 0);
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return buffer;
    }

    


}