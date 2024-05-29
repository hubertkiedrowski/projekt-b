# Webapp Performancetest

# Prerequisite

```
sudo apt update
sudo apt install software-properties-common -y
```

## Add custom APT repository

```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```

Press `ENTER` to confirm adding repository.

## Install Python 3.10

```
sudo apt install python3.10 python3.10-venv python3.10-dev
python3 --version
```

## Run with Virtual ENV

```
python3.10 -m venv ./venv/
source venv/bin/activate
```

# Running benchmark test / generating record

```bash
deno run -A src/main.ts -c src/config/testRunConfig.json -p "progress/topics/c6906727-fbd8-419a-809e-4a24de352d0d/trainings/26408628-a743-4f28-9d36-e4f7b4bcf636/questionnaires/4ec93c9d-53ac-4769-9ec0-d1c7220ed0c7/questions" -d content/basisschulungen/dokumentation.json
```

Flags

-d path to dokumentation.json <br>
-p path to training ,look example <br>
-c path to config.ts

Record will be saved at ./outputdata

# Webapp Performancetest Plotter

The Programm Plots the .json created by the web-app-performancetester.

It creates 2 .png files and a html:

- Sequential line plot
- Boxplot
- Comparison Table

it also opens a interactive boxplot in the browser where you can see
The exact Max/Min/Median

## Example Output

The `./example` folder contains a [Boxplot](./example/Boxplot-report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.png) and a [Lineplot](./example/Lineplot-report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.png), a [ComparisonTable](./example/comparison-table.html) generated based on [exampleData](./example/report_2024-04-22_15:38_8217199f-81d6-49b7-b97e-b719fce1862b.json)

## Generating output

To Run Programm, you need to install the Dependencys are found in [requirements.txt](./requirements.txt)

```bash
pip install -r ./plotter/requirement.txt

```

```bash
python3 plotData.py -f <Path to webperformance-tester json outputfile>
```
