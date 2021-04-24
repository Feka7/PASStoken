// SPDX-License-Identifier: MIT

/// @title Custom token ERC721
/// @author Federico Giannotti

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/// @notice You can use this contract for only the most basic simulation

contract PassToken is ERC721URIStorage {

    using Counters for Counters.Counter;

    //Only increment, use for Id PASS token
    Counters.Counter private _tokenIds;

    //Status of the PASS
    enum StatusPass {
        NotSale,
        Sale,
        Rent
    }

    /** Data about the PASS
        consumer: who rent the PASS
        status: actual status of the PASS
        day: duration of the rental offer
        startDay: when consumer rent the PASS
        price: cost for rent the PASS
    **/
    /// Important: the variable day is actually
    /// used with the seconds, this was done for quicker verification.
    struct Details {
        address consumer;
        StatusPass status;
        uint day;
        uint startDay;
        uint price;
    }

    mapping (uint256 => Details) private Pass;

    //Mapping between address and what they earn with rent their PASS
    mapping (address => uint) private Earn;

    constructor() ERC721 ("PassToken", "PASS") {}

    /// @notice emit an event when a new token is created
    /// @param itemId of the new token
    event Create(uint itemId);
    /// @notice emit an event when a new offert about token is set
    /// @param itemId of the token, day duration of the offer, price of the offer
    event Offer(uint itemId, uint day, uint price);
    /// @notice emit an event when a upgrade about token offert is set
    /// @param itemId of the token, day new duration of the offer, new price of the offer
    event Upgrade(uint itemId, uint day, uint price);
    /// @notice emit an event when a consumer rent a PASS
    /// @param itemId of the PASS
    event Rent(uint itemId);

    /// @dev only the owner of the PASS can perform the function
   /// @param itemId of the PASS
    modifier onlyCreator(uint itemId) {
        require(
            msg.sender == ownerOf(itemId),
            "Only creator can call this function."
        );
        _;
    }

    /// @dev only if the pass is in rent status
    /// @param itemId od the PASS
    modifier onlyRent(uint itemId) {
        require(
            StatusPass.Rent == Pass[itemId].status,
            "Only if pass is in rent status you can call this function."
        );
        _;
    }

    /// @dev only if the pass is in sale status
    /// @param itemId od the PASS
    modifier onlySale(uint itemId) {
        require(
            StatusPass.Sale == Pass[itemId].status,
            "Only if pass is in sale status you can call this function."
        );
        _;
    }

    /// @dev only if the pass is in not sale status
    /// @param itemId od the PASS
    modifier onlyNotSale(uint itemId) {
        require(
            StatusPass.NotSale == Pass[itemId].status,
            "Only if pass is not in sale status you can call this function."
        );
        _;
    }

    ///@dev only if the rent is valid (PASS should be in rent status)
    /// @param itemId od the PASS
    modifier rentIsValid(uint itemId) {
        require(
            block.timestamp < Pass[itemId].startDay + (Pass[itemId].day * 1 seconds),
            "Only if rent is not terminated you can call this function."
        );
        _;
    }

    ///@dev only if the rent is not valid
    /// @param itemId od the PASS
    modifier rentIsNotValid(uint itemId) {
        require(
            block.timestamp >= Pass[itemId].startDay + (Pass[itemId].day * 1 seconds),
            "Only if rent is terminated you can call this function."
        );
        _;
    }

    /// @dev only if user has earn something with the rent of PASS
    modifier enoughEarn() {
        require(
            Earn[msg.sender] > 0,
            "Only if you have earn some ether you can call this function"
        );
        _;
    }

    /// @dev only if the PASS exist
    /// @param itemId od the PASS
    modifier tokenIdIsValid(uint itemId) {
        require(
            _exists(itemId) == true,
            "TokenId is not valid"
        );
        _;
    }

 /// @param tokenURI : uri of the PASS

    function createPass(string memory tokenURI)
        public
        returns (uint256 newItemId)
    {
        _tokenIds.increment();

        newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        Details memory detail = Details(address(0), StatusPass.NotSale, 0, 0, 0);
        Pass[newItemId] = detail;
        emit Create(newItemId);

    }

 /// @param itemId : id of the PASS
 /// @param tokenURI : new uri of the PASS

    function changeTokenURI(uint itemId, string memory tokenURI)
        public
        onlyCreator(itemId)
     {
         _setTokenURI(itemId, tokenURI);
     }


 /// @param itemId : id of the PASS
 /// @param _day : duration of the offert
 /// @param _price : cost for rent the PASS

    function setOffer(uint itemId, uint _day, uint _price)
        public
        tokenIdIsValid(itemId)
        onlyCreator(itemId)
        onlyNotSale(itemId)
    {
            Pass[itemId].status = StatusPass.Sale;
            Pass[itemId].day = _day;
            Pass[itemId].price = _price;
            emit Offer(itemId, _day, _price);
    }

 /// @param  itemId : id of the PASS
 /// @param  _day : new duration of the offert
 /// @param  _price : new cost for rent the PASS
    function upgradeOffer(uint itemId, uint _day, uint _price)
        public
        tokenIdIsValid(itemId)
        onlyCreator(itemId)
        onlySale(itemId)
    {
            Pass[itemId].day = _day;
            Pass[itemId].price = _price;
            emit Upgrade(itemId, _day, _price);
    }

 /// @param itemId : id of the PASS
    function removeOffer(uint itemId)
        public
        tokenIdIsValid(itemId)
        onlyCreator(itemId)
        onlySale(itemId)
    {
            Pass[itemId].status = StatusPass.NotSale;
    }

 /// @param itemId : id of the PASS
    function retrievePass(uint itemId)
        public
        tokenIdIsValid(itemId)
        onlyCreator(itemId)
        onlyRent(itemId)
        rentIsNotValid(itemId)
    {
        Pass[itemId].status = StatusPass.NotSale;
    }

 /// @param itemId : id of the PASS
    function rentPass(uint itemId)
        public
        payable
        tokenIdIsValid(itemId)
        onlySale(itemId)
    {
        Pass[itemId].status = StatusPass.Rent;
        Pass[itemId].consumer = msg.sender;
        Pass[itemId].startDay = block.timestamp;
        Earn[ownerOf(itemId)] += msg.value;
        require(msg.value == Pass[itemId].price, "You should send the exactly price");
        emit Rent(itemId);
    }

     function withdrawEarn()
        public
        enoughEarn()
    {
        uint amount = Earn[msg.sender];
        Earn[msg.sender] = 0;
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }

 /// @param itemId : id of the PASS
    function getDetails(uint itemId)
        public
        view
        tokenIdIsValid(itemId)
        returns (
            address _consumer,
            uint _status,
            uint _day,
            uint _startDay,
            uint _price
        )
    {
         _consumer = Pass[itemId].consumer;
         _day = Pass[itemId].day;
         _startDay = Pass[itemId].startDay;
         _price = Pass[itemId].price;
         _status = uint(Pass[itemId].status);
    }

 /// @param itemId : id of the PASS
    function isConsumer(uint itemId)
        public
        view
        tokenIdIsValid(itemId)
        rentIsValid(itemId)
        returns (bool)
    {
            if(msg.sender == Pass[itemId].consumer) return true;
            else return false;
    }
}
