// SPDX-License-Identifier: MIT

import "./IOnChainId.sol";

pragma solidity >=0.8.11;

contract OnChainId is IOnChainId {
  uint64 public constant NO_EXPIRATION_VALUE = 42;

  // Private data
  mapping(address => mapping(bytes32 => PrivateDataEntry)) privateDataStorage;
  mapping(address => bytes32) privateDataFirstEntry;
  mapping(address => bytes32) privateDataLastEntry;

  // Permissions
  mapping(address => mapping(address => PermissionsEntry)) permissionsStorage;
  mapping(address => address) permissionsFirstEntry;
  mapping(address => address) permissionsLastEntry;

  modifier isValidKey(bytes32 _key) {
    if (!_isValidKey(_key)) {
      revert InvalidPrivateDataKey();
    }

    _;
  }

  modifier isValidData(string memory _data) {
    if (bytes(_data).length == 0) {
      revert InvalidPrivateData();
    }

    _;
  }

  modifier isValidProvider(address _provider) {
    if (!_isValidProvider(_provider)) {
      revert InvalidProvider();
    }

    _;
  }

  modifier isValidPermissions(PermissionValue[] memory _permissions) {
    if (_permissions.length == 0) {
      revert InvalidPermissions();
    }

    _;
  }

  modifier isValidExpiration(uint64 _expiration) {
    if (_expiration < block.timestamp && _expiration != NO_EXPIRATION_VALUE) {
      revert InvalidExpiration();
    }

    _;
  }

  function writeData(bytes32 _key, string memory _data) public isValidKey(_key) isValidData(_data) {
    PrivateDataEntry memory privateData = privateDataStorage[msg.sender][_key];

    if (_isPrivateDataEmpty(privateData)) {
      _addNewDataEntry(_key, _data);

      return;
    }

    privateDataStorage[msg.sender][_key].data = _data;
  }

  function writeMultipleData(PrivateDataValue[] memory _data) public {
    for (uint256 i = 0; i < _data.length; i++) {
      writeData(_data[i].key, _data[i].data);
    }
  }

  function deleteData(bytes32 _key) public isValidKey(_key) {
    bytes32 previous = privateDataStorage[msg.sender][_key].previous;
    bytes32 next = privateDataStorage[msg.sender][_key].next;

    if (privateDataFirstEntry[msg.sender] == _key) {
      privateDataFirstEntry[msg.sender] = next;
    }

    if (privateDataLastEntry[msg.sender] == _key) {
      privateDataLastEntry[msg.sender] = previous;
    }

    privateDataStorage[msg.sender][previous].next = next;
    privateDataStorage[msg.sender][next].previous = previous;

    delete privateDataStorage[msg.sender][_key];
  }

  function deleteMultipleData(bytes32[] memory _keys) public {
    for (uint256 i = 0; i < _keys.length; i++) {
      deleteData(_keys[i]);
    }
  }

  function getFirstDataEntry() public view returns(bytes32) {
    return privateDataFirstEntry[msg.sender];
  }

  function getLastDataEntry() public view returns(bytes32) {
    return privateDataLastEntry[msg.sender];
  }

  function getDataEntries(bytes32 _previousKey, uint256 _maxResults) public view returns(PrivateDataValue[] memory) {
    PrivateDataValue[] memory entries = new PrivateDataValue[](_maxResults);
    uint256 currentEntryIndex = 0;
    bytes32 currentKey = _previousKey == 0 ? getFirstDataEntry() : privateDataStorage[msg.sender][_previousKey].next;
    PrivateDataEntry memory currentPrivateData = privateDataStorage[msg.sender][currentKey];

    while (_isValidKey(currentKey) && !_isPrivateDataEmpty(currentPrivateData) && currentEntryIndex < _maxResults) {
      entries[currentEntryIndex] = PrivateDataValue(currentKey, currentPrivateData.data);

      currentKey = privateDataStorage[msg.sender][currentKey].next;
      currentPrivateData = privateDataStorage[msg.sender][currentKey];
      currentEntryIndex++;
    }

    assembly {
      mstore(entries, currentEntryIndex)
    }

    return entries;
  }

  function writePermissions(
    address _provider,
    PermissionValue[] memory _permissions,
    uint64 _expiration
  ) public  isValidProvider(_provider) isValidPermissions(_permissions) isValidExpiration(_expiration) {
    PermissionsEntry storage permissions = permissionsStorage[msg.sender][_provider];

    if (_arePermissionsEmpty(permissions)) {
      _initializeNewPermissionsEntry(_provider);
    }

    permissions.expiration = _expiration;

    for (uint256 i = 0; i < _permissions.length; i++) {
      PermissionValue memory permissionValue = _permissions[i];

      permissions.canRead[permissionValue.key] = permissionValue.canRead;
    }
  }

  function disableProvider(address _provider) public isValidProvider(_provider) {
    PermissionsEntry storage permissions = permissionsStorage[msg.sender][_provider];
    address previous = permissions.previous;
    address next = permissions.next;

    if (permissionsFirstEntry[msg.sender] == _provider) {
      permissionsFirstEntry[msg.sender] = next;
    }

    if (permissionsLastEntry[msg.sender] == _provider) {
      permissionsLastEntry[msg.sender] = previous;
    }

    permissionsStorage[msg.sender][previous].next = next;
    permissionsStorage[msg.sender][next].previous = previous;

    permissions.previous = address(0);
    permissions.next = address(0);
    permissions.expiration = 0;
  }

  function disableProviders(address[] memory _addresses) public {
    for (uint256 i = 0; i < _addresses.length; i++) {
      disableProvider(_addresses[i]);
    }
  }

  function setProviderExpiration(
    address _provider,
    uint64 _expiration
  ) public isValidProvider(_provider) isValidExpiration(_expiration) {
    if (_arePermissionsEmpty(permissionsStorage[msg.sender][_provider])) {
      revert PermissionsForTheGivenProviderAreEmpty();
    }

    permissionsStorage[msg.sender][_provider].expiration = _expiration;
  }

  function getFirstPermissionsEntry() public view returns(address) {
    return permissionsFirstEntry[msg.sender];
  }

  function getLastPermissionsEntry() public view returns(address) {
    return permissionsLastEntry[msg.sender];
  }

  function getAllowedProviders(address _previousProvider, uint256 _maxResults) public view returns(address[] memory) {
    address[] memory entries = new address[](_maxResults);
    uint256 currentProviderIndex = 0;
    address currentProvider = _previousProvider == address(0) ? getFirstPermissionsEntry() : permissionsStorage[msg.sender][_previousProvider].next;

    while (
      _isValidProvider(currentProvider) &&
      !_arePermissionsEmpty(permissionsStorage[msg.sender][currentProvider]) &&
      currentProviderIndex < _maxResults
    ) {
      entries[currentProviderIndex] = currentProvider;

      currentProvider = permissionsStorage[msg.sender][currentProvider].next;
      currentProviderIndex++;
    }

    assembly {
      mstore(entries, currentProviderIndex)
    }

    return entries;
  }

  function getExpiration(address _provider) public view returns(uint64) {
    return permissionsStorage[msg.sender][_provider].expiration;
  }

  function getPermissions(
    address _provider,
    bytes32 _startKey,
    uint256 _maxResults
  ) public view returns(PermissionValue[] memory) {
    PermissionValue[] memory entries = new PermissionValue[](_maxResults);
    uint256 currentEntryIndex = 0;
    bytes32 currentKey = _startKey;
    PrivateDataEntry memory currentPrivateData = privateDataStorage[msg.sender][currentKey];

    while (_isValidKey(currentKey) && !_isPrivateDataEmpty(currentPrivateData) && currentEntryIndex < _maxResults) {
      entries[currentEntryIndex] = PermissionValue(
        currentKey,
        permissionsStorage[msg.sender][_provider].canRead[currentKey]
      );

      currentKey = privateDataStorage[msg.sender][currentKey].next;
      currentPrivateData = privateDataStorage[msg.sender][currentKey];
      currentEntryIndex++;
    }

    assembly {
      mstore(entries, currentEntryIndex)
    }

    return entries;
  }

  function getData(address _owner, bytes32 _key) public view returns(string memory) {
    if (!_isProviderEnabled(_owner, msg.sender)) {
      revert AccessDenied(permissionsStorage[_owner][msg.sender].expiration);
    }

    if (!permissionsStorage[_owner][msg.sender].canRead[_key]) {
      revert DataAccessDenied();
    }

    return privateDataStorage[_owner][_key].data;
  }

  function _isValidKey(bytes32 _key) private pure returns(bool) {
    return _key != 0;
  }

  function _isPrivateDataEmpty(PrivateDataEntry memory _privateData) private pure returns(bool) {
    return _privateData.previous == 0 && _privateData.next == 0 && bytes(_privateData.data).length == 0;
  }

  function _isValidProvider(address _provider) private pure returns(bool) {
    return _provider != address(0);
  }

  function _arePermissionsEmpty(PermissionsEntry storage _permissions) private view returns(bool) {
    return _permissions.previous == address(0) && _permissions.next == address(0) && _permissions.expiration == 0;
  }

  function _isProviderEnabled(address _owner, address _provider) private view returns(bool) {
    return permissionsStorage[_owner][_provider].expiration == NO_EXPIRATION_VALUE ||
      permissionsStorage[_owner][_provider].expiration > block.timestamp;
  }

  function _addNewDataEntry(bytes32 _key, string memory _data) private {
    if (privateDataFirstEntry[msg.sender] == 0) {
      privateDataFirstEntry[msg.sender] = _key;
    } else {
      privateDataStorage[msg.sender][privateDataLastEntry[msg.sender]].next = _key;
    }

    privateDataStorage[msg.sender][_key] = PrivateDataEntry(privateDataLastEntry[msg.sender], 0, _data);

    privateDataLastEntry[msg.sender] = _key;
  }

  function _initializeNewPermissionsEntry(address _provider) private {
    if (permissionsFirstEntry[msg.sender] == address(0)) {
      permissionsFirstEntry[msg.sender] = _provider;
    } else {
      permissionsStorage[msg.sender][permissionsLastEntry[msg.sender]].next = _provider;
    }

    permissionsStorage[msg.sender][_provider].previous = permissionsLastEntry[msg.sender];

    permissionsLastEntry[msg.sender] = _provider;
  }
}
