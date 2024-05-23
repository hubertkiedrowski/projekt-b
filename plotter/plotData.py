import json
import os
import plotly.express as px
import numpy as np
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
    df['FileSource'] = fileName
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
        xaxis=dict(
            tickmode='array',
            tickvals=numbersXAxes,
            title='Nr of Request'  
        ),
        yaxis=dict(
            title='Duration'  
        )
    )
    
    linePlot.update_yaxes(
        tickmode='linear',
        dtick=25
    )
    
    linePlot.write_image("Lineplot-" + fileName)
    linePlot.show()

def plotDataBox(df, fileName):

    fig = px.box(df, y="Duration", facet_col="Description", color="Description",
                boxmode="overlay", points='all')

    for annotation in fig.layout.annotations:
        annotation.text = ""

    fig.write_image("Boxplot-" + fileName)
    fig.show()


def calculateMeanForRequestTypes(data_frames):
    for df in data_frames:
        mean_durations = df.groupby('Description')['Duration'].mean().reset_index()
        
        return mean_durations

def highlight_greater_than_50(row, mean_duration_dict):
    description = row['Description']
    duration = row['Duration']
    mean_duration = mean_duration_dict.get(description, 0)
    if duration - mean_duration > 0.5 * mean_duration:
        return ['background-color: red'] * len(row)
    elif duration - mean_duration < -0.5 * mean_duration:
        return ['background-color: green'] * len(row)
    else:
        return [''] * len(row)
   
    
def createComparisonTable(data_frames, file_names):
    html_content= ""
    mean_durations = calculateMeanForRequestTypes(data_frames)
    mean_durations_dict = dict(zip(mean_durations['Description'], mean_durations['Duration']))

    for index, row in mean_durations.iterrows():
        description = row['Description']
        mean_duration = row['Duration']

        
    
    


    for df, fileName in zip(data_frames,file_names):
        df_sorted = df.sort_values(by='Description')
        df_sorted.index.name = 'Request Nr.'
        table_df = df_sorted[['Description', 'Duration']]

        styled_table = table_df.style.apply(lambda x: highlight_greater_than_50(x, mean_durations_dict), axis=1)
        
        html_content += f"<h2>Table for {fileName}</h2>"
        html_content += styled_table.to_html(index=True)

    with open("output.html", "w") as html_file:
        html_file.write(html_content)


def main():
    parser = argparse.ArgumentParser(
                    prog='Data-Plotter',
                    description='Creates a Boxplot and a Lineplot for each Input file and a Comparison table',
                    epilog='Text at the bottom of help')
    parser.add_argument('-f', '--files', nargs='+', required=True, help='List of input JSON files')

    args = parser.parse_args()
    data_frames=[]
    file_names=[]
    for input_file in args.files:
        data = readData(input_file)
        path = os.path.split(input_file)
        data_frames.append(data)
        file_names.append(input_file)
    
        try:
            outputFileName = path[1].replace(".json", ".png")
            plotDataLine(data, outputFileName)
            plotDataBox(data, outputFileName)
            print(f"Plot saved for {input_file} as {outputFileName}")
        except FileNotFoundError:
            print("File not Saved")
    
    
    createComparisonTable(data_frames, file_names)


if __name__ == "__main__":
    main()