# Webapp Performancetest Plotter

The Programm Plots the .json created by the web-app-performancetester. 

It creates 2 .png files:  
 - sequential line plot 
 - boxplot

it also opens a interactive boxplot in the browser where you can see 
The exact Max/Min/Median

## Example Output
The `./example` folder contains a [Boxplot](./example/Boxplot-report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.png) and a [Lineplot](./example/Lineplot-report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.png) generated based on [exampleData](./example/report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.json)


## Generating output

To Run Programm, you need to install the Dependencys are found in [requirements.txt](./requirements.txt)

```bash
python3 plotData.py -f <Path to webperformance-tester json outputfile>
```