/* ------------
   MemManager.js
   
   
   ------------ */

function memManager()
{
   this.mm = {
      sect0:
      {
         base : 0,
         limit : 255,
         open : true
      },
      sect1:
      {
         base : 256,
         limit : 511,
         open : true
      },
      sect2:
      {
         base : 512,
         limit : 767,
         open : true
      }
   };

   //check if any space is available in memory
   this.isMemAvailable = function(){
      return (this.mm.sect0.open || this.mm.sect1.open || this.mm.sect2.open);
   }

   //return number of next open section
   this.getNextSect = function(){
      if(this.mm.sect0.open){
         this.mm.sect0.open = false;
         return 0;
      }
      if(this.mm.sect1.open){
         this.mm.sect1.open = false;
         return 1;
      }
      if(this.mm.sect2.open){
         this.mm.sect2.open = false;
         return 2;
      }
      return -1;
   }

   //return the next byte in memory if it is accessible by currently running process
   this.getNextByte = function(){
      _CPU.PC++;
      if(_CPU.PC + _RunningProcess.base > _RunningProcess.limit){
         _CPU.PC--;
         var interrupt = new Interrupt(PROGRAM_IRQ,"Illegal Memory Access");
         _KernelInterruptQueue.enqueue(interrupt);
      }
      return _Memory[_CPU.PC + _RunningProcess.base];
   }

   //return a byte from a specified address
   this.getByte = function(address){
      var adjAddress = address + _RunningProcess.base;
      if(adjAddress < _RunningProcess.base || adjAddress > _RunningProcess.limit){
         var interrupt = new Interrupt(PROGRAM_IRQ,"Illegal Memory Access");
         _KernelInterruptQueue.enqueue(interrupt);
      }
      return _Memory[adjAddress];
   }

   //sets a byte at a specified address
   this.setByte = function(address, data){
      if(data.length === 1)
         data = "0" + data;
      var adjAddress = address + _RunningProcess.base;
      if(adjAddress < _RunningProcess.base || adjAddress > _RunningProcess.limit){
         var interrupt = new Interrupt(PROGRAM_IRQ,"Illegal Memory Access");
         _KernelInterruptQueue.enqueue(interrupt);
      }
      _Memory[adjAddress] = data.toUpperCase();
   }

   //clear mem sections
   this.clear0 = function(){
      this.mm.sect0.open = true;
      for(i = 0; i < 256;i++)
         _Memory[i] = "00";
   }
   this.clear1 = function(){
      this.mm.sect1.open = true;
      for(i = 256; i < 512;i++)
         _Memory[i] = "00";
   }
   this.clear2 = function(){
      this.mm.sect2.open = true;
      for(i = 512; i < 768;i++)
         _Memory[i] = "00";
   }

   this.getMemoryData = function(base, limit){
      var data = _Memory[base];
      for(i = base+1;i <= limit;i++)
         data += " "+_Memory[i];
      return data;
   }

   this.rollOut = function(process){
      var fileName = "¡"+ process.pid;
      var data = this.getMemoryData(process.base,process.limit);
      krnFSDriver.create(fileName);
      krnFSDriver.write(fileName,data);
      
      if(process.slot === 0)this.clear0();
      else if(process.slot === 1)this.clear1();
      else if(process.slot === 2)this.clear2();

      process.base = process.limit = process.slot = -1;
      process.state = "on disk";
   }

   this.rollIn = function(process){
      var fileName = "¡"+process.pid;
      var data = krnFSDriver.read(fileName);
      krnFSDriver.delete(fileName);
      
      process.slot = this.getNextSect();
      process.base = process.slot*256;
      process.limit = process.slot*256+255;

      var programArray = data.split(/\s/);
      for(i = 0; i < programArray.length; i++){
         _Memory[i+process.base] = programArray[i].toUpperCase();
      }
      process.state = "ready";
   }
}
