use wasm_bindgen::prelude::*;
use markdown::to_html;

#[wasm_bindgen]
pub fn md2html(md:&str)->String{
    let html = to_html(md);
    html
}