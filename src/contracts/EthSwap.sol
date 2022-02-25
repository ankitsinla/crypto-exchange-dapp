pragma solidity  ^0.5.0;

import "./Token.sol";

contract EthSwap {
    string public name = "Ankit";
    Token public token;
    uint public rate = 100;

    event TokensPurchased(address account , address token , uint amount , uint rate);

    event TokensSelled(address account , address token , uint amount , uint rate);

    constructor(Token _token) public {
        token = _token;
    }

    function buyTokens() public payable {
        uint AmountTokens = msg.value * rate;

        require(token.balanceOf(address(this)) >= AmountTokens);

        token.transfer(msg.sender, AmountTokens);

        emit TokensPurchased(msg.sender, address(token), AmountTokens, rate);
    }

    function sellTokens(uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount);

        uint AmountEthers = _amount / rate ;

        require(address(this).balance >= AmountEthers);

        token.transferFrom(msg.sender,address(this), _amount);
        msg.sender.transfer(AmountEthers);

        emit TokensSelled(msg.sender, address(token), _amount, rate);
    }
}