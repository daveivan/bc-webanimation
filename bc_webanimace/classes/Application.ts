///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="../assets/bezier-easing/index.d.ts" />
///<reference path="Timeline.ts" />
///<reference path="Workspace.ts" />

class Application {

    timelineEl: JQuery = $('<div>').attr('id', 'timeline');
    workspaceEl: JQuery = $('<div>').attr('id', 'workspace');

    timeline: Timeline;
    workspace: Workspace;

    constructor()
    {
        console.log('Start Application');
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl);

        //$('body').append(($('<div>').addClass('wrapper')).append(this.workspaceEl).append($('<div>').addClass('push')));
        $('body').append($('<div>').addClass('top-container'));
        $('body').append(this.timelineEl);
        //$('body').append('<p class="help-text">Workspace</p>');

        //set height
        $('.top-container').css('height', ($(window).height() - this.timelineEl.height()) + 'px');

        $('.top-container').append(($('<div>').addClass('tool-panel')));
        $('.top-container').append(($('<div>').addClass('control-panel')).append(($('<div>').addClass('control-item')).append($('<div>').addClass('picker'))));
        $('.top-container').append(($('<div>').addClass('workspace-wrapper')).append(this.workspaceEl));

        $(window).resize(() => {
            console.log('onResize window');

            $('.top-container').css('height', ($(window).height() - this.timelineEl.height()) + 'px');
        });

        $('.picker').colpick({
            flat: true,
            layout: 'hex',
            submit: 0,
            color: {r: 255, g: 255, b: 255},
            onChange: (hsb, hex, rgb, el, bySetColor) => {
                this.workspace.setColor(rgb);
            },
        });
        this.workspace.setColor({ r: 255, g: 255, b: 255 });
    }
}

$(document).ready(() => {
    console.log('DOM Loaded');
    new Application();
});