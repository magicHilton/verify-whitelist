// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GoodStone is ERC721Enumerable, Ownable {
    using Strings for uint256;

    bool public _isSaleActive = false; // 发售

    bool public _revealed = false; // 盲盒

    uint256 public constant MAX_SUPPLY = 10;

    //Mint价格
    uint256 public mintPrice = 0.003 ether;

    //最大持有量
    uint256 public maxBalance = 10;

    uint256 public maxMint = 10;

    string baseURI;
    string public notRevealedUri;
    string public baseExtension = ".json";
    //设置签名
    string private signature;

    bytes32 root; // whitelist

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("JianLiBao", "JLB") {}

    function initial(
        string memory initBaseURI,
        string memory initNotRecealedUri
    ) public onlyOwner {
        setBaseURI(initBaseURI);
        setNotRevealedURI(initNotRecealedUri); // 盲盒
    }

    function verify(bytes32[] memory _proof) view public returns(bool) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        return MerkleProof.verify(_proof, root, leaf);
    }

    //预售方法
    function preSaleMint(
        uint256 quantity,
        bytes32[] memory proof
    ) public payable {
        require(verify(proof), "not whitelist member");
        require(totalSupply() + quantity <= MAX_SUPPLY, "Sale would exceed max supply");
        require(_isSaleActive, "preSale must be actived");
        require(balanceOf(msg.sender) + quantity <= maxBalance, "Sale would exceed max balance");
        require(quantity * mintPrice <= msg.value, "Not enough ether sent");
        require(quantity <= maxMint, "Can only mint less maxMint at a time");
        mintNft(quantity);
    }

    function publicMint(uint256 quantity) public payable {
        require(totalSupply() + quantity <= MAX_SUPPLY, "Sale would exceed max supply");
        require(_isSaleActive, "preSale must be actived");
        require(balanceOf(msg.sender) + quantity <= maxBalance, "Sale would exceed max balance");
        require(quantity * mintPrice <= msg.value, "Not enough ether sent");
        require(quantity <= maxMint, "Can only mint less maxMint at a time");
        mintNft(quantity);
    }

    function mintNft(uint256 quantity) internal {
        for(uint256 i = 0; i < quantity; i++) {
            uint256 mintIndex = totalSupply();
            if(totalSupply() < MAX_SUPPLY) {
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        if (_revealed == false) {
            // 盲盒模式
            return notRevealedUri;
        }

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        return
            string(abi.encodePacked(base, tokenId.toString(), baseExtension));
    }

    // internal
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    //only owner
    function flipSaleActive() public onlyOwner {
        _isSaleActive = !_isSaleActive;
    }

    function setSignature(string memory _signature) public onlyOwner {
        signature = _signature;
    }

    function flipReveal() public onlyOwner {
        _revealed = !_revealed;
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(
        string memory _newBaseExtension
    ) public onlyOwner {
        baseExtension = _newBaseExtension;
    }

    function setMaxBalance(uint256 _maxBalance) public onlyOwner {
        maxBalance = _maxBalance;
    }

    function setMaxMint(uint256 _maxMint) public onlyOwner {
        maxMint = _maxMint;
    }

    function setRoot(bytes32 _root) public onlyOwner {
        root = _root;
    }

    function getRoot() view public onlyOwner returns(bytes32) {
        return root;
    }

    function withdraw(address to) public onlyOwner {
        uint256 balance = address(this).balance;
        payable(to).transfer(balance);
    }
}
