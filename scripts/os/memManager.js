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
}
