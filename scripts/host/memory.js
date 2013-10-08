/* ------------  
   memory.js

   Requires global.js.
   
   ------------ */

function Memory()
{
   var memArray = new Array(); // haha it's a pun

   for(i = 0; i < 256; i++)
   {
      memArray[i] = "00";
   }

   return memArray;
}
