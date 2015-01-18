﻿class GenerateCode {
    private dialogEl: JQuery = $('<div>').attr('id', 'dialog').html('<p></p>').attr('title', 'Výsledný kód animace');
    private codeWrapperEl: JQuery = $('<div>').attr('id', 'code');

    private layers: Array<Layer>;
    private app: Application;

    arrayMax = Function.prototype.apply.bind(Math.max, null);
    arrayMin = Function.prototype.apply.bind(Math.min, null);

    constructor(app: Application, l: Array<Layer>) {
        this.app = app;
        this.layers = l;

        $('body').find(this.dialogEl).remove();
        $('body').append(this.dialogEl);
        this.dialogEl.dialog({
            autoOpen: false,
            draggable: false,
            height: 600,
            width: 900,
            resizable: false,
            modal: true,
            closeOnEscape: true,
            close: (event, ui) => {
                this.dialogEl.remove();
            },
        });
    }

    generate() {
        console.log('generate code');
        this.dialogEl.dialog('open');

        var html: string = '<!DOCTYPE html>\n<html lang="cs">\n<head>\n  <meta charset="UTF-8">\n  <title></title>\n';
        html += '  <style>\n';
        html += this.generateCss();
        html += '  </style>\n</head>\n';
        html += '<body>\n';
        html += this.generateObjects();
        html += '\n</body>\n</html>';
        console.log(html);

        html = html.replace(/[<>]/g, (m) => { return { '<': '&lt;', '>': '&gt;' }[m]; });
        var pre: JQuery = $('<pre>').addClass('prettyprint').attr('id', 'code');
        this.dialogEl.append(pre.html(html));

        prettyPrint();

        $(pre).on('dblclick', () => {
            this.selectText('code');
        });
    }

    generateCss(): string {
        var css: string = '';
        css += this.gCss({
            'name': '#workspace',
            'width': this.app.workspace.workspaceSize.width + 'px',
            'height': this.app.workspace.workspaceSize.height + 'px',
            'border': '1px dotted #ededed',
            'overflow': 'hidden',
            'position': 'relative',
            'margin': '0 auto',
        });

        css += this.gCss({
            'name': '.square',
            'overflow': 'hidden',
        });

        css += this.objectCss();

        return css;
    }

    generateObjectsTmp(): string {
        var shapes = $('#workspace').clone();
        shapes.find('.shape-helper').remove();
        shapes.find('.shape').removeAttr('style');
        shapes.removeAttr('style');

        var markup: string = '  <div id="workspace">\n';
        shapes.find('.shape').each(function(index) {
            markup += '    ' + ($(this).addClass('object'+$(this).data('id')).prop('outerHTML')) + '\n';
        });
        markup += '  </div>';
        return markup;
    }

    /*generateObjects() {
        var markup: string = '  <div id="workspace">\n';
        this.layers.forEach((layer: Layer, index: number) => {
            markup += layer.getObject();
        });
        markup += '  </div>';
        return markup;
    }*/

    generateObjects() {
        var markup: string = '  <div id="workspace">\n';
        this.layers.forEach((layer: Layer, index: number) => {
            if (layer.nesting == 0) {
                //if layer is root
                markup += layer.getObject();
                markup += this.getChildsObject(layer.id);
                if(layer instanceof RectangleLayer)
                    markup += '    </div>\n';
                else if (layer instanceof TextLayer)
                    markup += '</span>\n';
            }
        });
        markup += '  </div>';
        return markup;
    }
    getChildsObject(parent: number): string {
        var value: string = '';
        this.layers.forEach((layer: Layer, index: number) => {
            if (layer.parent == parent) {
                value += layer.getObject();

                if (layer instanceof RectangleLayer) {
                    value += this.getChildsObject(layer.id);
                    value += (Array(layer.nesting + 1).join('  ') + '    </div>\n');
                } else if (layer instanceof TextLayer) {
                    value += '</span>\n';
                } else if (layer instanceof ImageLayer) {
                }
            }
        });

        return value;
    }

    objectCss() {
        var css: string = '';
        var keyframesCss: string = '';

        //if infinite animation, find absolute maximum
        if (this.app.timeline.repeat) {
            var absoluteMax: number = 0;
            this.layers.forEach((item: Layer, index: number) => {
                var tmp: number = this.arrayMax(item.timestamps);
                if (tmp > absoluteMax) absoluteMax = tmp;
            });
        }

        this.layers.forEach((item: Layer, index: number) => {
            var percents = new Array<String>();
            var min: number = this.arrayMin(item.timestamps);
            var max: number = this.arrayMax(item.timestamps);
            if (this.app.timeline.repeat) {
                var duration: number = absoluteMax;
            } else {
                var duration: number = max - min;   
            }

            var nameElement = 'object' + item.id;

            //1. init style for object
            var cssObject = item.getInitStyles(nameElement);

            if (this.app.timeline.repeat) {
                cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
                cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + 0 + 's infinite';
            } else {
                if (duration != 0) {
                    cssObject['-webkit-animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';
                    cssObject['animation'] = nameElement + ' ' + (duration / 1000) + 's linear ' + (item.timestamps[0] / 1000) + 's forwards';  
                }      
            }

            css += this.gCss(cssObject);

            //2. if keyframes > 1, generate it
            if (item.timestamps.length > 1) {
                cssObject = {};
                cssObject['name'] = nameElement;

                item.timestamps.forEach((timestamp: number, i: number) => {
                    var keyframe: Keyframe = item.getKeyframeByTimestamp(timestamp);
                    if (this.app.timeline.repeat) {
                        var part: number = ((keyframe.timestamp) / duration);
                    } else {
                        var part: number = ((keyframe.timestamp - min) / duration);   
                    }
                    var percent: string = (part * 100).toString() + '%';
                    //if infinite animation and not 100% append it to last keyframe
                    if (this.app.timeline.repeat && i == item.timestamps.length-1 && part != 1) {
                        percent += ' ,100%';
                    }
                    //if infinite animation and set delay, append delay to first keyframe
                    if (this.app.timeline.repeat && i == 0 && part != 0) {
                        percent += ', 0%';
                    }
                    percents.push(percent);
                    cssObject[percent] = item.getKeyframeStyle(timestamp);

                    if (i != item.timestamps.length - 1) {
                        cssObject[percent]['-webkit-animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                        cssObject[percent]['animation-timing-function'] = 'cubic-bezier(' + keyframe.timing_function.p0 + ', ' + keyframe.timing_function.p1 + ', ' + keyframe.timing_function.p2 + ', ' + keyframe.timing_function.p3 + ')';
                    }
                });

                keyframesCss += this.gKeyframes(cssObject);
            }
        });

        return (keyframesCss + css);
    }

    gKeyframes(frameData) {
        if (frameData.length) {
            for (var i = 0; i < frameData.length; i++) {
                var frame = frameData[i];
                return this.gKeyframe(frame);
            }
        } else {
            return this.gKeyframe(frameData);
        }
    }

    gCss(cssData) {
        var elName = cssData.name || "";
        var css = "    " + elName + " {\n";

        for (var key in cssData) {
            if (key !== "name") {
                css += "      " + key + ": " + cssData[key] + ";\n";
            }
        }

        css += "    }\n";

        return css;
    }

    gKeyframe (frameData) {
        var frameName = frameData.name || "";
        var css = '';
        var prefix: Array<string> = ['-webkit-keyframes', 'keyframes'];
        $.each(prefix, (index, value) => {
            css += "    @" + value + " " + frameName + " {\n";

            for (var key in frameData) {
                if (key !== "name") {
                    css += "      " + key + " {\n";

                    for (var property in frameData[key]) {
                        css += "        " + property + ":" + frameData[key][property] + ";\n";
                    }

                    css += "      }\n";
                }
            }

            css += "    }\n";
        });

        return css;
    }

    selectText(element) {
        var doc = document;
        var text = doc.getElementById(element);
        var range, selection;

        
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(text);
            selection.removeAllRanges();
            selection.addRange(range);
    }
}