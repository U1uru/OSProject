/* ------------
   PCB.js
   
   Process Control Block prototype
   ------------ */

// I put these empty comment lines here at some point.
// I don't know why so now I'm putting stuff in them.
// ??? Pickles ???
function pcb(pid, state, pc, base, limit)
{
   this.pid = pid;
   this.state = state;
   this.pc = pc;
   this.base = base;
   this.limit = limit;

   this.accumulator = 0;
   this.xReg = 0;
   this.yReg = 0;
   this.zFlag = 0;
}
