import {marked} from "marked"
import * as wasm from "md2html"
import testMd from "./testMd.md"

let result = document.querySelector("#id");

function markedTest(){
    console.time("marked");
    let res = marked.parse(testMd);
    console.timeEnd("marked");
}

function md2htmlTest(){
    console.time("md2html");
    let res = wasm.md2html(testMd);
    console.timeEnd("md2html");
}

markedTest();
md2htmlTest();