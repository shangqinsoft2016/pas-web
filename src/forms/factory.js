'use strict';

let __instance = (function () {
  let instance;
  return (newInstance) => {
    if (newInstance) instance = newInstance;
    return instance;
  }
}());

class Factory {
  constructor() {
    if (__instance()) return __instance();
    this.classMap = new Map();
    __instance(this);
  }
  set(name,reactFactory){
      this.classMap.set(name,reactFactory)
  }
  get(name){
      return this.classMap.get(name)
  }
}
export default Factory