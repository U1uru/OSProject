/* --------  
   Tables.js

   Fill memory tables
   -------- */

function tables() {
   var memTable = document.getElementById("memoryOutput");
   var text = "";
   for(i = 0;i < _MEMORY_SIZE;i++)
      text += _Memory[i] + " ";
   memTable.value = text;

   var cpuTable = document.getElementById("cpuOutput");
   text = "Program Counter: " + _CPU.PC.toString(16).toUpperCase() +
          "\nAccumulator: " + _CPU.Acc.toString(16).toUpperCase() +
          "\nX Register: " + _CPU.Xreg.toString(16).toUpperCase() +
          "\nY Register: " + _CPU.Yreg.toString(16).toUpperCase() +
          "\nZ Flag: " + _CPU.Zflag.toString(16).toUpperCase();
   cpuTable.value = text;

   var pcbTable = document.getElementById("PCBs");
   text = "PID\tBase Address\tLimit Address\tState\n";
   if(_RunningProcess != null)
   text += _RunningProcess.pid+"\t"+_RunningProcess.base+"\t\t"+_RunningProcess.limit+"\t\t"+_RunningProcess.state;
   pcbTable.value = text;
}
