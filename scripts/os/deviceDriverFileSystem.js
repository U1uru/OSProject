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
   this.emptyBytes = "";
   for(i = 0;i<this.numBytes;i++)this.emptyBytes+="-";

   this.format = function(){

      try
      {
         for(i = 0;i < this.numTracks;i++){
            for(j = 0; j < this.numSectors;j++){
               for(k = 0;k < this.numBlocks;k++){
                  var data = "0---";
                  sessionStorage[i+","+j+","+k] = data;
               }
            }
         }
         sessionStorage["0,0,0"] = "1---MBR";
         return true;
      }
      catch(error)
      {
         krnTrace(error);
         return false;
      }
   }
   
   this.create = function(fileName){

      try
      {
         if(fileName.length > 60)
            return "Filename too long. Max is 60 characters.";
         var dirT,dirS,dirB,dataT,dataS,dataB;
         var set = false;
         for(j = 0; j < this.numSectors;j++){
            for(k = 0;k < this.numBlocks;k++){
               var block = sessionStorage["0,"+j+","+k];
               if(block[0] == "1" && this.getData(block) === fileName)return "File already exists";
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
         var dirData = "1"+dataT+dataS+dataB+fileName;
         sessionStorage[dirT+","+dirS+","+dirB] = dirData;
         sessionStorage[dataT+","+dataS+","+dataB] = "1---";
         return true;
      }
      catch(error)
      {
         krnTrace(error);
         return "File creation failed. See log for details.";
      }
   }

   this.read = function(fileName){
      try
      {
         var data = "";
         for(i = 0;i < this.numSectors;i++){
            for(j = 0;j < this.numBlocks;j++){
               var block = sessionStorage["0,"+i+","+j];
               if(block[0] === "1" && this.getData(block) === fileName){
                  var addrs = block.slice(0,4);
                  do {
                     block = sessionStorage[addrs[1]+","+addrs[2]+","+addrs[3]];
                     data += this.getData(block);
                     addrs = block.slice(0,4);
                  }
                  while(addrs[0] === "2");
                  return data;
               }
            }
         }
         return "Error: file not found";
      }
      catch(error)
      {
         krnTrace(error);
         return "File read failed. See log for details.";
      }
   }

   this.write = function(fileName,data){

      try
      {
         var numBlocksNeeded = Math.ceil(data.length/60);
         var addresses = new Queue();
         var blocksFound = 0;
         for(i = 0;i < this.numSectors;i++){
            for(j = 0;j < this.numBlocks;j++){
               var block = sessionStorage["0,"+i+","+j];
               if(block[0] === "1" && this.getData(block) === fileName){
                  var dataAddress = block[1]+","+block[2]+","+block[3];
                  blocksFound++;
                  if(blocksFound === numBlocksNeeded){
                     sessionStorage[dataAddress] = "1---"+data;
                     return true;
                  }
                  addresses.enqueue(dataAddress);
               }
            }
         }
         if(blocksFound === 0)
            return "Error: file not found";
         for(i = 1;i < this.numTracks;i++){
            for(j = 0;j < this.numSectors;j++){
               for(k = 0;k < this.numBlocks;k++){
                  if(blocksFound < numBlocksNeeded){
                     var block = sessionStorage[i+","+j+","+k];
                     if(block[0] === "0"){
                        var dataAddress = i+","+j+","+k;
                        addresses.enqueue(dataAddress);
                        blocksFound++;
                     }
                  }
               }
            }
         }
         if(blocksFound < numBlocksNeeded)
            return "Error: not enough available space";

         var counter = 0;
         while(!addresses.isEmpty()){
            var address = addresses.dequeue();
            if(addresses.isEmpty())
               var firstBytes = "1---";
            else{
               nextAddress = addresses.peek();
               var firstBytes = "2"+nextAddress[0]+nextAddress[2]+nextAddress[4];
            }
            sessionStorage[address] = firstBytes + data.slice(counter*60,counter*60+60);
            counter++;
         }
         return true;
      }
      catch(error)
      {
         krnTrace(error);
         return "File write failed. See log for details.";
      }
   }

   this.delete = function(fileName){
      
      try
      {
         for(i = 0;i < this.numSectors;i++){
            for(j = 0;j < this.numBlocks;j++){
               var block = sessionStorage["0,"+i+","+j];
               if(block[0] === "1" && this.getData(block) === fileName){
                  var addrs = block.slice(0,4);
                  sessionStorage["0,"+i+","+j] = "0"+block.slice(1);
                  do {
                     block = sessionStorage[addrs[1]+","+addrs[2]+","+addrs[3]];
                     sessionStorage[addrs[1]+","+addrs[2]+","+addrs[3]] = "0"+block.slice(1);
                     addrs = block.slice(0,4);
                  }
                  while(addrs[0] === "2");
                  return true;
               }
            }
         }
         return "Error: file not found";
      }
      catch(error)
      {
         krnTrace(error);
         console.log(error);
         return "File deletion failed. See log for details.";
      }
   }

   this.getData = function(block){
      return block.slice(this.dataOffset);
   }
}
