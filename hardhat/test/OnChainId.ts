import { loadFixture, time } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { Signer } from 'ethers';
import { keccak256, toUtf8Bytes, formatBytes32String } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

const DISCORD_HASH = formatBytes32String('Discord');
const GITHUB_HASH = formatBytes32String('GitHub');
const THIRD_PARTY_DATA_HASH = keccak256(toUtf8Bytes('VENDOR_PREFIX__CustomDataName'));
const INVALID_KEY = ethers.constants.HashZero;
const INVALID_PROVIDER = ethers.constants.AddressZero;

describe('OnChainId', function () {
  let deployer!: Signer;
  let user1!: Signer;
  let user2!: Signer;
  let provider1!: Signer;
  let provider2!: Signer;
  let provider3!: Signer;

  before(async () => {
    [
      deployer,
      user1,
      user2,
      provider1,
      provider2,
      provider3,
    ] = await ethers.getSigners();
  });

  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function fixtures() {
    const OnChainId = await ethers.getContractFactory('OnChainId');
    const onChainId = await OnChainId.deploy();

    return { onChainId };
  }

  describe('Private Data Storage', function () {
    it('Basic operations', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[], ethers.constants.HashZero]);

      // Adding Discord entry
      await contractU1.writeData(DISCORD_HASH, 'MyUsername#1234');
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
      ], ethers.constants.HashZero]);

      // Adding GitHub entry
      await contractU1.writeData(GITHUB_HASH, 'OpenCoder90');
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [GITHUB_HASH, 'OpenCoder90'],
      ], ethers.constants.HashZero]);

      // Adding Custom entry
      await contractU1.writeData(THIRD_PARTY_DATA_HASH, '12');
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [GITHUB_HASH, 'OpenCoder90'],
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);

      // Check partial retrivial
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 1)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
      ], GITHUB_HASH]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 2)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [GITHUB_HASH, 'OpenCoder90'],
      ], THIRD_PARTY_DATA_HASH]);
      expect(await contractU1.getDataEntries(THIRD_PARTY_DATA_HASH, 2)).deep.eq([[
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);
      expect(await contractU1.getDataEntries(GITHUB_HASH, 2)).deep.eq([[
        [GITHUB_HASH, 'OpenCoder90'],
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);

      // Removing GitHub entry
      await contractU1.deleteData(GITHUB_HASH);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);

      // Removing Discord entry
      await contractU1.deleteData(DISCORD_HASH);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);

      // Removing Custom entry
      await contractU1.deleteData(THIRD_PARTY_DATA_HASH);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[], ethers.constants.HashZero]);
    });

    it('Using invalid keys', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      // Data
      await expect(contractU1.writeData(INVALID_KEY, 'MyUsername#1234')).revertedWithCustomError(contractU1, 'InvalidPrivateDataKey');
      await expect(contractU1.writeData(DISCORD_HASH, '')).revertedWithCustomError(contractU1, 'InvalidPrivateData');

      // Permissions
      await expect(contractU1.writePermissions(INVALID_PROVIDER, [
        { key: DISCORD_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE())).revertedWithCustomError(contractU1, 'InvalidProvider');
      await expect(contractU1.writePermissions(provider1.getAddress(), [], await contractU1.NO_EXPIRATION_VALUE()))
      .revertedWithCustomError(contractU1, 'InvalidPermissions');
      await expect(contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
      ], 0)).revertedWithCustomError(contractU1, 'InvalidExpiration');
      await expect(contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
      ], Math.floor(new Date().getTime() / 1000) - 100)).revertedWithCustomError(contractU1, 'InvalidExpiration');

      // Expiration
      await expect(contractU1.setProviderExpiration(provider2.getAddress(), await contractU1.NO_EXPIRATION_VALUE()))
        .revertedWithCustomError(contractU1, 'PermissionsForTheGivenProviderAreEmpty');
    });

    it('Adding/removing multiple entries', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      // Adding two entries at once
      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#1234' },
        { key: GITHUB_HASH, data: 'OpenCoder90' },
      ]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [GITHUB_HASH, 'OpenCoder90'],
      ], ethers.constants.HashZero]);

      // Adding two entries at once (with an already existing one)
      await contractU1.writeMultipleData([
        { key: GITHUB_HASH, data: 'OpenCoder92' },
        { key: THIRD_PARTY_DATA_HASH, data: '12' },
      ]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#1234'],
        [GITHUB_HASH, 'OpenCoder92'],
        [THIRD_PARTY_DATA_HASH, '12'],
      ], ethers.constants.HashZero]);

      // Updating all entries at once
      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#4567' },
        { key: GITHUB_HASH, data: 'OpenCoder98' },
        { key: THIRD_PARTY_DATA_HASH, data: '42' },
      ]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [DISCORD_HASH, 'MyUsername#4567'],
        [GITHUB_HASH, 'OpenCoder98'],
        [THIRD_PARTY_DATA_HASH, '42'],
      ], ethers.constants.HashZero]);

      // Removing multiple entries
      await contractU1.deleteMultipleData([DISCORD_HASH, THIRD_PARTY_DATA_HASH]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[
        [GITHUB_HASH, 'OpenCoder98'],
      ], ethers.constants.HashZero]);

      // Removing last entry with multiple call
      await contractU1.deleteMultipleData([GITHUB_HASH]);
      expect(await contractU1.getDataEntries(ethers.constants.HashZero, 100)).deep.eq([[], ethers.constants.HashZero]);
    });

    it('Adding/removing providers', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      await contractU1.writeData(DISCORD_HASH, 'MyUsername#1234');
      await contractU1.writeData(GITHUB_HASH, 'OpenCoder90');

      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100))
        .deep.eq([[], ethers.constants.HashZero]);

      // Adding provider1
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider1.getAddress(),
      ], ethers.constants.HashZero]);

      // Adding provider2
      await contractU1.writePermissions(provider2.getAddress(), [
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider1.getAddress(),
        await provider2.getAddress(),
      ], ethers.constants.HashZero]);

      // Adding provider3
      await contractU1.writePermissions(provider3.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider1.getAddress(),
        await provider2.getAddress(),
        await provider3.getAddress(),
      ], ethers.constants.HashZero]);

      // Check partial retrivial
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 1)).deep.eq([[
        await provider1.getAddress(),
      ], await provider2.getAddress()]);
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 2)).deep.eq([[
        await provider1.getAddress(),
        await provider2.getAddress(),
      ], await provider3.getAddress()]);
      expect(await contractU1.getAllowedProviders(provider3.getAddress(), 2)).deep.eq([[
        await provider3.getAddress(),
      ], ethers.constants.HashZero]);
      expect(await contractU1.getAllowedProviders(provider2.getAddress(), 2)).deep.eq([[
        await provider2.getAddress(),
        await provider3.getAddress(),
      ], ethers.constants.HashZero]);

      // Removing provider2
      await contractU1.disableProvider(provider2.getAddress());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider1.getAddress(),
        await provider3.getAddress(),
      ], ethers.constants.HashZero]);

      // Removing provider1
      await contractU1.disableProvider(provider1.getAddress());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider3.getAddress(),
      ], ethers.constants.HashZero]);

      // Removing provider3
      await contractU1.disableProvider(provider3.getAddress());
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100))
        .deep.eq([[], ethers.constants.HashZero]);
    });

    it('Adding/removing multiple providers', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#4567' },
        { key: GITHUB_HASH, data: 'OpenCoder98' },
        { key: THIRD_PARTY_DATA_HASH, data: '42' },
      ]);

      // Adding providers
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      await contractU1.writePermissions(provider2.getAddress(), [
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      await contractU1.writePermissions(provider3.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());

      // Removing providers 1 and 3
      await contractU1.disableProviders([provider1.getAddress(), provider3.getAddress()]);
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100)).deep.eq([[
        await provider2.getAddress(),
      ], ethers.constants.AddressZero]);

      // Removing provider2
      await contractU1.disableProviders([provider2.getAddress()]);
      expect(await contractU1.getAllowedProviders(ethers.constants.AddressZero, 100))
        .deep.eq([[], ethers.constants.AddressZero]);
    });

    it('Fetching data (user)', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);

      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#1234' },
        { key: GITHUB_HASH, data: 'OpenCoder90' },
        { key: THIRD_PARTY_DATA_HASH, data: '12' },
      ]);

      expect(await contractU1.getExpiration(provider1.getAddress())).eq(0);

      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        ethers.constants.HashZero,
      100)).deep.eq([[
        [DISCORD_HASH, false],
        [GITHUB_HASH, false],
        [THIRD_PARTY_DATA_HASH, false],
      ], ethers.constants.HashZero]);

      // Add explicit permissions
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getExpiration(provider1.getAddress())).eq(await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        ethers.constants.HashZero,
      100)).deep.eq([[
        [DISCORD_HASH, true],
        [GITHUB_HASH, true],
        [THIRD_PARTY_DATA_HASH, false],
      ], ethers.constants.HashZero]);

      // Fetching partial result
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        ethers.constants.HashZero,
      2)).deep.eq([[
        [DISCORD_HASH, true],
        [GITHUB_HASH, true],
      ], THIRD_PARTY_DATA_HASH]);
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        THIRD_PARTY_DATA_HASH,
      2)).deep.eq([[
        [THIRD_PARTY_DATA_HASH, false],
      ], ethers.constants.HashZero]);
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        GITHUB_HASH,
      1)).deep.eq([[
        [GITHUB_HASH, true],
      ], THIRD_PARTY_DATA_HASH]);

      // Updating permissions
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: false },
        { key: THIRD_PARTY_DATA_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getExpiration(provider1.getAddress())).eq(await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        ethers.constants.HashZero,
      100)).deep.eq([[
        [DISCORD_HASH, false],
        [GITHUB_HASH, true],
        [THIRD_PARTY_DATA_HASH, true],
      ], ethers.constants.HashZero]);

      // Disabling provider
      await contractU1.disableProvider(provider1.getAddress());
      expect(await contractU1.getExpiration(provider1.getAddress())).eq(0);
      expect(await contractU1.getPermissions(
        provider1.getAddress(),
        ethers.constants.HashZero,
      100)).deep.eq([[
        [DISCORD_HASH, false],
        [GITHUB_HASH, true],
        [THIRD_PARTY_DATA_HASH, true],
      ], ethers.constants.HashZero]);
    });

    it('Fetching data (provider)', async function () {
      const { onChainId } = await loadFixture(fixtures);

      const contractU1 = onChainId.connect(user1);
      const contractU2 = onChainId.connect(user2);
      const contractP1 = onChainId.connect(provider1);
      const contractP2 = onChainId.connect(provider2);
      const contractP3 = onChainId.connect(provider3);

      // User 1
      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#1234' },
        { key: GITHUB_HASH, data: 'OpenCoder90' },
        { key: THIRD_PARTY_DATA_HASH, data: '12' },
      ]);

      // User 2
      await contractU2.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#4567' },
        { key: GITHUB_HASH, data: 'OpenCoder92' },
        { key: THIRD_PARTY_DATA_HASH, data: '42' },
      ]);
      await contractU2.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      await contractU2.writePermissions(provider2.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: THIRD_PARTY_DATA_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());

      expect(await contractU1.getExpiration(provider1.getAddress())).eq(0);

      await expect(contractP1.getData(user1.getAddress(), DISCORD_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP1.getData(user1.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);

      // Add explicit permissions
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: GITHUB_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      expect(await contractP1.getData(user1.getAddress(), DISCORD_HASH)).eq('MyUsername#1234');
      expect(await contractP1.getData(user1.getAddress(), GITHUB_HASH)).eq('OpenCoder90');
      await expect(contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');

      // Updating permissions
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: false },
        { key: THIRD_PARTY_DATA_HASH, canRead: true },
      ], await contractU1.NO_EXPIRATION_VALUE());
      await expect(contractP1.getData(user1.getAddress(), DISCORD_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');
      expect(await contractP1.getData(user1.getAddress(), GITHUB_HASH)).eq('OpenCoder90');
      expect(await contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH)).eq('12');

      // Disabling provider
      await contractU1.disableProvider(provider1.getAddress());
      await expect(contractP1.getData(user1.getAddress(), DISCORD_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP1.getData(user1.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);

      // Multiple users and providers
      expect(await contractP1.getData(user2.getAddress(), DISCORD_HASH)).eq('MyUsername#4567');
      await expect(contractP1.getData(user2.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');
      await expect(contractP1.getData(user2.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');
      expect(await contractP2.getData(user2.getAddress(), DISCORD_HASH)).eq('MyUsername#4567');
      await expect(contractP2.getData(user2.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');
      expect(await contractP2.getData(user2.getAddress(), THIRD_PARTY_DATA_HASH)).eq('42');
      await expect(contractP3.getData(user2.getAddress(), DISCORD_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP3.getData(user2.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
      await expect(contractP3.getData(user2.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(0);
    });

    it('Permissions expiration', async function () {
      const { onChainId } = await loadFixture(fixtures);
      const timestamp = Math.floor(new Date().getTime() / 1000);
      const expiration = timestamp + 60 * 60 * 24 * 31;

      const contractU1 = onChainId.connect(user1);
      const contractP1 = onChainId.connect(provider1);

      // User 1
      await contractU1.writeMultipleData([
        { key: DISCORD_HASH, data: 'MyUsername#1234' },
        { key: GITHUB_HASH, data: 'OpenCoder90' },
        { key: THIRD_PARTY_DATA_HASH, data: '12' },
      ]);

      expect(await contractU1.getExpiration(provider1.getAddress())).eq(0);

      // Add explicit permissions
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: DISCORD_HASH, canRead: true },
        { key: GITHUB_HASH, canRead: true },
      ], expiration);
      expect(await contractU1.getExpiration(provider1.getAddress())).eq(expiration);
      expect(await contractP1.getData(user1.getAddress(), DISCORD_HASH)).eq('MyUsername#1234');
      expect(await contractP1.getData(user1.getAddress(), GITHUB_HASH)).eq('OpenCoder90');
      await expect(contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'DataAccessDenied');

      // Update the data and wait a bit...
      await contractU1.writePermissions(provider1.getAddress(), [
        { key: THIRD_PARTY_DATA_HASH, canRead: true },
      ], expiration);
      await time.increaseTo(expiration - (60 * 60 * 24));
      expect(await contractU1.getExpiration(provider1.getAddress())).eq(expiration);
      expect(await contractP1.getData(user1.getAddress(), DISCORD_HASH)).eq('MyUsername#1234');
      expect(await contractP1.getData(user1.getAddress(), GITHUB_HASH)).eq('OpenCoder90');
      expect(await contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH)).eq('12');


      // Waiting for expiration
      await time.increaseTo(expiration + 1);
      await expect(contractP1.getData(user1.getAddress(), DISCORD_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(expiration);
      await expect(contractP1.getData(user1.getAddress(), GITHUB_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(expiration);
      await expect(contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH))
        .revertedWithCustomError(contractU1, 'AccessDenied').withArgs(expiration);

      // Extending expiration
      await contractU1.setProviderExpiration(provider1.getAddress(), expiration + 3600);
      expect(await contractP1.getData(user1.getAddress(), DISCORD_HASH)).eq('MyUsername#1234');
      expect(await contractP1.getData(user1.getAddress(), GITHUB_HASH)).eq('OpenCoder90');
      expect(await contractP1.getData(user1.getAddress(), THIRD_PARTY_DATA_HASH)).eq('12');
    });
  });
});
