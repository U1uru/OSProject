/* ------------
   Queue.js
   
   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.
   
   ------------ */
   
function Queue()
{
    // Properties
    this.q = new Array();

    // Methods
    this.getSize = function() {
        return this.q.length;    
    };

    this.isEmpty = function(){
        return (this.q.length == 0);    
    };

    this.enqueue = function(element) {
        this.q.push(element);        
        if(_Schedule === PRIORITY)
            this.arrange();
    };
    
    this.dequeue = function() {
        var retVal = null;
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
        }
        return retVal;        
    };

    this.peek = function(){
        return this.q[0];
    }

    this.arrange = function(){
        if(_Schedule === PRIORITY){
            this.q.sort(comparePriority);
        }
        else{
            this.q.sort(comparePID);
        }
    }
    
    this.toString = function() {
        var retVal = "";
        for (var i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    };
}

function comparePriority(a,b)
{
   if(a.priority < b.priority)
      return -1;
   if(a.priority > b.priority)
      return 1;
   return 0;
}

function comparePID(a,b)
{
   if(a.pid < b.pid)
      return -1;
   if(a.pid > b.pid)
      return 1;
   return 0;
}
