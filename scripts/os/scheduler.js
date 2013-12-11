/* ------------
   Scheduler.js
   
   
   ------------ */

function scheduler()
{
   this.schedulingAlg = ROUND_ROBIN;

   this.contextSwitch = function(){
      if(_ReadyQueue.getSize() > 0){
         krnTrace("Context Switch");
         _RunningProcess.state = "ready";
         _RunningProcess.pc = _CPU.PC;
         _RunningProcess.accumulator = _CPU.Acc;
         _RunningProcess.xReg = _CPU.Xreg;
         _RunningProcess.yReg = _CPU.Yreg;
         _RunningProcess.zFlag = _CPU.Zflag;

         _ReadyQueue.enqueue(_RunningProcess);
         _RunningProcess = _ReadyQueue.dequeue();
         _RunningProcess.state = "running";
         _CPU.switch(_RunningProcess);
      }
      _NumCycles = 0;
   }
}
