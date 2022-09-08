import React from "react"
import ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

export const QuillEditor = () => {
    return (
        <>
            <EditorToolbar toolbarId={'t1'}/>
            <ReactQuill 
                theme="snow"
                placeholder="Text editor content..."
                onChange={changeState}
                modules={modules('t1')}
                formats={formats}
                style={{ width: "100%", height: "100%" }}
            />
        </>
        
    )
}

export const changeState = (value) => {
    console.log(value)
    return value
}