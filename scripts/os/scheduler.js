/* ------------
   Scheduler.js
   
   
   ------------ */

function scheduler()
{

   this.contextSwitch = function(){
      if(_ReadyQueue.getSize() > 0){
         krnTrace("Context Switch");
         if(_RunningProcess.state != "terminated"){
            _RunningProcess.state = "ready";
            _RunningProcess.pc = _CPU.PC;
            _RunningProcess.accumulator = _CPU.Acc;
            _RunningProcess.xReg = _CPU.Xreg;
            _RunningProcess.yReg = _CPU.Yreg;
            _RunningProcess.zFlag = _CPU.Zflag;

            _ReadyQueue.enqueue(_RunningProcess);
         }
         _RunningProcess = _ReadyQueue.dequeue();
         if(_RunningProcess.slot >= 0){
            _RunningProcess.state = "running";
            _CPU.clear();
            _CPU.switch(_RunningProcess);
         }
         else{
            if(!_MemManager.isMemAvailable()){
               var swapFile = _ReadyQueue.q[_ReadyQueue.getSize()-1]
               if(swapFile)
                  _MemManager.rollOut(swapFile);
            }
            _MemManager.rollIn(_RunningProcess);
            _RunningProcess.state = "running";
            _CPU.clear();
            _CPU.switch(_RunningProcess);
         }
      }
      _NumCycles = 0;
   }

   this.setAlgorithm = function(schedule){
      _Schedule = schedule;
      _ReadyQueue.arrange()
   }
}
