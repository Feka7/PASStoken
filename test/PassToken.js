const PassToken = artifacts.require("PassToken");
const truffleAssert = require('truffle-assertions');

contract("PassToken test", async accounts => {

  let instance;
  beforeEach('should setup the contract instance', async () => {
    instance = await PassToken.deployed();
  });

  it("should create first Pass", async () => {
    const id = await instance.createPass.call("first");
    assert.equal(id.valueOf(), 1);
  });

  it('shouldn\'\ t access to pass has not been created yet', async () => {
      await truffleAssert.reverts(instance.getDetails.call(1));
  });

  it("should get details to the pass", async () => {
      await instance.createPass("");
      let result = await instance.getDetails.call(1);
      assert.equal(result[0].valueOf(), '0x0000000000000000000000000000000000000000');
      assert.equal(result[1].toNumber(), 0);
      assert.equal(result[2].toNumber(), 0);
      assert.equal(result[3].toNumber(), 0);
      assert.equal(result[4].toNumber(), 0);
  });

  it("should change URI to the pass", async () => {
      let newURI = "changeTokenURI";
      await instance.changeTokenURI(1, newURI);
      assert.equal(newURI, await instance.tokenURI(1));
  });

  it("should set offer to the pass", async () => {
      await instance.setOffer(1, 1, 1);
      let result = await instance.getDetails.call(1);
      assert.equal(result[0].valueOf(), '0x0000000000000000000000000000000000000000');
      assert.equal(result[1].toNumber(), 1);
      assert.equal(result[2].toNumber(), 1);
      assert.equal(result[3].toNumber(), 0);
      assert.equal(result[4].toNumber(), 1);
  });


  it("should upgrade offer to the pass", async () => {
      await instance.upgradeOffer(1, 2, 2);
      let result = await instance.getDetails.call(1);
      assert.equal(result[0].valueOf(), '0x0000000000000000000000000000000000000000');
      assert.equal(result[1].toNumber(), 1);
      assert.equal(result[2].toNumber(), 2);
      assert.equal(result[3].toNumber(), 0);
      assert.equal(result[4].toNumber(), 2);
  });

  it("should remove offer to the pass", async () => {
      await instance.removeOffer(1);
      let result = await instance.getDetails.call(1);
      assert.equal(result[1].toNumber(), 0);
  });

  it("should rent the pass", async () => {
      await instance.setOffer(1, 1, web3.utils.toWei('1', 'ether'));
      await instance.rentPass(1, {
          from: accounts[1],
          value: web3.utils.toWei('1', 'ether')
      });
      let result = await instance.getDetails.call(1);
      assert.equal(result[0].valueOf(), accounts[1]);
  });

  it("should retrieve the pass", async () => {
      await new Promise(r => setTimeout(r, 2000));
      await instance.retrievePass(1);
      let result = await instance.getDetails.call(1);
      assert.equal(result[0].valueOf(), accounts[1]);
  });


  it("should withdraw what you earn", async () => {
      let balanceBefore = await web3.eth.getBalance(accounts[0]);
      await instance.withdrawEarn( { from: accounts[0] } );
      let balanceAfter = await web3.eth.getBalance(accounts[0]);
      assert(parseFloat(balanceAfter) > parseFloat(balanceBefore), "error in account balance");
  });

  it('only creator can set, upgrade, remove and retrieve offer', async () => {
      await truffleAssert.reverts(instance.setOffer.call(1, 1, 1, {
        'from': accounts[1]
      }));
      await truffleAssert.reverts(instance.upgradeOffer.call(1, 1, 1, {
        'from': accounts[1]
      }));
      await truffleAssert.reverts(instance.removeOffer.call(1, {
        'from': accounts[1]
      }));
      await truffleAssert.reverts(instance.retrievePass.call(1, {
        'from': accounts[1]
      }));
  });

  it('creator can\'\ t upgrade and remove offer to pass in not sale status', async () => {
      await truffleAssert.reverts(instance.upgradeOffer.call(1, 1, 1));
      await truffleAssert.reverts(instance.removeOffer.call(1));
  });

  it('creator can\'\ t set offer to pass in sale status', async () => {
      await instance.setOffer(1, 2, web3.utils.toWei('1', 'ether'));
      await truffleAssert.reverts(instance.setOffer.call(1, 1, 1));
  });

  it('consumer can\'\ t rent pass in not sale status', async () => {
      await instance.createPass("second");
      await truffleAssert.reverts(instance.rentPass.call(2, {
          from: accounts[1],
          value: web3.utils.toWei('1', 'ether')
      }));
  });

  it('consumer can\'\ t rent pass if not send the exactly ether', async () => {
      await truffleAssert.reverts(instance.rentPass.call(1, {
          from: accounts[1],
          value: web3.utils.toWei('2', 'ether')
      }));
  });

  it('creator can\'\ t retrieve pass in rent status', async () => {
      await instance.rentPass(1, {
          from: accounts[1],
          value: web3.utils.toWei('1', 'ether')
      });
      await truffleAssert.reverts(instance.retrievePass.call(1));
  });

  it('creator can\'\ t withdraw if have Earn balance = 0', async () => {
      await instance.withdrawEarn();
      await truffleAssert.reverts(instance.withdrawEarn.call());
  });

  it("consumer can verify that rent the pass", async () => {

    const result = await instance.isConsumer.call(1, {
        from: accounts[1]
    });
    assert.equal(result.valueOf(), true);
  });

  it("only actually consumer can verify that rent the pass", async () => {
    const result = await instance.isConsumer.call(1, {
        from: accounts[2]
    });
    assert.equal(result.valueOf(), false);
  });

  it("only creator can change the tokenURI", async () => {
    await truffleAssert.reverts(instance.changeTokenURI.call(1, "change", {
        from: accounts[1]
    }));
  });

  it('should emit create with correct paremeters', async () => {
      const result = await instance.createPass("");
      truffleAssert.eventEmitted(result, 'Create', (ev) => {
          return ev.itemId == 3;
      });
  });

  it('should emit offer with correct paremeters', async () => {
      const result = await instance.setOffer(2, 1, 1);
      truffleAssert.eventEmitted(result, 'Offer', (ev) => {
          return ev.itemId == 2 && ev.day == 1 && ev.price ==1;
      });
  });

  it('should emit upgrade with correct paremeters', async () => {
      const result = await instance.upgradeOffer(2, 2, 1);
      truffleAssert.eventEmitted(result, 'Upgrade', (ev) => {
          return ev.itemId == 2 && ev.day == 2 && ev.price == 1;
      });
  });

  it('should emit rent with correct paremeters', async () => {
      const result = await instance.rentPass(2, {
          from: accounts[1],
          value: 1
      });
      truffleAssert.eventEmitted(result, 'Rent', (ev) => {
          return ev.itemId == 2;
      });
  });

  it("only if rent is valid consumer can verify that rent the pass", async () => {
    await new Promise(r => setTimeout(r, 5000));
    await truffleAssert.reverts(instance.isConsumer.call(1, {
        from: accounts[1]
    }));
  });

});
