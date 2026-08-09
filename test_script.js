const p1 = Promise.reject("error 1");
const p2 = Promise.resolve("ok");
const promises = [];
try { promises.push(p1); } catch (e) { console.log("caught p1"); }
try { promises.push(p2); } catch (e) { console.log("caught p2"); }
Promise.allSettled(promises).then(r => console.log(r));
