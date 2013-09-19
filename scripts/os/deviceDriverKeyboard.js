/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }    
    else if ( ((keyCode >= 48) && (keyCode <= 57)) ||   // digits 
               (keyCode == 32)                     ||   // space
               (keyCode == 13)                     ||
               (keyCode == 8))
    {
        chr = String.fromCharCode(keyCode);

	//check for shift
	if(isShifted)
	{
	    //Unfortunately many of the number-to-symbol changes
	    //have different shift values
	    if ( (keyCode == 49) || ((keyCode >= 51) && (keyCode <= 53)) )
	        chr = String.fromCharCode(keyCode - 16);
	    else if ( (keyCode == 55) || (keyCode == 57) )
		chr = String.fromCharCode(keyCode -17);
	    else
	    {
	        switch(keyCode)
	        {
	            case 48:
		       chr = String.fromCharCode(41);
		       break;
	            case 50:
		       chr = String.fromCharCode(64);
		       break;
	            case 54:
		       chr = String.fromCharCode(94);
		       break;
	            case 56:
		       chr = String.fromCharCode(42);
		       break;
	        }
	    }
	}
        _KernelInputQueue.enqueue(chr); 
    }
    else
    {
        switch(keyCode)
        {
            case 192: //`~
              chr = String.fromCharCode(96);
              if(isShifted)
                  chr = String.fromCharCode(126);
              break;
            case 173: //-_
              chr = String.fromCharCode(45);
              if(isShifted)
                  chr = String.fromCharCode(95);
              break;
            case 61: //=+
              chr = String.fromCharCode(keyCode);
              if(isShifted)
                  chr = String.fromCharCode(43);
              break;
            case 219: //[{
              chr = String.fromCharCode(91);
              if(isShifted)
                  chr = String.fromCharCode(123);
              break;
            case 221: //]}
              chr = String.fromCharCode(93);
              if(isShifted)
                  chr = String.fromCharCode(125);
              break;
            case 220: //\|
              chr = String.fromCharCode(92);
              if(isShifted)
                  chr = String.fromCharCode(124);
              break;
            case 59: //;:
              chr = String.fromCharCode(keyCode);
              if(isShifted)
                  chr = String.fromCharCode(58);
              break;
            case 222: //'"
              chr = String.fromCharCode(39);
              if(isShifted)
                  chr = String.fromCharCode(34);
              break;
            case 188: //,<
              chr = String.fromCharCode(44);
              if(isShifted)
                  chr = String.fromCharCode(60);
              break;
            case 190: //.>
              chr = String.fromCharCode(46);
              if(isShifted)
                  chr = String.fromCharCode(62);
              break;
            case 191: ///?
              chr = String.fromCharCode(47);
              if(isShifted)
                  chr = String.fromCharCode(63);
              break;
            case 38: // for up arrow
              chr = String.fromCharCode(11);//using as placeholder
              break;
            case 40: // for down arrow
              chr = String.fromCharCode(12);
              break;
        }
    _KernelInputQueue.enqueue(chr);
    }
}
