pragma solidity ^0.6.1;
pragma experimental ABIEncoderV2;
contract Zones {
    address[] registers;

    struct Zone {
        string zoneId;
        address parent;
        bool approved;
    }
    mapping(address => Zone[]) public pendings;
    mapping(address => Zone[]) public verified;

    event Register(string zoneId, address parentAccount, bool approved);
    event GetZones(Zone[] zones);
    event Approve(address requestingAddress, string zoneId);
    event Reject(address requestingAddress, string zoneId);
    event Fail(address requestingAddress, string zoneId);
    event Sender(address sender);

    function registerZone(
        string memory _zoneId,
        address _parentAccount,
        bool _approved
    ) public {
        Zone memory newZone = Zone(_zoneId, _parentAccount, _approved);
        pendings[_parentAccount].push(newZone);
        if (register()) {
            emit GetZones(pendings[_parentAccount]);
            emit Register(_zoneId, _parentAccount, newZone.approved);
        }

    }

    function getRegisters() public returns (address[] memory) {
        return registers;
    }

    function register() internal returns (bool) {
        for (uint256 i = 0; i < registers.length; i++) {
            if (registers[i] == msg.sender) {
                return false;
            }
        }
        registers.push(msg.sender);
        return true;
    }

    function getVerifiedZones() public returns (Zone[] memory) {
        emit Sender(msg.sender);
        emit GetZones(verified[msg.sender]);
        return verified[msg.sender];
    }

    function getRequestedZones() public returns (Zone[] memory) {
        emit Sender(msg.sender);
        return pendings[msg.sender];
    }

    function approve(address _requestingAddress, string memory _zoneId)
        public
        returns (bool)
    {
        Zone[] memory requests = pendings[msg.sender];

        for (uint256 i = 0; i < requests.length; i++) {
            Zone memory curr = requests[i];
            if (
                compareStrings(curr.zoneId, _zoneId) &&
                msg.sender == curr.parent
            ) {
                curr.approved = true;
                verified[_requestingAddress].push(curr);
                delete pendings[msg.sender][i];
                emit Approve(_requestingAddress, _zoneId);
                return true;
            }
        }

        emit Fail(_requestingAddress, _zoneId);
        return false;

    }

    function reject(address _requestingAddress, string memory _zoneId)
        public
        returns (bool)
    {
        Zone[] memory requests = pendings[msg.sender];

        for (uint256 i = 0; i < requests.length; i++) {
            Zone memory curr = requests[i];
            if (
                compareStrings(curr.zoneId, _zoneId) &&
                msg.sender == curr.parent
            ) {
                delete pendings[msg.sender][i];
                emit Reject(_requestingAddress, _zoneId);
                return true;
            }
        }

        emit Fail(_requestingAddress, _zoneId);
        return false;

    }

    function compareStrings(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}
