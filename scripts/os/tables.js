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
   text = "PID\tBase Address\tLimit Address\tState";
   if(_RunningProcess != null)
      text += "\n"+ _RunningProcess.pid+"\t"+ _RunningProcess.base+"\t\t"+ _RunningProcess.limit+"\t\t"+ _RunningProcess.state;
   for(i = 0;i < _ReadyQueue.q.length;i++)
      text += "\n"+_ReadyQueue.q[i].pid+"\t"+_ReadyQueue.q[i].base+"\t\t"+_ReadyQueue.q[i].limit+"\t\t"+_ReadyQueue.q[i].state;
   pcbTable.value = text;

   var storageTable = document.getElementById("storageOutput");
   text = "T,S,B\tData";
   for(i = 0;i < krnFSDriver.numTracks;i++){
      for(j = 0; j < krnFSDriver.numSectors;j++){
         for(k = 0;k < krnFSDriver.numBlocks;k++){
            text += "\n" + i+","+j+","+k + " | " +sessionStorage[i+","+j+","+k];
         }
      }
   }
   storageTable.value = text;
}
