(function(){
    function addCopyButtons(clipboard) {
        document.querySelectorAll('pre > code[class^="language"]').forEach(function (codeBlock) {
            var button = document.createElement('button');
            button.className = 'button__clipboard';
            button.type = 'button';
            button.innerText = 'Copy';
            button.dataset.tooltip = 'click to copy the code';
    
            button.addEventListener('click', function () {
                clipboard.writeText(codeBlock.innerText).then(function () {
                    /* Chrome doesn't seem to blur automatically,
                       leaving the button in a focused state. */
                    button.blur();
    
                    button.innerText = 'Copied!';
                    button.classList.add('is-copied');
                    button.dataset.tooltip = 'code is copied';
    
                    setTimeout(function () {
                        button.innerText = 'Copy';
                        button.classList.remove('is-copied');
                        button.dataset.tooltip = 'click to copy the code';
                    }, 2000);
                }, function (error) {
                    button.innerText = 'Error';
                });
            });
    
            var pre = codeBlock.parentNode;
            var lntd = pre.parentNode;
            var tr = lntd.parentNode;
            var tbody = tr.parentNode;
            var table = tbody.parentNode;
            var chroma = table.parentNode;
            if (pre.parentNode.classList.contains('highlight')) {
                var highlight = pre.parentNode;
                highlight.parentNode.insertBefore(button, highlight);
            } else {
                chroma.parentNode.insertBefore(button, chroma);
            }
        });
    }

    if (navigator && navigator.clipboard) {
        addCopyButtons(navigator.clipboard);
    } else {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/clipboard-polyfill/2.7.0/clipboard-polyfill.promise.js';
        script.integrity = 'sha256-waClS2re9NUbXRsryKoof+F9qc1gjjIhc2eT7ZbIv94=';
        script.crossOrigin = 'anonymous';
        script.onload = function() {
            addCopyButtons(clipboard);
        };
    
        document.body.appendChild(script);
    }    
})();