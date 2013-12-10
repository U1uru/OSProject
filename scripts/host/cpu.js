/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };

    //Update CPU with values from a PCB
    this.switch = function(PCB){
        this.PC = PCB.pc;
        this.Acc = PCB.accumulator;
        this.Xreg = PCB.xReg;
        this.Yreg = PCB.yReg;
        this.Zflag = PCB.zFlag;
    };
    
    //clear cpu without stopping execution
    this.clear = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;
    };

    this.cycle = function() {
        krnTrace("CPU cycle");
        // TODO: Accumulate CPU usage and profiling statistics here.
        // Do the real work here. Be sure to set this.isExecuting appropriately.

        //Fetch and execute the next opcode.
        this.execute(this.fetch());
    };

    //brings opcode in from memory
    this.fetch = function(){
        return _Memory[this.PC]; //will need to adjust once more memory slots exist
    };

    this.execute = function(instruction){
        switch(instruction)
        {
           case "A9": loadAccWithConst(); break;
           case "AD": loadAccFromMem(); break;
           case "8D": storeAccInMem(); break;
           case "6D": addWithCarry(); break;
           case "A2": loadXWithConst(); break;
           case "AE": loadXFromMem(); break;
           case "A0": loadYWithConst(); break;
           case "AC": loadYFromMem(); break;
           case "EA": noOp(); break;
           case "00": breakSysCall(); break;
           case "EC": compareMemToX(); break;
           case "D0": branchIfNotZ(); break;
           case "EE": incrByteValue(); break;
           case "FF": sysCall(); break;
        }
    };
}

function loadAccWithConst()
{
    _CPU.Acc = parseInt(_MemManager.getNextByte(),16);
    _CPU.PC++;
}

function loadAccFromMem()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    //command switches params for some reason?
    //i.e. LDA $0010 -> AD 10 00
    var memAddress = adr2 + adr1;
    _CPU.Acc = parseInt(_MemManager.getByte(parseInt(memAddress,16)),16);
    _CPU.PC++;
}

function storeAccInMem()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    _MemManager.setByte(parseInt(memAddress,16),_CPU.Acc.toString(16));
    _CPU.PC++;
}

function addWithCarry()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    _CPU.Acc += parseInt(_MemManager.getByte(parseInt(memAddress,16)),16);
    _CPU.PC++;
}

function loadXWithConst()
{
    _CPU.Xreg = parseInt(_MemManager.getNextByte(),16);
    _CPU.PC++;
}

function loadXFromMem()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    _CPU.Xreg = parseInt(_MemManager.getByte(parseInt(memAddress,16)),16);
    _CPU.PC++;
}

function loadYWithConst()
{
    _CPU.Yreg = parseInt(_MemManager.getNextByte(),16);
    _CPU.PC++;
}

function loadYFromMem()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    _CPU.Yreg = parseInt(_MemManager.getByte(parseInt(memAddress,16)),16);
    _CPU.PC++;
}

function noOp()
{
    _CPU.PC++;
}

function breakSysCall()
{
    _RunningProcess.state = "terminated";
    if(_ReadyQueue.isEmpty()){
        _CPU.isExecuting = false;
        _RunningProcess = null;
    }
    else{
        _CPU.clear();
        _RunningProcess = _ReadyQueue.dequeue();
        _RunningProcess.state = "running";
        _CPU.switch(_RunningProcess);
    }
}

function compareMemToX()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    if(parseInt(_MemManager.getByte(parseInt(memAddress,16)),16) === _CPU.Xreg)
        _CPU.Zflag = 1;
    else
        _CPU.Zflag = 0;
    _CPU.PC++;
}

function branchIfNotZ()
{
    if(_CPU.Zflag === 0){
        _CPU.PC += parseInt(_MemManager.getNextByte(),16)
        if(_CPU.PC > (_MEMORY_PARTITION_SIZE - 1))
            _CPU.PC -= _MEMORY_PARTITION_SIZE;
        _CPU.PC += 2;
    }
    else
        _CPU.PC += 2;
}

function incrByteValue()
{
    var adr1 = _MemManager.getNextByte();
    var adr2 = _MemManager.getNextByte();
    var memAddress = adr2 + adr1;
    var oldValue = parseInt(_MemManager.getByte(parseInt(memAddress,16)),16);
    var newValue = (oldValue + 1).toString(16);
    _MemManager.setByte(parseInt(memAddress,16),newValue);
    _CPU.PC++;
}

function sysCall()
{
    if(_CPU.Xreg === 1){
        //print integer in yreg
        var yValue = _CPU.Yreg.toString(16)
        _Console.putText(yValue);
        _Console.advanceLine();
        _Console.putText(_OsShell.promptStr);
    }
    else if(_CPU.Xreg === 2){
        //print 00 term str at address in yreg
        var yAddress = _CPU.Yreg;
        var byte = _MemManager.getByte(yAddress);
        while(byte != "00"){
            var character = String.fromCharCode(parseInt(byte,16));
            _Console.putText(character);
            yAddress++;
            byte = _MemManager.getByte(yAddress);
        }
        _Console.advanceLine();
        _Console.putText(_OsShell.promptStr);
    }
    _CPU.PC++;
}
