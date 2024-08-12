let ar = ['AUR','BKX','BVC','BIO','BTC','BCH','BTG','BTCP','BTCZ','CLO','DASH','DCR','DGB','DOGE','ETH','ETC','ETZ','FRC','GRLC','HUSH','KMD','LTC','MEC','XMR','NMC','NANO','NEO','GAS','PPC','XPM','PTS','QTUM','XRB','XRP','SNG','VTC','VOT','ZEC','ZCL','ZEN']

let fs = require("fs")

let files = fs.readdirSync("./icon")

for(let e of ar){
    if(files.indexOf(e+".png") != -1){
        console.log(e)
    }
}