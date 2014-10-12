///<reference path="../assets/jquery/jquery.d.ts" />
///<reference path="../assets/jqueryui/jqueryui.d.ts" />
///<reference path="Timeline.ts" />
class Application {

    timelineEl: JQuery = $('<div>').attr('id', 'timeline');

    constructor()
    {
        console.log('Start Application');
        new Timeline(this.timelineEl);
        $('body').append(this.timelineEl);
    }
}

$(document).ready(function () {
    console.log('DOM Loaded');
    new Application();
});