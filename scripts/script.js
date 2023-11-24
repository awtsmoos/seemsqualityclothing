/*B"H*/
//B"H
var d = document.getElementsByClassName("mat-table cdk-table mat-sort fire-table")[0];
var c = Array.from(d.children).slice(1);
var m = c.map(w=>Array.from(w.children[0].children).slice(1).map(w=>w.innerText));
console.log(JSON.stringify(m, null, "\t"))