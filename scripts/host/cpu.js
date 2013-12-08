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
    _CPU.Acc = parseInt(_Memory[++_CPU.PC],16);
    _CPU.PC++;
}

function loadAccFromMem()
{
    var adr1 = _Memory[++_CPU.PC];
    var adr2 = _Memory[++_CPU.PC];
    //command switches params for some reason?
    //i.e. LDA $0010 -> AD 10 00
    var memAddress = adr2 + adr1;
    _CPU.Acc = parseInt(_Memory[parseInt(memAddress,16)],16);
    _CPU.PC++;
}

function storeAccInMem()
{

}

function breakSysCall()
{
    _CPU.isExecuting = false;
}
