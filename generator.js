const exp = require("constants");
const { stat } = require("fs");
const fs = require("mz/fs");
const { type } = require("os");
const path = require("path");

async function main(){
    const filename = process.argv[2];
    const outputFilename = path.basename(filename,".ast")+".js";
    const code = (await fs.readFile(filename)).toString();
    const ast = JSON.parse(code);
    const jsCode = generateJS(ast,[]);
    await fs.writeFile(outputFilename,jsCode);
    console.log(`Wrote ${outputFilename}.`);
}

function generateJS(statements,declaredVars){
    const lines = [];
    for(let statement of statements){
        if(statement.type === "var_assignment"){
            const value = generateJSForExpression(statement.value,declaredVars);
            if(declaredVars.indexOf(statement.varname) === -1){
                lines.push(`let ${statement.varname} = ${value};`);
                declaredVars.push(statement.varname)
            }else{
                lines.push(`${statement.varname} = ${value};`);
            }
        }else if(statement.type == "var_stringAssignment"){
            const value = generateJSForString(statement.value,declaredVars);
            if(declaredVars.indexOf(statement.varname) === -1){
                lines.push(`let ${statement.varname} = ${value};`);
                declaredVars.push(statement.varname)
            }else{
                lines.push(`${statement.varname} = ${value};`);
            }
        }else if(statement.type == "print_statement"){
            const expression = generateJSForExpression(statement.expression,declaredVars);
            lines.push(`console.log(${expression});`);
        }else if(statement.type == "while_loop"){
            const condition = generateJSForExpression(statement.condition,declaredVars);
            const body = generateJS(statement.body,declaredVars)
                .split("\n")
                .map(line =>"  "+line)
                .join("\n");
            lines.push(`while (${condition}) {\n${body}\n}`);
        }
    }
    return lines.join('\n');
}

function generateJSForExpression(expression,declaredVars){
    const operatorMap ={
        "+":"+",
        "-":"-",
        "*":"*",
        "/":"/",
        "<":"<",
        "<=":"<=",
        ">":">",
        ">=":">=",
        "==":"==",
    }
    if(typeof expression == "object"){
        if(expression.type == "binary_expression"){
        const left = generateJSForExpression(expression.left,declaredVars);
        const right = generateJSForExpression(expression.right,declaredVars);
        return `${left} ${operatorMap[expression.operator]} ${right}`;
        }else{
            return parseExpression(expression);
        }
    }
    return expression;
}

function parseExpression(expression){
    return `[${expression.map(e => {
        if(typeof e === "object"){
            return parseExpression(e);
        }else if(typeof e === "string"){
            return `"${e}"`;
        }else{
            return e;
        }
    })}]`;
}

function generateJSForString(expression,declaredVars){
    return `"${expression}"`;
}

main();