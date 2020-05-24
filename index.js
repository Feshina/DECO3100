// Please note, this code was written by following example code from the Plotly.js Reference.
// Effort has been made to comment the code thoroughly to show understanding, in case similarity is attributed to palgiarism
// Original code can be found at https://plotly.com/javascript/map-animations/

//Get the back-to-top button element:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// Open Data Source
Plotly.d3.csv("COD.csv", function (err, rows) {


    // For each row of data, package into bundles using year as grouping variable
    function filter_and_unpack(rows, key, year) {
        return rows.filter(row => row["Year"] == year).map(row => row[key])
    }

    // Variable Definitions
    var frames = []
    var slider_steps = []

    // Number of slider steps/animation frames
    var n = 20;
    // Starting year
    var num = 1997;

    // Iterate through dataset, build arrays containing data in each variable
    for (var i = 0; i <= n; i++) {
        var z = filter_and_unpack(rows, "Highest In Country", num)
        var locations = filter_and_unpack(rows, "Code", num)
        var cause = filter_and_unpack(rows, "Cause of death words", num)
        var text = filter_and_unpack(rows, "Name", num)

        // For each "cause of death" value, tack on cause of death in plain text, and other tooltip text
        for (var f = 0; f <= 196; f++) {
            text[f] = "<b>Country: </b>" + text[f] + "<br><b>Primary Cause of Death: </b>" +  cause[f]
        }

        // Add each slider step object into a object array readble by Plotly
        frames[i] = {
            data: [{
                z: z,
                locations: locations,
                text: text
            }],
            name: num
        }

        // Animation control, iterate slider step each 1/3 second, move onto next frame
        slider_steps.push({
            label: num.toString(),
            method: "animate",
            args: [
                [num], {
                    mode: "immediate",
                    transition: {
                        duration: 300
                    },
                    frame: {
                        duration: 300
                    }
                }
            ]
        })

        // Iterate iterator (huh)
        num = num + 1
    }


    // establish main data structure
    var data = [{

        // Map setup
        type: "choropleth",
        locationmode: "world",

        // Custom colour scale
        autocolorscale: false,
        zauto: false,
        zmin: 0,
        zmax: 10,

        // Fetch data from earlier for loop
        locations: frames[0].data[0].locations,
        z: frames[0].data[0].z,
        text: frames[0].data[0].text,

        // Defining individual colour values
        colorscale: [
            [0, "rgb(242, 223, 145)"],
            [0.1, "rgb(161, 202, 241)"],
            [0.2, "rgb(230, 143, 172)"],
            [0.3, "rgb(141, 105, 150)"],
            [0.4, "rgb(201, 101, 101)"],
            [0.5, "rgb(224, 170, 110)"],
            [0.6, "rgb(107, 131, 198)"],
            [0.7, "rgb(244, 184, 171)"],
            [0.8, "rgb(115, 168, 146)"],
            [0.9, "rgb(141, 182, 0)"],
            [1, "rgb(239, 125, 80)"]
        ],

        // Hide the scary rainbow bar (ew)
        showscale: false,

        // Show concatnated tooltip text
        hoverinfo: "text",

    }];


    // Plot area layout setup
    var layout = {

        margin: {
            t: 40, //top margin
            l: 200, //left margin
            r: 50, //right margin
            b: 20, //bottom margin
        },

        // Colours
        paper_bgcolor: 'rgb(30, 30, 30)',
        plot_bgcolor: 'rgb(36, 36, 36)',

        // Subplot setup
        geo: {
            scope: "world",
            projection: "miller",

            // Center it so America doesn't have a piece of Russia attached to it
            center: {
                lon: 13,
                lat: 25,
            },
            

            // Map subplot colours
            bgcolor: 'rgb(36, 36, 36)',
            showland: false,
            showcountries: false,
            countrycolor: "rgb(30, 30, 30)",
            countrywidth: 20,
            showocean: true,
            oceancolor: 'rgb(36, 36, 36)',
            showframe: false,
            lonaxis: {},
            lataxis: {},
        
        },

        // Button Menu Setup
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "center",
            showactive: true,
            direction: "left",
            type: "buttons",
            font: "Arial",
            pad: {
                t: 87,
                r: 0,
                l: 65,
            },

            // Defining buttons
            buttons: [{
                // Play button
                method: "animate",
                bgcolor: "rgb(200, 200, 200)",
                args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 200,
                    },
                    frame: {
                        duration: 500
                    }
                }],
                label: "▶"
            }, {
                // Pause button
                method: "animate",
                args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                            duration: 0
                        },
                        frame: {
                            duration: 0
                        }
                    }
                ],
                label: "❚❚"
            }]
        }],

        // Defining Slider
        sliders: [{
            active: 0,
            bgcolor: "rgb(200, 200, 200)",
            activebgcolor: "rgb(100, 100, 100)",
            steps: slider_steps,
            x: 0.1,
            len: 0.9,
            xanchor: "left",
            y: 0,
            yanchor: "top",
            pad: {
                t: 50,
                b: 10,
                l: 100,
                r: 120,
            },

            // Show current slider value as a label
            currentvalue: {
                visible: true,
                prefix: "Year:",
                xanchor: "right",
                font: {
                    size: 20,
                    color: "#666"
                }
            },

            // Transition Control
            transition: {
                duration: 500,
                easing: "sin-in-out"
            }
        }]
    };

    // Layout configuration
    var config = {
        resonsive: true, // size of chart depends on window size
        displayModeBar: false // Don't show the ugly Plotly bar (who the heck would wanna save our chart as an image)
    }

    // Draw plot
    Plotly.newPlot("myDiv", data, layout, config).then(function () {
        Plotly.addFrames("myDiv", frames);
    });
})
