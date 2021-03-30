# logic-lattice
A JavaScript and HTML5 canvas project to simulate logic circuits arranged on a 2D square lattice.

See the project in action [here](https://jcarr.ca/logic-lattice).

## Background and Inspiration
The inspiration for this project comes from marble machines used to demonstrate logic circuits and computation. Great examples of these include:
- [Digi-Comp II](https://digicompii.com/)
- [Turing Tumble](https://www.turingtumble.com/)
- [This adding machine on YouTube](https://www.youtube.com/watch?v=GcDshWmhF4A)
- [This Rule 110 on YouTube](https://www.youtube.com/watch?v=QKnSRw_X2w4)
- [This AND gate on YouTube](https://www.youtube.com/watch?v=VGQC33w3ltc)

Many of these examples were inspired by the Digi-Comp. Many other mechanical computer predate these examples, most relying on gear systems for their computation. Notable examples include:
- [Charles Babbage's Analytical Engine](https://en.wikipedia.org/wiki/Analytical_Engine)
- [The Pascaline](https://en.wikipedia.org/wiki/Pascal%27s_calculator)
- [The Curta](https://en.wikipedia.org/wiki/Curta)
- [The Antikythera mechanism](https://en.wikipedia.org/wiki/Antikythera_mechanism)

## This Project's Objective
The marble machines in the list aboves generally keep track of these state using the positions of switches, whose positions are changed by the marbles, and whose position affect the path of the marbles.  
My goal is to create a marble machine that is closer to the electronic implementations fo logic circuits: where the marbles falling represent current, and the presence indicated the HIGH logic level, and the lack represents the LOW logic level.  
I'd also like to make the logic gates be interchangeable pieces so that any circuit can be constructed (given enough space).  
With these considerations in mind the most obvious approach is to arrange a **lattice** of logic gates in a diamond pattern. Connections from gates above representing inputs, and connections with gates below representing outputs. The "current" flows from the top to the bottom.

## Logic Analysis
Given this description, what does this say about the logic gates we can choose? Well, each gate will be **2-input** and **2-output**, and furthermore we'll restrict ourselves so that we can drop a ball if needed, but we cannot generate one: The [Hamming weight](https://en.wikipedia.org/wiki/Hamming_weight) of the output must be equal to or less than that of the output.  
Formally:

The function of the logic gate can be defined as a function mapping 2 binary inputs to 2 binary outputs  
![g: \mathbb{Z}_{2}^{2} \to \mathbb{Z}_{2}^{2}](https://render.githubusercontent.com/render/math?math=g%3A%20%5Cmathbb%7BZ%7D_%7B2%7D%20%5E%7B2%7D%20%5Cto%20%5Cmathbb%7BZ%7D_%7B2%7D%20%5E%7B2%7D)

And the Hamming weight, or L1 norm, of the input must be less than the output
![g: X \to Y \mid \left\| X \right\|_{1} \geq \left\| Y \right\|_{1}](https://render.githubusercontent.com/render/math?math=g%3A%20X%20%5Cto%20Y%20%5Cmid%20%5Cleft%5C%7C%20X%20%5Cright%5C%7C_%7B1%7D%20%5Cgeq%20%5Cleft%5C%7C%20Y%20%5Cright%5C%7C_%7B1%7D)

So what gates are included in this set?
