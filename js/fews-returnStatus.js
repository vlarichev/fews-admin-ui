var saveAdd = (valTest) => valTest ? valTest : 0 ;

export default function formatStatusResults(stLib){    

    var _done = saveAdd(stLib["completed fully successful"]);
    var _appr = saveAdd(stLib.approved);
    stLib.done = _done + _appr;

    var _aPart = saveAdd(stLib["approved partly successful"]);
    var _cPart = saveAdd(stLib["completed partly successful"]);
    stLib.partly = _aPart + _cPart;   
    
    var _runn = saveAdd(stLib.running);
    var _pend = saveAdd(stLib.pending);
    stLib.run = _runn + _pend;
    
    var _error = saveAdd(stLib.error);
    var _inval =  saveAdd(stLib.invalid);
    var _termin =  saveAdd(stLib.terminated);
    var _failed =  saveAdd(stLib.failed);
    stLib.bad = _error + _inval +_termin +_failed;
    // console.log(stLib);
    return stLib;
}