
// SPDX-License-Identifier: MIT
// https://0xmacro.com/blog/solidity-gas-optimizations-cheat-sheet/
// https://solidity-by-example.org/
// https://docs.openzeppelin.com/contracts/4.x/erc721
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TheNFTSnapshot is ERC721, ERC721URIStorage, Ownable {
    constructor() ERC721("TheNFTSnapshot", "TNS") {}

    function safeMint(address to, string memory name, string memory uri)
        public
        onlyOwner
    {
        // require(msg.value == 0.01 ether, "0.01 ETH required");   
        uint256 tokenId = getTokenId(name);
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function getTokenId(string memory _input) internal pure returns (uint256) {
        bytes memory temp = bytes(_input);
        return uint256(keccak256(temp));
    }
    
    function getTokenURI(string memory name) public view returns (string memory) {
        uint256 tokenId = getTokenId(name);
        return tokenURI(tokenId);
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

// snapshot name check against regex and convert uint256 num = uint256(keccak256(abi.encode(name)));
// max 63 letters, numbers and hyphens