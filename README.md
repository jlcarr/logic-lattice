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
My goal is to create a marble machine that is closer to the electronic implementations fo logic circuits: where the marbles falling represent current, and o he presence of current indicates the HIGH logic level, and the lack of current represents the LOW logic level.  
I'd also like to make the logic gates be interchangeable pieces so that any circuit can be constructed (given enough space).  
With these considerations in mind the most obvious approach is to arrange a **lattice** of logic gates in a diamond pattern. Connections from gates above representing inputs, and connections with gates below representing outputs. The "current" flows from the top to the bottom.

## Logic Analysis
### Definition of Allowed Gates
Given this description, what does this say about the logic gates we can choose? Well, each gate will be **2-input** and **2-output**, and furthermore we'll restrict ourselves so that we can drop a ball if needed, but we cannot generate one: The [Hamming weight](https://en.wikipedia.org/wiki/Hamming_weight) of the output must be equal to or less than that of the output.  
Formally:

The function of the logic gate can be defined as a function mapping 2 binary inputs to 2 binary outputs  
![g: \mathbb{Z}_{2}^{2} \to \mathbb{Z}_{2}^{2}](https://render.githubusercontent.com/render/math?math=g%3A%20%5Cmathbb%7BZ%7D_%7B2%7D%20%5E%7B2%7D%20%5Cto%20%5Cmathbb%7BZ%7D_%7B2%7D%20%5E%7B2%7D)

And the Hamming weight, or L1 norm, of the input must be less than the output  
![g: X \to Y \mid \left\| X \right\|_{1} \geq \left\| Y \right\|_{1}](https://render.githubusercontent.com/render/math?math=g%3A%20X%20%5Cto%20Y%20%5Cmid%20%5Cleft%5C%7C%20X%20%5Cright%5C%7C_%7B1%7D%20%5Cgeq%20%5Cleft%5C%7C%20Y%20%5Cright%5C%7C_%7B1%7D)

### Gates Count
So what gates are included in this set? Let's start by counting them:  
In the general case, the number of *n* input gate with *n* outputs such that the Hamming weight of the output is less than that of the input is:  
![\prod_{k=0}^{n}\left [ \sum_{i=0}^{k}\binom{n}{i} \right ] ^{\binom{n}{k}}](https://render.githubusercontent.com/render/math?math=%5Cprod_%7Bk%3D0%7D%5E%7Bn%7D%5Cleft%20%5B%20%5Csum_%7Bi%3D0%7D%5E%7Bk%7D%5Cbinom%7Bn%7D%7Bi%7D%20%5Cright%20%5D%20%5E%7B%5Cbinom%7Bn%7D%7Bk%7D%7D)  
This result can be found by noticing that each possible input Hamming weight, *k*, represents *n*C*k* possible inputs, and each input can only have output Hamming weights *i*<=*k*, which in turn represent *k*C*i* possibile outputs.

For the case *n*=2, we have **36** possible gates.

### Gate Synthesis
So, what are these 36 gates? We could simply iterate over all possible truth tables and output those that match our condition, but we can do better: let's instead sythesis and describe these allowed gates in terms of logic gates we're familiar with. Let's describe them in terms of pairs of our classic 2-input 1-output logic gates.  
We can describe the truth table of a given gate by appending the outputs column into a binary string. Therefore all possible 2-input 1-output gates can be described in terms of a 4-bit binary string.  
Here we have a table of all possible 2-input 1-output gates, where the rows show the values of the first 2 bits, and the outputs are the last 2 bits:
|    | 00 | 01 | 10 | 11 |
|:--:|:--:|:--:|:--:|:--:|
| 00 | 0 | &and; | &and;<sub>A&#773;</sub> | B |
| 01 | &and;<sub>A&#773;</sub> | A | &nequiv; | &or; |
| 10 | &#x22bd; | &equiv; | A&#773; | &or;<sub>A&#773;</sub> |
| 11 | B&#773; | &or;<sub>B&#773;</sub> | &#x22bc; | 1 |

Notice that in order to match out Hamming weight constraint the first bit of our truth table encoding must always be zero: therefore only the first 2 rows of the table contain gates we can use in our synthesis.

Now we can takes these gates and determine which pairs valid:
| A\B | 0 | &and; | A | B | &and;<sub>A&#773;</sub> | &and;<sub>B&#773;</sub> | &or; | &nequiv; |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 0 | X | X | X | X | X | X | X | X |
| &and; | X | X | X | X | X | X | X | X |
| A | X | X |  | X | X |  |  |  |
| B | X | X | X |  |  | X |  |  |
| &and;<sub>A&#773;</sub> | X | X | X |  |  | X |  |  |
| &and;<sub>B&#773;</sub> | X | X |  | X | X |  |  |  |
| &or; | X | X |  |  |  |  |  |  |
| &nequiv; | X | X |  |  |  |  |  |  |

And here we count the total 36 gates we're looking for.

## Implementation
So now that we have our set of logic gates, how can we actually implement them? Well, I'll leave the physical implementation to future project, but for this project I'd like to simply simulate their action in code.  
This project takes the form of a simple webpage using HTML5 canvas and JavaScript to implement the lattice of logic gates. The gates are labeled by ordered pairs of 2-input 1-output gates we're familiar with. The left gate of the pair represent the value given to the left-output of the gate, and the right follows suit.  

The user also has the option to toggle between the animated 'falling marble' simulation, and the more instantaneous electric circuit simulation.  
In the animated simulation the presence of a falling ball or lack thereof represent HIGH and LOW logic accordingly.  
In the instantaeous simulation the red wired and blue wires represent HIGH and LOW logic accordingly.  

### Gates Implemented
- **0**: Always return 0
- **1**: Always returns 1 (not a gate that respects the Hamming weight condition, but useful for inputs)
- **R**: returns the value of right input
- **L**: returns the value of the left input
- **&**: The AND gate
- **|**: The OR gate
- **^**: The XOR gate

## References
### Mechanical Computers
- https://en.wikipedia.org/wiki/Mechanical_computer
- https://en.wikipedia.org/wiki/Billiard-ball_computer
- https://en.wikipedia.org/wiki/Digi-Comp_II
- https://www.scottaaronson.com/blog/?p=1902
### Boolean Logic
- https://en.wikipedia.org/wiki/Boolean_circuit
- https://en.wikipedia.org/wiki/Truth_table
