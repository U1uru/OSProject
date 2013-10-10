/* ------------
   Loader.js
   
   Handles loading of user programs into memory.
   ------------ */

function loadUserProgram()
{
   //check that input is valid hex code
   var input = _UserInput.value
   var re = /^(?:[0-9]|[A-F]|[a-f]|\s)*$/;
   if(!re.test(input))
      return -1;

   //need to check memory manager for available memory,
   //but for now will just always load into the one memory slot.

   var process = createProcess();
   //clear memory
   for(i = 0;i < _Memory.length;i++)
      _Memory[i] = "00";
   //separate opcodes into array and enter into mem
   var userProgramArray = input.split(/\s/);
   for(i = 0; i < userProgramArray.length; i++)
      _Memory[i] = userProgramArray[i].toUpperCase();
   process.state = "ready";
   _ProcessArray[process.pid] = process;

   return process.pid;
}

function createProcess()
{
   var state = "new";
   var pc = 0;
   //to do: include scheduling information and
   //memory management information once multiple 
   //programs can be loaded.

   var pid = _PID++;

   var newProcess = new pcb(pid, state, pc);

   return newProcess;
}