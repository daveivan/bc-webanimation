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

        $('body').append(($('<div>').addClass('wrapper')).append(this.workspaceEl).append($('<div>').addClass('push')));
        $('body').append(this.timelineEl);
        $('body').append('<p class="help-text">Workspace</p>');
    }
}

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
});