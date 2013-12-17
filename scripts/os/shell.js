/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;

    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time.";
    sc.function = shellDate;
    this.commandList[this.commandList.length] = sc;

    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays user's current location.";
    sc.function = shellWhereami;
    this.commandList[this.commandList.length] = sc;

    // whattimeisit
    sc = new ShellCommand();
    sc.command = "whattimeisit";
    sc.description = "- Deprecated function. To be removed once updates to legacy code completed. Please ignore.";
    sc.function = shellWhatTimeIsIt;
    this.commandList[this.commandList.length] = sc;

    // status <string>
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets the status.";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;

    // bluescreen
    sc = new ShellCommand();
    sc.command = "bluescreen";
    sc.description = "- Tests the system's blue screen function.";
    sc.function = shellBlueScreen;
    this.commandList[this.commandList.length] = sc;

    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "- Loads user program into memory.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;

    // run <PID>
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<PID> - runs program with <PID>";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;

    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "- Runs all programs in memory.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;

    // quantum <int>
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - sets the round robin quantum";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;

    // processes 
    sc = new ShellCommand();
    sc .command = "processes";
    sc.description = "- list the running processes and their IDs";
    sc.function = shellProcesses;
    this.commandList[this.commandList.length] = sc;

    // kill <id>
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = " <PID>- kills the specified process id.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;

    //format
    sc = new ShellCommand();
    sc.command = "format";
    sc.description = "clears hard drive."
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;

    //create <filename>
    sc = new ShellCommand();
    sc.command = "create";
    sc.description = " <filename>- creates new file with <filename>."
    sc.function = shellCreate;
    this.commandList[this.commandList.length] = sc;

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}

function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDate(args)
{
    var date = new Date();
    _StdIn.putText(date.toString());
}

function shellWhereami(args)
{
    _StdIn.putText("Directly in front of Chuck Norris. (with your back turned, of course)");
}

function shellWhatTimeIsIt(args)
{
    var responses = ["Adventure Time!",
                     ".....People assume that time is a strict progression of cause to effect, but actually, from a non-linear, non-subjective viewpoint, it's more like a big ball of wibbly-wobbly... timey-whimey... stuff.",
                     "Game time!","Time to get a watch. : P","Hello, world!","dunno, but it's five o'clock somewhere"];
    var randomNum = Math.floor(Math.random()*responses.length);
    _StdIn.putText(responses[randomNum]);
}

function shellStatus(args)
{
    if (args.length > 0)
    {
        _Status = args[0];
        for(i = 1;i < args.length;i++)
           _Status += " " + args[i];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellBlueScreen(args)
{
    krnTrapError("This is a test of the blue screen function");
}

function shellLoad(args)
{
    var results = loadUserProgram();
    if(results == -1)
        _StdOut.putText("Invalid hex code");
    else if(results == -2)
        _StdOut.putText("Program larger than available memory");
    else
        _StdOut.putText("Program loaded with PID: " + results);
}

function shellRun(args)
{
    //make sure pid is given and corresponds to a process
    if(args.length > 0 && _ProcessArray[args[0]] != null)
    {
        _CPU.clear();
        _RunningProcess = _ProcessArray[args[0]];
        _RunningProcess.state = "running";
        _CPU.switch(_RunningProcess);
        _CPU.isExecuting = true;
    }
    else
        _StdOut.putText("PID invalid");
}

function shellRunAll(args)
{
    var process;
    for(i = 0;i < _ProcessArray.length;i++){
        process = _ProcessArray[i];
        _ReadyQueue.enqueue(process);
    }
    _CPU.clear();
    _RunningProcess = _ReadyQueue.dequeue();
    _RunningProcess.state = "running";
    _CPU.switch(_RunningProcess);
    _CPU.isExecuting = true;
}

function shellQuantum(args)
{
    if(args.length > 0 && parseInt(args[0]) > 0)
        _Quantum = parseInt(args[0]);
    else
        _StdOut.putText("Please supply desired number of clock cycles.");
}

function shellProcesses(args)
{
    if(_ProcessArray.length === 0)
        _StdOut.putText("No active processes");
    else{
        for(i = 0;i < _ProcessArray.length;i++){
            _StdOut.putText("Process "+_ProcessArray[i].pid+": "+_ProcessArray[i].state);
            _StdOut.advanceLine();
        }
    }
}

function shellKill(args)
{
    console.log("here i am!");
    var ID = parseInt(args[0]);
    if(args.length > 0 && _ProcessArray[parseInt(args[0])] != null){
        if(_ProcessArray[ID].state === "ready"){
            for(i = 0;i < _ReadyQueue.q.length;i++){
                if(_ReadyQueue.q[i].pid === ID)
                    _ReadyQueue.q.splice(i,1);
            }
        }
        else if(_ProcessArray[ID].state === "running")
            breakSysCall();
        switch(_ProcessArray[ID].base)
        {
            case 0:
                _MemManager.clear0();break;
            case 256:
                _MemManager.clear1();break;
            case 512:
                _MemManager.clear2();break;
        }
        _ProcessArray.splice(ID,1);
    }
    else
        _StdOut.putText("Please supply a valid target.");
}

function shellFormat(args)
{
    krnFSDriver.format();
    _StdOut.putText("Hard disk drive formatted.");
}

function shellCreate(args)
{
    if(args.length > 0)
    {
        var file = args[0]
        for(i = 1;i < args.length;i++)
            file += " "+args[i];
        if(file.length >= 60)
            _StdOut.putText("Filename too long");
        else
        {
            _StdOut.putText("Okay we'll make "+file);
        }
    }
    else
        _StdOut.putText("Please supply a filename")
}
