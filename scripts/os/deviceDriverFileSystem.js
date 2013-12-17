/* ----------------------------------
   DeviceDriverFileSystem.js
   
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;

function DeviceDriverFileSystem()
{
   this.numTracks = 4;
   this.numSectors = 8;
   this.numBlocks = 8;
   this.numBytes = 64;
   this.dataOffset = 4;

   this.format = function(){

      try
      {
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
         return true;
      }
      catch(error)
      {
         return false;
      }
   }
   
   this.create = function(fileName){

      try{
         if(fileName.length >= 60)
            return "Filename too long. Must be under 60 characters.";
         var dirT,dirS,dirB,dataT,dataS,dataB;
         var set = false;
         for(j = 0; j < this.numSectors;j++){
            for(k = 0;k < this.numBlocks;k++){
               var block = sessionStorage["0,"+j+","+k];
               if(this.getData(block) === fileName)return "File already exists";
               if(block[0] === "0" && !set){
                  set = true;
                  dirT = 0;
                  dirS = j;
                  dirB = k;
               }
            }
         }
         if(!set)
            return "Error: Directory full";
         set = false;
         for(i = 1;i < this.numTracks;i++){
            for(j = 0;j < this.numSectors;j++){
               for(k = 0;k < this.numBlocks;k++){
                  var block = sessionStorage[i+","+j+","+k];
                  if(block[0] === "0" && !set){
                     set = true;
                     dataT = i;
                     dataS = j;
                     dataB = k;
                  }
               }
            }
         }
         if(!set)
            return "Error: Memory full";
         var dirData = "1"+dataT+dataS+dataB+fileName+"Ω";
         var dirEntry = dirData + sessionStorage[dirT+","+dirS+","+dirB].slice(dirData.length);
         sessionStorage[dirT+","+dirS+","+dirB] = dirEntry;
         var fileData = "1" + sessionStorage[dataT+","+dataS+","+dataB].slice(1);
         sessionStorage[dataT+","+dataS+","+dataB] = fileData;
         return true;
      }
      catch(error)
      {
         return "Unknown error; could not create file";
      }
   }

   this.write = function(fileName,data){
      try{
         if(data.length < 60){
            for(i = 0;i < this.numSectors;i++){
               for(j = 0;j < this.numBlocks;j++){
                  var block = sessionStorage["0,"+i+","+j];
                  if(this.getData(block) === fileName){
                     var dataAddress = block[1]+","+block[2]+","+block[3];
                     var writeData = data + "Ω" + sessionStorage[dataAddress].slice(data.length+1);
                     sessionStorage[dataAddress] = writeData;
                     return true;
                  }
               }
            }
            return "file not found";
         }
      }
      catch(error)
      {
         console.log(error);
         return "unknown error; write failed";
      }
   }

   this.getData = function(block){
      var data = "";
      var i = this.dataOffset;
      var character = block[i];
      while(!(character === "Ω") && i < this.numBytes){
         data += character;
         character = block[++i];
      }
      return data;
   }
}
