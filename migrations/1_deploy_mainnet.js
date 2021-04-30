const ActivePool = artifacts.require("ActivePool");
const BorrowerOperations = artifacts.require("BorrowerOperations");
const TroveManager = artifacts.require("TroveManager");
const CollSurplusPool = artifacts.require("CollSurplusPool");
const DefaultPool = artifacts.require("DefaultPool");
const HintHelpers = artifacts.require("HintHelpers");
const PriceFeed = artifacts.require("PriceFeed");
const SortedTroves = artifacts.require("SortedTroves");
const StabilityPool = artifacts.require("StabilityPool");
const GasPool = artifacts.require("GasPool");
const LUSDToken = artifacts.require("LUSDToken");
const CommunityIssuance = artifacts.require("CommunityIssuance");
const LQTYStaking = artifacts.require("LQTYStaking");
const LQTYToken = artifacts.require("LQTYToken");
const LockInHalflife = artifacts.require("LockInHalflife");
const LUSDUnipool = artifacts.require("Unipool");
const LQTYUnipool = artifacts.require("UnipoolForLqtyLP");
const MultiTroveGetter = artifacts.require("MultiTroveGetter");

const UniswapFactory = artifacts.require("IUniswapFactory");

const wethAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
const uniFactoryAddress = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
const halflifeAddress = "0x4614777bA8a2C0D1fB60EC5149585e700a08974a";
const chainLinkAddress = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";
const bandAddress = "0xDA7a001b254CD22e46d3eAB04d937489c93174C3";

const teamHalflifeAdmin = "";
const multisigAddressForLO = "";
const multisigAddressForCC = "";
const multisigAddressForLBSC = "";


const halflifeReceivers = [
  "",
  "",
  "",
  "",
  "",
  "" 
];
const halflifeAmounts = [
  web3.utils.toWei('10000000'),
  web3.utils.toWei('4500000'),
  web3.utils.toWei('3750000'),
  web3.utils.toWei('3000000'),
  web3.utils.toWei('2250000'),
  web3.utils.toWei('1500000')
];
const halflifeEnableDestroy = [
  false,
  true,
  true,
  true,
  true,
  true
];

const LUSDDuration = 3628800  // 6 weeks: 6 * 7 * 24 * 60 * 60


