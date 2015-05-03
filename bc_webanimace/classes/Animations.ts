class Animations {
    static animations = [
        {
            name: 'bliknutí',
            keyframes: [
                {
                    timestamp: [0, 500, 1000],
                    parameters: {
                        opacity: 1,
                    },
                },
                {
                    timestamp: [250, 750],
                    parameters: {
                        opacity: 0,
                    },
                }
            ],
        },
        {
            name: 'skákání',
            keyframes: [
                {
                    timestamp: [0, 400, 1060, 1600, 2000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1.000 },
                    parameters: {
                        translatey: 0,
                        originx: 50,
                        originy: 100,
                    },
                },
                {
                    timestamp: [800, 860],
                    bezier: { p0: 0.755, p1: 0.050, p2: 0.855, p3: 0.060 },
                    parameters: {
                        translatey: -30,
                        originx: 50,
                        originy: 100,
                    },
                },
                {
                    timestamp: [1400],
                    bezier: { p0: 0.755, p1: 0.050, p2: 0.855, p3: 0.060 },
                    parameters: {
                        translatey: -15,
                        originx: 50,
                        originy: 100,
                    },
                },
                {
                    timestamp: [1800],
                    parameters: {
                        translatey: -4,
                        originx: 50,
                        originy: 100,
                    },
                }
            ],
        },
        {
            name: 'puls',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1,
                    },
                },
                {
                    timestamp: [500],
                    parameters: {
                        scale: 1.05,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 1,
                    },
                },
            ],
        },
        {
            name: 'chvění',
            keyframes: [
                {
                    timestamp: [0, 1000],
                    parameters: {
                        translatex: 0,
                    },
                },
                {
                    timestamp: [100, 300, 500, 700, 900],
                    parameters: {
                        translatex: -10,
                    },
                },
                {
                    timestamp: [200, 400, 600, 800],
                    parameters: {
                        translatex: 10,
                    },
                },
            ],
        },
        {
            name: 'houpání',
            keyframes: [
                {
                    timestamp: [200],
                    parameters: {
                        rotatez: 15,
                        originx: 50,
                        originy: 0,
                    },
                },
                {
                    timestamp: [400],
                    parameters: {
                        rotatez: -10,
                        originx: 50,
                        originy: 0,
                    },
                },
                {
                    timestamp: [600],
                    parameters: {
                        rotatez: 5,
                        originx: 50,
                        originy: 0,
                    },
                },
                {
                    timestamp: [800],
                    parameters: {
                        rotatez: -5,
                        originx: 50,
                        originy: 0,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        rotatez: 0,
                        originx: 50,
                        originy: 0,
                    },
                },
            ],
        },
        {
            name: 'tadáá',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1,
                    },
                },
                {
                    timestamp: [100, 200],
                    parameters: {
                        scale: 0.9,
                        rotatez: -3,
                    },
                },
                {
                    timestamp: [300, 500, 700, 900],
                    parameters: {
                        scale: 1.1,
                        rotatez: 3,
                    },
                },
                {
                    timestamp: [400, 600, 800],
                    parameters: {
                        scale: 1.1,
                        rotatez: -3,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 1,
                    },
                },
            ],
        },
        {
            name: 'spadnutí',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0,
                    },
                },
                {
                    timestamp: [600, 1800],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0,
                        rotatez: 80,
                    },
                },
                {
                    timestamp: [1200, 2400],
                    bezier: { p0: 0.42, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        originx: 0,
                        originy: 0,
                        rotatez: 60,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [3000],
                    parameters: {
                        rotatez: -3,
                        opacity: 0,
                        translatey: 700,
                    },
                },
            ],
        },
        {
            name: 'otočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                        perspective: 400,
                    },
                },
                {
                    timestamp: [300],
                    parameters: {
                        opacity: 1,
                        rotatey: -15,
                        perspective: 400,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 0,
                        rotatey: 90,
                        perspective: 400,
                    },
                },
            ],
        },
        {
            name: 'otočení a zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        rotatex: 90,
                        perspective: 400,
                        opacity: 0,
                    },
                },
                {
                    timestamp: [400],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        rotatex: -40,
                        perspective: 400,
                    },
                },
                {
                    timestamp: [600],
                    parameters: {
                        opacity: 1,
                        rotatex: 20,
                        perspective: 400,
                    },
                },
                {
                    timestamp: [800],
                    parameters: {
                        opacity: 1,
                        rotatex: -10,
                        perspective: 400,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 1,
                        perspective: 400,
                        rotatex: 0,
                    },
                },
            ],
        },
        {
            name: 'zoom zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                        scale: 1,
                        translatey: 0,
                    },
                }, {
                    timestamp: [400],
                    bezier: { p0: 0.55, p1: 0.055, p2: 0.675, p3: 0.190 },
                    parameters: {
                        opacity: 1,
                        scale: 0.475,
                        translatey: -60,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.175, p1: 0.885, p2: 0.320, p3: 1 },
                    parameters: {
                        scale: 0.1,
                        translatey: 200,
                        originx: 50,
                        originy: 100,
                        opacity: 0,
                    },
                },
            ],
        },
        {
            name: 'kolísání',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        translatex: 0,
                        rotatez: 0,
                    },
                }, {
                    timestamp: [300],
                    parameters: {
                        translatex: -50,
                        rotatez: -5,
                    },
                },
                {
                    timestamp: [600],
                    parameters: {
                        translatex: 40,
                        rotatez: 3,
                    },
                },
                {
                    timestamp: [900],
                    parameters: {
                        translatex: -30,
                        rotatez: -3,
                    },
                },
                {
                    timestamp: [1200],
                    parameters: {
                        translatex: 20,
                        rotatez: 2,
                    },
                },
                {
                    timestamp: [1500],
                    parameters: {
                        translatex: -10,
                        rotatez: -1,
                    },
                },
                {
                    timestamp: [2000],
                    parameters: {
                        translatex: 0,
                        rotatez: 0,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.3,
                        opacity: 0,
                    },
                }, {
                    timestamp: [200],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1.1,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [400],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.9,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1.03,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [800],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 0.97,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        scale: 1,
                        opacity: 1,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -3000,
                        opacity: 0,
                    },
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 25,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -10,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -5,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 0,
                        opacity: 1,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zobrazení zdola',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 1000,
                        opacity: 0,
                    },
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -20,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 10,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: -5,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatey: 0,
                        opacity: 1,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zobrazení zleva',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -1000,
                        opacity: 0,
                    },
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 25,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -10,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 5,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 0,
                        opacity: 1,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zobrazení zprava',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 1000,
                        opacity: 0,
                    },
                }, {
                    timestamp: [600],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -25,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [750],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 10,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [900],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: -5,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 0.215, p1: 0.610, p2: 0.355, p3: 1 },
                    parameters: {
                        translatex: 0,
                        opacity: 1,
                    },
                },
            ],
        },
        {
            name: 'poskočení a zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        scale: 1,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [200],
                    parameters: {
                        scale: 0.9,
                        opacity: 1,
                    },
                }, {
                    timestamp: [500, 550],
                    parameters: {
                        scale: 1.1,
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        scale: 0.3,
                        opacity: 0,
                    },
                },
            ],
        },
        {
            name: 'otočka',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -360,
                        translatez: 0,
                        scale: 1,
                    },
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0, p1: 0, p2: 0.58, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -190,
                        translatez: 150,
                        scale: 1,
                    },
                }, {
                    timestamp: [1000],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: -170,
                        translatez: 150,
                        scale: 1,
                    },
                },
                {
                    timestamp: [1600],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: 0,
                        translatez: 0,
                        scale: 0.95,
                    },
                },
                {
                    timestamp: [2000],
                    bezier: { p0: 0.42, p1: 0, p2: 1, p3: 1 },
                    parameters: {
                        perspective: 400,
                        rotatey: 0,
                        translatez: 0,
                        scale: 1
                    },
                },
            ],
        },
        {
            name: 'rychlost světla zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 0,
                        translatex: 1000,
                        skewx: -30,
                    },
                },
                {
                    timestamp: [600],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: 20,
                        translatex: 15,
                    },
                }, {
                    timestamp: [800],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: -10,
                        translatex: 5,
                    },
                },
                {
                    timestamp: [1000],
                    bezier: { p0: 1, p1: 1, p2: 0, p3: 0 },
                    parameters: {
                        opacity: 1,
                        skewx: 0,
                        translatex: 0,
                    },
                },
            ],
        },
        {
            name: 'rychlost světla zmizení',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 0,
                        translatex: 500,
                        skewx: 30,
                    },
                }
            ],
        },
        {
            name: 'zoom zobrazení',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: { p0: 0.55, p1: 0.055, p2: 0.675, p3: 0.190 },
                    parameters: {
                        opacity: 0,
                        scale: 0.1,
                        translatey: -1000,
                    },
                },
                {
                    timestamp: [600],
                    bezier: { p0: 0.175, p1: 0.885, p2: 0.320, p3: 1 },
                    parameters: {
                        opacity: 1,
                        scale: 0.475,
                        translatey: 60,
                    },
                },
                {
                    timestamp: [1000],
                    parameters: {
                        opacity: 1,
                        scale: 1,
                        translatey: 0,
                    },
                }
            ],
        },
    ];
}