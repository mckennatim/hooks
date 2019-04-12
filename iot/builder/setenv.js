var fs = require('fs')
var str=`{"m":"${process.argv[2]}"}`
fs.writeFile('envmy.json', str, (err)=>{if(err) {cons.log(err);}})
