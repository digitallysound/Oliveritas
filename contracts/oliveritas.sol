// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract OliveOilSupplyChain is ERC20, Ownable2Step, Pausable {

    // Roles
    enum Role { Producer, Lab, Mill, Partner }
    struct Roles {
        bool isProducer;
        bool isLab;
        bool isMill;
        bool isPartner;
    }
    mapping(address account => Roles) public roles;

    // Olive Oil Quality Categories
    enum OliveOilQuality {
        EarlyHarvestExtraVirgin,
        OrganicExtraVirgin,
        ExtraVirgin
    }

    // Packaging Sizes (in milliliters)
    uint256 constant internal _PACKAGE_500ML = 500;
    uint256 constant internal _PACKAGE_330ML = 330;

    // Olive Variety
    struct OliveVariety {
        string name; // e.g., "Arbequina", "Picual", "Koroneiki"
    }

    struct BatchCore {
        uint256 batchNumber;
        address producer;
        address lab;
        address mill;
        uint8 oilPercentage;
        uint128 oliveKg;
        uint128 oilQuantity;
        bool approvedByMill;
        bool tokensMinted;
    }

    struct BatchDetails {
        uint256 batchNumber;
        uint256 dateBatchCreation;
        OliveVariety olivesVariety;
        OliveOilQuality qualityCategory;
        bytes32 secretPhraseHash;
        string origin;
    }

    mapping(uint256 batchId => BatchCore) public batchCores;
    mapping(uint256 batchId => BatchDetails) public batchDetails;

    // Events
    event BatchCreated(uint256 indexed batchNumber, address indexed lab, address indexed producer, address mill, uint256 dateBatchCreation, OliveOilQuality qualityCategory, uint8 oilPercentage);
    event QuantityAndHashAdded(uint256 indexed batchNumber, address indexed producer, uint128 oliveKg, bytes32 secretPhraseHash, string origin, string olivesVariety);
    event BatchApproved(uint256 indexed batchNumber, address indexed mill, uint128 oilQuantity);
    event TokensMinted(uint256 indexed batchNumber, address indexed producer, uint256 amount, uint256 packageSize);
    event RoleAssigned(address indexed account, uint8 role);
    event RoleRevoked(address indexed account, uint8 role);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event TokensBurned(address indexed owner, uint256 amount);

    // Custom Errors
    error NotOwner();
    error NotProducer();
    error NotLab();
    error NotMill();
    error NotPartner();
    error QuantityAlreadyExists();
    error BatchAlreadyApproved();
    error BatchNotApproved();
    error TokensAlreadyMinted();
    error InvalidRole();
    error NotAuthorized();
    error InvalidPackageSize();
    error SenderNotAuthorized();
    error CalculationOverflow();
    error InvalidOliveKg();
    error OriginAlreadyExists();
    error OlivesVarietyAlreadyExists();

    // Modifiers
    modifier onlyAdmin() {
        if(owner() != msg.sender) revert NotOwner();
        _;
    }

    modifier onlyProducer(uint256 _batchNumber) {
        if(!roles[msg.sender].isProducer) revert NotProducer();
        if(batchCores[_batchNumber].producer != msg.sender) revert NotAuthorized();
        _;
    }

    modifier onlyLab() {
        if(!roles[msg.sender].isLab) revert NotLab();
        _;
    }

    modifier onlyMill(uint256 _batchNumber) {
        if(!roles[msg.sender].isMill) revert NotMill();
        if(batchCores[_batchNumber].mill != msg.sender) revert NotAuthorized();
        _;
    }

    modifier onlyPartner() {
        if(!roles[msg.sender].isPartner) revert NotPartner();
        _;
    }

    // Internal Variables
    uint256 private _batchNumberCounter;

    // Constructor
    constructor() ERC20("OliveOilToken", "EVOO") payable Ownable(msg.sender) {

    }

    // Admin Functions
    function assignRole(address _address, Role _role) external onlyAdmin {
        if (_role == Role.Producer) {
            roles[_address].isProducer = true;
        } else if (_role == Role.Lab) {
            roles[_address].isLab = true;
        } else if (_role == Role.Mill) {
            roles[_address].isMill = true;
        } else if (_role == Role.Partner) {
            roles[_address].isPartner = true;
        } else {
            revert InvalidRole();
        }

        emit RoleAssigned(_address, uint8(_role));
    }

    function revokeRole(address _address, Role _role) external onlyAdmin {
        if (_role == Role.Producer) {
            roles[_address].isProducer = false;
        } else if (_role == Role.Lab) {
            roles[_address].isLab = false;
        } else if (_role == Role.Mill) {
            roles[_address].isMill = false;
        } else if (_role == Role.Partner) {
            roles[_address].isPartner = false;
        } else {
            revert InvalidRole();
        }

        emit RoleRevoked(_address, uint8(_role));
    }

    // Lab Initializes a Batch Record
    function createBatch(address _producer, address _mill, OliveOilQuality _qualityCategory, uint8 _oilPercentage) external onlyLab {
        require(_oilPercentage <= 40, "Invalid oil percentage");

        uint256 batchNumber = _batchNumberCounter;

        batchCores[batchNumber] = BatchCore({
            batchNumber: batchNumber,
            producer: _producer,
            lab: msg.sender,
            mill: _mill,
            oliveKg: 0,
            oilQuantity: 0,
            oilPercentage: _oilPercentage,
            approvedByMill: false,
            tokensMinted: false
        });

        batchDetails[batchNumber] = BatchDetails({
            batchNumber: batchNumber,
            dateBatchCreation: block.timestamp,
            olivesVariety: OliveVariety(""),
            qualityCategory: _qualityCategory,
            secretPhraseHash: bytes32(0),
            origin: ""
        });

        emit BatchCreated(batchNumber, msg.sender, _producer, _mill, block.timestamp, _qualityCategory, _oilPercentage);
        _batchNumberCounter++;
    }

    // Producer Adds Quantity, Secret Phrase Hash, Origin and Olives Variety
    function addQuantityAndHash(uint256 _batchNumber, uint128 _oliveKg, bytes32 _secretPhraseHash, string memory _origin, string memory _olivesVariety) external onlyProducer(_batchNumber) {
        if (batchCores[_batchNumber].oliveKg != 0) revert QuantityAlreadyExists();
        if (bytes(batchDetails[_batchNumber].origin).length != 0) revert OriginAlreadyExists();
        if (bytes(batchDetails[_batchNumber].olivesVariety.name).length != 0) revert OlivesVarietyAlreadyExists();
        if (_oliveKg == 0) revert InvalidOliveKg();

        // Check for potential overflow
        uint8 oilPercentage = batchCores[_batchNumber].oilPercentage;
        uint256 multipliedValue = uint256(_oliveKg) * oilPercentage;
        if (multipliedValue / uint256(_oliveKg) != oilPercentage) {
            revert CalculationOverflow();
        }

        batchCores[_batchNumber].oliveKg = _oliveKg;
        batchCores[_batchNumber].oilQuantity = uint128(multipliedValue / 100);
        batchDetails[_batchNumber].secretPhraseHash = _secretPhraseHash;
        batchDetails[_batchNumber].origin = _origin;
        batchDetails[_batchNumber].olivesVariety = OliveVariety(_olivesVariety);

        emit QuantityAndHashAdded(_batchNumber, msg.sender, _oliveKg, _secretPhraseHash, _origin, _olivesVariety);
    }

    // Mill Approves the Batch
    function approveBatch(uint256 _batchNumber) external onlyMill(_batchNumber) {
        if(batchCores[_batchNumber].approvedByMill) revert BatchAlreadyApproved();

        batchCores[_batchNumber].approvedByMill = true;

        emit BatchApproved(_batchNumber, msg.sender, batchCores[_batchNumber].oilQuantity);
    }

    // Producer Mints Tokens based on packaging size
    function mintTokens(uint256 _batchNumber, uint256 _packageSize) external onlyProducer(_batchNumber) {
        if(!batchCores[_batchNumber].approvedByMill) revert BatchNotApproved();
        if(batchCores[_batchNumber].oilQuantity == 0) revert NotAuthorized();
        if(batchCores[_batchNumber].tokensMinted) revert TokensAlreadyMinted();

        uint256 amountToMint;
        if (_packageSize == _PACKAGE_500ML) {
            amountToMint = _PACKAGE_500ML;
        } else if (_packageSize == _PACKAGE_330ML) {
            amountToMint = _PACKAGE_330ML;
        } else {
            revert InvalidPackageSize();
        }

        // Calculate how many packages can be filled
        uint256 numPackages = batchCores[_batchNumber].oilQuantity * 1000 / amountToMint;

        // Check for potential overflow
        if (numPackages > type(uint128).max) {
            revert CalculationOverflow();
        }

        // Mint tokens for the number of packages of the specified size
        _mint(msg.sender, numPackages);

        // Mark that tokens have been minted for this batch
        batchCores[_batchNumber].tokensMinted = true;

        emit TokensMinted(_batchNumber, msg.sender, numPackages, _packageSize);
    }

    // Restrict access to standard ERC20's 'transfer' only Producers and Partners can transfer tokens to any address
    function transfer(address _to, uint256 _amount) public override whenNotPaused returns (bool success) {
        // Only Producers and Partners can initiate transfers
        if (_to == msg.sender || !(roles[msg.sender].isProducer || roles[msg.sender].isPartner)) revert SenderNotAuthorized();

        success = false;

        // Transfer tokens from the sender to the recipient
        _transfer(msg.sender, _to, _amount);
        emit TokensTransferred(msg.sender, _to, _amount);
    }

    // Anyone can burn their own tokens
    function burnTokens(uint256 _amount) external whenNotPaused {
        _burn(msg.sender, _amount);
        emit TokensBurned(msg.sender, _amount);
    }

    // Pause and unpause in case of emergency
    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }
}