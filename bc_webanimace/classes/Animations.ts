class Animations {
    static animations = [
        {
            name: 'flash',
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
            name: 'bounce',
            keyframes: [
                {
                    timestamp: [0, 400, 1060, 1600, 2000],
                    bezier: {p0: 0.215, p1: 0.610, p2: 0.355, p3: 1.000},
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
            name: 'pulse',
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
            name: 'shake',
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
            name: 'swing',
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
            name: 'tada',
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
            name: 'hinge',
            keyframes: [
                {
                    timestamp: [0],
                    bezier: {p0: 0.42, p1: 0, p2: 0.58, p3: 1},
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
            name: 'flipOutY',
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
            name: 'flipInX',
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
            name: 'zoomOutDown',
            keyframes: [
                {
                    timestamp: [0],
                    parameters: {
                        opacity: 1,
                        scale: 1,
                        translatey: 0,
                    },
                },{
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
                        translatey: 500,
                        originx: 50,
                        originy: 100,
                        opacity: 0,
                    },
                },
            ],
        },
    ];
} 