/* ------------
   PCB.js
   
   Process Control Block prototype
   ------------ */

// I put these empty comment lines here at some point.
// I don't know why so now I'm putting stuff in them.
// ??? Pickles ???
function pcb(pid, state, pc, slot, base, limit, priority)
{
   this.pid = pid;
   this.state = state;
   this.pc = pc;
   this.slot = slot;
   this.base = base;
   this.limit = limit;
   this.priority = priority;

   this.accumulator = 0;
   this.xReg = 0;
   this.yReg = 0;
   this.zFlag = 0;
}
