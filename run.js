const {exec} = require("mz/child_process")
const path = require("path")

async function main(){
    const filename = process.argv[2];
    const astFilename = path.basename(filename,".group")+".ast";
    const jsFilename = path.basename(filename,".group")+".js";
    try{
        await exec(`node parse.js ${filename}`);
        await exec(`node generator.js ${astFilename}`);
        const [output] = await exec(`node ${jsFilename}`);
        process.stdout.write(output.toString());
    }catch(e){
        console.log(`Failed:${e.message}`);
    }
}

main();