module.exports = async function (deployer, network) {
  
  /* ===========  deploy core  =========== */
  await deployer.deploy(ActivePool);
  await deployer.deploy(BorrowerOperations);
  await deployer.deploy(TroveManager);
  await deployer.deploy(CollSurplusPool);
  await deployer.deploy(DefaultPool);
  await deployer.deploy(HintHelpers);
  await deployer.deploy(SortedTroves);
  await deployer.deploy(StabilityPool);
  await deployer.deploy(GasPool);
  await deployer.deploy(PriceFeed);
  
  const borrowerOperations = await BorrowerOperations.deployed();
  const sortedTroves = await SortedTroves.deployed();
  const troveManager = await TroveManager.deployed();
  const activePool = await ActivePool.deployed();
  const stabilityPool = await StabilityPool.deployed();
  const defaultPool = await DefaultPool.deployed();
  const collSurplusPool = await CollSurplusPool.deployed();
  const hintHelpers = await HintHelpers.deployed();
  const gasPool = await GasPool.deployed();
  const priceFeed = await PriceFeed.deployed();

  await deployer.deploy(
    LUSDToken, 
    troveManager.address,
    stabilityPool.address,
    borrowerOperations.address
    );

  await deployer.deploy(
    MultiTroveGetter,
    troveManager.address,
    sortedTroves.address
  )
  
  const lusdToken = await LUSDToken.deployed();
  const multiTroveGetter = await MultiTroveGetter.deployed();
  
  /* ===========  deploy LP reward pool  =========== */
  
  await deployer.deploy(LUSDUnipool);
  await deployer.deploy(LQTYUnipool);

  const lusdUnipool = await LUSDUnipool.deployed();
  const lqtyUnipool = await LQTYUnipool.deployed();

  /* ===========  deploy LQTY reward pool  =========== */
  
  await deployer.deploy(CommunityIssuance);
  await deployer.deploy(LQTYStaking);
  await deployer.deploy(LockInHalflife);
  
  const communityIssuance = await CommunityIssuance.deployed();
  const lqtyStaking = await LQTYStaking.deployed();
  const lockInHalflife = await LockInHalflife.deployed();

  
  await deployer.deploy(
    LQTYToken,
    communityIssuance.address,
    lqtyStaking.address,
    lusdUnipool.address,
    lockInHalflife.address,
    multisigAddressForLO,
    multisigAddressForCC,
    multisigAddressForLBSC
    );
  const lqtyToken = await LQTYToken.deployed();
  
  /* ===========  set address  =========== */
  console.log('setting address for activePool')
  console.log()
  await activePool.setAddresses(
    borrowerOperations.address,
    troveManager.address,
    stabilityPool.address,
    defaultPool.address
  );

  console.log('setting address for borrowerOperations')
  console.log()
  await borrowerOperations.setAddresses(
    troveManager.address,
    activePool.address,
    defaultPool.address,
    stabilityPool.address,
    gasPool.address,
    collSurplusPool.address,
    priceFeed.address,
    sortedTroves.address,
    lusdToken.address,
    lqtyStaking.address
  );
  
  console.log('setting address for troveManager')
  console.log()
  await troveManager.setAddresses(
    borrowerOperations.address,
    activePool.address,
    defaultPool.address,
    stabilityPool.address,
    gasPool.address,
    collSurplusPool.address,
    priceFeed.address,
    lusdToken.address,
    sortedTroves.address,
    lqtyToken.address,
    lqtyStaking.address
  );

  console.log('setting address for collSurplusPool')
  console.log()
  await collSurplusPool.setAddresses(
    borrowerOperations.address,
    troveManager.address,
    activePool.address
  )
  
  console.log('setting address for defaultPool')
  console.log()
  await defaultPool.setAddresses(
    troveManager.address,
    activePool.address
  )

  console.log('setting address for hintHelpers')
  console.log()
  await hintHelpers.setAddresses(
    sortedTroves.address,
    troveManager.address
  )

  console.log('setting address for stabilityPool')
  console.log()
  await stabilityPool.setAddresses(
    borrowerOperations.address,
    troveManager.address,
    activePool.address,
    lusdToken.address,
    sortedTroves.address,
    priceFeed.address,
    communityIssuance.address
  )
  
  console.log('setting address for sortedTroves')
  console.log()
  await sortedTroves.setParams(
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    troveManager.address,
    borrowerOperations.address
  )

  console.log('setting address for communityIssuance')
  console.log()
  await communityIssuance.setAddresses(
    lqtyToken.address,
    stabilityPool.address
  )

  console.log('setting address for lqtyStaking')
  console.log()
  await lqtyStaking.setAddresses(
    lqtyToken.address,
    lusdToken.address,
    troveManager.address,
    borrowerOperations.address,
    activePool.address
  )

  console.log('setting address for priceFeed')
  console.log()
  await priceFeed.setAddresses(
      chainLinkAddress,
      bandAddress
  )

  console.log('setting address for lockInHalflife')
  console.log()
  await lockInHalflife.setParams(
    halflifeAddress,
    lqtyToken.address,
    teamHalflifeAdmin,
    halflifeReceivers,
    halflifeAmounts,
    halflifeEnableDestroy
  )
    
  console.log('create LP token')
  const uniswapFactory = await UniswapFactory.at(uniFactoryAddress);
  await uniswapFactory.createPair(lqtyToken.address, wethAddress);
  await uniswapFactory.createPair(lusdToken.address, wethAddress);
  const LQTYLPAddress = await uniswapFactory.getPair(lqtyToken.address, wethAddress);
  const LUSDLPAddress = await uniswapFactory.getPair(lusdToken.address, wethAddress);
  console.log("LQTYLPAddress: " + LQTYLPAddress)
  console.log("LUSDLPAddress: " + LUSDLPAddress)

  
  console.log('setting address for lusdUnipool')
  console.log()
  await lusdUnipool.setParams(
    lqtyToken.address,
    LUSDLPAddress,
    LUSDDuration
  )

  console.log('setting address for lqtyUnipool')
  console.log()
  await lqtyUnipool.setParams(
    lqtyToken.address,
    LQTYLPAddress,
    multisigAddress
  )

};
