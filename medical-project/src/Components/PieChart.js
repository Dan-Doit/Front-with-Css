import React, { Component } from 'react'
import Chart from "chart.js";

export default class PieChart extends Component {
    chartRef = React.createRef();

    state = {
        category: this.props.category,
        data : this.props.data
    }
    
    componentDidMount() {
        const data = this.state.data;
        const keys = Object.keys(data);
        const values = Object.values(data);
        const myChartRef = this.chartRef.current.getContext("2d"); 
        new Chart(myChartRef, {
            type: "pie",
            data: {
                //Bring in data
                labels: keys,
                datasets: [
                    {
                        label: "Sales",
                        data: values,
                        backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                        'rgba(255, 255, 255, 1)',
                    ],
                    borderWidth: 2
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                animation: {
                    animateRotate: true,
                }
            }
        });
    }
    render() {
        return (
            <div style={{width: 300,margin:"auto",textAlign:"center",marginBottom:50}}>
                <canvas
                    style={{width:"40vh",height:"40vh",position:"relative"}}
                    id="myChart"
                    ref={this.chartRef}
                />
                {this.state.category === "gender" ? <p>성별 구분 이용고객</p> : null}
                {this.state.category === "race" ? <p>인종 구분 이용고객</p> : null}
                {this.state.category === "ethnicity" ? <p>민족 구분 이용고객</p> : null}
            </div>
        )
    }
}