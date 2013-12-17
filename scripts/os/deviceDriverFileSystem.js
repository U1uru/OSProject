/* ----------------------------------
   DeviceDriverFileSystem.js
   
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverFileSystem()
{
   this.numTracks = 4;
   this.numSectors = 8;
   this.numBlocks = 8;
   this.numBytes = 64;

   this.format = function(){

      var emptyBytes = "";
      for(i = 1; i < this.numBytes;i++)
         emptyBytes += "-";

      for(i = 0;i < this.numTracks;i++){
         for(j = 0; j < this.numSectors;j++){
            for(k = 0;k < this.numBlocks;k++){
               var data = "0" + emptyBytes;
               sessionStorage[i+","+j+","+k] = data;
            }
         }
      }
      sessionStorage["0,0,0"] = "1---MBR";
   }
}
