import json
import os
import plotly.express as px
import pandas as pd
import argparse


def readData(fileName):
    with open(fileName, 'r') as file:
        data = json.load(file)
    startTimes = []
    durations = []
    descriptions = []
    
    global_index = 1
    for user_id, tasks in data['results'].items():
        for task in tasks:
            startTimes.append(task['timings']['startTime'])
            durations.append(task['timings']['duration'])
            descriptions.append(task['description'])

            global_index += 1

   
    
    

    df= pd.DataFrame({ 'TimeStamp': startTimes,
                        'Duration': durations,
                        'Description': descriptions
                        })
    
    df = df.sort_values(by=['TimeStamp'])
    
    return df


def plotDataLine(df, fileName):
    numbersXAxes = [i for i in range(len(df['TimeStamp']))]
    linePlot = px.line(
        df,
        y='Duration',
        x=numbersXAxes,
        color='Description',
        title='Task Duration',
        markers=True
        )
    
    linePlot.update_layout(
        xaxis = dict(
            tickmode='array',
            tickvals=numbersXAxes
            )
        )
       
    linePlot.update_yaxes(
        tickmode='linear',
        dtick= 25
    )
    
    linePlot.write_image("Lineplot-" + fileName)

def plotDataBox(df, fileName):

    fig = px.box(df, y="Duration", facet_col="Description", color="Description",
                boxmode="overlay", points='all')

    fig.write_image("Boxplot-" + fileName)
    fig.show()


def main():
    parser = argparse.ArgumentParser(
                    prog='ProgramName',
                    description='What the program does',
                    epilog='Text at the bottom of help')
    parser.add_argument('-f', '--file', required=True)

    args = parser.parse_args()

    data = readData(args.file)
    path = os.path.split(args.file)
    
    try:
        outputFileName = path[1].replace(".json", ".png")
        plotDataLine(data, outputFileName)
        plotDataBox(data, outputFileName)
        print(f"Plot saved as {outputFileName}")
    except FileNotFoundError:
        print("File not Saved")


if __name__ == "__main__":
    main()