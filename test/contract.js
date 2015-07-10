var asrt = require('assert');
var erisC = require('../index');
var MockPipe = require('./mock/mock_pipe.js');
var testData = require('./testdata/testdata.json');
var contracts = erisC.solidityContracts(new MockPipe());

var abi = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "a",
                "type": "int256"
            },
            {
                "name": "b",
                "type": "int256"
            }
        ],
        "name": "add",
        "outputs": [
            {
                "name": "sum",
                "type": "int256"
            }
        ],
        "type": "function"
    },
    {
        "inputs": [],
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "a",
                "type": "int256"
            },
            {
                "indexed": true,
                "name": "b",
                "type": "int256"
            },
            {
                "indexed": true,
                "name": "sum",
                "type": "int256"
            },
            {
                "indexed": false,
                "name": "body",
                "type": "bytes32"
            }
        ],
        "name": "Added",
        "type": "event"
    }
];

var newAddr = "";

var contractFactory = contracts(abi);

describe('TestAll', function () {

    it("should create a contract and simulate an event fired upon calling.", function (done) {
        contractFactory.new({to: newAddr, data: ""}, function (error, contract) {
            console.log(contract.address);
            asrt.equal(contract.address, "9FC1ECFCAE2A554D4D1A000D0D80F748E66359E3", "Contract address wrong.");
            asrt.deepEqual(contract.abi, abi, "Contract abi not matching expected.");
            contract.Added(function(error, event){
                asrt.ifError(error);
                asrt.equal(event.event, "Added");
                asrt.equal(event.address.slice(24), contract.address);
                var a = event.args.a.toString();
                var b = event.args.b.toString();
                var sum = event.args.sum.toString();
                asrt.equal(sum, "30");
                done();
            });
            contract.add(5, 25, function (error, data) {
                asrt.equal(data.toString(), '30');
            });

        });
    });

});