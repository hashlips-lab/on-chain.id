// SPDX-License-Identifier: MIT

pragma solidity >=0.8.11;

interface IOnChainId {
  struct PrivateDataEntry {
    bytes32 previous;
    bytes32 next;
    string data;
  }

  struct PrivateDataValue {
    bytes32 key;
    string data;
  }

  struct PermissionsEntry {
    address previous;
    address next;
    uint64 expiration;
    mapping(bytes32 => bool) canRead;
  }

  struct PermissionValue {
    bytes32 key;
    bool canRead;
  }

  error InvalidPrivateDataKey();
  error InvalidPrivateData();
  error InvalidPermissions();
  error InvalidExpiration();
  error InvalidProvider();
  error PermissionsForTheGivenProviderAreEmpty();
  error AccessDenied(uint64 expiration);
  error DataAccessDenied();

  function NO_EXPIRATION_VALUE() external returns(uint64);

  function writeData(bytes32 _key, string memory _data) external;

  function writeMultipleData(PrivateDataValue[] memory _data) external;

  function deleteData(bytes32 _key) external;

  function deleteMultipleData(bytes32[] memory _keys) external;

  function getFirstDataEntry() external view returns(bytes32);

  function getLastDataEntry() external view returns(bytes32);

  function getDataEntries(bytes32 _previousKey, uint256 _maxResults) external view returns(PrivateDataValue[] memory);

  function writePermissions(address _provider, PermissionValue[] memory _permissions, uint64 _expiration) external;

  function disableProvider(address _provider) external;

  function disableProviders(address[] memory _addresses) external;

  function setProviderExpiration(address _provider, uint64 _expiration) external;

  function getFirstPermissionsEntry() external view returns(address);

  function getLastPermissionsEntry() external view returns(address);

  function getAllowedProviders(address _previousProvider, uint256 _maxResults) external view returns(address[] memory);

  function getExpiration(address _provider) external view returns(uint64);

  function getPermissions(
    address _provider,
    bytes32 _startKey,
    uint256 _maxResults
  ) external view returns(PermissionValue[] memory);

  function getData(address _owner, bytes32 _key) external view returns(string memory);
}
