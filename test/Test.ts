import { expect } from "chai";
import { ethers } from "hardhat";   
import { parseUnits  } from "ethers";  
import { MooveDAO, ERC20Mock } from "../typechain-types";

describe("MooveDAO Contract", function(){
    let mooveDAO: MooveDAO;
    let daoToken: ERC20Mock;
    let addr1: any;
    let addr2: any;
    let addr3: any;
    let addr4: any;

    beforeEach(async function () {

        [addr1, addr2, addr3, addr4] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("ERC20Mock");
        daoToken = (await Token.deploy("DaoToken", "DAO", parseUnits("1000000", 18))) as unknown as ERC20Mock;
        await daoToken.waitForDeployment();

        await daoToken.transfer(addr1.address, parseUnits("1000", 18));
        await daoToken.transfer(addr2.address, parseUnits("2000", 18));

        const MooveDAO = await ethers.getContractFactory("MooveDAO");
        mooveDAO = (await MooveDAO.deploy(await daoToken.getAddress())) as unknown as MooveDAO;
        await mooveDAO.waitForDeployment();

        
    });

    it("should allow users to buy shares and become members of the DAO", async function () {
        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await expect(mooveDAO.connect(addr1).buyShares(10))
            .to.emit(mooveDAO, "SharesBought")
            .withArgs(addr1.address, 10);

        const shares = await mooveDAO.shares(addr1.address);
        expect(shares).to.equal(10);

    });

    it("should fail if the sale is not active", async function(){
       
        await mooveDAO.stopSale();
        await expect(mooveDAO.connect(addr1).buyShares(5))
            .to.be.revertedWith("La vendita di azioni e' terminata")
    })

    it("should allow a shareholder to create a proposal", async function () {

        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);

        await expect(mooveDAO.connect(addr1).createProposal("Increase budget for R&D"))
            .to.not.be.reverted;

        const proposal = await mooveDAO.getProposal(0);
        expect(proposal[0]).to.equal("Increase budget for R&D") 
    })

    it("should count votes proportionally to the number of shares owned", async function () {

        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);

        await daoToken.connect(addr2).approve(await mooveDAO.getAddress(), parseUnits("200", 18));
        await mooveDAO.connect(addr2).buyShares(20);

        await mooveDAO.connect(addr1).createProposal("Expand marketing");

        await mooveDAO.connect(addr1).vote(0, true);
        await mooveDAO.connect(addr2).vote(0, false);

        const proposal = await mooveDAO.getProposal(0);

        expect(proposal[1]).to.equal(10);
        expect(proposal[2]).to.equal(20);
    })

    it("should allow users to vote and correctly registrer votes", async function () {

        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);

        await daoToken.connect(addr2).approve(await mooveDAO.getAddress(), parseUnits("200", 18));
        await mooveDAO.connect(addr2).buyShares(20);

        await mooveDAO.connect(addr1).createProposal("Expand marketing");

        await mooveDAO.connect(addr1).vote(0, true);
        await mooveDAO.connect(addr2).vote(0, false);

        const proposal = await mooveDAO.getProposal(0);

        expect(proposal[1]).to.equal(10);
        expect(proposal[2]).to.equal(20);

        const addr1VotedFor = await mooveDAO.hasVotedFor(0, addr1.address);
        expect (addr1VotedFor).to.equal(true);

        const addr2VotedAgainst = await mooveDAO.hasVotedAgainst(0, addr2.address);
        expect (addr2VotedAgainst).to.equal(true);  
    })

    it("should approve the proposal when it receives the majority of votes and mark it as executed", async function () {

        await daoToken.transfer(addr3.address, parseUnits("1000", 18));
        await daoToken.transfer(addr4.address, parseUnits("1000", 18));

        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);

        await daoToken.connect(addr2).approve(await mooveDAO.getAddress(), parseUnits("200", 18));
        await mooveDAO.connect(addr2).buyShares(20);

        await daoToken.connect(addr3).approve(await mooveDAO.getAddress(), parseUnits("170", 18));
        await mooveDAO.connect(addr3).buyShares(17);

        await daoToken.connect(addr4).approve(await mooveDAO.getAddress(), parseUnits("50", 18));
        await mooveDAO.connect(addr4).buyShares(5);

        await mooveDAO.connect(addr3).delegateVote(addr1.address)
        await mooveDAO.connect(addr4).delegateVote(addr2.address)

        await mooveDAO.connect(addr1).createProposal("Expand marketing");

        await mooveDAO.connect(addr1).vote(0, true);
        await mooveDAO.connect(addr2).vote(0, false);
    
        await mooveDAO.connect(addr1).executeProposal(0); 

        const proposal = await mooveDAO.getProposal(0);
        expect(proposal[3]).to.equal(true);    

    })

    it("should correctly maintain the record of proposals and their votes", async function () {

        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);

        await daoToken.connect(addr2).approve(await mooveDAO.getAddress(), parseUnits("200", 18));
        await mooveDAO.connect(addr2).buyShares(20);

        await mooveDAO.connect(addr1).createProposal("Expand marketing");
        await mooveDAO.connect(addr2).createProposal("Increase development team");

        const proposal1 = await mooveDAO.getProposal(0)
        const proposal2 = await mooveDAO.getProposal(1)

        expect(proposal1[0].toString()).to.equal("Expand marketing")
        expect(proposal2[0].toString()).to.equal("Increase development team")

        await mooveDAO.connect(addr1).vote(0,true)
        await mooveDAO.connect(addr2).vote(0,false)

        await mooveDAO.connect(addr2).vote(1,true)
        await mooveDAO.connect(addr1).vote(1,false)

        const updateProposal1 = await mooveDAO.getProposal(0);
        const updateProposal2 = await mooveDAO.getProposal(1);

        expect(updateProposal1[1]).to.equal(10);
        expect(updateProposal1[2]).to.equal(20);

        expect(updateProposal2[1]).to.equal(20);
        expect(updateProposal2[2]).to.equal(10);

        const addr1VotedForProp0 = await mooveDAO.hasVotedFor(0, addr1.address);
        const addr2VotedAgainstProp0 = await mooveDAO.hasVotedAgainst(0, addr2.address);
    
        expect(addr1VotedForProp0).to.equal(true);
        expect(addr2VotedAgainstProp0).to.equal(true);
    
        const addr1VotedAgainstProp1 = await mooveDAO.hasVotedAgainst(1, addr1.address);
        const addr2VotedForProp1 = await mooveDAO.hasVotedFor(1, addr2.address);
    
        expect(addr1VotedAgainstProp1).to.equal(true);
        expect(addr2VotedForProp1).to.equal(true);
        
    })

    it("should not allow voting without owning shares or delegations", async function () {
        await daoToken.connect(addr1).approve(await mooveDAO.getAddress(), parseUnits("100", 18));
        await mooveDAO.connect(addr1).buyShares(10);
        await mooveDAO.connect(addr1).createProposal("Test proposal");
    
        await expect(
            mooveDAO.connect(addr3).vote(0, true)
        ).to.be.revertedWith("Nessun potere di voto");
    });
    
})
