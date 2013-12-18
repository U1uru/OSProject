/* ------------
   Loader.js
   
   Handles loading of user programs into memory.
   ------------ */

function loadUserProgram(priority)
{
   //check that input is valid hex code
   var input = _UserInput.value
   var re = /^(?:[0-9]|[A-F]|[a-f]|\s)*$/;
   if(!re.test(input))
      return -1;

   //check memory manager for available memory
   if(!_MemManager.isMemAvailable()){
      return -1;
   }
   var process = createProcess(priority);
   //separate opcodes into array and enter into mem
   var userProgramArray = input.split(/\s/);
   for(i = 0; i < userProgramArray.length; i++){
      if(process.base+i > process.limit){ // incase program too large
         for(j = process.base+i-1;j >= process.base;j--)
            _Memory[j] = "00";
         return -2;
      }
      _Memory[i+process.base] = userProgramArray[i].toUpperCase();
   }
   process.state = "ready";
   _ProcessArray[process.pid] = process;

   return process.pid;
}

function createProcess(priority)
{
   var state = "new";
   var pc = 0;

   var base, limit;
   var nextSect = _MemManager.getNextSect();
   if(nextSect >= 0){
      base = nextSect*256;
      limit = nextSect*256+255;
   }

   var pid = _PID++;

   var newProcess = new pcb(pid, state, pc, base, limit, priority);

   return newProcess;
}
