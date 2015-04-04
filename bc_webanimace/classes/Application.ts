///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="../assets/bezier-easing/index.d.ts" />
///<reference path="../assets/tooltipster/jquery.tooltipster.d.ts" />
///<reference path="Timeline.ts" />
///<reference path="Workspace.ts" />
///<reference path="ControlPanel.ts" />

class Application {

    timelineEl: JQuery = $('<div>').attr('id', 'timeline');
    workspaceWrapperEl: JQuery = $('<div>').addClass('workspace-wrapper');
    workspaceEl: JQuery = $('<div>').attr('id', 'workspace');
    topContainerEl: JQuery = $('<div>').attr('id', 'top-container');
    messageEl: JQuery = $('<div>').attr('id', 'message-dialog').css({ 'display': 'none' });

    timeline: Timeline;
    workspace: Workspace;
    controlPanel: ControlPanel;

    constructor()
    {
        console.log('Start Application');
        this.timeline = new Timeline(this, this.timelineEl);
        this.workspace = new Workspace(this, this.workspaceEl, this.workspaceWrapperEl);
        this.controlPanel = new ControlPanel(this, this.topContainerEl);

        $('body').append(this.messageEl);
        $('body').append(this.topContainerEl);
        $('body').append(this.timelineEl);

        this.controlPanel.setHeight();

        this.topContainerEl.append(this.workspaceWrapperEl.append(this.workspaceEl));
    }
}


$(document).ready(() => {
    console.log('DOM Loaded');
    new Application();
    $('.tooltip').tooltipster({ position: 'right' });
    $('.tooltip-top').tooltipster({ position: 'top' });
    $('.workspace-wrapper').perfectScrollbar({ includePadding: true, });
});