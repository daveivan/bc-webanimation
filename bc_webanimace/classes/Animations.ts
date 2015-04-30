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
    ];
} 