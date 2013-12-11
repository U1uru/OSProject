/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "DoorOS Y";  // 'cause I was at a loss for a better name.
var APP_VERSION = "4.2.10.pi.7";   // What did you expect?

var CPU_CLOCK_INTERVAL = 10;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1;  

var PROGRAM_IRQ = 2;

var _MEMORY_SIZE = 768;

var _MEMORY_PARTITION_SIZE = 256;

//scheduling algorithms
var ROUND_ROBIN = 0;


//
// Global Variables
//
var _CPU = null;

var _PID = 0;

var _Memory = null;

var _MemManager = null;

var _ProcessArray = null;

var _ReadyQueue = null;

var _RunningProcess = null;

var _Scheduler = null;

var _Quantum = 6;

var _NumCycles = 0;

var _OSclock = 0;       // Page 23.

//var _Mode = 0;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Commands = new Array();
var _CommandPlace = 0;

var _Canvas = null;               // Initialized in hostInit().
var _TaskBar = null;              // Initialized in hostInit().
var _TskCtx = null;
var _DrawingContext = null;       // Initialized in hostInit().
var _UserInput = null;
var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

//Default status
var _Status = "Pretty Wizard";

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

// UI
var _Console = null;
var _OsShell = null;

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
