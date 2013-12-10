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
         //illegal memory access error
         //do more about this later
         return;
      }
      return _Memory[_CPU.PC + _RunningProcess.base];
   }

   //return a byte from a specified address
   this.getByte = function(address){
      var adjAddress = address + _RunningProcess.base;
      if(adjAddress < _RunningProcess.base || adjAddress > _RunningProcess.limit)
         return;
      return _Memory[adjAddress];
   }

   //sets a byte at a specified address
   this.setByte = function(address, data){
      var adjAddress = address + _RunningProcess.base;
      if(adjAddress < _RunningProcess.base || adjAddress > _RunningProcess.limit)
         return;
      _Memory[adjAddress] = data.toUpperCase();
   }

}
