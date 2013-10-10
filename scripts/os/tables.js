/* --------  
   Tables.js

   Fill memory tables
   -------- */

function tables() {
   var memTable = document.getElementById("memoryOutput");
   var text = "";
   for(i = 0;i < 256;i++)
      text += _Memory[i] + " ";
   memTable.value = text;

   var cpuTable = document.getElementById("cpuOutput");
   text = "Program Counter: " + _CPU.PC +
          "\nAccumulator: " + _CPU.Acc +
          "\nX Register: " + _CPU.Xreg +
          "\nY Register: " + _CPU.Yreg +
          "\nZ Flag: " + _CPU.Zflag;
   cpuTable.value = text;
}