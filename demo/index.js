if (requirejs) requirejs.config({
    paths: {
        "codemirror": "./node_modules/codemirror/",
        /* "codemirror/lib": "./node_modules/codemirror/", */ /* [^1] */
        "hypermd": "./hypermd/"
    },
    waitSeconds: 15
})

/**
 [^1]:  The `codemirror.js` might be outside the `lib` directory,
        which will make HyperMD fail to load,
        if you are using CDN, bower, or old version of CodeMirror.
        
        Uncomment this line to fix it.

        see http://stackoverflow.com/questions/36500713/loading-codemirror-with-requirejs-from-cdn
 */

require([
    'codemirror/lib/codemirror',
    'codemirror/mode/javascript/javascript',
    'codemirror/addon/fold/foldcode',
    'codemirror/addon/fold/foldgutter',
    'codemirror/addon/fold/markdown-fold',
    'codemirror/addon/edit/continuelist',
    'hypermd/mode/hypermd',
    'hypermd/addon/hide-token',
    'hypermd/addon/cursor-debounce',
    'hypermd/addon/fold',
    'hypermd/addon/fold-math',
    'hypermd/addon/readlink',
    'hypermd/addon/click',
    'hypermd/addon/hover',
    'hypermd/addon/paste',
    'hypermd/addon/paste-image'
], function (CodeMirror) {
    'use strict';
    var myTextarea = document.getElementById('demo')

    // init_editor()
    ajax_load_file_then_init_editor("README.md")

    function init_editor() {
        var editor = CodeMirror.fromTextArea(myTextarea, {
            lineNumbers: true,
            lineWrapping: true,
            theme: "hypermd-light",
            mode: "text/x-hypermd",
            // keyMap: "vim",     // just for fun

            foldGutter: true,
            gutters: [
                "CodeMirror-linenumbers",
                "CodeMirror-foldgutter",
                "HyperMD-goback"  // (addon: click) 'back' button for footnotes
            ],
            extraKeys: {
                "Enter": "newlineAndIndentContinueMarkdownList"
            },

            // (addon) cursor-debounce
            // cheap mouse could make unexpected selection. use this to fix.
            hmdCursorDebounce: true,

            // (addon) fold
            // turn images and links into what you want to see
            hmdAutoFold: 200,

            // (addon) fold-math
            // MathJax support. Both `$` and `$$` are supported
            hmdFoldMath: {
                interval: 200,      // auto folding interval
                preview: true       // providing a preview while composing math
            },

            // (addon) paste
            // copy and paste HTML content
            hmdPaste: true,

            // (addon) paste-image
            // copy, paste and upload image
            hmdPasteImage: true,
            
            // (addon) hide-token
            // hide/show Markdown tokens like `**`
            hmdHideToken: "(profile-1)"
        })

        // (addon) hover
        // (dependencies) addon/readlink
        // tooltips on footnotes
        editor.hmdHoverInit()

        // (addon) click
        // (dependencies) addon/readlink
        // click to follow links and footnotes
        editor.hmdClickInit()

        window.CodeMirror = CodeMirror
        window.editor = editor
        editor.setSize("100%", 500)
    }

    function ajax_load_file_then_init_editor(url) {
        var xmlhttp;
        if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest() }
        else if (window.ActiveXObject) { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP") }
        if (xmlhttp != null) {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    myTextarea.innerText = xmlhttp.responseText
                    init_editor()
                }
            }
            xmlhttp.open("GET", url, true)
            xmlhttp.send(null)
        }
    }
})
